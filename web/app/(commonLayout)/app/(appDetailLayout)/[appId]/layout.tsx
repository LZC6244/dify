'use client'
import type { FC } from 'react'
import { useUnmount } from 'ahooks'
import React, { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import s from './style.module.css'
import arrangeIcon from './images/arrange.svg'
import arrangeIconH from './images/arrange_h.svg'
import visitIcon from './images/visit.svg'
import visitIconH from './images/visit_h.svg'
import logIcon from './images/log.svg'
import logIconH from './images/log_h.svg'

import overviewIcon from './images/overview.svg'
import overviewIconH from './images/overview_h.svg'
import cn from '@/utils/classnames'
import { useStore } from '@/app/components/app/store'
import AppSideBar from '@/app/components/app-sidebar-zs'
import type { NavIcon } from '@/app/components/app-sidebar/navLink'
import { fetchAppDetail } from '@/service/apps'
import { useAppContext } from '@/context/app-context'
import Loading from '@/app/components/base/loading'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'

export type IAppDetailLayoutProps = {
  children: React.ReactNode
  params: { appId: string }
}

const AppDetailLayout: FC<IAppDetailLayoutProps> = (props) => {
  const {
    children,
    params: { appId }, // get appId in path
  } = props
  const { t } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { appDetail, setAppDetail, setAppSiderbarExpand } = useStore(useShallow(state => ({
    appDetail: state.appDetail,
    setAppDetail: state.setAppDetail,
    setAppSiderbarExpand: state.setAppSiderbarExpand,
  })))
  const [navigation, setNavigation] = useState<Array<{
    name: string
    href: string
    icon: NavIcon
    selectedIcon: NavIcon
  }>>([])

  const getNavigations = useCallback((appId: string, isCurrentWorkspaceEditor: boolean, mode: string) => {
    const navs = [
      ...(isCurrentWorkspaceEditor
        ? [{
          name: t('common.appMenus.promptEng'),
          href: `/app/${appId}/${(mode === 'workflow' || mode === 'advanced-chat') ? 'workflow' : 'configuration'}`,
          icon: arrangeIcon,
          selectedIcon: arrangeIconH,
        }]
        : []
      ),
      {
        name: t('common.appMenus.apiAccess'),
        href: `/app/${appId}/develop`,
        icon: visitIcon,
        selectedIcon: visitIconH,
      },
      ...(isCurrentWorkspaceEditor
        ? [{
          name: mode !== 'workflow'
            ? t('common.appMenus.logAndAnn')
            : t('common.appMenus.logs'),
          href: `/app/${appId}/logs`,
          icon: logIcon,
          selectedIcon: logIconH,
        }]
        : []
      ),
      {
        name: t('common.appMenus.overview'),
        href: `/app/${appId}/overview`,
        icon: overviewIcon,
        selectedIcon: overviewIconH,
      },
    ]
    return navs
  }, [t])

  useEffect(() => {
    if (appDetail) {
      document.title = `${(appDetail.name || 'App')} - 卓世科技`
      const localeMode = localStorage.getItem('app-detail-collapse-or-expand') || 'expand'
      const mode = isMobile ? 'collapse' : 'expand'
      setAppSiderbarExpand(isMobile ? mode : localeMode)
      // TODO: consider screen size and mode
      // if ((appDetail.mode === 'advanced-chat' || appDetail.mode === 'workflow') && (pathname).endsWith('workflow'))
      //   setAppSiderbarExpand('collapse')
    }
  }, [appDetail, isMobile])

  useEffect(() => {
    setAppDetail()
    fetchAppDetail({ url: '/apps', id: appId }).then((res) => {
      // redirections
      if ((res.mode === 'workflow' || res.mode === 'advanced-chat') && (pathname).endsWith('configuration')) {
        router.replace(`/app/${appId}/workflow`)
      }
      else if ((res.mode !== 'workflow' && res.mode !== 'advanced-chat') && (pathname).endsWith('workflow')) {
        router.replace(`/app/${appId}/configuration`)
      }
      else {
        setAppDetail(res)
        setNavigation(getNavigations(appId, isCurrentWorkspaceEditor, res.mode))
      }
    }).catch((e: any) => {
      if (e.status === 404)
        router.replace('/apps')
    })
  }, [appId, isCurrentWorkspaceEditor])

  useUnmount(() => {
    setAppDetail()
  })

  if (!appDetail) {
    return (
      <div className='flex h-full items-center justify-center bg-white'>
        <Loading />
      </div>
    )
  }

  return (
    <div className={cn(s.app, 'flex', 'overflow-hidden')}>
      {appDetail && (
        <AppSideBar title={appDetail.name} icon={appDetail.icon} icon_background={appDetail.icon_background} desc={appDetail.mode} navigation={navigation} />
      )}
      <div className="bg-white grow overflow-hidden">
        {children}
      </div>
    </div>
  )
}
export default React.memo(AppDetailLayout)
