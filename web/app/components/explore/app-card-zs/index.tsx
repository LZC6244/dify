'use client'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import type { App } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon-zs'
export type AppCardProps = {
  app: App
  onClick: () => void
  isExplore: boolean
  canCreate: boolean
}

const AppCard = ({
  app,
  onClick,
}: AppCardProps) => {
  const { t } = useTranslation()
  const { app: appBasicInfo } = app
  return (
    <div
      onClick={onClick}
      className={cn('group col-span-1 bg-white rounded-lg min-h-[160px] flex flex-row p-[18px] transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0px_6px_10px_4px_rgba(0,0,0,0.06)]')}>
      <div className='relative shrink-0'>
        <AppIcon size='large' className='!w-[72px] !h-[72px] !rounded-[36px]' icon={app.app.icon} background={app.app.icon_background} />
      </div>
      <div className='grow w-0 pt-[12px] ml-3'>
        <div className='flex flex-row items-center'>
          <div className='truncate text-[18px] leading-[18px] font-semibold text-[#212B36]' title={appBasicInfo.name}>{appBasicInfo.name}</div>
          <div className='ml-2 flex items-center p-1 bg-[#EEEDFD] rounded text-[12px] leading-[12px] text-[#5E3EFB]'>
            {appBasicInfo.mode === 'advanced-chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
            {appBasicInfo.mode === 'chat' && <div className='truncate'>{t('app.types.chatbot').toUpperCase()}</div>}
            {appBasicInfo.mode === 'agent-chat' && <div className='truncate'>{t('app.types.agent').toUpperCase()}</div>}
            {appBasicInfo.mode === 'workflow' && <div className='truncate'>{t('app.types.workflow').toUpperCase()}</div>}
            {appBasicInfo.mode === 'completion' && <div className='truncate'>{t('app.types.completion').toUpperCase()}</div>}
          </div>
        </div>
        <div className='mt-[8px] text-[14px] leading-[24px] text-[#637381] line-clamp-3'>{app.description}</div>
      </div>
    </div>
  )
}

export default AppCard
