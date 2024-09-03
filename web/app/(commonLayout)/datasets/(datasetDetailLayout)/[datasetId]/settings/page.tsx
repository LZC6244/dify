import React from 'react'
import { getLocaleOnServer, useTranslation as translate } from '@/i18n/server'
import Form from '@/app/components/datasets/settings/form-zs'

const Settings = async () => {
  const locale = getLocaleOnServer()
  const { t } = await translate(locale, 'dataset-settings')

  return (
    <div className='bg-white h-full overflow-y-auto rounded-tl-[20px] shadow-[-1px_0px_0px_0px_#DFE0E8]'>
      <div className='px-[30px] py-3 pt-9'>
        <div className='mb-1 text-lg font-semibold text-gray-900'>{t('title')}</div>
        <div className='text-sm text-gray-500'>{t('desc')}</div>
      </div>
      <Form />
    </div>
  )
}

export default Settings
