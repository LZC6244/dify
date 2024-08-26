'use client'

import { useContext } from 'use-context-selector'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiMoreFill,
} from '@remixicon/react'
import Image from 'next/image'
import apiIcon from './images/api.svg'
import databaseIcon from './images/database.svg'
import excelIcon from './images/excel.svg'
import htmIcon from './images/htm.svg'
import imgIcon from './images/img.svg'
import textIcon from './images/text.svg'
import wordIcon from './images/word.svg'
import cn from '@/utils/classnames'
import Confirm from '@/app/components/base/confirm-zs'
import { ToastContext } from '@/app/components/base/toast'
import { checkIsUsedInApp, deleteDataset } from '@/service/datasets'
import type { DataSet } from '@/models/datasets'
import Tooltip from '@/app/components/base/tooltip'
// import { Folder } from '@/app/components/base/icons/src/vender/solid/files'
import type { HtmlContentProps } from '@/app/components/base/popover'
import CustomPopover from '@/app/components/base/popover'
import Divider from '@/app/components/base/divider'
import RenameDatasetModal from '@/app/components/datasets/rename-modal-zs'
import type { Tag } from '@/app/components/base/tag-management/constant'
import TagSelector from '@/app/components/base/tag-management/zs-selector'
import { useAppContext } from '@/context/app-context'

export type DatasetCardProps = {
  dataset: DataSet
  onSuccess?: () => void
}

