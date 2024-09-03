import type { CommonNodeType, Memory, ModelConfig, ValueSelector } from '@/app/components/workflow/types'

export type Topic = {
  id: string
  name: string
}

export type QuestionTransformationNodeType = CommonNodeType & {
  query_variable_selector: ValueSelector
  model: ModelConfig
  instruction: string
  memory?: Memory
}
