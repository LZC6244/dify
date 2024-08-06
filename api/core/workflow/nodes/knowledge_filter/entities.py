from typing import Any, Optional

from pydantic import BaseModel

from core.prompt.entities.advanced_prompt_entities import MemoryConfig
from core.workflow.entities.base_node_data_entities import BaseNodeData


# class ModelConfig(BaseModel):
#     """
#      Model Config.
#     """
#     provider: str
#     name: str
#     mode: str
#     completion_params: dict[str, Any] = {}


class ClassConfig(BaseModel):
    """
    Class Config.
    """
    id: str
    threshold: float


class KnowledgeFilterNodeData(BaseNodeData):
    """
    Knowledge filter Node Data.
    """
    query_variable_selector: list[str]
    type: str = 'knowledge-filter'
    # model: ModelConfig
    classes: list[ClassConfig]
    # instruction: Optional[str] = None
    # memory: Optional[MemoryConfig] = None
