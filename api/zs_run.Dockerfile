# base image
# FROM 10.10.1.15:8388/zskj/backend/zs-dify-api:0.6.16.1
FROM 111.19.168.169:8389/zskj/backend/zs-dify-api:0.6.16.1

RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

WORKDIR /app/api

COPY . /app/api/
RUN cp /app/api/zs.env /app/api/.env

COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


ENTRYPOINT ["/bin/bash", "/entrypoint.sh"]