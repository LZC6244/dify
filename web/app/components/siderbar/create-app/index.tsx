'use client'
import classNames from 'classnames'
import type { FC } from 'react'
import React, { useState } from 'react'
import Image from 'next/image'
// import LogoSite from '@/app/components/base/logo/logo-site'
import s from '../style.module.css'
import plusIcon from './plus.svg'
import importIcon from './Import.svg'
import importActiveIcon from './Import_h.svg'
import templateIcon from './template.svg'
import templateActiveIcon from './template_h.svg'
import buildIcon from './build.svg'
import buildActiveIcon from './build_h.svg'

export type IProps = {
  className?: string
}

const CreateApp: FC<IProps> = ({ className }) => {
  const [show, setShow] = useState(false)
  return (
    <div className='relative my-9'>
      <div className={classNames('flex flex-row items-center justify-center py-[10px] text-white text-[16px] font-semibold rounded-lg cursor-pointer', s.newApp, className ?? '')}>
        <Image src={plusIcon} className='w-[14px] h-[14px] mr-[9px]' alt='' />
        创建应用
      </div>
      <div className='absolute z-50 left-0 right-0 top-[100%] mt-[10px] px-[14px] py-[15px] bg-white rounded-lg shadow-[0px_2px_8px_4px_rgba(0,0,0,0.04)]'>
        <div className='group flex flex-row items-center mb-[15px] cursor-pointer text-[14px] text-[#212B36] hover:text-[#5E3EFB]'>
          <Image className='w-4 h-4 mr-2 inline-block group-hover:hidden' src={buildIcon} alt='' />
          <Image className='w-4 h-4 mr-2 hidden group-hover:inline-block' src={buildActiveIcon} alt='' />
          创建空白应用
        </div>
        <div className='group flex flex-row items-center cursor-pointer text-[14px] text-[#212B36] hover:text-[#5E3EFB]'>
          <Image className='w-4 h-4 mr-2 inline-block group-hover:hidden' src={templateIcon} alt='' />
          <Image className='w-4 h-4 mr-2 hidden group-hover:inline-block' src={templateActiveIcon} alt='' />
          从应用模版创建
        </div>
        <div className='w-full h-[1px] bg-[#EFEFEF] my-[15px]'></div>
        <div className='group flex flex-row items-center cursor-pointer text-[14px] text-[#212B36] hover:text-[#5E3EFB]'>
          <Image className='w-4 h-4 mr-2 inline-block group-hover:hidden' src={importIcon} alt='' />
          <Image className='w-4 h-4 mr-2 hidden group-hover:inline-block' src={importActiveIcon} alt='' />
          导入DSL文件
        </div>
      </div>
    </div>
  )
}

export default React.memo(CreateApp)
