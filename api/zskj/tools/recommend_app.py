import re
import os
import sys
import json
import httpx
import logging
from time import sleep
from urllib import parse
from copy import deepcopy
from sqlalchemy import func, or_
from collections import defaultdict

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
import contexts
from app import app
from extensions.ext_database import db
from models.model import App, Site
from models.account import TenantAccountJoin
from services.app_dsl_service import AppDslService
from services.account_service import AccountService
from services.recommended_app_service import RecommendedAppService

logging.basicConfig(format='%(asctime)s [%(module)s] %(levelname)s: %(message)s',
                    level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')


logger = logging.getLogger(__name__)


def clean_recommend_app_str(recommend_app_str):
    """
    清洗推荐应用字符串

    :param recommend_app_str: 推荐应用字符串
    :return: 清洗后的推荐应用字符串
    """
    # 🤖 替换为 🧭（ \\U0001F916 替换为 \\U0001F9ED）
    recommend_app_str = recommend_app_str.\
        replace('🤖', '🧭').\
        replace('\\U0001F916', '\\U0001F9ED')
    return recommend_app_str


def create_all_recommend_app(language='zh-Hans'):
    """
    为租户工作空间创建指定语言的所有推荐应用
    """

    # app 是全局变量，在函数内使用需要 global 声明
    global app

    # 进入 app 上下文环境
    ctx = app.app_context()
    ctx.push()

    recommend_app_info = dict()

    recommend_app_json_path = os.path.normpath(os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '../../constants/recommended_apps.json'
    ))
    with open(recommend_app_json_path, 'r') as f:
        recommend_app_json = json.load(f)

    # 获取全部推荐应用列表
    # recommend_app_list = RecommendedAppService.\
    #     get_recommended_apps_and_categories(language=language)[
    #         'recommended_apps']
    recommend_app_list = recommend_app_json['recommended_apps'][language]['recommended_apps']

    for recommend_app in recommend_app_list:
        app_name = recommend_app['app']['name']
        app_id = recommend_app['app']['id']
        app_icon = recommend_app['app']['icon']
        app_detail = RecommendedAppService.\
            get_recommend_app_detail(app_id=app_id)
        recommend_app_info[app_name] = {
            'data': app_detail['export_data'],
            'description': recommend_app['description'],
            'icon': app_icon,
            'icon_background': app_detail['icon_background'],
            'name': app_name,
        }

    tenants = db.session.query(TenantAccountJoin).with_entities(
        TenantAccountJoin.tenant_id,
        TenantAccountJoin.account_id
    ).filter(
        TenantAccountJoin.role == 'owner'
    ).all()
    tenant_info = {tenant.tenant_id: tenant.account_id for tenant in tenants}

    # 加载全部租户信息
    account_info = dict()
    for tenant in tenants:
        account = AccountService.load_user(tenant.account_id)
        account_info[account.id] = account
        logger.info(f'成功加载用户信息：[{account.email}] [{account.name}]')
        print(account)
        sleep(0.5)

    recommend_app_names = set(recommend_app_info.keys())
    # 获取租户已创建的模板应用名称
    target_tenant_info = db.session.query(App).with_entities(
        App.tenant_id,
        func.array_agg(App.name).label('app_names')
    ).filter(App.name.in_(recommend_app_names)).\
        group_by(App.tenant_id).all()

    for target_tenant in target_tenant_info:
        tenant_id = target_tenant.tenant_id
        account = account_info[tenant_info[tenant_id]]
        app_names = set(target_tenant.app_names)
        miss_app_names = recommend_app_names - app_names

        logger.info(f'用户 [{account.email}] 缺少应用：{miss_app_names}')

        for miss_app_name in miss_app_names:

            # 参考 api.app.load_user_from_request 配置 contexts
            # contexts 配置不全会导致创建模板应用报错
            contexts.tenant_id.set(account.current_tenant_id)

            # 创建重复应用会抛出异常：werkzeug.exceptions.Forbidden: 403 Forbidden: 应用名称重复，请选择其他名称
            # 创建模板应用 app ，工作流应用会自动发布
            logger.info(f'用户 [{account.email}] 创建模板应用：[{miss_app_name}]')
            app = AppDslService.import_and_create_new_app(
                tenant_id=tenant_id,
                data=recommend_app_info[miss_app_name]['data'],
                args=recommend_app_info[miss_app_name],
                account=account
            )

    # 退出 app 上下文环境
    ctx.pop()
    logger.info(f'推荐应用创建完成')


