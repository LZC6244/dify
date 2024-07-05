'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import { Explore, ExploreActive } from '../../base/icons/src/public/header-nav/explore'
type ExploreNavProps = {
  className?: string
}

const ExploreChatNav = ({
  className,
}: ExploreNavProps) => {
  const { t } = useTranslation()
  // const selectedSegment = useSelectedLayoutSegment()
  const pathname = usePathname()
  // console.log('pathname', pathname);

  // const actived = selectedSegment === 'explore'
  const actived = pathname === '/explore/chat' || pathname.includes('/explore/installed')

  return (
    <Link href="/explore/chat" className={classNames(
      className, 'group',
      actived && 'bg-white shadow-md',
      actived ? 'text-primary-600' : 'text-gray-500 hover:bg-gray-200',
    )}>
      {
        actived
          ? <ExploreActive className='mr-2 w-4 h-4' />
          : <Explore className='mr-2 w-4 h-4' />
      }
      {/* {t('common.menus.explore')} */}
      对话
    </Link>
  )
}

export default ExploreChatNav
