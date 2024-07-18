#!/bin/bash

set -e -x

echo "[worker-debug] 启动调试模式"

cd /app/api


python -m debugpy --wait-for-client --listen 0.0.0.0:5680 -m \
celery -A app.celery worker -P prefork -c 1 --loglevel INFO -Q dataset,generation,mail