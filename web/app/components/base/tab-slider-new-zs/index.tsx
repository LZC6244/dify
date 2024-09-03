import type { FC } from 'react'
import cn from '@/utils/classnames'

type Option = {
  value: string
  text: string
  icon?: React.ReactNode
}
type TabSliderProps = {
  className?: string
  value: string
  onChange: (v: string) => void
  options: Option[]
}
const TabSliderNew: FC<TabSliderProps> = ({
  className,
  value,
  onChange,
  options,
}) => {
  return (
    <div className={cn(className, 'relative flex')}>
      {options.map(option => (
        <div
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'bg-white mr-[10px] w-[80px] h-[32px] flex items-center justify-center rounded-lg text-[#120649] text-[14px] font-normal leading-[14px] cursor-pointer hover:bg-[#E4EAFF] hover:text-[#5E3EFB]',
            value === option.value && 'text-[#5E3EFB] hover:bg-[#E4EAFF]',
          )}
        >
          {option.text}
        </div>
      ))}
    </div>
  )
}

export default TabSliderNew
