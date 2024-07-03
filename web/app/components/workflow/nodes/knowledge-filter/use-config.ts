import { useCallback, useEffect, useRef } from 'react'
import produce from 'immer'
import { BlockEnum, VarType } from '../../types'
import type { Memory, ValueSelector, Var } from '../../types'
import {
  useIsChatMode, useNodesReadOnly,
  useWorkflow,
} from '../../hooks'
import { useStore } from '../../store'
import useAvailableVarList from '../_base/hooks/use-available-var-list'
import type { KnowledgeFilterNodeType } from './types'
import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'
import useOneStepRun from '@/app/components/workflow/nodes/_base/hooks/use-one-step-run'


const useConfig = (id: string, payload: KnowledgeFilterNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const isChatMode = useIsChatMode()
  const defaultConfig = useStore(s => s.nodesDefaultConfigs)[payload.type]
  const { getBeforeNodesInSameBranch } = useWorkflow()
  const startNode = getBeforeNodesInSameBranch(id).find(node => node.data.type === BlockEnum.Start)
  const knowledgeNode = getBeforeNodesInSameBranch(id).find(node => node.data.type === BlockEnum.KnowledgeRetrieval)
  const startNodeId = startNode?.id
  const knowledgeId = knowledgeNode?.id

  const { inputs, setInputs } = useNodeCrud<KnowledgeFilterNodeType>(id, payload)
  const inputRef = useRef(inputs)
  useEffect(() => {
    inputRef.current = inputs
  }, [inputs])



  const handleQueryVarChange = useCallback((newVar: ValueSelector | string) => {
    const newInputs = produce(inputs, (draft) => {
      draft.query_variable_selector = newVar as ValueSelector
    })
    setInputs(newInputs)
  }, [inputs, setInputs])


  useEffect(() => {
    const isReady = defaultConfig && Object.keys(defaultConfig).length > 0
    if (isReady) {
      let query_variable_selector: ValueSelector = []
      if (isChatMode && inputs.query_variable_selector.length === 0 && knowledgeId)
        query_variable_selector = [knowledgeId, 'result']

      setInputs({
        ...inputs,
        ...defaultConfig,
        query_variable_selector: inputs.query_variable_selector.length > 0 ? inputs.query_variable_selector : query_variable_selector,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultConfig])

  const handleClassesChange = useCallback((newClasses: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.classes = newClasses
      // draft._targetBranches = newClasses
    })
    setInputs(newInputs)
  }, [inputs, setInputs])

  const filterInputVar = useCallback((varPayload: Var) => {
    return [VarType.number, VarType.string].includes(varPayload.type)
  }, [])

  const {
    availableVars,
    availableNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar: filterInputVar,
  })



  // single run
  const {
    isShowSingleRun,
    hideSingleRun,
    // getInputVars,
    runningStatus,
    handleRun,
    handleStop,
    runInputData,
    setRunInputData,
    runResult,
  } = useOneStepRun<KnowledgeFilterNodeType>({
    id,
    data: inputs,
    defaultRunInputData: {
      query: '',
    },
  })

  const query = runInputData.query
  const setQuery = useCallback((newQuery: string) => {
    setRunInputData({
      ...runInputData,
      query: newQuery,
    })
  }, [runInputData, setRunInputData])

  console.log("runInputData")
  console.log(runInputData)
  console.log('inputs:')
  console.log(inputs)
  const varInputs = runInputData.query //getInputVars([inputs.instruction])
  const inputVarValues = (() => {
    const vars: Record<string, any> = {
      query,
    }
    Object.keys(runInputData)
      .forEach((key) => {
        vars[key] = runInputData[key]
      })
    return vars
  })()

  const setInputVarValues = useCallback((newPayload: Record<string, any>) => {
    setRunInputData(newPayload)
  }, [setRunInputData])

  const filterVar = useCallback((varPayload: Var) => {
    return varPayload.type === VarType.arrayObject
  }, [])

  return {
    readOnly,
    inputs,
    // handleModelChanged,
    isChatMode,
    // isChatModel,
    // handleCompletionParamsChange,
    handleQueryVarChange,
    filterVar,
    handleTopicsChange: handleClassesChange,
    // hasSetBlockStatus,
    availableVars,
    availableNodesWithParent,
    // handleInstructionChange,
    varInputs,
    inputVarValues,
    setInputVarValues,
    // handleMemoryChange,
    isShowSingleRun,
    hideSingleRun,
    runningStatus,
    handleRun,
    handleStop,
    query,
    setQuery,
    runResult,
  }
}

export default useConfig
