'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import classNames from 'classnames'
// import { Tools, ToolsActive } from '../../base/icons/src/public/header-nav/tools'
import Image from 'next/image'
import Explore from './plug-in.svg'
import ExploreActive from './plug-in_h.svg'
type ToolsNavLeftProps = {
  className?: string
}

const ToolsNavLeft = ({
  className,
}: ToolsNavLeftProps) => {
  const selectedSegment = useSelectedLayoutSegment()
  const actived = selectedSegment === 'tools'

  return (
    <Link href="/tools" className={classNames(
      className, 'group',
      'w-full pl-[17px] hover:bg-[#E4EAFF]',
      // actived && 'bg-white shadow-md',
      actived ? 'text-[#5E3EFB]' : 'text-[#000000] ',
    )}>
      {
        actived
          ? <Image src={ExploreActive} className='mr-3 w-5 h-5' alt="" />
          : <Image src={Explore} className='mr-3 w-5 h-5' alt="" />
      }
      <span className={classNames('text-[16px]')}>
        发现
      </span>
    </Link>
  )
}

export default ToolsNavLeft
