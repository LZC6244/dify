import type { CommonNodeType, Memory, ModelConfig, ValueSelector } from '@/app/components/workflow/types'

export type Topic = {
  id: string
  name: string
  threshold: string
}

export type KnowledgeFilterNodeType = CommonNodeType & {
  query_variable_selector: ValueSelector
  // model: ModelConfig
  classes: Topic[]
}
