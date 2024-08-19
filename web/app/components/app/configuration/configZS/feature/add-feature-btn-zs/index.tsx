'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from '@heroicons/react/24/solid'

export type IAddFeatureBtnProps = {
  toBottomHeight: number
  onClick: () => void
}

const ITEM_HEIGHT = 56

const AddFeatureBtn: FC<IAddFeatureBtnProps> = ({
  toBottomHeight,
  onClick,
}) => {
  const { t } = useTranslation()
  return (
    <div
      className='absolute z-[9] left-0 right-0 flex justify-center pb-4'
      style={{
        top: toBottomHeight - ITEM_HEIGHT,
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)',
      }}
    >
      <div
        className='flex items-center h-10 py-2 space-x-[6px] px-[22px]
        border border-[#5E3EFB] rounded-[20px] bg-white hover:bg-[#F3F2FF] cursor-pointer
        text-[16px] font-normal text-[#5E3EFB] uppercase
        shadow-[0px_0px_6px_0px_rgba(0,0,0,0.09)]
      '
        onClick={onClick}
      >
        <PlusIcon className='w-4 h-4 font-semibold' />
        <div>{t('appDebug.operation.addFeature')}</div>
      </div>
    </div>
  )
}
export default React.memo(AddFeatureBtn)
