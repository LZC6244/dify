import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import VarReferencePicker from '../_base/components/variable/var-reference-picker'
import useConfig from './use-config'
import ClassList from './components/class-list'

import type { KnowledgeFilterNodeType } from './types'
import Field from '@/app/components/workflow/nodes/_base/components/field'

import { InputVarType, type NodePanelProps } from '@/app/components/workflow/types'
import BeforeRunForm from '@/app/components/workflow/nodes/_base/components/before-run-form'
import ResultPanel from '@/app/components/workflow/run/result-panel'
import Split from '@/app/components/workflow/nodes/_base/components/split'
import OutputVars, { VarItem } from '@/app/components/workflow/nodes/_base/components/output-vars'

const i18nPrefix = 'workflow.nodes.knowledgeFilter'
const i18nPrefiKnowledge = 'workflow.nodes.knowledgeRetrieval'

const Panel: FC<NodePanelProps<KnowledgeFilterNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    // handleModelChanged,
    isChatMode,
    // isChatModel,
    // handleCompletionParamsChange,
    handleQueryVarChange,
    handleTopicsChange,
    // hasSetBlockStatus,
    availableVars,
    availableNodesWithParent,
    // handleInstructionChange,
    inputVarValues,
    varInputs,
    setInputVarValues,
    // handleMemoryChange,
    isShowSingleRun,
    hideSingleRun,
    runningStatus,
    handleRun,
    handleStop,
    runResult,
    filterVar,
  } = useConfig(id, data)

  // const model = inputs.model

  return (
    <div className='mt-2'>
      <div className='px-4 pb-4 space-y-4'>
        <Field
          title={t(`${i18nPrefix}.inputVars`)}
        >
          <VarReferencePicker
            readonly={readOnly}
            isShowNodeName
            nodeId={id}
            value={inputs.query_variable_selector}
            onChange={handleQueryVarChange}
            filterVar={filterVar}
          />
        </Field>
        <Field
          title={t(`${i18nPrefix}.class`)}
        >
          <ClassList
            id={id}
            list={inputs.classes}
            onChange={handleTopicsChange}
            readonly={readOnly}
          />
        </Field>

      </div>
      <Split />
      <div className='px-4 pt-4 pb-2'>
        <OutputVars>
          <>
          <VarItem
              name='high_score_results'
              type='Array[Object]'
              description={t(`${i18nPrefiKnowledge}.outputVars.output`)}
              subItems={[
                {
                  name: 'content',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.content`),
                },
                // url, title, link like bing search reference result: link, link page title, link page icon
                {
                  name: 'title',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.title`),
                },
                {
                  name: 'url',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.url`),
                },
                {
                  name: 'icon',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.icon`),
                },
                {
                  name: 'metadata',
                  type: 'object',
                  description: t(`${i18nPrefiKnowledge}.outputVars.metadata`),
                },
              ]}
            />
            <VarItem
              name='mid_score_results'
              type='Array[Object]'
              description={t(`${i18nPrefiKnowledge}.outputVars.output`)}
              subItems={[
                {
                  name: 'content',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.content`),
                },
                // url, title, link like bing search reference result: link, link page title, link page icon
                {
                  name: 'title',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.title`),
                },
                {
                  name: 'url',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.url`),
                },
                {
                  name: 'icon',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.icon`),
                },
                {
                  name: 'metadata',
                  type: 'object',
                  description: t(`${i18nPrefiKnowledge}.outputVars.metadata`),
                },
              ]}
            />
            <VarItem
              name='low_score_results'
              type='Array[Object]'
              description={t(`${i18nPrefiKnowledge}.outputVars.output`)}
              subItems={[
                {
                  name: 'content',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.content`),
                },
                // url, title, link like bing search reference result: link, link page title, link page icon
                {
                  name: 'title',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.title`),
                },
                {
                  name: 'url',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.url`),
                },
                {
                  name: 'icon',
                  type: 'string',
                  description: t(`${i18nPrefiKnowledge}.outputVars.icon`),
                },
                {
                  name: 'metadata',
                  type: 'object',
                  description: t(`${i18nPrefiKnowledge}.outputVars.metadata`),
                },
              ]}
            />
          </>
        </OutputVars>
      </div>
      {isShowSingleRun && (
        <BeforeRunForm
          nodeName={inputs.title}
          onHide={hideSingleRun}
          forms={[
            {
              inputs: [{
                label: t(`${i18nPrefix}.inputVars`)!,
                variable: 'query',
                type: InputVarType.paragraph,
                required: true,
              }, ...varInputs],
              values: inputVarValues,
              onChange: setInputVarValues,
            },
          ]}
          runningStatus={runningStatus}
          onRun={handleRun}
          onStop={handleStop}
          result={<ResultPanel {...runResult} showSteps={false} />}
        />
      )}
    </div>
  )
}

export default React.memo(Panel)
