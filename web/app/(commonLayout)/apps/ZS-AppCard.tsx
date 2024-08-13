'use client'

import { useContext, useContextSelector } from 'use-context-selector'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiMoreFill } from '@remixicon/react'
import s from './style.module.css'
import cn from '@/utils/classnames'
import type { App } from '@/types/app'
import Confirm from '@/app/components/base/confirm'
import { ToastContext } from '@/app/components/base/toast'
import { copyApp, deleteApp, exportAppConfig, updateAppInfo, updateAppSiteConfig } from '@/service/apps'
import DuplicateAppModal from '@/app/components/app/duplicate-modal'
import type { DuplicateAppModalProps } from '@/app/components/app/duplicate-modal'
import AppIcon from '@/app/components/base/app-icon/zs-index'
import AppsContext, { useAppContext } from '@/context/app-context'
import type { HtmlContentProps } from '@/app/components/base/popover'
import CustomPopover from '@/app/components/base/popover'
import Divider from '@/app/components/base/divider'
import { getRedirection } from '@/utils/app-redirection'
import { useProviderContext } from '@/context/provider-context'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import type { CreateAppModalProps } from '@/app/components/explore/create-app-modal-zs'
import EditAppModal from '@/app/components/explore/create-app-modal-zs'
import SwitchAppModal from '@/app/components/app/switch-app-modal'
import type { Tag } from '@/app/components/base/tag-management/constant'
import TagSelector from '@/app/components/base/tag-management/zs-selector'
import type { EnvironmentVariable } from '@/app/components/workflow/types'
import DSLExportConfirmModal from '@/app/components/workflow/dsl-export-confirm-modal'
import { fetchWorkflowDraft } from '@/service/workflow'
import { asyncRunSafe } from '@/utils'

export type AppCardProps = {
  app: App
  onRefresh?: () => void
}

