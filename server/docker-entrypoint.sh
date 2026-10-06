#!/bin/sh
set -e

echo "Waiting for MySQL to accept connections..."
until echo "SELECT 1;" | npx prisma db execute --stdin --schema=./prisma/schema.prisma > /dev/null 2>&1; do
  sleep 2
done

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding admin user..."
node prisma/seed.js || true

echo "Starting server..."
exec node server.js
