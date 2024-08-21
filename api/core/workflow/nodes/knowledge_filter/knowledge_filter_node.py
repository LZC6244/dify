from typing import Optional, cast

from core.workflow.entities.base_node_data_entities import BaseNodeData
from core.workflow.entities.node_entities import NodeRunResult, NodeType
from core.workflow.entities.variable_pool import VariablePool
from core.workflow.nodes.base_node import BaseNode
from core.workflow.nodes.knowledge_filter.entities import KnowledgeFilterNodeData
from models.workflow import WorkflowNodeExecutionStatus


class KnowledgeFilterNode(BaseNode):
    _node_data_cls = KnowledgeFilterNodeData
    node_type = NodeType.KNOWLEDGE_FILTER

    def _run(self, variable_pool: VariablePool) -> NodeRunResult:
        node_data: KnowledgeFilterNodeData = cast(self._node_data_cls, self.node_data)
        node_data = cast(KnowledgeFilterNodeData, node_data)

        # extract variables
        query = variable_pool.get_any(node_data.query_variable_selector)

        variables = {
            'query': query
        }
    
        thresholds = [cla.threshold  for cla in node_data.classes]

        process_data = {
            "input": variables,
            "thresholds": thresholds
        }

        low_score_results = []
        mid_score_results = []
        high_score_results = []

        # 遍历result中的每个条目
        for item in query:
            score = item["metadata"]["score"]

            if score >= thresholds[0]:
                high_score_results.append(item)
            elif score >= thresholds[1]:
                mid_score_results.append(item)
            else:
                low_score_results.append(item)

        result =  {
            "high_score_results":high_score_results,
            "mid_score_results":mid_score_results,
            "low_score_results":low_score_results,
        }
        
        if len(high_score_results):
            category_id = "1"
        elif len(mid_score_results):
            category_id = "2"
        else:
            category_id = "3"
        
        try:

            outputs = result

            return NodeRunResult(
                status=WorkflowNodeExecutionStatus.SUCCEEDED,
                inputs=variables,
                process_data=process_data,
                outputs=outputs,
                edge_source_handle=category_id
            )

        except ValueError as e:
            return NodeRunResult(
                status=WorkflowNodeExecutionStatus.FAILED,
                inputs=variables,
                error=str(e)
            )

    @classmethod
    def _extract_variable_selector_to_variable_mapping(cls, node_data: BaseNodeData) -> dict[str, list[str]]:
        node_data = node_data
        node_data = cast(cls._node_data_cls, node_data)
        variable_mapping = {'query': node_data.query_variable_selector}
        variable_selectors = []

        for variable_selector in variable_selectors:
            variable_mapping[variable_selector.variable] = variable_selector.value_selector
        return variable_mapping

    @classmethod
    def get_default_config(cls, filters: Optional[dict] = None) -> dict:
        """
        Get default config of node.
        :param filters: filter by node config parameters.
        :return:
        """
        return {
            "type": "knowledge-filter",
            "config": {

            }
        }

