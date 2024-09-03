'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import { useBoolean } from 'ahooks'

type Props = {
  value: string
  onChange: (value: string) => void
  title: JSX.Element | string
  headerRight?: JSX.Element
  minHeight?: number
  onBlur?: () => void
  placeholder?: string
  readonly?: boolean
  isInNode?: boolean
}

const TextEditor: FC<Props> = ({
  value,
  onChange,
  title,
  headerRight,
  minHeight,
  onBlur,
  placeholder,
  readonly,
  isInNode,
}) => {
  const [isFocus, {
    setTrue: setIsFocus,
    setFalse: setIsNotFocus,
  }] = useBoolean(false)

  const handleBlur = useCallback(() => {
    setIsNotFocus()
    onBlur?.()
  }, [setIsNotFocus, onBlur])

  return (
    <div className='flex flex-row items-center justify-between'>
      {title}
      <input
        value={value}
        className='shrink-0 block ml-4 pl-3 w-24 h-8 appearance-none outline-none rounded-lg bg-gray-100 text-[13px] text-gra-900'
        type='number'
        max={2}
        min={0}
        step={0.1}
        onChange={e => onChange(e.target.value)}
        onFocus={setIsFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        readOnly={readonly}
      />
    </div>
  )
}
export default React.memo(TextEditor)
