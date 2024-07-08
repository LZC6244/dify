'use client'
import { useTranslation } from 'react-i18next'
import { Fragment, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useContext } from 'use-context-selector'
import { Menu, Transition } from '@headlessui/react'
import Image from 'next/image'
import AccountAbout from '../account-about'
import UserIcon from './user.svg'
import I18n from '@/context/i18n'
import { logout } from '@/service/common'
import { useAppContext } from '@/context/app-context'
import { LogOut01 } from '@/app/components/base/icons/src/vender/line/general'
import { useModalContext } from '@/context/modal-context'
export type IAppSelecotr = {
  isMobile: boolean
}

export default function AppSelector({ isMobile }: IAppSelecotr) {
  const itemClassName = `
    flex items-center w-full h-9 px-3 text-gray-700 text-[14px]
    rounded-lg font-normal hover:bg-gray-50 cursor-pointer
  `
  const router = useRouter()
  const [aboutVisible, setAboutVisible] = useState(false)

  const { locale } = useContext(I18n)
  const { t } = useTranslation()
  const { userProfile, langeniusVersionInfo } = useAppContext()
  const { setShowAccountSettingModal } = useModalContext()

  const handleLogout = async () => {
    await logout({
      url: '/logout',
      params: {},
    })

    if (localStorage?.getItem('console_token'))
      localStorage.removeItem('console_token')

    router.push('/signin')
  }

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left w-full">
        {
          ({ open }) => (
            <>
              <div>
                <Menu.Button
                  className={`
                    w-full
                    inline-flex items-center
                    rounded-[20px] py-1 pr-2.5 pl-1 text-sm
                  text-[#637381] 
                    mobile:px-1
                    ${open && 'bg-[#E4EAFF]'}
                  `}
                >
                  {/* <Avatar name={userProfile.name} className='sm:mr-2 mr-0' size={32} /> */}
                  <Image src={UserIcon} className='w-6 h-6 mr-[10px]' alt='' />
                  {!isMobile && <>
                    {userProfile.name}
                    {/* <ChevronDown className="w-3 h-3 ml-1 text-gray-700" /> */}
                  </>}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className="
                    absolute left-full bottom-0 mt-1.5 w-60 max-w-80 z-10
                    divide-y divide-gray-100 origin-top-right rounded-lg bg-white
                    shadow-lg
                  "
                >
                  <div className="px-1 py-1">
                    <Menu.Item>
                      <div className={itemClassName} onClick={() => setShowAccountSettingModal({ payload: 'account' })}>
                        <div>{t('common.userProfile.settings')}</div>
                      </div>
                    </Menu.Item>
                  </div>
                  <Menu.Item>
                    <div className='p-1' onClick={() => handleLogout()}>
                      <div
                        className='flex items-center justify-between h-9 px-3 rounded-lg cursor-pointer group hover:bg-gray-50'
                      >
                        <div className='font-normal text-[14px] text-gray-700'>{t('common.userProfile.logout')}</div>
                        <LogOut01 className='hidden w-[14px] h-[14px] text-gray-500 group-hover:flex' />
                      </div>
                    </div>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </>
          )
        }
      </Menu>
      {
        aboutVisible && <AccountAbout onCancel={() => setAboutVisible(false)} langeniusVersionInfo={langeniusVersionInfo} />
      }
    </div >
  )
}
