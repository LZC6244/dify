import type { NodeDefault } from '../../types'
import { BlockEnum } from '../../types'
import type { KnowledgeFilterNodeType } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/constants'

const i18nPrefix = 'workflow'

const nodeDefault: NodeDefault<KnowledgeFilterNodeType> = {
  defaultValue: {
    _targetBranches: [
      {
        id: '1',
        name: 'high_score_results',
      },
      {
        id: '2',
        name: 'mid_score_results',
      },
      {
        id: '3',
        name: 'low_score_results',
      },
    ],
    query_variable_selector: [],
    classes: [
      {
        id: '1',
        name: "high_score_results",
        threshold: "0.9",
      },
      {
        id: '2',
        name: "mid_score_results",
        threshold: "0.5",
      },
      {
        id: '3',
        name: "low_score_results",
        threshold: "0.1",
      },
    ],
  },
  getAvailablePrevNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
    return nodes
  },
  getAvailableNextNodes(isChatMode: boolean) {
    const nodes = isChatMode ? ALL_CHAT_AVAILABLE_BLOCKS : ALL_COMPLETION_AVAILABLE_BLOCKS
    return nodes
  },
  checkValid(payload: KnowledgeFilterNodeType, t: any) {
    let errorMessages = ''
    if (!errorMessages && (!payload.query_variable_selector || payload.query_variable_selector.length === 0))
      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.knowledgeFilter.inputVars`) })

    // if (!errorMessages && !payload.model.provider)
    //   errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.knowledgeFilter.model`) })

    if (!errorMessages && (!payload.classes || payload.classes.length === 0))
      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.knowledgeFilter.class`) })

    // if (!errorMessages && (payload.classes.some(item => !item.threshold)))
    //   errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.knowledgeFilter.topicName`) })
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
