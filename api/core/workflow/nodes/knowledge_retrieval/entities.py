from typing import Any, Literal, Optional

from pydantic import BaseModel

from core.workflow.entities.base_node_data_entities import BaseNodeData


class RerankingModelConfig(BaseModel):
    """
    Reranking Model Config.
    """
    provider: str
    model: str

class RerankingModelConfig2(BaseModel):
    """
    Reranking Model Config.
    """
    reranking_provider_name: Optional[str] = None
    reranking_model_name: Optional[str] = None

class VectorSetting(BaseModel):
    """
    Vector Setting.
    """
    vector_weight: float
    embedding_provider_name: str
    embedding_model_name: str


class KeywordSetting(BaseModel):
    """
    Keyword Setting.
    """
    keyword_weight: float


class WeightedScoreConfig(BaseModel):
    """
    Weighted score Config.
    """
    vector_setting: VectorSetting
    keyword_setting: KeywordSetting


class MultipleRetrievalConfig(BaseModel):
    """
    Multiple Retrieval Config.
    """
    top_k: int
    score_threshold: Optional[float] = None
    reranking_mode: str = 'reranking_model'
    reranking_enable: bool = True
    reranking_model: Optional[RerankingModelConfig] = None
    weights: Optional[WeightedScoreConfig] = None

class ModelConfig(BaseModel):
    """
     Model Config.
    """
    provider: str
    name: str
    mode: str
    completion_params: dict[str, Any] = {}


class SingleRetrievalConfig(BaseModel):
    """
    Single Retrieval Config.
    """
    model: ModelConfig

class RetrievalConfig(BaseModel):
    """
    Retrieval Config
    """
    search_method: str
    reranking_enable: bool
    reranking_model: RerankingModelConfig2
    top_k: int
    score_threshold_enabled: bool
    score_threshold: float


class KnowledgeRetrievalNodeData(BaseNodeData):
    """
    Knowledge retrieval Node Data.
    """
    type: str = 'knowledge-retrieval'
    query_variable_selector: list[str]
    dataset_ids: list[str]
    retrieval_mode: Literal['single', 'multiple']
    multiple_retrieval_config: Optional[MultipleRetrievalConfig] = None
    single_retrieval_config: Optional[SingleRetrievalConfig] = None
    dataset_retrieval_configs: Optional[list[RetrievalConfig]] = None