def reset_recommend_app_model_from_str(recommend_app_json_str: str, model_name: str = 'gpt-4o', provider: str = 'openai'):
    result = re.sub(
        'name: ([^\\\\]*?)(\\\\n\s+provider: )([^\\\\]*?)\\\\n',
        f'name: {model_name}\g<2>{provider}\\\\n',
        recommend_app_json_str,
    )
    return result


def reset_recommend_app_model_to_json(model_name: str = 'gpt-4o', provider: str = 'openai'):
    recommend_app_json_path = os.path.normpath(os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '../../constants/recommended_apps.json'
    ))
    with open(recommend_app_json_path, 'r') as f:
        recommend_app_json_str = f.read()

    logger.info(f'成功加载当前推荐应用配置：{recommend_app_json_path}')

    recommend_app_json_str = reset_recommend_app_model_from_str(
        recommend_app_json_str, model_name, provider)

    with open(recommend_app_json_path, 'w', encoding='utf-8') as f:
        f.write(recommend_app_json_str)
    logger.info(f'成功更新推荐应用配置')


def reset_recommend_app_model(tenant_id, authorization, max_tokens: int, language='zh-Hans',
                              base_url='http://127.0.0.1:5001',
                              model_name: str = 'gpt-4o', provider: str = 'openai'):
    """统一更新模板应用默认配置模型"""
    recommend_app_json_path = os.path.normpath(os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '../../constants/recommended_apps.json'
    ))
    with open(recommend_app_json_path, 'r') as f:
        recommend_app_json = json.load(f)

    logger.info(f'成功加载当前推荐应用配置：{recommend_app_json_path}')

    headers = {
        'authorization': authorization,
        # 'Content-Type': 'application/json',
    }

    reset_recommend_app_pattern_1 = re.compile(
        '"name": "([^\\\\]*?)"(,\s+"provider": )"([^\\\\]*?)"')
    reset_recommend_app_repl_1 = f'"name": "{model_name}"\g<2>"{provider}"'
    reset_recommend_app_pattern_2 = re.compile('"max_tokens": (\d+|null)')
    reset_recommend_app_repl_2 = f'"max_tokens": {max_tokens}'

    # app 是全局变量，在函数内使用需要 global 声明
    global app

    # 进入 app 上下文环境
    ctx = app.app_context()
    ctx.push()

    # 获取全部推荐应用列表
    # recommend_app_list = RecommendedAppService.\
    #     get_recommended_apps_and_categories(language=language)[
    #         'recommended_apps']
    recommend_app_list = recommend_app_json['recommended_apps'][language]['recommended_apps']
    recommend_app_names = [recommend_app['app']['name']
                           for recommend_app in recommend_app_list]
    logger.info(f'当前推荐应用列表：{recommend_app_names}')

    # 获取租户已创建的模板应用信息
    created_template_apps = db.session.query(App).filter(
        App.name.in_(recommend_app_names)).all()

    for created_template_app in created_template_apps:
        app_id = created_template_app.id
        app_mode = created_template_app.mode
        logger.info(
            f'[{created_template_app.mode}] 开始检查应用：[{created_template_app.name}]')

        if app_mode in ['workflow', 'advanced-chat']:
            draft_url = parse.urljoin(
                base_url, f'/console/api/apps/{app_id}/workflows/draft')
            # 获取当前工作流草稿信息
            draft_info = httpx.get(draft_url, headers=headers).json()
            graph_str = json.dumps(draft_info['graph'])

            new_graph_str_1 = reset_recommend_app_pattern_1.sub(
                reset_recommend_app_repl_1,
                graph_str
            )

            new_graph_str_2 = reset_recommend_app_pattern_2.sub(
                reset_recommend_app_repl_2,
                new_graph_str_1
            )

            # 存在当前模板应用使用模型不等于传入的预设模型，更新工作流
            if graph_str != new_graph_str_2:
                # 更新草稿
                update_darft_resp = httpx.post(
                    url=draft_url,
                    headers=headers,
                    json={
                        'environment_variables': draft_info['environment_variables'],
                        'features': draft_info['features'],
                        'graph': json.loads(new_graph_str_2),
                        'hash': draft_info['hash'],
                    }
                )
                # 发布更新
                publish_url = parse.urljoin(
                    base_url, f'/console/api/apps/{app_id}/workflows/publish'
                )
                publish_resp = httpx.post(
                    url=publish_url,
                    headers=headers,
                )
                logger.info(
                    f'[{created_template_app.mode}] 成功更新预设模型：[{created_template_app.name}]')
            else:
                logger.info(
                    f'[{created_template_app.mode}] 无须更新预设模型：[{created_template_app.name}]')
        else:
            app_info_url = parse.urljoin(
                base_url, f'/console/api/apps/{app_id}'
            )
            app_info_resp = httpx.get(
                url=app_info_url,
                headers=headers,
            ).json()
            model_config = deepcopy(app_info_resp['model_config'])
            if model_config['model']['provider'] != provider or \
                    model_config['model']['name'] != model_name or \
                    model_config['model']['completion_params'].get('max_tokens') != max_tokens:
                update_app_url = parse.urljoin(
                    base_url, f'/console/api/apps/{app_id}/model-config'
                )
                model_config['model']['provider'] = provider
                model_config['model']['name'] = model_name
                model_config['model']['completion_params']['max_tokens'] = max_tokens
                update_app_resp = httpx.post(
                    url=update_app_url,
                    headers=headers,
                    json=model_config
                ).json()
                logger.info(
                    f'[{created_template_app.mode}] 成功更新预设模型：[{created_template_app.name}]')
            else:
                logger.info(
                    f'[{created_template_app.mode}] 无须更新预设模型：[{created_template_app.name}]')

    # 退出 app 上下文环境
    ctx.pop()
    logger.info(
        f'[{base_url}] 成功更新预设模型：[tenant_id -> {tenant_id}] '
        f'[provider -> {provider}] [model_name -> {model_name}] [max_tokens -> {max_tokens}]')


