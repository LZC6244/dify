#!/bin/bash

set -e -x

cd /app/api

if [[ "${ZSKJ_DEBUG}" == "true" ]];then

  echo "[api-debug] 启动调试模式"

  python -m debugpy --wait-for-client --listen 0.0.0.0:5678 app.py

else

  echo "[api-debug] 启动本地运行模式"

  python app.py
  
fi