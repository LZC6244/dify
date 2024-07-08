'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
// import { Explore, ExploreActive } from '../../base/icons/src/public/header-nav/explore'
import Image from 'next/image'
import Explore from './work_room.svg'
import ExploreActive from './work_room_h.svg'
type ExploreNavProps = {
  className?: string
}

const AppNavLeft = ({
  className,
}: ExploreNavProps) => {
  const pathname = usePathname()
  const actived = pathname === '/apps' || pathname.includes('/apps')

  return (
    <Link href="/apps" className={classNames(
      className, 'group',
      'w-full pl-[17px] hover:bg-[#E4EAFF]',
      actived ? 'text-[#5E3EFB]' : 'text-[#000000] ',
    )}>
      {
        actived
          ? <Image src={ExploreActive} className='mr-3 w-5 h-5' alt="" />
          : <Image src={Explore} className='mr-3 w-5 h-5' alt="" />
      }
      {/* {
        actived
          ? <ExploreActive className='mr-2 w-4 h-4' />
          : <Explore className='mr-2 w-4 h-4' />
      } */}
      <span className={classNames('text-[16px]')}>
        工作室
      </span>
    </Link>
  )
}

export default AppNavLeft
