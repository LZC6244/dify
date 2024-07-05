'use client'
import classNames from 'classnames'
import React from 'react'
import ExploreNav from '../header/explore-nav'
import ExploreChatNav from '../header/explore-chat-nav'
import AppNavLeft from '../header/app-nav-left'
import DatasetNavLeft from '../header/dataset-nav-left'
import ToolsNav from '../header/tools-nav'
import AccountDropdown from '../header/account-dropdown-left'
import { WorkspaceProvider } from '@/context/workspace-context'

const navClassName = `
  flex items-center relative mr-0 sm:mr-3 px-3 h-8 rounded-xl
  font-medium text-sm
  cursor-pointer
`

const Sidebar = () => {
  return (
    <div className={classNames('sidebar h-full flex flex-col transition-all duration-300', 'w-[150px]')}>
      <div className='flex flex-col items-center flex-1'>
        <ExploreNav className={navClassName} />
        <ExploreChatNav className={navClassName} />
        <AppNavLeft />
        <DatasetNavLeft />
        <ToolsNav className={navClassName} />
      </div>
      <div className='h-[55px] flex items-center flex-shrink-0'>
        <WorkspaceProvider>
          <AccountDropdown isMobile={false} />
        </WorkspaceProvider>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
