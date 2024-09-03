'use client'
import type { FC } from 'react'
import React from 'react'
import cn from '@/utils/classnames'

type Props = {
  className?: string
  icon: React.ReactNode
  iconBgClassName?: string
  title: React.ReactNode
  description: string
  noRadio?: boolean
  isChosen?: boolean
  onChosen?: () => void
  chosenConfig?: React.ReactNode
  chosenConfigWrapClassName?: string
}

const RadioCard: FC<Props> = ({
  icon,
  iconBgClassName = 'bg-[#F5F3FF]',
  title,
  description,
  noRadio,
  isChosen,
  onChosen = () => { },
  chosenConfig,
  chosenConfigWrapClassName,
}) => {
  return (
    <div
      className={cn(
        'bg-[#F6F6F9] rounded-lg hover:shadow-xs cursor-pointer',
        isChosen && 'bg-[#F6F6F9] shadow-xs',
      )}
    >
      <div className='flex py-[14px] pl-[14px] pr-[18px]' onClick={onChosen}>
        <div className={cn(iconBgClassName, 'mr-3 shrink-0 hidden w-8 justify-center h-8 items-center rounded-lg')}>
          {icon}
        </div>
        <div className='grow'>
          <div className='leading-4 text-sm font-medium text-[#212B36]'>{title}</div>
          <div className='leading-[18px] mt-2 text-xs font-normal text-[#9EADB9] pr-[50px]'>{description}</div>
        </div>
        {!noRadio && (
          <div className='shrink-0 flex items-center h-8'>
            <div className={cn(
              'w-4 h-4 border border-[#5E3EFB] bg-[#F6F6F9] shadow-xs rounded-full',
              isChosen && 'border-[5px] border-[#5E3EFB]',
            )}></div>
          </div>
        )}
      </div>
      {((isChosen && chosenConfig) || noRadio) && (
        <div className={cn(chosenConfigWrapClassName, 'p-3 border-t border-gray-200')}>
          {chosenConfig}
        </div>
      )}
    </div>
  )
}
export default React.memo(RadioCard)
