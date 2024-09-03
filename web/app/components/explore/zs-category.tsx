'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from '@/utils/classnames'
import exploreI18n from '@/i18n/en-US/explore'
import type { AppCategory } from '@/models/explore'
// import { ThumbsUp } from '@/app/components/base/icons/src/vender/line/alertsAndFeedback'

const categoryI18n = exploreI18n.category

export type ICategoryProps = {
  className?: string
  list: AppCategory[]
  value: string
  onChange: (value: AppCategory | string) => void
  /**
   * default value for searchparam 'category' in en
   */
  allCategoriesEn: string
}

const Category: FC<ICategoryProps> = ({
  className,
  list,
  value,
  onChange,
  allCategoriesEn,
}) => {
  const { t } = useTranslation()
  const isAllCategories = !list.includes(value as AppCategory)

  // v2.1.1UI修改样式字体大小
  const itemClassName = (isSelected: boolean) => cn(
    'flex items-center px-6 py-[9px] h-[32px] min-w-[64px] rounded-lg border-[0.5px] border-transparent text-[#120649] font-[14px] leading-[18px] cursor-pointer bg-white hover:bg-[#E4EAFF] hover:text-[#5E3EFB]',
    isSelected && 'bg-white shadow-xs text-[#5E3EFB] hover:bg-[#E4EAFF]',
  )

  return (
    <div className={cn(className, 'flex space-x-[10px] text-[13px] flex-wrap')}>
      <div
        className={itemClassName(isAllCategories)}
        onClick={() => onChange(allCategoriesEn)}
      >
        {/* v2.1.1UI修改 */}
        {/* <ThumbsUp className='mr-1 w-3.5 h-3.5' /> */}
        {t('explore.apps.allCategories')}
      </div>
      {list.map(name => (
        <div
          key={name}
          className={itemClassName(name === value)}
          onClick={() => onChange(name)}
        >
          {categoryI18n[name] ? t(`explore.category.${name}`) : name}
        </div>
      ))}
    </div>
  )
}

export default React.memo(Category)
