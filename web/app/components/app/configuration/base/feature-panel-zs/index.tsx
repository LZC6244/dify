'use client'
import type { FC, ReactNode } from 'react'
import React from 'react'
import cn from '@/utils/classnames'
import ParamsConfig from '@/app/components/app/configuration/config-voice/param-config'

export type IFeaturePanelProps = {
  className?: string
  headerIcon?: ReactNode
  title: ReactNode
  headerRight?: ReactNode
  hasHeaderBottomBorder?: boolean
  isFocus?: boolean
  noBodySpacing?: boolean
  children?: ReactNode
  isShowTextToSpeech?: boolean
}

const FeaturePanel: FC<IFeaturePanelProps> = ({
  className,
  headerIcon,
  title,
  headerRight,
  hasHeaderBottomBorder,
  isFocus,
  noBodySpacing,
  children,
  isShowTextToSpeech,
}) => {
  return (
    <div
      className={cn(className, isFocus && '', 'rounded-xl bg-[#F3F4F7] pt-4 pb-5', noBodySpacing && '!pb-0')}
      style={isFocus
        ? {
          boxShadow: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        }
        : {}}
    >
      {/* Header */}
      <div className={cn('pb-4 px-[14px]', hasHeaderBottomBorder && '')}>
        <div className='flex justify-between items-center leading-[14px]'>
          <div className='flex items-center space-x-1 shrink-0'>
            {headerIcon && <div className='flex items-center justify-center w-6 h-6'>{headerIcon}</div>}
            <div className='text-[16px] font-medium leading-4 text-[#212B36]'>{title}</div>
          </div>
          <div className='flex gap-2 items-center'>
            {headerRight && <div>{headerRight}</div>}
            {isShowTextToSpeech && <div className='flex items-center'>
              <ParamsConfig />
            </div>}
          </div>
        </div>
      </div>
      {/* Body */}
      {children && (
        <div className={cn(!noBodySpacing && 'px-[14px]')}>
          {children}
        </div>
      )}
    </div>
  )
}
export default React.memo(FeaturePanel)
