# Gigly — production image for Amvera Cloud (РФ PaaS).
# Single-stage on purpose: keeps ALL node_modules (incl. Prisma + @libsql native bindings + tsx for seeding)
# so nothing is missing at runtime. Reliability over image size — matches the deploy priority.
FROM node:20-slim

# Prisma needs openssl; ca-certificates for TLS. slim = Debian (glibc), which @libsql/client's native bindings require.
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install ALL deps (dev included) — `next build` and the `tsx` seed need them.
# NODE_ENV is intentionally left unset here so npm does not drop devDependencies.
COPY package.json package-lock.json ./
RUN npm ci

# App source.
COPY . .

# Generate the Prisma client and build Next.js. No DB access happens at build time
# (every DB-backed page reads cookies -> dynamic -> not rendered during build).
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate \
  && npm run build

# Runtime.
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Entrypoint applies the schema to the persistent volume, seeds once, then starts the server.
# sed strips any CRLF (file may be authored on Windows) so /bin/sh accepts the shebang.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh \
  && chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
