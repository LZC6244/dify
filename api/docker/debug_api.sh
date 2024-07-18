#!/bin/bash

set -e -x

echo "[api-debug] 启动调试模式"

cd /app/api

# gunicorn \
#   --bind "${DIFY_BIND_ADDRESS:-0.0.0.0}:${DIFY_PORT:-5001}" \
#   --workers 1 \
#   --worker-class ${SERVER_WORKER_CLASS:-sync} \
#   --timeout ${GUNICORN_TIMEOUT:-200} \
#   --preload \
#   app:app

python -m debugpy --wait-for-client --listen 0.0.0.0:5678 app.py