'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiCloseLine } from '@remixicon/react'
import Upload from '../../app/create-app-modal-zs/upload'
import AppIconPicker from '../../base/app-icon-picker'
import Modal from '@/app/components/base/modal'
import ButtonNormal from '@/app/components/base/button'
import Button from '@/app/components/base/button-zs'
import Switch from '@/app/components/base/switch'
import Toast from '@/app/components/base/toast'
import { useProviderContext } from '@/context/provider-context'
import AppsFull from '@/app/components/billing/apps-full-in-dialog'
import type { AppIconType } from '@/types/app'

export type CreateAppModalProps = {
  show: boolean
  isEditModal?: boolean
  appName: string
  appDescription: string
  appIconType: AppIconType | null
  appIcon: string
  appIconBackground?: string | null
  appIconUrl?: string | null
  appMode?: string
  appUseIconAsAnswerIcon?: boolean
  onConfirm: (info: {
    name: string
    icon_type: AppIconType
    icon: string
    icon_background?: string
    description: string
    use_icon_as_answer_icon?: boolean
  }) => Promise<void>
  onHide: () => void
}

const CreateAppModal = ({
  show = false,
  isEditModal = false,
  appIconType,
  appIcon: _appIcon,
  appIconBackground,
  appIconUrl,
  appName,
  appDescription,
  appMode,
  appUseIconAsAnswerIcon,
  onConfirm,
  onHide,
}: CreateAppModalProps) => {
  const { t } = useTranslation()

  const [name, setName] = React.useState(appName)
  const [appIcon, setAppIcon] = useState(
    () => appIconType === 'image'
      ? { type: 'image' as const, fileId: _appIcon, url: appIconUrl }
      : { type: 'emoji' as const, icon: _appIcon, background: appIconBackground },
  )
  const [showAppIconPicker, setShowAppIconPicker] = useState(false)
  const [description, setDescription] = useState(appDescription || '')
  const [useIconAsAnswerIcon, setUseIconAsAnswerIcon] = useState(appUseIconAsAnswerIcon || false)

  // const [emoji, setEmoji] = useState({ icon: appIcon, icon_background: appIconBackground })

  const { plan, enableBilling } = useProviderContext()
  const isAppsFull = (enableBilling && plan.usage.buildApps >= plan.total.buildApps)

  const submit = () => {
    if (!name.trim()) {
      Toast.notify({ type: 'error', message: t('explore.appCustomize.nameRequired') })
      return
    }
    onConfirm({
      name,
      icon_type: appIcon.type,
      icon: appIcon.type === 'emoji' ? appIcon.icon : appIcon.fileId,
      icon_background: appIcon.type === 'emoji' ? appIcon.background! : undefined,
      description,
      use_icon_as_answer_icon: useIconAsAnswerIcon,
      // ...emoji,
    })
    onHide()
  }

  return (
    <>
      <Modal
        isShow={show}
        onClose={() => { }}
        className='relative !max-w-[480px] px-8'
      >
        <div className='absolute right-4 top-4 p-2 cursor-pointer' onClick={onHide}>
          <RiCloseLine className='w-4 h-4 text-gray-500' />
        </div>
        {isEditModal && (
          <div className='mb-9 font-semibold text-xl leading-[30px] text-gray-900'>{t('app.editAppTitle')}</div>
        )}
        {!isEditModal && (
          <div className='mb-9 font-semibold text-xl leading-[30px] text-gray-900'>{t('explore.appCustomize.title', { name: appName })}</div>
        )}
        <div className='mb-9'>
          {/* icon & name */}
          <div className='pt-2'>
            {/* <div className='py-2 text-sm font-medium leading-[20px] text-gray-900'>{t('app.newApp.captionName')}</div> */}
            <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用名称</div>
            <div className='flex items-center justify-between space-x-2 relative'>
              {/* <AppIcon size='large' onClick={() => { setShowEmojiPicker(true) }} className='cursor-pointer' icon={emoji.icon} background={emoji.icon_background} /> */}
              <input
                value={name}
                // maxLength={10}
                onChange={e => setName(e.target.value)}
                placeholder={t('app.newApp.appNamePlaceholder') || ''}
                className='grow h-[42px] p-3 text-sm font-normal bg-[#F3F4F7] rounded-lg  outline-none appearance-none caret-primary-600 placeholder:text-[#9EADB9] hover:bg-[#EAEBF2] focus:bg-[#EAEBF2] focus:shadow-xs'
              />
              {/* <span className='text-[#9EADB9] text-[16px] absolute top-[50%] right-3 -translate-y-[50%]'>{name.length}/10</span> */}
            </div>
          </div>
          {/* description */}
          <div className='pt-2'>
            {/* <div className='py-2 text-sm font-medium leading-[20px] text-gray-900'>{t('app.newApp.captionDescription')}</div> */}
            <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>{t('app.newApp.captionDescription')}</div>
            <textarea
              className='w-full px-3 py-2 text-sm font-normal bg-[#F3F4F7] rounded-lg outline-none appearance-none caret-primary-600 placeholder:text-text-[#9EADB9 hover:bg-[#EAEBF2] focus:bg-[#EAEBF2] focus:shadow-xs h-[80px] resize-none'
              placeholder="请输入描述"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            {/* <textarea
              className='w-full h-10 px-3 py-2 text-sm font-normal bg-gray-100 rounded-lg border border-transparent outline-none appearance-none caret-primary-600 placeholder:text-gray-400 hover:bg-gray-50 hover:border hover:border-gray-300 focus:bg-gray-50 focus:border focus:border-gray-300 focus:shadow-xs h-[80px] resize-none'
              placeholder={t('app.newApp.appDescriptionPlaceholder') || ''}
              value={description}
              onChange={e => setDescription(e.target.value)}
            /> */}
          </div>
          {/* icon */}
          <div className='pt-2'>
            <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用图标</div>
            <Upload value={`${appIcon.icon || appIcon.url}`} onImageChange={(v) => {
              setAppIcon({ type: 'image' as const, url: v, fileId: _appIcon })
            }} />
          </div>
          {/* answer icon */}
          {isEditModal && (appMode === 'chat' || appMode === 'advanced-chat' || appMode === 'agent-chat') && (
            <div className='pt-2'>
              <div className='flex justify-between items-center'>
                <div className='py-2 text-sm font-medium leading-[20px] text-gray-900'>{t('app.answerIcon.title')}</div>
                <Switch
                  defaultValue={useIconAsAnswerIcon}
                  onChange={v => setUseIconAsAnswerIcon(v)}
                />
              </div>
              <p className='body-xs-regular text-gray-500'>{t('app.answerIcon.descriptionInExplore')}</p>
            </div>
          )}
          {!isEditModal && isAppsFull && <AppsFull loc='app-explore-create' />}
        </div>
        <div className='flex flex-row-reverse'>
          <Button disabled={!isEditModal && isAppsFull} className='w-24 ml-2 h-8 font-normal text-[13px] text-white' variant='primary' onClick={submit}>{!isEditModal ? t('common.operation.create') : t('common.operation.save')}</Button>
          <ButtonNormal className='w-24' onClick={onHide}>{t('common.operation.cancel')}</ButtonNormal>
        </div>
      </Modal>
      {showAppIconPicker && <AppIconPicker
        onSelect={(payload) => {
          setAppIcon(payload)
          setShowAppIconPicker(false)
        }}
        onClose={() => {
          setAppIcon(appIconType === 'image'
            ? { type: 'image' as const, url: appIconUrl, fileId: _appIcon }
            : { type: 'emoji' as const, icon: _appIcon, background: appIconBackground })
          setShowAppIconPicker(false)
        }}
      />}
    </>

  )
}

export default CreateAppModal
