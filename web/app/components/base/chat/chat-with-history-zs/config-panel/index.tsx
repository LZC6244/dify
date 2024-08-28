import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import classNames from 'classnames'
import { useChatWithHistoryContext } from '../context'
import Form from './form'
import ArrowRight from './images/arrow-right.svg'
import s from './style.module.css'
import Button from '@/app/components/base/button-zs'
import AppIcon from '@/app/components/base/app-icon-zs'
import { Edit02 } from '@/app/components/base/icons/src/vender/line/general'
import { Star06 } from '@/app/components/base/icons/src/vender/solid/shapes'

const ConfigPanel = () => {
  const { t } = useTranslation()
  const {
    appData,
    inputsForms,
    handleStartChat,
    showConfigPanelBeforeChat,
    isMobile,
  } = useChatWithHistoryContext()
  const [collapsed, setCollapsed] = useState(true)
  const customConfig = appData?.custom_config
  const site = appData?.site

  return (
    <div className='flex flex-col max-h-[80%] w-full max-w-[620px]'>
      <div
        className={`
          grow rounded-xl overflow-y-auto overflow-y-visible
          ${showConfigPanelBeforeChat && 'border-[0.5px] border-gray-100 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)]'}
          ${!showConfigPanelBeforeChat && collapsed && 'border border-indigo-100'}
          ${!showConfigPanelBeforeChat && !collapsed && 'border-[0.5px] border-gray-100 shadow-[0px_6px_12px_0px_rgba(0,0,0,0.1)]'}
        `}
      >
        <div
          className={`
            flex flex-wrap justify-center px-[30px] py-[30px] pt-0 rounded-t-2xl bg-white
            ${isMobile && '!px-4 !py-3'}
          `}
        >
          {
            showConfigPanelBeforeChat && (
              <>
                <div className='-mt-[50px] flex flex-col justify-center items-center'>
                  <div className={classNames(
                    'w-[112px] h-[112px] rounded-[56px] bg-[#FFF] flex items-center justify-center',
                    s.half,
                  )}>
                    {/* TODO 有可能是Base64 */}
                    <AppIcon
                      icon={appData?.site.icon}
                      background='transparent'
                      size='small'
                      className='!w-[100px] !h-[100px] !rounded-[50px]'
                    />
                  </div>
                  <span className='text-[#1D2939] mt-[10px] text-[22px] leading-[22px] font-semibold'>
                    {appData?.site.title}
                  </span>
                </div>
                {
                  appData?.site.description && (
                    <div className='mt-2 w-full text-sm text-gray-500'>
                      {appData?.site.description}
                    </div>
                  )
                }
              </>
            )
          }
          {
            !showConfigPanelBeforeChat && collapsed && (
              <>
                <Star06 className='mr-1 mt-1 w-4 h-4 text-indigo-600' />
                <div className='grow py-[3px] text-[13px] text-indigo-600 leading-[18px] font-medium'>
                  {t('share.chat.configStatusDes')}
                </div>
                <Button
                  variant='secondary-accent'
                  size='small'
                  className='shrink-0'
                  onClick={() => setCollapsed(false)}
                >
                  <Edit02 className='mr-1 w-3 h-3' />
                  {t('common.operation.edit')}
                </Button>
              </>
            )
          }
          {
            !showConfigPanelBeforeChat && !collapsed && (
              <>
                <Star06 className='mr-1 mt-1 w-4 h-4 text-indigo-600' />
                <div className='grow py-[3px] text-[13px] text-indigo-600 leading-[18px] font-medium'>
                  {t('share.chat.privatePromptConfigTitle')}
                </div>
              </>
            )
          }
        </div>
        {
          !collapsed && !showConfigPanelBeforeChat && (
            <div className='p-[30px] rounded-b-2xl bg-white'>
              <Form />
              <div className={`pl-[136px] flex items-center ${isMobile && '!pl-0'}`}>
                <Button
                  variant='primary'
                  className='mr-2'
                  onClick={() => {
                    setCollapsed(true)
                    handleStartChat()
                  }}
                >
                  {t('common.operation.save')}
                </Button>
                <Button
                  onClick={() => setCollapsed(true)}
                >
                  {t('common.operation.cancel')}
                </Button>
              </div>
            </div>
          )
        }
        {
          showConfigPanelBeforeChat && (
            <div className='p-[30px] pt-[0px] pb-5 rounded-b-xl bg-white'>
              <Form />
              <div className='flex justify-end'>
                <Button
                  // className={`${inputsForms.length && !isMobile && 'ml-[136px]'}`}
                  className='px-[21px] py-3 text-[16px] font-normal leading-4 rounded-[20px]'
                  variant='primary'
                  size='large'
                  onClick={handleStartChat}
                >
                  {t('share.chat.startChat')}
                  <Image src={ArrowRight} alt='' className='ml-[10px] w-[14px] h-[14px]' />
                </Button>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default ConfigPanel
