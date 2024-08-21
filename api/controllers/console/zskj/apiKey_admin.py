import flask_restful
from flask_restful import Resource, fields, marshal_with

from controllers.console import api
from extensions.ext_database import db
from libs.helper import TimestampField

# from libs.login import login_required
from models.model import ApiToken, App

from .setup import setup_required

# from .wraps import account_initialization_required

api_key_fields = {
    'id': fields.String,
    'type': fields.String,
    'token': fields.String,
    'last_used_at': TimestampField,
    'created_at': TimestampField
}

api_key_list = {
    'data': fields.List(fields.Nested(api_key_fields), attribute="items")
}


def _get_resource(resource_id, resource_model):
    resource = resource_model.query.filter_by(
        id=resource_id
    ).first()

    if resource is None:
        flask_restful.abort(
            404, message=f"{resource_model.__name__} not found.")

    return resource


class BaseApiKeyListResource(Resource):
    method_decorators = [setup_required]

    resource_type = None
    resource_model = None
    resource_id_field = None
    token_prefix = None
    max_keys = 10

    @marshal_with(api_key_list)
    def get(self, resource_id):
        resource_id = str(resource_id)
        _get_resource(resource_id, self.resource_model)
        keys = db.session.query(ApiToken). \
            filter(ApiToken.type == self.resource_type, getattr(ApiToken, self.resource_id_field) == resource_id). \
            all()
        return {"items": keys}

    @marshal_with(api_key_fields)
    def post(self, resource_id):
        resource_id = str(resource_id)
        _get_resource(resource_id, self.resource_model)
        # if not current_user.is_admin_or_owner:
        #     raise Forbidden()

        current_key_count = db.session.query(ApiToken). \
            filter(ApiToken.type == self.resource_type, getattr(ApiToken, self.resource_id_field) == resource_id). \
            count()

        if current_key_count >= self.max_keys:
            flask_restful.abort(
                400,
                message=f"Cannot create more than {self.max_keys} API keys for this resource type.",
                code='max_keys_exceeded'
            )

        key = ApiToken.generate_api_key(self.token_prefix, 24)
        api_token = ApiToken()
        setattr(api_token, self.resource_id_field, resource_id)
        api_token.tenant_id = 'admin'
        api_token.token = key
        api_token.type = self.resource_type
        db.session.add(api_token)
        db.session.commit()
        return api_token, 201


class AppApiKeyListResource(BaseApiKeyListResource):

    def after_request(self, resp):
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Credentials'] = 'true'
        return resp

    resource_type = 'app'
    resource_model = App
    resource_id_field = 'app_id'
    token_prefix = 'app-'

api.add_resource(AppApiKeyListResource, '/zskj/apps/<uuid:resource_id>/api-keys')