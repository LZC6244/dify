'use client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import EmbeddingProcess from '../embedding-process'

import s from './index.module.css'
// import cn from '@/utils/classnames'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import type { FullDocumentDetail, createDocumentResponse } from '@/models/datasets'

type StepThreeProps = {
  datasetId?: string
  datasetName?: string
  indexingType?: string
  creationCache?: createDocumentResponse
}

const StepThree = ({ datasetId, datasetName, indexingType, creationCache }: StepThreeProps) => {
  const { t } = useTranslation()

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  return (
    <div className='flex w-full h-full'>
      <div className={'h-full w-full overflow-y-scroll px-[30px] sm:px-[30px]'}>
        <div className='max-w-[636px]'>
          {!datasetId && (
            <>
              <div className={s.creationInfo}>
                <div className={s.title}>知识库已创建</div>
                <div className={s.content}>我们自动为该知识库起了个名称，您也可以随时修改</div>
                <div className={s.label}>{t('datasetCreation.stepThree.label')}</div>
                <div className={s.datasetName}>{datasetName || creationCache?.dataset?.name}</div>
              </div>
              {/* <div className={s.dividerLine} /> */}
            </>
          )}
          {datasetId && (
            <div className={s.creationInfo}>
              <div className={s.title}>文档已上传</div>
              <div className={s.content}>{`文档已上传至知识库：${datasetName || creationCache?.dataset?.name}，你可以在知识库的文档列表中找到它`}</div>
            </div>
          )}
          <EmbeddingProcess
            datasetId={datasetId || creationCache?.dataset?.id || ''}
            batchId={creationCache?.batch || ''}
            documents={creationCache?.documents as FullDocumentDetail[]}
            indexingType={indexingType || creationCache?.dataset?.indexing_technique}
          />
        </div>
      </div>
      {/* {!isMobile && <div className={cn(s.sideTip)}>
        <div className={s.tipCard}>
          <span className={s.icon} />
          <div className={s.title}>{t('datasetCreation.stepThree.sideTipTitle')}</div>
          <div className={s.content}>{t('datasetCreation.stepThree.sideTipContent')}</div>
        </div>
      </div>} */}
    </div>
  )
}

export default StepThree
