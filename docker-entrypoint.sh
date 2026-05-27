#!/bin/sh
set -e

echo "Starting LensLab server..."

if [ "${PRISMA_DB_PUSH:-true}" = "true" ]; then
  echo "Syncing database schema..."
  node /app/node_modules/prisma/build/index.js db push --skip-generate
fi

if [ "${SEED_DEFAULT_USERS:-true}" = "true" ]; then
  echo "Ensuring default login users..."
  node /app/scripts/seed-default-users.js
fi

if [ -f /app/server.js ]; then
  exec node /app/server.js
fi

echo "ERROR: server.js not found."
ls -la /app/
exit 1
