#!/bin/bash

set -e -x

echo "[api-debug] 启动调试模式"

cd /app/api


# python app.py
python -m debugpy --wait-for-client --listen 0.0.0.0:5678 app.py