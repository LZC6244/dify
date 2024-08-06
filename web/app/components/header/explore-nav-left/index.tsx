'use client'

// import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
// import { Explore, ExploreActive } from '../../base/icons/src/public/header-nav/explore'
import Image from 'next/image'
import Explore from './find.svg'
import ExploreActive from './find_h.svg'
type ExploreNavLeftProps = {
  className?: string
}

const ExploreNavLeft = ({
  className,
}: ExploreNavLeftProps) => {
  // const { t } = useTranslation()
  // const selectedSegment = useSelectedLayoutSegment()
  // const actived = selectedSegment === 'explore'
  const pathname = usePathname()
  const actived = pathname === '/explore/apps'

  return (
    <Link href="/explore/apps" className={classNames(
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
      {/* {
        actived
          ? <ExploreActive className='mr-2 w-4 h-4' />
          : <Explore className='mr-2 w-4 h-4' />
      } */}
      {/* {t('common.menus.explore')} */}
      <span className={classNames('text-[16px]')}>
        发现
      </span>
    </Link>
  )
}

export default ExploreNavLeft
