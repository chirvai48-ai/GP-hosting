#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/apps/glowing-partner

echo "==> Loading Docker images"
for img in "$APP_DIR"/*.tar.gz; do
  [ -e "$img" ] && docker load < "$img"
done

echo "==> Starting services"
cd "$APP_DIR"
docker compose -p glowing-partner up -d --remove-orphans

echo "==> Pruning dangling images"
docker image prune -f

echo "==> Deploy complete"
