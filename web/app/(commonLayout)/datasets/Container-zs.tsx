'use client'

// Libraries
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useDebounceFn } from 'ahooks'
import useSWR from 'swr'

// Components
import Datasets from './Datasets-zs'
// import DatasetFooter from './DatasetFooter'
import ApiServer from './ApiServer'
import Doc from './Doc'
import TabSliderNew from '@/app/components/base/tab-slider-new-zs'
import SearchInput from '@/app/components/base/search-input-zs'
import TagManagementModal from '@/app/components/base/tag-management'
import TagFilter from '@/app/components/base/tag-management/zs-filter'

// Services
import { fetchDatasetApiBaseUrl } from '@/service/datasets'

// Hooks
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
import { useAppContext } from '@/context/app-context'
import CreateButton from '@/app/components/base/create-button-zs'

const Container = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const { currentWorkspace } = useAppContext()
  const showTagManagementModal = useTagStore(s => s.showTagManagementModal)

  const options = useMemo(() => {
    return [
      { value: 'dataset', text: t('dataset.datasets') },
      ...(currentWorkspace.role === 'dataset_operator' ? [] : [{ value: 'api', text: t('dataset.datasetsApi') }]),
    ]
  }, [currentWorkspace.role, t])

  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'dataset',
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const { data } = useSWR(activeTab === 'dataset' ? null : '/datasets/api-base-info', fetchDatasetApiBaseUrl)

  const [keywords, setKeywords] = useState('')
  const [searchKeywords, setSearchKeywords] = useState('')
  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([])
  const [tagIDs, setTagIDs] = useState<string[]>([])
  const { run: handleTagsUpdate } = useDebounceFn(() => {
    setTagIDs(tagFilterValue)
  }, { wait: 500 })
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    handleTagsUpdate()
  }

  useEffect(() => {
    if (currentWorkspace.role === 'normal')
      return router.replace('/apps')
  }, [currentWorkspace])

  return (
    <div ref={containerRef} className='grow relative flex flex-col h-full overflow-y-auto' style={{ background: 'linear-gradient( 180deg, #EBF3FF 0%, #E8E9FF 100%)' }}>
      <div className='h-full relative flex flex-col overflow-y-auto shrink-0 grow rounded-tl-[20px] bg-[#F7F8FC]'>
        <div className='sticky top-0 shrink-0 pt-[38px] pb-[18px] px-[60px] rounded-tl-[20px] bg-[#F7F8FC] z-20'>
          <div className='text-[#120649] font-semibold text-[22px] leading-[22px]'>知识库</div>
          <div className='pt-[29px] flex justify-between leading-[56px] z-10 flex-wrap gap-y-2'>
            <TabSliderNew
              value={activeTab}
              onChange={newActiveTab => setActiveTab(newActiveTab)}
              options={options}
            />
            {activeTab === 'dataset' && (
              <div className='flex items-center gap-[14px]'>
                <TagFilter type='knowledge' value={tagFilterValue} onChange={handleTagsChange} />
                <SearchInput className='w-[200px]' value={keywords} onChange={handleKeywordsChange} />
                <CreateButton
                  title='创建知识库'
                  className='leading-[32px] py-[10px] px-[17px] h-[34px] text-[14px] font-[600]'
                  onClick={() => {
                    location.href = '/datasets/create'
                  }}
                />
              </div>
            )}
            {activeTab === 'api' && data && <ApiServer apiBaseUrl={data.api_base_url || ''} />}
          </div>
        </div>

        {activeTab === 'dataset' && (
          <>
            <Datasets containerRef={containerRef} tags={tagIDs} keywords={searchKeywords} />
            {/* <DatasetFooter /> */}
            {showTagManagementModal && (
              <TagManagementModal type='knowledge' show={showTagManagementModal} />
            )}
          </>
        )}

        {activeTab === 'api' && data && <Doc apiBaseUrl={data.api_base_url || ''} />}
      </div>
    </div>

  )
}

export default Container
