"""Abstract interface for document loader implementations."""
import json
from collections.abc import Iterator
from typing import Optional

import requests
import datetime
import mimetypes
import os
import tempfile
import re
import uuid

from core.rag.extractor.blod.blod import Blob
from core.rag.extractor.extractor_base import BaseExtractor
from core.rag.models.document import Document
from extensions.ext_storage import storage

from extensions.ext_database import db
from configs import dify_config
from models.model import UploadFile


class PaperExtractor(BaseExtractor):
    """Load pdf files.


    Args:
        file_path: Path to the file to load.
    """

    def __init__(
            self,
            file_path: str,
            url: str,
            tenant_id: str, 
            user_id: str,
    ):
        """Initialize with file path."""
        self._file_path = file_path
        self.url = url
        self.tenant_id = tenant_id
        self.user_id = user_id

    def extract(self) -> list[Document]:
        documents = list(self.load())
        return documents
    
    def _extract_images_from_md(self, md):
        image_folder = 'storage'
        os.makedirs(image_folder, exist_ok=True)

        img_paths = re.findall(r'!\[(.*?)\]\((.*?)\)', md)
        for img_path in img_paths:
            img_path =  img_path[1]

            image_ext = img_path.split('.')[-1]
        
            file_key = img_path
            mime_type, _ = mimetypes.guess_type(file_key)

            # save file to db
            upload_file = UploadFile(
                tenant_id=self.tenant_id,
                storage_type=dify_config.STORAGE_TYPE,
                key=file_key,
                name=file_key,
                size=0,
                extension=image_ext,
                mime_type=mime_type,
                created_by=self.user_id,
                created_at=datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None),
                used=True,
                used_by=self.user_id,
                used_at=datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
            )

            db.session.add(upload_file)
            db.session.commit()
            md = md.replace(img_path, f"{dify_config.FILES_URL}/files/{upload_file.id}/image-preview")
        return md


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
            # 发送POST请求,设置请求超时时间

            response = requests.post(self.url, files=form_data, timeout=300)

            # 检查响应状态码
            if response.status_code == 200:
                result = response.json()
                metadata = {"source": blob.source, "page": 0}
                md = result['res']
                md = self._extract_images_from_md(md)
                yield Document(page_content=md, metadata=metadata)
            else:
                print(f'Request failed with status {response.status_code}')
                yield Document(page_content="错误", metadata= {"source": blob.source, "page": 0})