def reset_recommend_app_icon(language='zh-Hans'):
    # TODO: 暂时硬编码，后续添加到 dify_config 中
    zskj_recommended_app_names = [
        '文章标题生成器',
        '会议纪要',
        '文献综述写作',
        '知识库 + 聊天机器人',
        '旅行规划助手',
        '文章翻译助理',
        'SEO 文章生成专家',
        '中英文互译',
        '个人学习导师',
        '文本总结工作流',
        '文本情感分析工作流',
        '长篇故事生成（迭代）',
        '邮件助手工作流',
        '全书翻译',
        'AI 前端面试官',
        '招聘广告撰写'
    ]

    recommend_app_json_path = os.path.normpath(os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        '../../constants/recommended_apps.json'
    ))
    with open(recommend_app_json_path, 'r') as f:
        recommend_app_json = json.load(f)

    logger.info(f'成功加载当前推荐应用配置：{recommend_app_json_path}')

    recommend_app_icon_info = {
        app['app']['name']: app['app']['icon']
        for app in recommend_app_json['recommended_apps'][language]['recommended_apps']
        if app['app']['name'] in zskj_recommended_app_names
    }

    # app 是全局变量，在函数内使用需要 global 声明
    global app

    # 进入 app 上下文环境
    ctx = app.app_context()
    ctx.push()

    recommend_apps_query = db.session.query(App).filter(
        App.name.in_(zskj_recommended_app_names)
    )

    recommend_app_info = defaultdict(list)
    for i in recommend_apps_query.yield_per(50):
        recommend_app_info[i.name].append(i.id)

    for app_name, app_ids in recommend_app_info.items():
        logger.info(f'正在更新推荐应用图标：{app_name} -> {app_ids}')
        db.session.query(App).filter(App.id.in_(app_ids)).update(
            {App.icon: recommend_app_icon_info[app_name]}
        )

        db.session.query(Site).filter(Site.app_id.in_(app_ids)).update(
            {Site.icon: recommend_app_icon_info[app_name]}
        )

    # 提交 icon 更新
    db.session.commit()

    # 退出 app 上下文环境
    ctx.pop()
    logger.info(f'推荐应用图标更新完毕')


