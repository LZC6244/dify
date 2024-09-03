'use client'
import type { MouseEventHandler } from 'react'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  RiCloseLine,
} from '@remixicon/react'
import { useRouter } from 'next/navigation'
import { useContext, useContextSelector } from 'use-context-selector'
import classNames from 'classnames'
import { DefaultIcon } from '../../base/app-icon-zs'
import Upload from './upload'
import cn from '@/utils/classnames'
import AppsContext, { useAppContext } from '@/context/app-context'
import { useProviderContext } from '@/context/provider-context'
import { ToastContext } from '@/app/components/base/toast'
import type { AppMode } from '@/types/app'
import { createApp } from '@/service/apps'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button-zs'
import ButtonNormal from '@/app/components/base/button'
import AppsFull from '@/app/components/billing/apps-full-in-dialog'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { getRedirection } from '@/utils/app-redirection'

type CreateAppDialogProps = {
  show: boolean
  onSuccess: () => void
  onClose: () => void
}

const CreateAppModal = ({ show, onSuccess, onClose }: CreateAppDialogProps) => {
  const { t } = useTranslation()
  const { push } = useRouter()
  const { notify } = useContext(ToastContext)
  const mutateApps = useContextSelector(AppsContext, state => state.mutateApps)

  const [appMode, setAppMode] = useState<AppMode>('chat')
  const [showChatBotType, setShowChatBotType] = useState<boolean>(true)
  const [emoji, setEmoji] = useState({ icon: '', icon_background: '#FFF' })
  // const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { plan, enableBilling } = useProviderContext()
  const isAppsFull = (enableBilling && plan.usage.buildApps >= plan.total.buildApps)
  const { isCurrentWorkspaceEditor } = useAppContext()

  const isCreatingRef = useRef(false)
  const onCreate: MouseEventHandler = useCallback(async () => {
    if (!appMode) {
      notify({ type: 'error', message: t('app.newApp.appTypeRequired') })
      return
    }
    if (!name.trim()) {
      notify({ type: 'error', message: t('app.newApp.nameNotEmpty') })
      return
    }
    if (isCreatingRef.current)
      return
    isCreatingRef.current = true
    try {
      const app = await createApp({
        name,
        description,
        icon: emoji.icon || DefaultIcon,
        icon_background: emoji.icon_background,
        mode: appMode,
      })
      notify({ type: 'success', message: t('app.newApp.appCreated') })
      onSuccess()
      onClose()
      mutateApps()
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, '1')
      getRedirection(isCurrentWorkspaceEditor, app, push)
    }
    catch (e) {
      notify({ type: 'error', message: t('app.newApp.appCreateFailed') })
    }
    isCreatingRef.current = false
  }, [name, notify, t, appMode, emoji.icon, emoji.icon_background, description, onSuccess, onClose, mutateApps, push, isCurrentWorkspaceEditor])

  return (
    <Modal
      overflowVisible
      className='!p-0 !max-w-[690px] !w-[690px] rounded-xl'
      isShow={show}
      onClose={() => { }}
    >
      {/* Heading */}
      <div className='shrink-0 flex flex-col h-full bg-white rounded-t-xl'>
        <div className='shrink-0 pl-8 pr-6 pt-6 pb-3 bg-white text-[22px] rounded-t-xl leading-[22px] font-semibold text-[#212B36] z-10'>{t('app.newApp.startFromBlank')}</div>
      </div>
      {/* app type */}
      <div className='py-2 px-8'>
        <div className='py-2 text-sm leading-[20px] font-medium text-[#212B36]'>应用类型</div>
        <div className='grid grid-cols-4 gap-[10px] mt-1'>
          <div
            className={cn(
              'relative grow box-border w-[150px] flex-1 p-[14px] flex flex-row items-center justify-start gap-1 rounded-lg bg-[#F3F4F7] text-[#212B36] cursor-pointer hover:bg-[#EAEBF2]',
            )}
            onClick={() => {
              setAppMode('chat')
              setShowChatBotType(true)
            }}
          >
            <div className={classNames('w-4 h-4 mr-[10px] rounded-lg box-border border-[#5E3EFB]', (appMode === 'chat' || appMode === 'advanced-chat') ? 'border-[5px]' : ' border-[1px]')}></div>
            <div className='text-[14px] font-medium leading-[14px]'>{t('app.types.chatbot')}</div>
          </div>
          <div
            className={cn(
              'relative grow box-border w-[150px] flex-1 p-[14px] flex flex-row items-center justify-start gap-1 rounded-lg bg-[#F3F4F7] text-[#212B36] cursor-pointer hover:bg-[#EAEBF2]',
            )}
            onClick={() => {
              setAppMode('completion')
              setShowChatBotType(false)
            }}
          >
            <div className={classNames('w-4 h-4 mr-[10px] rounded-lg box-border border-[#5E3EFB]', appMode === 'completion' ? 'border-[5px]' : ' border-[1px]')}></div>
            <div className='text-[14px] font-medium leading-[14px]'>{t('app.newApp.completeApp')}</div>
          </div>
          <div
            className={cn(
              'relative grow box-border w-[150px] flex-1 p-[14px] flex flex-row items-center justify-start gap-1 rounded-lg bg-[#F3F4F7] text-[#212B36] cursor-pointer hover:bg-[#EAEBF2]',
            )}
            onClick={() => {
              setAppMode('agent-chat')
              setShowChatBotType(false)
            }}
          >
            <div className={classNames('w-4 h-4 mr-[10px] rounded-lg box-border border-[#5E3EFB]', appMode === 'agent-chat' ? 'border-[5px]' : ' border-[1px]')}></div>
            <div className='text-[14px] font-medium leading-[14px]'>{t('app.types.agent')}</div>
          </div>
          <div
            className={cn(
              'relative grow box-border w-[150px] flex-1 p-[14px] flex flex-row items-center justify-start gap-1 rounded-lg bg-[#F3F4F7] text-[#212B36] cursor-pointer hover:bg-[#EAEBF2]',
            )}
            onClick={() => {
              setAppMode('workflow')
              setShowChatBotType(false)
            }}
          >
            <div className={classNames('w-4 h-4 mr-[10px] rounded-lg box-border border-[#5E3EFB]', appMode === 'workflow' ? 'border-[5px]' : ' border-[1px]')}></div>
            <div className='text-[14px] font-medium leading-[14px]'>{t('app.types.workflow')}</div>
          </div>
        </div>
      </div>
      {showChatBotType && (
        <div className='py-2 px-8'>
          <div className='py-2 text-[16px] leading-[16px] font-medium text-[#212B36]'>编排方法</div>
          <div className='flex gap-[10px] mt-1'>
            <div
              className={cn(
                'relative grow flex-[50%] flex flex-row items-center justify-between px-[14px] py-[15px] rounded-lg bg-[#F3F4F7] cursor-pointer hover:bg-[#EAEBF2]',
              )}
              onClick={() => {
                setAppMode('chat')
              }}
            >
              <div className='relative'>
                <div className='text-sm font-medium leading-[14px] text-[#212B36]'>{t('app.newApp.basic')}</div>
                <div className='mt-[10px] text-[#9EADB9] text-xs leading-[12px]'>{t('app.newApp.basicTip')}</div>
              </div>
              <div className={classNames('w-4 h-4 mr-[10px] rounded-lg box-border border-[#5E3EFB]', appMode === 'chat' ? 'border-[5px]' : ' border-[1px]')}></div>
            </div>

            <div
              className={cn(
                'relative grow flex-[50%] flex flex-row items-center justify-between px-[14px] py-[15px] rounded-lg bg-[#F3F4F7] cursor-pointer hover:bg-[#EAEBF2]',
              )}
              onClick={() => {
                setAppMode('advanced-chat')
              }}
            >
              <div className='relative'>
                <div className='text-sm font-medium leading-[14px] text-[#212B36]'>{t('app.newApp.advanced')}</div>
                <div className='mt-[10px] text-[#9EADB9] text-xs leading-[12px]'>{t('app.newApp.advancedFor')}</div>
              </div>
              <div className={classNames('w-4 h-4 mr-[10px] rounded-lg box-border border-[#5E3EFB]', appMode === 'advanced-chat' ? 'border-[5px]' : ' border-[1px]')}></div>
            </div>
          </div>
        </div>
      )}

      {/* icon & name */}
      <div className='pt-2 px-8'>
        <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用名称</div>
        <div className='flex items-center justify-between space-x-2 relative'>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="请输入名称"
            className='grow h-[42px] p-3 text-sm font-normal bg-[#F3F4F7] rounded-lg  outline-none appearance-none caret-primary-600 placeholder:text-[#9EADB9] hover:bg-[#EAEBF2] focus:bg-[#EAEBF2] focus:shadow-xs'
          />
          {/* <span className='text-[#9EADB9] text-[16px] absolute top-[50%] right-3 -translate-y-[50%]'>{name.length}/10</span> */}
        </div>
      </div>
      {/* description */}
      <div className='pt-4 px-8'>
        <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用描述</div>
        <textarea
          className='w-full px-3 py-2 text-sm font-normal bg-[#F3F4F7] rounded-lg outline-none appearance-none caret-primary-600 placeholder:text-text-[#9EADB9 hover:bg-[#EAEBF2] focus:bg-[#EAEBF2] focus:shadow-xs h-[80px] resize-none'
          placeholder="请输入描述"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>
      {/* icon */}
      <div className='pt-2 px-8'>
        <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用图标</div>
        <Upload value={emoji.icon} onImageChange={v => setEmoji({ icon: v, icon_background: '#FFF' })} />
      </div>
      {isAppsFull && (
        <div className='px-8 py-2'>
          <AppsFull loc='app-create' />
        </div>
      )}
      <div className='px-8 py-6 flex justify-end'>
        <Button disabled={isAppsFull || !name} className='rounded-2xl h-[32px] w-[80px] text-[#FFF] text-[16px] !font-normal' variant="primary" onClick={onCreate}>{t('app.newApp.Create')}</Button>
        <ButtonNormal className='ml-[20px] !bg-[#EEEEFF] rounded-2xl h-[32px] w-[80px] text-[#637381] text-[16px] !shadow-none !border-none font-normal' onClick={onClose}>{t('app.newApp.Cancel')}</ButtonNormal>
      </div>
      <div className='absolute right-6 top-6 p-2 cursor-pointer z-20 hidden border-none' onClick={onClose}>
        <RiCloseLine className='w-4 h-4 text-gray-500' />
      </div>
    </Modal>
  )
}

export default CreateAppModal
