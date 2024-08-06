import React from 'react'
import type { ReactNode } from 'react'
import Sidebar from '../components/siderbar'
import SwrInitor from '@/app/components/swr-initor'
import { AppContextProvider } from '@/context/app-context'
import GA, { GaType } from '@/app/components/base/ga'
<<<<<<< HEAD
import HeaderWrapper from '@/app/components/header/header-wrapper'
import Header from '@/app/components/header'
=======
// import HeaderWrapper from '@/app/components/header/HeaderWrapper'
// import Header from '@/app/components/header'
>>>>>>> origin/feature/v2.0.0
import { EventEmitterContextProvider } from '@/context/event-emitter'
import { ProviderContextProvider } from '@/context/provider-context'
import { ModalContextProvider } from '@/context/modal-context'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <GA gaType={GaType.admin} />
      <SwrInitor>
        <AppContextProvider>
          <EventEmitterContextProvider>
            <ProviderContextProvider>
              <ModalContextProvider>
                {/* <HeaderWrapper>
                  <Header />
                </HeaderWrapper> */}
                {/* <div className='flex flex-row min-h-[calc(100vh-55px)]'> */}
                <div className='flex flex-row min-h-[100vh]' style={{
                  background: 'linear-gradient( 180deg, #EBF3FF 0%, #E8E9FF 100%)',
                }}>
                  <Sidebar />
                  <div className='flex-1 h-auto overflow-y-auto'>
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
