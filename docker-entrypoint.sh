#!/bin/sh
# Gigly container entrypoint. Runs on every container start.
#   1. Guards that the security-critical SESSION_SECRET is present.
#   2. Applies the schema to the SQLite file on the persistent volume via `prisma db push`
#      (the app's schema.prisma is the source of truth; migrations lag behind it, so `db push`
#      — not `migrate deploy` — is what keeps the DB in sync, matching dev and E2E).
#   3. Seeds demo data exactly once (guarded by a flag file on the volume).
#   4. Starts Next.js.
set -e

if [ -z "$SESSION_SECRET" ]; then
  echo "FATAL: SESSION_SECRET is not set. Add it in Amvera -> Переменные окружения (as a secret)." >&2
  exit 1
fi

# Default the DB to the persistent mount if Amvera didn't pass DATABASE_URL.
: "${DATABASE_URL:=file:/data/prod.db}"
export DATABASE_URL

echo "[entrypoint] Applying schema to ${DATABASE_URL} via prisma db push ..."
npx prisma db push --accept-data-loss

SEED_FLAG="/data/.seeded"
if [ ! -f "$SEED_FLAG" ]; then
  echo "[entrypoint] First boot detected — seeding demo data ..."
  if npx prisma db seed; then
    touch "$SEED_FLAG"
    echo "[entrypoint] Seed complete."
  else
    echo "[entrypoint] WARNING: seed failed; it will be retried on next start." >&2
  fi
else
  echo "[entrypoint] DB already seeded — skipping seed."
fi

echo "[entrypoint] Starting Next.js on port ${PORT:-3000} ..."
exec npm run start
