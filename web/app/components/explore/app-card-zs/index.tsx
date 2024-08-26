'use client'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@heroicons/react/20/solid'
import Button from '../../base/button-zs'
import cn from '@/utils/classnames'
import type { App } from '@/models/explore'
import AppIcon from '@/app/components/base/app-icon-zs'
export type AppCardProps = {
  app: App
  onClick: () => void
  onCreate: () => void
  isExplore: boolean
  canCreate: boolean
}

const AppCard = ({
  app,
  onClick,
  onCreate,
  canCreate,
  isExplore,
}: AppCardProps) => {
  const { t } = useTranslation()
  const { app: appBasicInfo } = app
  return (
    <div className='relative group col-span-1 bg-white rounded-lg min-h-[160px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0px_6px_10px_4px_rgba(0,0,0,0.06)]'>
      <div
        onClick={!isExplore ? undefined : onClick}
        className={cn('flex flex-row p-[18px] flex-1')}>
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
          <div className={cn(
            'mt-[8px] text-[14px] leading-[24px] text-[#637381] line-clamp-3',
            !isExplore && 'group-hover:line-clamp-2 group-hover:h-[46px]',
          )}>
            {app.description}
          </div>
        </div>
      </div>
      {isExplore && canCreate && (
        <div className={cn('hidden items-center flex-wrap min-h-[42px] px-[14px] pt-2 pb-[10px] group-hover:hidden')}>
          <div className={cn('flex items-center w-full space-x-2')}>
            <Button variant='primary' className='grow h-7' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('explore.appCard.addToWorkspace')}</span>
            </Button>
          </div>
        </div>
      )}
      {!isExplore && (
        <div className={cn('hidden items-center flex-wrap min-h-[30px] px-[14px] pb-[10px] group-hover:flex')}>
          <div className={cn('flex items-center w-full space-x-2')}>
            <Button variant='primary' className='grow h-7' onClick={() => onCreate()}>
              <PlusIcon className='w-4 h-4 mr-1' />
              <span className='text-xs'>{t('app.newApp.useTemplate')}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppCard
