import type { FC } from 'react'

import data from '@emoji-mart/data'
import { init } from 'emoji-mart'
import Image from 'next/image'
import style from './style.module.css'
import classNames from '@/utils/classnames'

init({ data })

export type AppIconProps = {
  size?: 'xs' | 'tiny' | 'small' | 'medium' | 'large'
  rounded?: boolean
  icon?: string
  background?: string
  className?: string
  innerIcon?: React.ReactNode
  onClick?: () => void
  width?: number
  height?: number
}

const AppIcon: FC<AppIconProps> = ({
  size = 'medium',
  rounded = false,
  icon,
  background,
  className,
  innerIcon,
  onClick,
  width = 40,
  height = 40,
}) => {
  const isNotDefault = (icon && icon !== '') && (icon.includes('base64') || icon.startsWith('http'))
  return (
    <span
      className={classNames(
        style.appIcon,
        size !== 'medium' && style[size],
        rounded && style.rounded,
        className ?? '',
      )}
      style={{
        background: isNotDefault ? 'transparent' : background,
      }}
      onClick={onClick}
    >
      {
        isNotDefault
          ? <Image className='w-full h-full rounded-full' width={width} height={height} src={icon} alt='' />
          : (innerIcon || ((icon && icon !== '') ? <em-emoji id={icon} /> : <em-emoji id='🧭' />))
      }
    </span>
  )
}

export default AppIcon
