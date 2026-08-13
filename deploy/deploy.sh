#!/usr/bin/env bash
set -euo pipefail

APP_DIR=/opt/apps/glowing-partner

echo "==> Loading Docker images"
docker load < "$APP_DIR/frontend.tar.gz"
docker load < "$APP_DIR/backend.tar.gz"

echo "==> Starting services"
cd "$APP_DIR"
docker compose -p glowing-partner up -d --remove-orphans

echo "==> Pruning dangling images"
docker image prune -f

echo "==> Deploy complete"