const DatasetCard = ({
  dataset,
  onSuccess,
}: DatasetCardProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const { push } = useRouter()

  const { isCurrentWorkspaceDatasetOperator } = useAppContext()
  const [tags, setTags] = useState<Tag[]>(dataset.tags)

  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState<string>('')
  const detectIsUsedByApp = useCallback(async () => {
    try {
      const { is_using: isUsedByApp } = await checkIsUsedInApp(dataset.id)
      setConfirmMessage(isUsedByApp ? t('dataset.datasetUsedByApp')! : t('dataset.deleteDatasetConfirmContent')!)
    }
    catch (e: any) {
      const res = await e.json()
      notify({ type: 'error', message: res?.message || 'Unknown error' })
    }

    setShowConfirmDelete(true)
  }, [dataset.id, notify, t])
  const onConfirmDelete = useCallback(async () => {
    try {
      await deleteDataset(dataset.id)
      notify({ type: 'success', message: t('dataset.datasetDeleted') })
      if (onSuccess)
        onSuccess()
    }
    catch (e: any) {
    }
    setShowConfirmDelete(false)
  }, [dataset.id, notify, onSuccess, t])

  const Operations = (props: HtmlContentProps & { showDelete: boolean }) => {
    const onMouseLeave = async () => {
      props.onClose?.()
    }
    const onClickRename = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      setShowRenameModal(true)
    }
    const onClickDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      detectIsUsedByApp()
    }
    return (
      <div className="relative w-full py-1" onMouseLeave={onMouseLeave}>
        <div className='h-8 py-[6px] px-3 mx-1 flex items-center gap-2 hover:bg-gray-100 rounded-lg cursor-pointer' onClick={onClickRename}>
          <span className='text-gray-700 text-sm'>{t('common.operation.settings')}</span>
        </div>
        {props.showDelete && (
          <>
            <Divider className="!my-1" />
            <div
              className='group h-8 py-[6px] px-3 mx-1 flex items-center gap-2 hover:bg-red-50 rounded-lg cursor-pointer'
              onClick={onClickDelete}
            >
              <span className={cn('text-gray-700 text-sm', 'group-hover:text-red-500')}>
                {t('common.operation.delete')}
              </span>
            </div>
          </>
        )}
      </div>
    )
  }

  useEffect(() => {
    setTags(dataset.tags)
  }, [dataset])

  const getIcon = (description: string) => {
    const desc = description.toLowerCase()
    if (desc.includes('.pdf') || desc.includes('.png') || desc.includes('.jpg') || desc.includes('.jpeg') || desc.includes('.gif'))
      return imgIcon
    if (desc.includes('.db') || desc.includes('.sql'))
      return databaseIcon
    if (desc.includes('.txt') || desc.includes('.doc') || desc.includes('.docx'))
      return wordIcon
    if (desc.includes('.csv') || desc.includes('.xls'))
      return excelIcon
    if (desc.includes('.html') || desc.includes('.htm') || desc.includes('http'))
      return htmIcon
    if (desc.includes('http'))
      return apiIcon
    return textIcon
  }

  return (
    <>
      <div
        className='group col-span-1 bg-white rounded-lg min-h-[179px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0px_6px_10px_4px_rgba(0,0,0,0.06)]'
        data-disable-nprogress={true}
        onClick={(e) => {
          e.preventDefault()
          push(`/datasets/${dataset.id}/documents`)
        }}
      >
        <div className='flex pt-[20px] px-[20px] pb-[10px] items-center gap-[10px] grow-0 shrink-0'>
          <div className={cn(
            'shrink-0 flex items-center justify-center',
            !dataset.embedding_available && 'opacity-50 hover:opacity-100',
          )}>
            {/* <Folder className='w-5 h-5 text-[#444CE7]' /> */}
            <Image src={getIcon(dataset.description)} className='w-[48px] h-[48px] ' alt='' />
          </div>
          <div className='grow w-0 py-[1px]'>
            <div className='flex items-center text-[18px] leading-[18px] font-semibold text-[#212B36]'>
              <div className={cn('truncate', !dataset.embedding_available && 'opacity-50 hover:opacity-100')} title={dataset.name}>{dataset.name}</div>
              {!dataset.embedding_available && (
                <Tooltip
                  selector={`dataset-tag-${dataset.id}`}
                  htmlContent={t('dataset.unavailableTip')}
                >
                  <span className='shrink-0 inline-flex w-max ml-1 px-1 border boder-gray-200 rounded-md text-gray-500 text-xs font-normal leading-[18px]'>{t('dataset.unavailable')}</span>
                </Tooltip>
              )}
            </div>
            <div className='flex items-center mt-[10px] text-[14px] leading-[14px] text-[#9EADB9]'>
              <div
                className={cn('truncate', (!dataset.embedding_available || !dataset.document_count) && 'opacity-50')}
                title={`${dataset.document_count}${t('dataset.documentCount')} · ${Math.round(dataset.word_count / 1000)}${t('dataset.wordCount')} · ${dataset.app_count}${t('dataset.appCount')}`}
              >
                <span>{dataset.document_count}{t('dataset.documentCount')}</span>
                <span className='shrink-0 mx-0.5 w-1 text-gray-400'>·</span>
                <span>{Math.round(dataset.word_count / 1000)}{t('dataset.wordCount')}</span>
                <span className='shrink-0 mx-0.5 w-1 text-gray-400'>·</span>
                <span>{dataset.app_count}{t('dataset.appCount')}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'grow px-[20px] max-h-[72px] min-h-[48px] text-[14px] leading-[24px] text-[#637381] group-hover:line-clamp-2 group-hover:max-h-[48px]',
            tags.length ? 'line-clamp-2 max-h-[48px]' : 'line-clamp-3',
            !dataset.embedding_available && 'opacity-50 hover:opacity-100',
          )}
          title={dataset.description}>
          {dataset.description}
        </div>
        <div className={cn(
          'items-center shrink-0 mt-[13px] pt-0 pl-[14px] pr-[6px] pb-[6px] h-[32px]',
          tags.length ? 'flex' : '!hidden group-hover:!flex',
        )}>
          <div className={cn('grow flex items-center gap-1 w-0', !dataset.embedding_available && 'opacity-50 hover:opacity-100')} onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}>
            <div className={cn(
              'group-hover:!block group-hover:!mr-0 mr-[41px] grow w-full',
              tags.length ? '!block' : '!hidden',
            )}>
              <TagSelector
                position='bl'
                type='knowledge'
                targetID={dataset.id}
                value={tags.map(tag => tag.id)}
                selectedTags={tags}
                onCacheUpdate={setTags}
                onChange={onSuccess}
              />
            </div>
          </div>
          {/* <div className='!hidden group-hover:!flex shrink-0 mx-1 w-[1px] h-[14px] bg-gray-200' /> */}
          <div className='ml-1 !hidden group-hover:!flex shrink-0'>
            <CustomPopover
              htmlContent={<Operations showDelete={!isCurrentWorkspaceDatasetOperator} />}
              position="br"
              trigger="click"
              btnElement={
                <div
                  className='flex items-center justify-center w-8 h-8 cursor-pointer rounded-md'
                >
                  <RiMoreFill className='w-4 h-4 text-[#637381]' />
                </div>
              }
              btnClassName={open =>
                cn(
                  open ? '!bg-[#F7F8FC] !shadow-none' : '!bg-transparent',
                  'h-8 w-8 !p-2 rounded-md border-none hover:!bg-[#F7F8FC]',
                )
              }
              className={'!w-[128px] h-fit !z-20'}
            />
          </div>
        </div>
      </div>
      {showRenameModal && (
        <RenameDatasetModal
          show={showRenameModal}
          dataset={dataset}
          onClose={() => setShowRenameModal(false)}
          onSuccess={onSuccess}
        />
      )}
      {showConfirmDelete && (
        <Confirm
          title={t('dataset.deleteDatasetConfirmTitle')}
          content={confirmMessage}
          isShow={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={onConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
    </>
  )
}

export default DatasetCard
