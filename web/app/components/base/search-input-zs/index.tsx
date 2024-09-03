import type { FC } from 'react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RiSearchLine } from '@remixicon/react'
import cn from '@/utils/classnames'
import { XCircle } from '@/app/components/base/icons/src/vender/solid/general'

type SearchInputProps = {
  placeholder?: string
  className?: string
  value: string
  onChange: (v: string) => void
  white?: boolean
}
const SearchInput: FC<SearchInputProps> = ({
  placeholder,
  className,
  value,
  onChange,
  white,
}) => {
  const { t } = useTranslation()
  const [focus, setFocus] = useState<boolean>(false)

  return (
    <div className={cn(
      'group flex items-center px-2 h-8 rounded bg-[#EEEEF5] hover:bg-[#E4EAFF] border border-transparent overflow-hidden',
      focus && '!bg-white hover:bg-white shawdow-xs !border-gray-300',
      !focus && value && 'hover:!bg-[#E4EAFF] hover:!shawdow-xs hover:!border-black/5',
      white && '!bg-white hover:!bg-white shawdow-xs !border-gray-300 hover:!border-gray-300',
      className,
    )}>
      <div className="pointer-events-none shrink-0 flex items-center mr-1.5 justify-center w-4 h-4">
        <RiSearchLine className="h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
      </div>
      <input
        type="text"
        name="query"
        className={cn(
          'grow block h-[18px] bg-[#EEEEF5] border-0 text-gray-700 text-[13px] placeholder:text-gray-500 appearance-none outline-none group-hover:bg-[#E4EAFF] caret-blue-600',
          focus && '!bg-white hover:bg-white group-hover:bg-white placeholder:!text-gray-400',
          !focus && value && 'hover:!bg-[#E4EAFF] group-hover:!bg-[#E4EAFF]',
          white && '!bg-white hover:!bg-white group-hover:!bg-white placeholder:!text-gray-400',
        )}
        placeholder={placeholder || t('common.operation.search')!}
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        autoComplete="off"
      />
      {value && (
        <div
          className='shrink-0 flex items-center justify-center w-4 h-4 cursor-pointer group/clear'
          onClick={() => onChange('')}
        >
          <XCircle className='w-3.5 h-3.5 text-gray-400 group-hover/clear:text-gray-600' />
        </div>
      )}
    </div>
  )
}

export default SearchInput