const AppCard = ({ app, onRefresh }: AppCardProps) => {
  const { t } = useTranslation()
  const { notify } = useContext(ToastContext)
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { onPlanInfoChanged } = useProviderContext()
  const { push } = useRouter()

  const mutateApps = useContextSelector(
    AppsContext,
    state => state.mutateApps,
  )

  const [showEditModal, setShowEditModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showSwitchModal, setShowSwitchModal] = useState<boolean>(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [secretEnvList, setSecretEnvList] = useState<EnvironmentVariable[]>([])

  const onConfirmDelete = useCallback(async () => {
    try {
      await deleteApp(app.id)
      notify({ type: 'success', message: t('app.appDeleted') })
      if (onRefresh)
        onRefresh()
      mutateApps()
      onPlanInfoChanged()
    }
    catch (e: any) {
      notify({
        type: 'error',
        message: `${t('app.appDeleteFailed')}${'message' in e ? `: ${e.message}` : ''}`,
      })
    }
    setShowConfirmDelete(false)
  }, [app.id])

  const onEdit: CreateAppModalProps['onConfirm'] = useCallback(async ({
    name,
    icon,
    icon_background,
    description,
  }) => {
    try {
      await updateAppInfo({
        appID: app.id,
        name,
        icon,
        icon_background,
        description,
      })
      console.log(1)

      const [err] = await asyncRunSafe<App>(
        updateAppSiteConfig({
          url: `/apps/${app.id}/site`,
          body: {
            title: name,
            icon,
            icon_background,
            description,
          },
        }) as Promise<App>,
      )
      setShowEditModal(false)
      notify({
        type: 'success',
        message: t('app.editDone'),
      })
      if (onRefresh)
        onRefresh()
      mutateApps()
    }
    catch (e) {
      notify({ type: 'error', message: t('app.editFailed') })
    }
  }, [app.id, mutateApps, notify, onRefresh, t])

  const onCopy: DuplicateAppModalProps['onConfirm'] = async ({ name, icon, icon_background }) => {
    try {
      const newApp = await copyApp({
        appID: app.id,
        name,
        icon,
        icon_background,
        mode: app.mode,
      })
      setShowDuplicateModal(false)
      notify({
        type: 'success',
        message: t('app.newApp.appCreated'),
      })
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      if (onRefresh)
        onRefresh()
      mutateApps()
      onPlanInfoChanged()
      getRedirection(isCurrentWorkspaceEditor, newApp, push)
    }
    catch (e) {
      notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
  }

  const onExport = async (include = false) => {
    try {
      const { data } = await exportAppConfig({
        appID: app.id,
        include,
      })
      const a = document.createElement('a')
      const file = new Blob([data], { type: 'application/yaml' })
      a.href = URL.createObjectURL(file)
      a.download = `${app.name}.yml`
      a.click()
    }
    catch (e) {
      notify({ type: 'error', message: t('app.exportFailed') })
    }
  }

  const exportCheck = async () => {
    if (app.mode !== 'workflow' && app.mode !== 'advanced-chat') {
      onExport()
      return
    }
    try {
      const workflowDraft = await fetchWorkflowDraft(`/apps/${app.id}/workflows/draft`)
      const list = (workflowDraft.environment_variables || []).filter(env => env.value_type === 'secret')
      if (list.length === 0) {
        onExport()
        return
      }
      setSecretEnvList(list)
    }
    catch (e) {
      notify({ type: 'error', message: t('app.exportFailed') })
    }
  }

  const onSwitch = () => {
    if (onRefresh)
      onRefresh()
    mutateApps()
    setShowSwitchModal(false)
  }

  const Operations = (props: HtmlContentProps) => {
    const onMouseLeave = async () => {
      props.onClose?.()
    }
    const onClickSettings = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      setShowEditModal(true)
    }
    const onClickDuplicate = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      setShowDuplicateModal(true)
    }
    const onClickExport = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      exportCheck()
    }
    const onClickSwitch = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      setShowSwitchModal(true)
    }
    const onClickDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      props.onClick?.()
      e.preventDefault()
      setShowConfirmDelete(true)
    }
    return (
      <div className="relative w-full py-1" onMouseLeave={onMouseLeave}>
        <button className={cn(s.actionItem, s.activeItem)} onClick={onClickSettings}>
          <span className={cn(s.actionName, '')}>{t('app.editApp')}</span>
        </button>
        <Divider className="!my-1" />
        <button className={cn(s.actionItem, s.activeItem)} onClick={onClickDuplicate}>
          <span className={cn(s.actionName, '')}>{t('app.duplicate')}</span>
        </button>
        <button className={cn(s.actionItem, s.activeItem)} onClick={onClickExport}>
          <span className={cn(s.actionName, '')}>{t('app.export')}</span>
        </button>
        {(app.mode === 'completion' || app.mode === 'chat') && (
          <>
            <Divider className="!my-1" />
            <div
              className='h-9 py-2 px-3 mx-1 flex items-center rounded-lg cursor-pointer'
              onClick={onClickSwitch}
            >
              <span className='text-[#212B36] text-sm leading-5'>{t('app.switch')}</span>
            </div>
          </>
        )}
        <Divider className="!my-1" />
        <div
          className={cn(s.actionItem, s.deleteActionItem, 'group')}
          onClick={onClickDelete}
        >
          <span className={cn(s.actionName, 'group-hover:text-red-500')}>
            {t('common.operation.delete')}
          </span>
        </div>
      </div>
    )
  }

  const [tags, setTags] = useState<Tag[]>(app.tags)
  useEffect(() => {
    setTags(app.tags)
  }, [app.tags])

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault()
          getRedirection(isCurrentWorkspaceEditor, app, push)
        }}
        className='group col-span-1 bg-white rounded-lg min-h-[160px] flex flex-row p-[18px] pb-[10px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0px_6px_10px_4px_rgba(0,0,0,0.06)]'
      >
        <div className='relative shrink-0'>
          <AppIcon
            size="large"
            className='!w-[72px] !h-[72px] !rounded-[36px]'
            icon={app.icon}
            background={app.icon_background}
          />
        </div>
        <div className='grow w-0 pt-[12px] ml-3 relative'>
          {/* 名称和类型 */}
          <div className='flex flex-row items-center'>
            <div className='truncate text-[18px] leading-[18px] font-semibold text-[#212B36]' title={app.name}>{app.name}</div>
            <div className='ml-2 flex items-center p-1 bg-[#F7F8FC] rounded text-[12px] leading-[12px] text-[#9EADB9]'>
              {app.mode === 'advanced-chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
              {app.mode === 'chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
              {app.mode === 'agent-chat' && <div className='truncate'>{t('app.types.agent').toUpperCase()}</div>}
              {app.mode === 'workflow' && <div className='truncate'>{t('app.types.workflow').toUpperCase()}</div>}
              {app.mode === 'completion' && <div className='truncate'>{t('app.types.completion').toUpperCase()}</div>}
            </div>
          </div>
          {/* 描述 */}
          <div
            className={cn(
              'mt-[8px] max-h-[72px] min-h-[48px] text-[14px] leading-[24px] text-[#637381] group-hover:line-clamp-2 group-hover:max-h-[48px]',
              tags.length ? 'line-clamp-2' : 'line-clamp-3',
            )}
            title={app.description}
          >
            {app.description}
          </div>
          <div className={cn(
            'items-center h-[32px] mt-3',
            tags.length ? 'flex' : '!hidden group-hover:!flex',
          )}>
            {isCurrentWorkspaceEditor && (
              <>
                <div className={cn('grow flex items-center gap-1 w-0')} onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}>
                  <div className={cn(
                    'group-hover:!block group-hover:!mr-0 mr-[41px] grow w-full',
                    tags.length ? '!block' : '!hidden',
                  )}>
                    <TagSelector
                      position='bl'
                      type='app'
                      targetID={app.id}
                      value={tags.map(tag => tag.id)}
                      selectedTags={tags}
                      onCacheUpdate={setTags}
                      onChange={onRefresh}
                    />
                  </div>
                </div>
                <div className='ml-1 !hidden group-hover:!flex shrink-0'>
                  <CustomPopover
                    htmlContent={<Operations />}
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
                        'h-8 w-8 !p-2 rounded-[8px] border-none hover:!bg-[#F7F8FC]',
                      )
                    }
                    popupClassName={
                      (app.mode === 'completion' || app.mode === 'chat')
                        ? '!w-[238px] translate-x-[-110px]'
                        : ''
                    }
                    className={'!w-[128px] h-fit !z-20'}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditAppModal
          isEditModal
          appIcon={app.icon}
          appIconBackground={app.icon_background}
          appName={app.name}
          appDescription={app.description}
          show={showEditModal}
          onConfirm={onEdit}
          onHide={() => setShowEditModal(false)}
        />
      )}
      {showDuplicateModal && (
        <DuplicateAppModal
          appName={app.name}
          icon={app.icon}
          icon_background={app.icon_background}
          show={showDuplicateModal}
          onConfirm={onCopy}
          onHide={() => setShowDuplicateModal(false)}
        />
      )}
      {showSwitchModal && (
        <SwitchAppModal
          show={showSwitchModal}
          appDetail={app}
          onClose={() => setShowSwitchModal(false)}
          onSuccess={onSwitch}
        />
      )}
      {showConfirmDelete && (
        <Confirm
          title={t('app.deleteAppConfirmTitle')}
          content={t('app.deleteAppConfirmContent')}
          isShow={showConfirmDelete}
          onClose={() => setShowConfirmDelete(false)}
          onConfirm={onConfirmDelete}
          onCancel={() => setShowConfirmDelete(false)}
        />
      )}
      {secretEnvList.length > 0 && (
        <DSLExportConfirmModal
          envList={secretEnvList}
          onConfirm={onExport}
          onClose={() => setSecretEnvList([])}
        />
      )}
    </>
  )
}

export default AppCard
