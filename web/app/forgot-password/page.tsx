'use client'
import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useSearchParams } from 'next/navigation'
import Header from '../signin/_header'
import style from '../signin/page.module.css'
import ForgotPasswordForm from './ForgotPasswordForm'
import cn from '@/utils/classnames'
import ChangePasswordForm from '@/app/forgot-password/ChangePasswordForm'

const ForgotPassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const newStar = () => {
    const d = document.createElement('div')
    d.innerHTML = `<div class="${style.start}">`
    return d.firstChild!
  }

  const createStar = () => {
    for (let i = 0; i <= 80; i++) {
      const star: any = newStar()
      star.style.top = `${Math.random() * 100}%`
      star.style.left = `${Math.random() * 100}%`
      star.style.width = '3px'
      star.style.height = '3px'
      star.style.borderRadius = '50%'
      star.style.position = 'absolute'
      star.style.background = '#FFFFFF'
      star.style.boxShadow = '0px 0px 2px 2px #535FED'
      star.animation = 'none'
      document.getElementById('loginMain')!.appendChild(star)
    }
  }

  useEffect(() => {
    createStar()
  }, [])

  return (
    <div className={classNames(
      style.background,
      'flex w-full min-h-screen',
      'p-4 lg:p-8',
      'gap-x-20',
      'justify-center items-center',
    )}>
      <div id='loginMain' className={
        classNames(
          'flex w-full flex-col shadow rounded-2xl shrink-0',
          'md:w-[900px] space-between',
        )
      }>
        <Header />
        <div className='flex flex-row items-center justify-center z-50'>
          <div className='relative min-w-[564px] h-[440px]'>
            <div className={cn(style.star, style.glow, style.one)}></div>
            <div className={style.line}></div>
            <div className={cn(style.star, style.glow, style.two)}></div>
            <div className={style.line2}></div>
            <div className={cn(style.star, style.glow, style.three)}></div>
            <div className={style.line3}></div>
            <div className={cn(style.star, style.glow, style.four)}></div>
            <div className={style.line4}></div>
            <div className={cn(style.star, style.glow, style.five)}></div>
            <div className={style.line5}></div>
            <div className={cn(style.star, style.glow, style.six)}></div>
            <div className={style.line6}></div>
            <div className={cn(style.star, style.glow, style.seven)}></div>
          </div>
          <div className='bg-white px-12 pt-[60px] pb-[29px] rounded-lg'>
            {token ? <ChangePasswordForm /> : <ForgotPasswordForm />}
          </div>
        </div>
        {/* <div className='px-8 py-6 text-sm font-normal text-gray-500'>
          © {new Date().getFullYear()} Dify, Inc. All rights reserved.
        </div> */}
      </div>
    </div>
  )
}

export default ForgotPassword
