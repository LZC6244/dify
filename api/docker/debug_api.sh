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


if [[ "${ZSKJ_DEBUG}" == "true" ]];then

  echo "[api-debug] 启动调试模式"

  python -m debugpy --wait-for-client --listen 0.0.0.0:5678 app.py

else

  echo "[api-debug] 启动本地运行模式"

  python app.py
  
fi