'use client'
import React, { useRef } from 'react'

import { useRouter } from 'next/navigation'
import { useHover } from 'ahooks'
import s from './style.module.css'
import cn from '@/utils/classnames'
<<<<<<< HEAD
import ItemOperation from '@/app/components/explore/item-operation'
import AppIcon from '@/app/components/base/app-icon'
import type { AppIconType } from '@/types/app'
=======
// import ItemOperation from '@/app/components/explore/item-operation'
import AppIcon from '@/app/components/base/app-icon-zs'
>>>>>>> feature/v2.1.1

export type IAppNavItemProps = {
  isMobile: boolean
  name: string
  id: string
  icon_type: AppIconType | null
  icon: string
  icon_background: string
  icon_url: string
  isSelected: boolean
  isPinned: boolean
  togglePin: () => void
  uninstallable: boolean
  onDelete: (id: string) => void
}

export default function AppNavItem({
  isMobile,
  name,
  id,
  icon_type,
  icon,
  icon_background,
  icon_url,
  isSelected,
  isPinned,
  togglePin,
  uninstallable,
  onDelete,
}: IAppNavItemProps) {
  const router = useRouter()
  const url = `/explore/installed/${id}`
  const ref = useRef(null)
  const isHovering = useHover(ref)
  return (
    <div
      ref={ref}
      key={id}
      className={cn(
        s.item,
        isSelected ? 'bg-[#F3F2FF]' : 'hover:bg-[#F3F2FF]',
        'flex h-[46px] items-center justify-between mobile:justify-center px-3 mobile:px-3 rounded-lg text-sm font-normal',
      )}
      onClick={() => {
        router.push(url) // use Link causes popup item always trigger jump. Can not be solved by e.stopPropagation().
      }}
    >
      {isMobile && <AppIcon size='tiny' iconType={icon_type} icon={icon} background={icon_background} imageUrl={icon_url} />}
      {!isMobile && (
        <>
          <div className='flex items-center space-x-2 w-0 grow'>
<<<<<<< HEAD
            <AppIcon size='tiny' iconType={icon_type} icon={icon} background={icon_background} imageUrl={icon_url} />
            <div className='overflow-hidden text-ellipsis whitespace-nowrap' title={name}>{name}</div>
=======
            <AppIcon size='tiny' className='!w-9 !h-9 !rounded-[18px] !overflow-hidden' icon={icon} background={icon_background} />
            <div className={cn('overflow-hidden text-ellipsis whitespace-nowrap text-[16px]', isSelected ? 'text-[#5E3EFB]' : 'text-[#000]')} title={name}>{name}</div>
>>>>>>> feature/v2.1.1
          </div>
          {/* <div className='shrink-0 h-6' onClick={e => e.stopPropagation()}>
            <ItemOperation
              isPinned={isPinned}
              isItemHovering={isHovering}
              togglePin={togglePin}
              isShowDelete={!uninstallable && !isSelected}
              onDelete={() => onDelete(id)}
            />
          </div> */}
        </>
      )}
    </div>
  )
}
