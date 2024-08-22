'use client'
import React from 'react'
// import Toast from '@/app/components/base/toast'
import classNames from 'classnames'
import type { InstalledApp } from '@/models/explore'
import ChatWithHistory from '@/app/components/base/chat/chat-with-history-zs'
import TextGenerationApp from '@/app/components/share/text-generation-zs'

export type ChatModalProps = {
  app: InstalledApp
  onHide: () => void
}

const ChatModal = ({
  app: installedApp,
  onHide,
}: ChatModalProps) => {
  console.log(installedApp)

  return (
    <div className=' absolute left-0 top-0 right-0 bottom-0 py-2 pl-0 pr-2 sm:p-2 !p-0'>
      {installedApp.app.mode !== 'completion' && installedApp.app.mode !== 'workflow' && (
        <ChatWithHistory
          onClickBack={onHide}
          from='explores-app'
          installedAppInfo={installedApp}
          className={classNames('overflow-hidden bg-[#F7F8FC] rounded-tl-[20px]')}
        />
      )}
      {installedApp.app.mode === 'completion' && (
        <TextGenerationApp isInstalledApp installedAppInfo={installedApp} />
      )}
      {installedApp.app.mode === 'workflow' && (
        <TextGenerationApp isWorkflow isInstalledApp installedAppInfo={installedApp} />
      )}
    </div>
  )
}

export default ChatModal
