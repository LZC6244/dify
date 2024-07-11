import React from 'react'
import classNames from 'classnames'
import Header from '../signin/_header'
import style from '../signin/page.module.css'

/**
 * 隐私政策
 * @returns
 */
const Install = () => {
  return (
    <div className={classNames(
      style.background,
      'flex w-full min-h-screen',
      'p-4 lg:p-8',
      'gap-x-20',
      'justify-center lg:justify-start',
    )}>
      <div className={
        classNames(
          'flex w-full flex-col bg-white shadow rounded-2xl shrink-0',
          'md:w-[608px] space-between',
        )
      }>
        <Header />
        <div className='px-8 py-6 text-sm font-normal text-gray-500'>
          © {new Date().getFullYear()} Zhuoshi Future(Beijing)Technology Co., All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default Install
