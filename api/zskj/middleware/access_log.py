
import logging
from datetime import datetime

from flask import request

logger = logging.getLogger(__name__)


def access_start_log():
    """
    记录请求开始信息
    :return:
    """
    request.zskj_start_time = datetime.now()
    logger.info(
        f"access_start: {request.method} - {request.path}")


def access_end_log(response):
    """
    记录返回响应信息
    :param response:
    :return:
    """
    duration = datetime.now() - request.zskj_start_time
    # 去除毫秒
    # duration = str(duration).split('.')[0]
    logger.info(
        f"access_end: {response.status_code} - {request.path} - duration => {duration}")
    return response
