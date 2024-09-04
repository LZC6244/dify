#!/bin/bash

set -e -x


export DEFAULT_CELERY_QUEUES=${CELERY_QUEUES:-\
${CELERY_TASK_DEFAULT_QUEUE}:dataset,\
${CELERY_TASK_DEFAULT_QUEUE}:generation,\
${CELERY_TASK_DEFAULT_QUEUE}:mail,\
${CELERY_TASK_DEFAULT_QUEUE}:ops_trace,\
${CELERY_TASK_DEFAULT_QUEUE}:app_deletion\
}

# if [[ "${ZSKJ_MIGRATION_ENABLED}" == "true" ]]; then
#   echo "Running migrations"
#   flask db migrate -m "[$(date +"%Y-%m-%d %H:%M:%S")] 卓世科技 migration"
# fi


# if [[ "${MIGRATION_ENABLED}" == "true" ]]; then
#   flask db upgrade
# fi

cd /app/api


if [[ "${MODE}" == "worker" ]]; then

  echo "[worker-deploy] 启动部署模式"

  celery -A app.celery worker -P ${CELERY_WORKER_CLASS:-prefork} -c ${CELERY_WORKER_AMOUNT:-1} --loglevel INFO \
    -Q ${DEFAULT_CELERY_QUEUES}
elif [[ "${MODE}" == "api" ]]; then

  echo "[api-deploy] 启动部署模式"

  gunicorn \
    --bind "${DIFY_BIND_ADDRESS:-0.0.0.0}:${DIFY_PORT:-5001}" \
    --workers ${SERVER_WORKER_AMOUNT:-1} \
    --worker-class ${SERVER_WORKER_CLASS:-sync} \
    --timeout ${GUNICORN_TIMEOUT:-360} \
    --preload \
    app:app
fi