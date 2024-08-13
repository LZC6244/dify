import classNames from 'classnames'
import Image from 'next/image'
import type { FC } from 'react'
import s from './style.module.css'
import plusIcon from './plus.svg'

type CreateButtonProps = {
  className?: string
  title: string
  onClick: () => void
}
const CreateButton: FC<CreateButtonProps> = ({
  className,
  title,
  onClick,
}) => {
  // const { t } = useTranslation()
  // const [focus, setFocus] = useState<boolean>(false)

  return (
    <div
      className={classNames(
        'flex flex-row items-center justify-center py-[10px] text-white text-[16px] font-semibold rounded-lg cursor-pointer',
        s.newApp,
        className ?? '',
      )}
      onClick={() => onClick()}
    // ref={createRef}
    >
      <Image src={plusIcon} className='w-[14px] h-[14px] mr-[9px]' alt='' />
      {title || ''}
    </div>
  )
}

export default CreateButton
