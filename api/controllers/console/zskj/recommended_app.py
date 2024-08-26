import json
from copy import deepcopy
from flask_login import current_user
from flask_restful import Resource, marshal_with, reqparse

from configs import dify_config
from constants.languages import languages
from controllers.console import api
from controllers.console.explore.recommended_app import recommended_app_list_fields
from controllers.console.wraps import account_initialization_required
from libs.login import login_required
from services.recommended_app_service import RecommendedAppService


class ZskjRecommendedAppListApi(Resource):
    """
    获取卓世指定模板 app 列表
    参考自 api/controllers/console/explore/recommended_app.py RecommendedAppListApi
    """
    @login_required
    @account_initialization_required
    @marshal_with(recommended_app_list_fields)
    def get(self):
        # language args
        parser = reqparse.RequestParser()
        parser.add_argument('language', type=str, location='args')
        args = parser.parse_args()

        if args.get('language') and args.get('language') in languages:
            language_prefix = args.get('language')
        elif current_user and current_user.interface_language:
            language_prefix = current_user.interface_language
        else:
            language_prefix = languages[0]

        recommend_app_info = RecommendedAppService.get_recommended_apps_and_categories(
            language_prefix)

        # TODO: 暂时硬编码，后续添加到 dify_config 中
        zskj_recommended_app_names = ['文章标题生成器',
                                      '会议纪要',
                                      '文献综述写作',
                                      '知识库 + 聊天机器人',
                                      '旅行规划助手', '文章翻译助理',
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
        zskj_recommend_app_list = [
            recommend_app
            for recommend_app in recommend_app_info['recommended_apps']
            if recommend_app['app']['name'] in zskj_recommended_app_names
        ]

        zskj_recommend_app_info = deepcopy(recommend_app_info)
        zskj_recommend_app_info['recommended_apps'] = zskj_recommend_app_list

        return zskj_recommend_app_info


api.add_resource(ZskjRecommendedAppListApi, '/zskj/recommended-apps')
