'use client'
import { useState } from 'react'
import Image from 'next/image'
import cn from '@/utils/classnames'

type AvatarProps = {
  name: string
  avatar?: string
  size?: number
  className?: string
  textClassName?: string
}
const Avatar = ({
  name,
  avatar,
  size = 30,
  className,
  textClassName,
}: AvatarProps) => {
  const avatarClassName = 'shrink-0 flex items-center rounded-full'
  const style = { width: `${size}px`, height: `${size}px`, fontSize: `${size}px`, lineHeight: `${size}px` }
  const [imgError, setImgError] = useState(false)

  const handleError = () => {
    setImgError(true)
  }

  if (avatar && !imgError) {
    return (
      <Image
        className={cn(avatarClassName, className)}
        style={style}
        alt={name}
        src={avatar}
        width={40}
        height={40}
        onError={handleError}
      />
    )
  }

  return (
    <div
      className={cn(avatarClassName, className)}
      style={style}
    >
      <div
        className={cn(textClassName, 'text-center text-white scale-[0.4]')}
        style={style}
      >
        {name[0].toLocaleUpperCase()}
      </div>
    </div>
  )
}

export default Avatar
