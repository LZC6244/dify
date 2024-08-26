'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { StaticImport } from 'next/dist/shared/lib/get-img-props'
import classNames from '@/utils/classnames'

export type NavIcon = React.ComponentType<
React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
  title?: string | undefined
  titleId?: string | undefined
}
>

export type NavLinkProps = {
  name: string
  href: string
  iconMap: {
    selected: string | StaticImport
    normal: string | StaticImport
  }
  mode?: string
}

export default function NavLink({
  name,
  href,
  iconMap,
  mode = 'expand',
}: NavLinkProps) {
  const segment = useSelectedLayoutSegment()
  const formattedSegment = (() => {
    let res = segment?.toLowerCase()
    // logs and annotations use the same nav
    if (res === 'annotations')
      res = 'logs'

    return res
  })()
  const isActive = href.toLowerCase().split('/')?.pop() === formattedSegment
  const NavIcon = isActive ? iconMap.selected : iconMap.normal

  return (
    <Link
      key={name}
      href={href}
      className={classNames(
        isActive ? 'bg-[#F3F2FF] text-[#5E3EFB] font-semibold' : 'text-[#212B36] hover:text-[#5E3EFB]',
        'group flex items-center h-11 rounded-md py-3 text-[16px] font-normal',
        mode === 'expand' ? 'px-[14px]' : 'px-2.5',
      )}
      title={mode === 'collapse' ? name : ''}
    >
      <div className={classNames(
        'h-4 w-4 flex-shrink-0 block relative',
        mode === 'expand' ? 'mr-2' : 'mr-0',
      )}>
        <Image src={NavIcon} className='absolute opacity-100 left-0 top-0 w-full h-full group-hover:opacity-0' alt='' />
        <Image src={iconMap.selected} className="absolute opacity-0 left-0 top-0 w-full h-full group-hover:opacity-100" alt='' />
      </div>
      {mode === 'expand' && name}
    </Link>
  )
}
