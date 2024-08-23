'use client'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Upload from '../create-app-modal-zs/upload'
import s from './style.module.css'
import cn from '@/utils/classnames'
import Modal from '@/app/components/base/modal'
import Button from '@/app/components/base/button-zs'
import ButtonNormal from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
// import AppIcon from '@/app/components/base/app-icon-zs'
import EmojiPicker from '@/app/components/base/emoji-picker'
import { useProviderContext } from '@/context/provider-context'
import AppsFull from '@/app/components/billing/apps-full-in-dialog'
export type DuplicateAppModalProps = {
  appName: string
  icon: string
  icon_background: string
  show: boolean
  onConfirm: (info: {
    name: string
    icon: string
    icon_background: string
  }) => Promise<void>
  onHide: () => void
}

const DuplicateAppModal = ({
  appName,
  icon,
  icon_background,
  show = false,
  onConfirm,
  onHide,
}: DuplicateAppModalProps) => {
  const { t } = useTranslation()

  const [name, setName] = React.useState(appName)

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [emoji, setEmoji] = useState({ icon, icon_background })

  const { plan, enableBilling } = useProviderContext()
  const isAppsFull = (enableBilling && plan.usage.buildApps >= plan.total.buildApps)

  const submit = () => {
    if (!name.trim()) {
      Toast.notify({ type: 'error', message: t('explore.appCustomize.nameRequired') })
      return
    }
    onConfirm({
      name,
      ...emoji,
    })
    onHide()
  }

  return (
    <>
      <Modal
        isShow={show}
        onClose={() => { }}
        className={cn(s.modal, '!max-w-[480px]', 'px-8')}
      >
        <span className={s.close} onClick={onHide} />
        <div className={s.title}>{t('app.duplicateTitle')}</div>
        <div className={s.content}>
          {/* <div className={s.subTitle}>应用名称</div> */}
          <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用名称</div>
          <div className='flex items-center justify-between space-x-2 relative'>
            {/* <AppIcon size='large' onClick={() => { setShowEmojiPicker(true) }} className='cursor-pointer' icon={emoji.icon} background={emoji.icon_background} /> */}
            <input
              value={name}
              maxLength={10}
              onChange={e => setName(e.target.value)}
              className='grow h-[42px] p-3 text-sm font-normal bg-[#F3F4F7] rounded-lg  outline-none appearance-none caret-primary-600 placeholder:text-[#9EADB9] hover:bg-[#EAEBF2] focus:bg-[#EAEBF2] focus:shadow-xs'
            />
            <span className='text-[#9EADB9] text-[16px] absolute top-[50%] right-3 -translate-y-[50%]'>{name.length}/10</span>
          </div>
          <div className='pt-2'>
            <div className='py-2 pb-3 text-base font-medium leading-[16px] text-[#212B36]'>应用图标</div>
            <Upload value={emoji.icon} onImageChange={v => setEmoji({ icon: v, icon_background: '#FFF' })} />
          </div>
          {isAppsFull && <AppsFull loc='app-duplicate-create' />}
        </div>
        <div className='flex flex-row-reverse'>
          <Button
            disabled={isAppsFull}
            // className='w-24 ml-2'
            className='h-[32px] w-[80px] text-[#FFF] text-[13px] !font-normal'
            variant='primary'
            onClick={submit}>
            {t('app.duplicate')}
          </Button>
          <ButtonNormal
            // className='w-24'
            className='mr-[20px] !bg-[#EEEEFF] h-[32px] w-[80px] text-[#637381] text-[13px] !shadow-none !border-none'
            onClick={onHide}
          >
            {t('common.operation.cancel')}
          </ButtonNormal>
        </div>
      </Modal>
      {showEmojiPicker && <EmojiPicker
        onSelect={(icon, icon_background) => {
          setEmoji({ icon, icon_background })
          setShowEmojiPicker(false)
        }}
        onClose={() => {
          setEmoji({ icon, icon_background })
          setShowEmojiPicker(false)
        }}
      />}
    </>

  )
}

export default DuplicateAppModal
