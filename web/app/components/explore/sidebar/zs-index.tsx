'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import { useSearchParams, useSelectedLayoutSegments } from 'next/navigation'
import classNames from 'classnames'
import Toast from '../../base/toast'
import Item from './app-nav-item'
import s from './style.module.css'
import { fetchInstalledAppList as doFetchInstalledAppList, uninstallApp, updatePinStatus } from '@/service/explore'
import ExploreContext from '@/context/explore-context'
import Confirm from '@/app/components/base/confirm'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'

export type IExploreSideBarProps = {
  controlUpdateInstalledApps: number
}

const SideBar: FC<IExploreSideBarProps> = ({
  controlUpdateInstalledApps,
}) => {
  const { t } = useTranslation()
  const segments = useSelectedLayoutSegments()
  const lastSegment = segments.slice(-1)[0]
  const { installedApps, setInstalledApps } = useContext(ExploreContext)
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || undefined

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  const fetchInstalledAppList = async () => {
    // const { installed_apps }: any = await doFetchInstalledAppList()
    // 改为已经发布的应用列表，解决点了未发布的应用导致接口报错问题
    const { published_apps }: any = await doFetchInstalledAppList()
    setInstalledApps(published_apps)
  }

  const [showConfirm, setShowConfirm] = useState(false)
  const [currId, setCurrId] = useState('')
  const handleDelete = async () => {
    const id = currId
    await uninstallApp(id)
    setShowConfirm(false)
    Toast.notify({
      type: 'success',
      message: t('common.api.remove'),
    })
    fetchInstalledAppList()
  }

  const handleUpdatePinStatus = async (id: string, isPinned: boolean) => {
    await updatePinStatus(id, isPinned)
    Toast.notify({
      type: 'success',
      message: t('common.api.success'),
    })
    fetchInstalledAppList()
  }

  useEffect(() => {
    fetchInstalledAppList()
  }, [])

  useEffect(() => {
    fetchInstalledAppList()
  }, [controlUpdateInstalledApps])

  if (from)
    return null

  return (
    <div className='w-fit sm:w-[290px] shrink-0 pt-[40px] px-[30px] border-gray-200 cursor-pointer bg-white rounded-tl-[20px]'>
      {installedApps.length > 0 && (
        // <div className='mt-10'>
        <div className='mt-0'>
          <p className='pl-2 mobile:px-0 text-[18px] text-[#000] break-all font-medium uppercase'>{t('explore.sidebar.workspace')}</p>
          <div className={classNames('mt-3 space-y-1 overflow-y-auto overflow-x-hidden', s.hideScroll)}
            style={{
              height: 'calc(100vh - 100px)',
            }}
          >
            {installedApps.map(({ id, is_pinned, uninstallable, app: { name, icon, icon_background } }) => {
              return (
                <Item
                  key={id}
                  isMobile={isMobile}
                  name={name}
                  icon={icon}
                  icon_background={icon_background}
                  id={id}
                  isSelected={lastSegment?.toLowerCase() === id}
                  isPinned={is_pinned}
                  togglePin={() => handleUpdatePinStatus(id, !is_pinned)}
                  uninstallable={uninstallable}
                  onDelete={(id) => {
                    setCurrId(id)
                    setShowConfirm(true)
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
      {showConfirm && (
        <Confirm
          title={t('explore.sidebar.delete.title')}
          content={t('explore.sidebar.delete.content')}
          isShow={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}

export default React.memo(SideBar)
