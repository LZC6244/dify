"""Abstract interface for document loader implementations."""
import requests
import base64
from collections.abc import Iterator
from typing import Optional

from core.rag.extractor.blod.blod import Blob
from core.rag.extractor.extractor_base import BaseExtractor
from core.rag.models.document import Document
from extensions.ext_storage import storage


class NaiveExtractor(BaseExtractor):
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
        # import pypdfium2

        # with blob.as_bytes_io() as file_path:
        #     pdf_reader = pypdfium2.PdfDocument(file_path, autoclose=True)
        #     try:
        #         for page_number, page in enumerate(pdf_reader):
        #             text_page = page.get_textpage()
        #             content = text_page.get_text_range()
        #             text_page.close()
        #             page.close()
        #             metadata = {"source": blob.source, "page": page_number}
        #             yield Document(page_content=content, metadata=metadata)
        #     finally:
        #         pdf_reader.close()

        
        # 配置参数
        config = {
            'fileData': None,
            'filename': self._file_path,
            'parser_config':{
                "chunk_token_num": 512, "delimiter": "\n!?。；！？", "layout_recognize": True
            }
        }

        with blob.as_bytes_io() as binary_data:
            # 读取文件并编码为Base64字符串
            # with open(file_path, 'rb') as f:
            binary_data = binary_data.read()
            file_data_base64 = base64.b64encode(binary_data).decode('utf-8')
            config['fileData'] = file_data_base64

            # 发送POST请求
            response = requests.post(self.url, json=config)

            # 检查响应状态码
            if response.status_code == 200:
                result = response.json()
                for item in result['res']:
                    metadata = {"source": blob.source, "page": 0}
                    yield Document(page_content=item, metadata=metadata)
            else:
                print(f'Request failed with status {response.status_code}')
                return Document(page_content="错误", metadata= {"source": blob.source, "page": 0})