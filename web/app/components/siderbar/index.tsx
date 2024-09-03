'use client'
import classNames from 'classnames'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ExploreNavLeft from '../header/explore-nav-left'
import ExploreChatNavLeft from '../header/explore-chat-nav-left'
import AppNavLeft from '../header/app-nav-left'
import DatasetNavLeft from '../header/dataset-nav-left'
import ToolsNavLeft from '../header/tools-nav-left'
import AccountDropdown from '../header/account-dropdown-left'
import logo from './logo.png'
// import LogoSite from '@/app/components/base/logo/logo-site'
import CreateApp from './create-app'
import { WorkspaceProvider } from '@/context/workspace-context'
const navClassName = `
  flex items-center relative mr-0 h-[48px] rounded-lg
  font-medium text-sm
  cursor-pointer
`

const Sidebar = () => {
  return (
    <div className={classNames('sidebar h-auto flex flex-col transition-all duration-300 px-[20px]')}>
      <Link href="/apps" className='flex items-center px-3 '>
        {/* <LogoSite className='mt-6' /> */}
        <Image src={logo} className='w-[166px] h-[50px] mt-6' alt='' />
      </Link>
      <CreateApp className='mt-9 mb-8' />
      <div className='flex flex-col items-center flex-1 px-[9px]'>
        <ExploreNavLeft className={navClassName} />
        <ExploreChatNavLeft className={navClassName} />
        <div className='h-[1px] w-full bg-[#D9DFF6] my-6'></div>
        <AppNavLeft className={navClassName} />
        <DatasetNavLeft className={navClassName} />
        <ToolsNavLeft className={navClassName} />
      </div>
      <div className='h-auto py-5 border-t-[1px] border-[#D9DFF6] flex items-center flex-shrink-0'>
        <WorkspaceProvider>
          <AccountDropdown isMobile={false} />
        </WorkspaceProvider>
      </div>
    </div>
  )
}

export default React.memo(Sidebar)
