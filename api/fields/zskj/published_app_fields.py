# -*- encoding: utf-8 -*-
from flask_restful import fields
from ..installed_app_fields import installed_app_fields


published_app_list_fields = {
    'published_apps': fields.List(fields.Nested(installed_app_fields))
}
