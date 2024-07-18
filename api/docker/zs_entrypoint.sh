#!/bin/bash

set -e -x

echo "[api-debug] 启动部署模式"

if [[ "${MIGRATION_ENABLED}" == "true" ]]; then
  echo "Running migrations"
  flask db upgrade
fi

cd /app/api

gunicorn \
  --bind "${DIFY_BIND_ADDRESS:-0.0.0.0}:${DIFY_PORT:-5001}" \
  --workers ${SERVER_WORKER_AMOUNT:-1} \
  --worker-class ${SERVER_WORKER_CLASS:-gevent} \
  --timeout ${GUNICORN_TIMEOUT:-200} \
  --preload \
  app:app