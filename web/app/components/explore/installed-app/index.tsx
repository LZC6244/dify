'use client'
import type { FC } from 'react'
import React from 'react'
import { useContext } from 'use-context-selector'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import ExploreContext from '@/context/explore-context'
import TextGenerationApp from '@/app/components/share/text-generation-zs'
import Loading from '@/app/components/base/loading'
import ChatWithHistory from '@/app/components/base/chat/chat-with-history-zs'

export type IInstalledAppProps = {
  id: string
}

const InstalledApp: FC<IInstalledAppProps> = ({
  id,
}) => {
  const { installedApps } = useContext(ExploreContext)
  const installedApp = installedApps.find(item => item.id === id)
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || undefined

  if (!installedApp) {
    console.log('应用未安装')

    return (
      <div className='flex h-full items-center'>
        <Loading type='area' />
      </div>
    )
  }

  return (
    <div className='h-full py-2 pl-0 pr-2 sm:p-2 !p-0'>
      {installedApp.app.mode !== 'completion' && installedApp.app.mode !== 'workflow' && (
        <ChatWithHistory installedAppInfo={installedApp} className={classNames('overflow-hidden bg-[#F7F8FC]', from && 'rounded-tl-[20px]')} />
      )}
      {installedApp.app.mode === 'completion' && (
        <TextGenerationApp isInstalledApp installedAppInfo={installedApp}/>
      )}
      {installedApp.app.mode === 'workflow' && (
        <TextGenerationApp isWorkflow isInstalledApp installedAppInfo={installedApp}/>
      )}
    </div>
  )
}
export default React.memo(InstalledApp)
