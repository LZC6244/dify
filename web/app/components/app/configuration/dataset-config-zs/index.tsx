'use client'
import type { FC } from 'react'
import React from 'react'
import { useContext } from 'use-context-selector'
import produce from 'immer'
import { useFormattingChangedDispatcher } from '../debug/hooks'
import FeaturePanel from '../base/feature-panel-zs'
import OperationBtn from '../base/operation-btn-zs'
import CardItem from './card-item/item'
// import ParamsConfig from './params-config'
import ContextVar from './context-var'
import ConfigContext from '@/context/debug-configuration'
import { AppType } from '@/types/app'
import type { DataSet } from '@/models/datasets'

const DatasetConfig: FC = () => {
  const {
    mode,
    dataSets: dataSet,
    setDataSets: setDataSet,
    modelConfig,
    setModelConfig,
    showSelectDataSet,
  } = useContext(ConfigContext)
  const formattingChangedDispatcher = useFormattingChangedDispatcher()

  const hasData = dataSet.length > 0

  const onRemove = (id: string) => {
    setDataSet(dataSet.filter(item => item.id !== id))
    formattingChangedDispatcher()
  }

  const handleSave = (newDataset: DataSet) => {
    const index = dataSet.findIndex(item => item.id === newDataset.id)

    const newDatasets = [...dataSet.slice(0, index), newDataset, ...dataSet.slice(index + 1)]
    setDataSet(newDatasets)
    formattingChangedDispatcher()
  }

  const promptVariables = modelConfig.configs.prompt_variables
  const promptVariablesToSelect = promptVariables.map(item => ({
    name: item.name,
    type: item.type,
    value: item.key,
  }))
  const selectedContextVar = promptVariables?.find(item => item.is_context_var)
  const handleSelectContextVar = (selectedValue: string) => {
    const newModelConfig = produce(modelConfig, (draft) => {
      draft.configs.prompt_variables = modelConfig.configs.prompt_variables.map((item) => {
        return ({
          ...item,
          is_context_var: item.key === selectedValue,
        })
      })
    })
    setModelConfig(newModelConfig)
  }

  return (
    <FeaturePanel
      className='mt-6'
      // headerIcon={Icon}
      title="知识库"
      headerRight={
        <div className='flex items-center gap-1'>
          {/* {!isAgent && <ParamsConfig disabled={!hasData} selectedDatasets={dataSet} />} */}
          <OperationBtn type="add" onClick={showSelectDataSet} />
        </div>
      }
      hasHeaderBottomBorder={!hasData}
      noBodySpacing
    >
      {hasData
        ? (
          <div className='flex flex-wrap mt-0 px-3 pb-5 justify-between'>
            {dataSet.map(item => (
              <CardItem
                key={item.id}
                config={item}
                onRemove={onRemove}
                onSave={handleSave}
              />
            ))}
          </div>
        )
        : (
          <div className='mt-0 px-3 pb-5'>
            <div className='text-[#9EADB9] leading-[14pz] text-[14px]'>您可以直接导入知识库</div>
          </div>
        )}

      {mode === AppType.completion && dataSet.length > 0 && (
        <ContextVar
          value={selectedContextVar?.key}
          options={promptVariablesToSelect}
          onChange={handleSelectContextVar}
        />
      )}
    </FeaturePanel>
  )
}
export default React.memo(DatasetConfig)
