'use client'
import type { FC } from 'react'
import React from 'react'
// import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import generate from './generate.svg'

export type IAutomaticBtnProps = {
  onClick: () => void
}
const AutomaticBtn: FC<IAutomaticBtnProps> = ({
  onClick,
}) => {
  // const { t } = useTranslation()

  return (
    <div className='flex space-x-1 items-center cursor-pointer'
      onClick={onClick}
    >
      <Image src={generate} className='w-[14px] h-[14px]' alt='' />
      <span className='text-[14px] font-normal text-[#5E3EFB]'>自动编排</span>
    </div>
  )
}
export default React.memo(AutomaticBtn)
