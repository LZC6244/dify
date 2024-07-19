#!/bin/bash

set -e -x

echo "[api-debug] 启动部署模式"

if [[ "${MIGRATION_ENABLED}" == "true" ]]; then
  echo "Running migrations"
  flask db upgrade
fi

cd /app/api

DEFAULT_CELERY_QUEUES=${CELERY_QUEUES:-\
${CELERY_TASK_DEFAULT_QUEUE}:dataset,\
${CELERY_TASK_DEFAULT_QUEUE}:generation,\
${CELERY_TASK_DEFAULT_QUEUE}:mail}

if [[ "${MODE}" == "worker" ]]; then
  celery -A app.celery worker -P ${CELERY_WORKER_CLASS:-gevent} -c ${CELERY_WORKER_AMOUNT:-1} --loglevel INFO \
    -Q ${DEFAULT_CELERY_QUEUES}
elif [[ "${MODE}" == "api" ]]; then
  gunicorn \
    --bind "${DIFY_BIND_ADDRESS:-0.0.0.0}:${DIFY_PORT:-5001}" \
    --workers ${SERVER_WORKER_AMOUNT:-1} \
    --worker-class ${SERVER_WORKER_CLASS:-gevent} \
    --timeout ${GUNICORN_TIMEOUT:-200} \
    --preload \
    app:app