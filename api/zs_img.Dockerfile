# base image
FROM langgenius/dify-api:0.6.16

RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

WORKDIR /app/api

COPY . /app/api/
RUN cp /app/api/zs.env /app/api/.env

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN pip install --upgrade pip
RUN pip install debugpy

ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]