import os
import sys
import logging
from time import sleep
from sqlalchemy import func

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
import contexts
from app import app
from extensions.ext_database import db
from models.model import App
from models.account import TenantAccountJoin
from services.app_dsl_service import AppDslService
from services.account_service import AccountService
from services.recommended_app_service import RecommendedAppService

logging.basicConfig(format='%(asctime)s [%(module)s] %(levelname)s: %(message)s',
                    level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')


logger = logging.getLogger(__name__)


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

    # 获取全部推荐应用列表
    recommend_app_list = RecommendedAppService.\
        get_recommended_apps_and_categories(language=language)[
            'recommended_apps']
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

    account_info = dict()
    for tenant in tenants:
        account = AccountService.load_user(tenant.account_id)
        account_info[account.id] = account
        logger.info(f'成功加载用户信息：[{account.email}] [{account.name}]')
        print(account)
        sleep(0.5)

    recommend_app_names = set(recommend_app_info.keys())
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


if __name__ == '__main__':
    create_all_recommend_app()
