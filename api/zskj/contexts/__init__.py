from contextvars import ContextVar

"""
通过 contextvars 共享上下文变量
不要借助 flask 的 g 全局变量，如果使用 gunicorn gevent 部署，g 变量协程不安全
"""

request_id: ContextVar[str] = ContextVar('request_id', default='')
