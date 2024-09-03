import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { NodeProps } from 'reactflow'
import InfoPanel from '../_base/components/info-panel'
import { NodeSourceHandle } from '../_base/components/node-handle'
import type { QuestionTransformationNodeType } from './types'
import {
  useTextGenerationCurrentProviderAndModelAndModelList,
} from '@/app/components/header/account-setting/model-provider-page/hooks'
import ModelSelector from '@/app/components/header/account-setting/model-provider-page/model-selector'

const i18nPrefix = 'workflow.nodes.questionClassifiers'

const Node: FC<NodeProps<QuestionTransformationNodeType>> = (props) => {
  const { t } = useTranslation()

  const { data } = props
  const { provider, name: modelId } = data.model

  const {
    textGenerationModelList,
  } = useTextGenerationCurrentProviderAndModelAndModelList()
  const hasSetModel = provider && modelId

  return (
    <div className='mb-1 px-3 py-1'>
      {hasSetModel && (
        <ModelSelector
          defaultModel={{ provider, model: modelId }}
          modelList={textGenerationModelList}
          readonly
        />
      )}
    </div>
  )
}

export default React.memo(Node)
