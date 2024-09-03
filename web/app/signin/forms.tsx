'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

import NormalForm from './normalForm'
import OneMoreStep from './oneMoreStep'
import cn from '@/utils/classnames'

const Forms = () => {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  const getForm = () => {
    switch (step) {
      case 'next':
        return <OneMoreStep />
      default:
        return <NormalForm />
    }
  }
  return <div className={
    cn(
      'flex flex-row items-center justify-end',
      // 'px-6',
      // 'md:px-[108px]',
    )
  }>
    <div className='flex flex-col px-12 pt-[60px] pb-[29px] bg-white md:w-[416px] rounded-lg'>
      {getForm()}
    </div>
  </div>
}

export default Forms
