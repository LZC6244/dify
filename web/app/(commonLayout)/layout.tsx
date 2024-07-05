import React from 'react'
import type { ReactNode } from 'react'
import ExploreNav from '../components/header/explore-nav'
import DatasetNav from '../components/header/dataset-nav'
import ToolsNav from '../components/header/tools-nav'
import ExploreChatNav from '../components/header/explore-chat-nav'
import AppNavLeft from '../components/header/app-nav-left'
import SwrInitor from '@/app/components/swr-initor'
import { AppContextProvider } from '@/context/app-context'
import GA, { GaType } from '@/app/components/base/ga'
import HeaderWrapper from '@/app/components/header/HeaderWrapper'
import Header from '@/app/components/header'
import { EventEmitterContextProvider } from '@/context/event-emitter'
import { ProviderContextProvider } from '@/context/provider-context'
import { ModalContextProvider } from '@/context/modal-context'

const navClassName = `
  flex items-center relative mr-0 sm:mr-3 px-3 h-8 rounded-xl
  font-medium text-sm
  cursor-pointer
`

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <GA gaType={GaType.admin} />
      <SwrInitor>
        <AppContextProvider>
          <EventEmitterContextProvider>
            <ProviderContextProvider>
              <ModalContextProvider>
                <HeaderWrapper>
                  <Header />
                </HeaderWrapper>
                <div className='grid grid-cols-[200px_1fr] min-h-[calc(100vh-55px)]'>
                  <div className='sidebar w-full h-full'>
                    <div className='flex flex-col items-center'>
                      <ExploreNav className={navClassName} />
                      <ExploreChatNav className={navClassName} />
                      <AppNavLeft />
                      <DatasetNav />
                      <ToolsNav className={navClassName} />
                    </div>
                  </div>
                  <div className='flex-1 h-full overflow-y-auto'>
                    {children}
                  </div>
                </div>
              </ModalContextProvider>
            </ProviderContextProvider>
          </EventEmitterContextProvider>
        </AppContextProvider>
      </SwrInitor>
    </>
  )
}

export const metadata = {
  title: '卓世科技',
}

export default Layout
