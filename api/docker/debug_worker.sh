#!/bin/bash

set -e -x

echo "[worker-debug] 启动调试模式"

cd /app/api


DEFAULT_CELERY_QUEUES=${CELERY_QUEUES:-\
${CELERY_TASK_DEFAULT_QUEUE}:dataset,\
${CELERY_TASK_DEFAULT_QUEUE}:generation,\
${CELERY_TASK_DEFAULT_QUEUE}:mail,\
${CELERY_TASK_DEFAULT_QUEUE}:ops_trace,\
${CELERY_TASK_DEFAULT_QUEUE}:app_deletion

python -m debugpy --wait-for-client --listen 0.0.0.0:5680 -m \
celery -A app.celery worker -P prefork -c 1 --loglevel INFO -Q ${DEFAULT_CELERY_QUEUES}