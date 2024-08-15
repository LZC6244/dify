import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { memo } from 'react'

type InputProps = {
  form: any
  value: string
  onChange: (variable: string, value: string) => void
}
const FormInput: FC<InputProps> = ({
  form,
  value,
  onChange,
}) => {
  const { t } = useTranslation()
  const {
    type,
    label,
    required,
    max_length,
    variable,
  } = form

  if (type === 'paragraph') {
    return (
      <textarea
        value={value}
        className='grow h-[104px] rounded-lg bg-[#F3F4F7] px-[18px] py-2 outline-none appearance-none resize-none'
        onChange={e => onChange(variable, e.target.value)}
        placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
      />
    )
  }

  return (
    <input
      className='grow h-[42px] rounded-lg bg-[#F3F4F7] px-[18px] outline-none appearance-none'
      value={value || ''}
      maxLength={max_length}
      onChange={e => onChange(variable, e.target.value)}
      placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
    />
  )
}

export default memo(FormInput)
