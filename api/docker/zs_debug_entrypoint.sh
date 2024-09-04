#!/bin/bash

set -e -x

cd /app/api


export DEFAULT_CELERY_QUEUES=${CELERY_QUEUES:-\
${CELERY_TASK_DEFAULT_QUEUE}:dataset,\
${CELERY_TASK_DEFAULT_QUEUE}:generation,\
${CELERY_TASK_DEFAULT_QUEUE}:mail,\
${CELERY_TASK_DEFAULT_QUEUE}:ops_trace,\
${CELERY_TASK_DEFAULT_QUEUE}:app_deletion\
}

echo "GEVENT_SUPPORT初始：${GEVENT_SUPPORT},  CELERY_TASK_DEFAULT_QUEUE初始：${CELERY_TASK_DEFAULT_QUEUE}"
export GEVENT_SUPPORT=${GEVENT_SUPPORT:-true}
echo "GEVENT_SUPPORT最终：${GEVENT_SUPPORT}"

if [[ "${ZSKJ_MIGRATION_ENABLED}" == "true" ]]; then
  echo "Running migrations"
  flask db migrate -m "[$(date +"%Y-%m-%d %H:%M:%S")] 卓世科技 migration"
fi


if [[ "${MIGRATION_ENABLED}" == "true" ]]; then
  flask db upgrade
fi


if [[ "${MODE}" == "worker" ]]; then

  if [[ "${ZSKJ_DEBUG}" == "true" ]];then

    echo "[worker-debug] 启动调试模式"

    python -m debugpy --wait-for-client --listen 0.0.0.0:5680 -m \
    celery -A app.celery worker -P ${CELERY_WORKER_CLASS:-gevent} -c ${CELERY_WORKER_AMOUNT:-1} --loglevel INFO -Q ${DEFAULT_CELERY_QUEUES}

  else

    echo "[worker-debug] 启动本地运行模式"

    celery -A app.celery worker -P ${CELERY_WORKER_CLASS:-gevent} -c ${CELERY_WORKER_AMOUNT:-1} --loglevel INFO -Q ${DEFAULT_CELERY_QUEUES}
    
  fi


elif [[ "${MODE}" == "api" ]]; then

  if [[ "${ZSKJ_DEBUG}" == "true" ]];then

    echo "[api-debug] 启动调试模式"

    # gunicorn \
    #   --bind "${DIFY_BIND_ADDRESS:-0.0.0.0}:${DIFY_PORT:-5001}" \
    #   --workers ${SERVER_WORKER_AMOUNT:-1} \
    #   --worker-class ${SERVER_WORKER_CLASS:-sync} \
    #   --timeout ${GUNICORN_TIMEOUT:-360} \
    #   --preload \
    #   app:app

    python -m debugpy --wait-for-client --listen 0.0.0.0:5678 app.py

    # python -m debugpy --wait-for-client --listen 0.0.0.0:5678 zskj/tools/recommend_app.py
    # python zskj/tools/recommend_app.py

  else

    echo "[api-debug] 启动本地运行模式"

    gunicorn \
      --bind "${DIFY_BIND_ADDRESS:-0.0.0.0}:${DIFY_PORT:-5001}" \
      --workers ${SERVER_WORKER_AMOUNT:-1} \
      --worker-class ${SERVER_WORKER_CLASS:-sync} \
      --timeout ${GUNICORN_TIMEOUT:-360} \
      --preload \
      app:app
    
  fi

fi