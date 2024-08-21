'use client'
import { useMemo } from 'react'
import { useContext } from 'use-context-selector'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import type { Collection } from '../types'
import cn from '@/utils/classnames'
import AppIcon from '@/app/components/base/app-icon-zs'
// import { Tag01 } from '@/app/components/base/icons/src/vender/line/financeAndECommerce'
import I18n from '@/context/i18n'
import { getLanguage } from '@/i18n/language'
import { useStore as useLabelStore } from '@/app/components/tools/labels/store'
import tagIcon from '@/app/components/base/tag-management/images/tag.png'

type Props = {
  active: boolean
  collection: Collection
  onSelect: () => void
}

const ProviderCard = ({
  active,
  collection,
  onSelect,
}: Props) => {
  const { t } = useTranslation()
  const { locale } = useContext(I18n)
  const language = getLanguage(locale)
  const labelList = useLabelStore(s => s.labelList)

  const labelContent = useMemo(() => {
    if (!collection.labels)
      return ''
    return collection.labels.map((name) => {
      const label = labelList.find(item => item.name === name)
      return label?.label[language]
    }).filter(Boolean).join(', ')
  }, [collection.labels, labelList, language])

  return (
    <div className={cn('group col-span-1 p-5 bg-white rounded-lg min-h-[179px] flex flex-col transition-all duration-200 ease-in-out cursor-pointer hover:shadow-[0px_6px_10px_4px_rgba(0,0,0,0.06)]', active && '!border-primary-400')} onClick={onSelect}>
      <div className='flex pb-[10px] items-center gap-[10px] grow-0 shrink-0'>
        <div className='relative shrink-0'>
          {typeof collection.icon === 'string' && (
            <div className='w-[48px] h-[48px] bg-center bg-cover bg-no-repeat rounded-md' style={{ backgroundImage: `url(${collection.icon})` }} />
          )}
          {typeof collection.icon !== 'string' && (
            <AppIcon
              size='large'
              icon={collection.icon.content}
              background={collection.icon.background}
            />
          )}
        </div>
        <div className='grow w-0 pt-[3px]'>
          <div className='flex items-center text-[18px] leading-5 font-semibold text-[#212B36]'>
            <div className='truncate' title={collection.label[language]}>{collection.label[language]}</div>
          </div>
          <div className='flex items-center mt-[10px] text-[14px] leading-[14px] text-[#9EADB9] font-normal'>
            <div className='truncate'>{t('tools.author')}&nbsp;{collection.author === 'Dify' ? '卓世科技' : collection.author}</div>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'grow mb-[23px] max-h-[46px] text-[14px] leading-[24px] text-[#637381]',
          collection.labels?.length ? 'line-clamp-2' : 'line-clamp-2',
          collection.labels?.length > 0 && 'group-hover:line-clamp-2 group-hover:max-h-[46px]',
        )}
        title={collection.description[language]}
      >
        {collection.description[language]}
      </div>
      {collection.labels?.length > 0 && (
        <div className='flex items-center shrink-0'>
          <div className='relative w-full flex items-center gap-1 rounded-md text-gray-500' title={labelContent}>
            {/* <Tag01 className='shrink-0 w-3 h-3' /> */}
            <Image src={tagIcon} className='w-3 h-3 shrink-0' alt={''} />
            <div className='grow text-xs text-start leading-[12px] font-normal truncate'>{labelContent}</div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ProviderCard
