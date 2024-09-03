
from flask_restful import Resource, marshal_with
from sqlalchemy import and_, or_

from controllers.console import api
from extensions.ext_database import db
from fields.zskj.published_app_fields import published_app_list_fields
from models.model import App, InstalledApp

from .zs_nest_admin import zs_admin_required


class ZsPublishedAppsAdminListApi(Resource):
    """
    获取已发布 app 列表【不鉴权，给admin使用】
    参考自 api/controllers/console/explore/installed_app.py InstalledAppsListApi
    """
    # @login_required
    # @account_initialization_required
    @marshal_with(published_app_list_fields)
    @zs_admin_required
    def get(self):
        # current_tenant_id = current_user.current_tenant_id
        published_apps = db.session.query(InstalledApp).join(App, InstalledApp.app_id == App.id).filter(
            or_(
                App.mode != 'workflow',
                and_(App.mode == 'workflow', App.workflow_id.isnot(None))
            )
            # App.workflow_id.isnot(None)
        ).all()

        # current_user.role = TenantService.get_user_role(current_user, current_user.current_tenant)
        published_apps = [
            {
                'id': published_app.id,
                'app': published_app.app,
                'app_owner_tenant_id': published_app.app_owner_tenant_id,
                'is_pinned': published_app.is_pinned,
                'last_used_at': published_app.last_used_at,
                # 'editable': current_user.role in ["owner", "admin"],
                # 'uninstallable': current_tenant_id == published_app.app_owner_tenant_id
            }
            for published_app in published_apps
        ]
        published_apps.sort(key=lambda app: (-app['is_pinned'],
                                             app['last_used_at'] is None,
                                             -app['last_used_at'].timestamp() if app['last_used_at'] is not None else 0))

        return {'published_apps': published_apps}


api.add_resource(ZsPublishedAppsAdminListApi, '/zskj/publish-apps-admin')
