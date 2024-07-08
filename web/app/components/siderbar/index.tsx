'use client'
import classNames from 'classnames'
import React from 'react'
import Link from 'next/link'
import ExploreNavLeft from '../header/explore-nav-left'
import ExploreChatNavLeft from '../header/explore-chat-nav-left'
import AppNavLeft from '../header/app-nav-left'
import DatasetNavLeft from '../header/dataset-nav-left'
import ToolsNavLeft from '../header/tools-nav-left'
import AccountDropdown from '../header/account-dropdown-left'
import { WorkspaceProvider } from '@/context/workspace-context'
import LogoSite from '@/app/components/base/logo/logo-site'

const navClassName = `
  flex items-center relative mr-0 h-[48px] rounded-lg
  font-medium text-sm
  cursor-pointer
`

const Sidebar = () => {
  return (
    <div className={classNames('sidebar h-full flex flex-col transition-all duration-300 px-[29px]')}>
      <Link href="/apps" className='flex items-center px-8 '>
        <LogoSite className='mt-6' />
      </Link>
      <div className='flex flex-col items-center flex-1 mt-9'>
        <ExploreNavLeft className={navClassName} />
        <ExploreChatNavLeft className={navClassName} />
        <div className='h-[1px] w-full bg-[#D9DFF6] mt-6 mb-[38px]'></div>
        <AppNavLeft className={navClassName} />
        <DatasetNavLeft className={navClassName} />
        <ToolsNavLeft className={navClassName} />
      </div>
      <div className='h-auto py-5 border-t-[1px] border-[#FBFBFB] flex items-center flex-shrink-0'>
        <WorkspaceProvider>
          <AccountDropdown isMobile={false} />
        </WorkspaceProvider>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