def reset_app_default_icon(old_icon: str, new_icon: str):
    """
    重设 app 默认图标
    下面的 sql 需要根据实际情况进行更新修改
    """

    # app 是全局变量，在函数内使用需要 global 声明
    global app

    # 进入 app 上下文环境
    ctx = app.app_context()
    ctx.push()

    # TODO: 判断条件需要根据实际情况进行更新更新
    app_result = db.session.query(App).filter(
        or_(
            App.icon.notlike(old_icon),
            App.icon.is_(None),
        )
    ).update({App.icon: new_icon})

    site_result=db.session.query(Site).filter(
        or_(
            Site.icon.notlike(old_icon),
            Site.icon.is_(None),
        )
    ).update({Site.icon: new_icon})

    # 提交 icon 更新
    db.session.commit()

    # 退出 app 上下文环境
    ctx.pop()
    logger.info(
        f'应用默认图标更新完毕：[app 更新条数{app_result.rowcount}] [site 更新条数：{site_result.rowcount}')


if __name__ == '__main__':
    # create_all_recommend_app()
    # reset_recommend_app_model_to_json()

    # # dev
    # reset_recommend_app_model(
    #     tenant_id='8bfba299-e0c4-4fa5-8757-06f28e2be256',
    #     authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiN2M2MTU4Y2QtZDMzZC00Y2I3LWIxMWQtMTkxOWIyMDFlOTBmIiwiZXhwIjoxNzI2MTk5NTM3LCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.IdkjZC6V3F7H1cds171BlTluV5kCbPU2C97wR1C9F0Y',
    #     max_tokens=4096,
    #     base_url='https://agent-x-dev.maas.com.cn',
    # )

    # # pre
    # reset_recommend_app_model(
    #     tenant_id='d5d6c01e-fc41-4566-a892-718eee1d0277',
    #     authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODA2ZTRjOTktOTA0Yi00NzMwLTgwZDEtMDM4MjEzOGQwMWM0IiwiZXhwIjoxNzI2NjU0OTg5LCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.khsf8nxk5VPY21Pt4cC3MyenqLZ7h1vaoNViwyzok0M',
    #     max_tokens=4096,
    #     base_url='https://agent-x-pre.maas.com.cn',
    # )

    # prd
    reset_recommend_app_model(
        tenant_id='a49606fb-0cf0-4f07-8fb8-29f5b7fc25b3',
        authorization='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmIyYzY3ZmEtZTVlZi00YTVhLWEwNDMtNjUxMmYwYmY2YWM0IiwiZXhwIjoxNzI2NjU1MDQ3LCJpc3MiOiJTRUxGX0hPU1RFRCIsInN1YiI6IkNvbnNvbGUgQVBJIFBhc3Nwb3J0In0.XPZBZ_kwJ4k2kZydMtpZ51U97UICKVi3yH3y0RWwyUU',
        max_tokens=4096,
        base_url='https://agent-x.maas.com.cn',
    )

    # reset_recommend_app_icon()

    reset_app_default_icon(
        old_icon='data:image%',
        new_icon='',
    )
