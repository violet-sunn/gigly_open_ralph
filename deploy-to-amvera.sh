#!/usr/bin/env bash
# deploy-to-amvera.sh — publish ONLY the application to Amvera.
#
# Your know-how stays on this machine: openspec/, gigly_full_design/, design-reference/,
# screens/, ralphy-spec/, docs/, tests, status reports and local databases are NEVER copied.
# Only the files Amvera needs to build and run the app are pushed.
#
# Usage:
#   ./deploy-to-amvera.sh <amvera-git-url>
#   # or register the remote once, then run with no args:
#   git remote add amvera <amvera-git-url>
#   ./deploy-to-amvera.sh
set -euo pipefail

# --- resolve the Amvera git target ---
REMOTE_URL="${1:-}"
if [ -z "$REMOTE_URL" ]; then
  REMOTE_URL="$(git remote get-url amvera 2>/dev/null || true)"
fi
if [ -z "$REMOTE_URL" ]; then
  echo "ERROR: give the Amvera git URL:  ./deploy-to-amvera.sh <url>" >&2
  echo "       (or once:  git remote add amvera <url>  then run with no args)" >&2
  exit 1
fi

ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

# --- exactly what Amvera needs; nothing else is copied ---
INCLUDE=(
  app lib prisma public scripts
  package.json package-lock.json
  next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs
  .eslintrc.json prisma.config.ts middleware.ts
  Dockerfile docker-entrypoint.sh amvera.yaml .dockerignore
)

STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

for p in "${INCLUDE[@]}"; do
  if [ -e "$p" ]; then
    mkdir -p "$STAGE/$(dirname "$p")"
    cp -R "$p" "$STAGE/$(dirname "$p")/"
  else
    echo "WARN: missing '$p' — skipped" >&2
  fi
done

# strip local databases / junk that must never reach Amvera
rm -f "$STAGE"/prisma/*.db "$STAGE"/prisma/*.db-* "$STAGE"/prisma/dev.db.backup-* 2>/dev/null || true
find "$STAGE" -name '*.log' -delete 2>/dev/null || true
find "$STAGE" -name '.DS_Store' -delete 2>/dev/null || true

SHORT="$(git rev-parse --short HEAD 2>/dev/null || echo local)"

cd "$STAGE"
git init -q
git checkout -q -b master
git add -A
git -c user.name=deploy -c user.email=deploy@local commit -qm "deploy: app snapshot ($SHORT)"
echo "Pushing app-only snapshot to Amvera ..."
git push --force "$REMOTE_URL" master:master
echo "Done. Amvera will rebuild from this snapshot."
