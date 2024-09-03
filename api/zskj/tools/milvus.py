
import os
import logging
from pymilvus import MilvusClient

logger = logging.getLogger(__name__)

# TODO: 未完成
def copy_database(source_db, target_db):
    """
    复制 Milvus 数据库
    """
    env = os.environ
    milvus_host = env['MILVUS_HOST']
    milvus_port = env['MILVUS_PORT']
    milvus_uri = f'http://{milvus_host}:{milvus_port}'
    # 连接到 Milvus
    client = MilvusClient(uri=milvus_uri, user=env['MILVUS_USER'],
                          password=env['MILVUS_PASSWORD'], db_name=source_db)
    logger.info("Milvus client initialized")


    # 关闭连接
    client.close()


if __name__ == '__main__':
    copy_database('dify_dev_customer_01', 'dify_prd_customer_01')
