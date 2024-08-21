"""Abstract interface for document loader implementations."""
import json
from collections.abc import Iterator
from typing import Optional

import requests

from core.rag.extractor.blod.blod import Blob
from core.rag.extractor.extractor_base import BaseExtractor
from core.rag.models.document import Document
from extensions.ext_storage import storage


class PaperExtractor(BaseExtractor):
    """Load pdf files.


    Args:
        file_path: Path to the file to load.
    """

    def __init__(
            self,
            file_path: str,
            url: str,
            file_cache_key: Optional[str] = None
    ):
        """Initialize with file path."""
        self._file_path = file_path
        self._file_cache_key = file_cache_key
        self.url = url

    def extract(self) -> list[Document]:
        
        plaintext_file_key = ''
        plaintext_file_exists = False
        if self._file_cache_key:
            try:
                text = storage.load(self._file_cache_key).decode('utf-8')
                plaintext_file_exists = True
                return [Document(page_content=text)]
            except FileNotFoundError:
                pass
        documents = list(self.load())
        text_list = []
        for document in documents:
            text_list.append(document.page_content)
        text = "\n\n".join(text_list)

        # save plaintext file for caching
        if not plaintext_file_exists and plaintext_file_key:
            storage.save(plaintext_file_key, text.encode('utf-8'))

        return documents

    def load(
            self,
    ) -> Iterator[Document]:
        """Lazy load given path as pages."""
        blob = Blob.from_path(self._file_path)
        yield from self.parse(blob)

    def parse(self, blob: Blob) -> Iterator[Document]:
        """Lazily parse the blob."""        
        # 配置参数
        config = {
            'fileData': None,
            'filename': self._file_path,
            'parser_config':{
                "chunk_token_num": 512, "delimiter": "\n!?。；！？", "layout_recognize": True
            }
        }

        with blob.as_bytes_io() as binary_data:
            # 将配置数据转换为JSON字符串
            config_json = json.dumps(config)

            # 构造请求数据
            form_data = {
                'config': (None, config_json),  # None作为文件名表示这是一个非文件字段
                'file': (self._file_path, binary_data)
            }
            # 发送POST请求
            response = requests.post(self.url, files=form_data)

            # 检查响应状态码
            if response.status_code == 200:
                result = response.json()
                metadata = {"source": blob.source, "page": 0}
                yield Document(page_content=result['res'], metadata=metadata)
            else:
                print(f'Request failed with status {response.status_code}')
                yield Document(page_content="错误", metadata= {"source": blob.source, "page": 0})