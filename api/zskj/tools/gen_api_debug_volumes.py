import os
import debugpy
import logging
from typing import List

logging.basicConfig(format='%(asctime)s [%(module)s] %(levelname)s: %(message)s',
                    level=logging.INFO, datefmt='%Y-%m-%d %H:%M:%S')

logger = logging.getLogger(__name__)


def gen_debug_compose_volumes_path(
    root_dir, exculde_path_list: List[str],
        relative_root_dir: str = None, path_level: int = 0
):
    """
    仅 linux 系统适用
    生成 docker-compose-debug 中 api 的 volumes 文件/路径
    :param root_dir: 根目录
    :param exculde: 排除的文件/路径列表
    :param relative_root_dir: 相对根目录
    :param path_level: 当前路径层级（第几次迭代调用）
    :return:
    """
    logger.info(f'root_dir: {root_dir}')
    exculde_path_list = set(list(exculde_path_list))
    debug_compose_volumes = []
    exculde_dir_list = []
    exculde_file_list = []
    for exculde_path in exculde_path_list:
        if exculde_path.startswith('/') or exculde_path.endswith('/'):
            raise ValueError('exculde_path 不能以 / 开头或者结尾')

        # 处理多级路径
        if '/' in exculde_path:
            logger.info(f'排除多级路径: {exculde_path}')
            _dir, _path = exculde_path.split('/', maxsplit=1)
            exculde_dir_list.append(_dir)
            sub_root_dir = os.path.normpath(os.path.join(root_dir, _dir))

            _relative_root_dir = root_dir
            for _ in range(path_level):
                _relative_root_dir = os.path.dirname(_relative_root_dir)
            debug_compose_volumes += gen_debug_compose_volumes_path(
                root_dir=sub_root_dir,
                exculde_path_list=[_path],
                relative_root_dir=_relative_root_dir,
                path_level=path_level + 1
            )
            continue

        # 处理单级路径
        abs_exculde_path = os.path.normpath(
            os.path.join(root_dir, exculde_path))
        if os.path.isdir(abs_exculde_path):
            logger.info(f'排除目录: {abs_exculde_path}')
            exculde_dir_list.append(exculde_path)
        else:
            logger.info(f'排除文件: {abs_exculde_path}')
            exculde_file_list.append(exculde_path)

    for root, dirs, files in os.walk(root_dir):
        _dirs = list(set(dirs) - set(exculde_dir_list))
        _files = list(set(files) - set(exculde_file_list))

        if relative_root_dir:
            relative_root_path = os.path.relpath(root, relative_root_dir)
            _dirs = [os.path.join(relative_root_path, i) for i in _dirs]
            _files = [os.path.join(relative_root_path, i) for i in _files]

        debug_compose_volumes += _dirs + _files
        break

    return debug_compose_volumes


def gen_debug_compose_volumes_template(template_str: str, exculde_path_list=['.venv', '__pycache__']):
    """


    ## 示例
    # template_str 为 '- ../../api/{0}:/app/api/{0}' ，得到路径为 'constants'
    - ../../api/constants:/app/api/constants
    """
    api_dir = os.path.normpath(os.path.join(
        os.path.dirname(__file__), '../..'))
    logger.info(f'api_dir: {api_dir}')
    volumes = gen_debug_compose_volumes_path(
        root_dir=api_dir,
        exculde_path_list=exculde_path_list
    )
    volumes.sort()

    real_volumes = [template_str.format(i) for i in volumes]
    real_volumes_str = '\n'.join(real_volumes)
    logger.info(f'最终生成挂载路径如下：\n# 挂载路径\n{real_volumes_str}')


if __name__ == '__main__':

    gen_debug_compose_volumes_template(
        template_str='- ../../api/{0}:/app/api/{0}'
    )
