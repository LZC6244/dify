import os
import json
import httpx
import logging
from time import sleep

logging.basicConfig(format='%(asctime)s [%(module)s] %(levelname)s: %(message)s',
                    level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')
logger = logging.getLogger(__name__)


def get_recommend_app_detail(recommended_apps_json_path: str, launge: str = 'zh-Hans'):
    logger.info(f'开始读取推荐应用列表: {recommended_apps_json_path}')
    with open(recommended_apps_json_path, 'r', encoding='utf-8') as f:
        recommended_apps = json.load(f).get('recommended_apps', {}).get(launge)
    logger.info(f'推荐应用列表读取完成：{launge}')
    if not isinstance(recommended_apps, dict):
        logger.error(f'推荐应用列表格式错误')
        return

    recommended_apps = recommended_apps['recommended_apps']
    total_recommended_app = len(recommended_apps)
    recommended_apps_detail_dict = dict()
    for index, recommended_app in enumerate(recommended_apps, start=1):
        app_id = recommended_app['app_id']
        url = f'https://tmpl.dify.ai/apps/{app_id}'
        resp = httpx.get(url)
        logger.info(
            f'成功获取推荐应用详情：{index}/{total_recommended_app}，app_id：{app_id}')
        recommended_apps_detail_dict[app_id] = resp.json()
        sleep(0.1)

    result_file = 'recommended_apps_detail.json'
    with open(result_file, 'w', encoding='utf-8') as f:
        json.dump(
            recommended_apps_detail_dict,
            f,
            ensure_ascii=False, indent=4)
    logger.info(f'推荐应用详情保存完成：{result_file}')


if __name__ == '__main__':
    recommended_apps_json_path = os.path.normpath(os.path.join(
        os.path.dirname(__file__), '../../constants/recommended_apps.json'))
    get_recommend_app_detail(
        recommended_apps_json_path=recommended_apps_json_path
    )
