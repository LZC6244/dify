import type { FC } from 'react'
import { memo } from 'react'
import type { ChatItem } from '../../types'
import { Markdown } from '@/app/components/base/markdown'

type BasicContentProps = {
  item: ChatItem
}
const BasicContent: FC<BasicContentProps> = ({
  item,
}) => {
  const {
    annotation,
    content,
  } = item

  if (annotation?.logAnnotation) {
    return (
      <div className='bg-white px-[17px] py-[12px] rounded-xl rounded-tl-none !text-[16px]'>
        <Markdown content={annotation?.logAnnotation.content || ''} className='!text-[16px]' />
      </div>
    )
  }

  return (
    <div className='bg-white px-[17px] py-[12px] rounded-xl rounded-tl-none !text-[16px]'>
      <Markdown content={content} className={`!text-[16px] ${item.isError && '!text-[#F04438]'}`} />
    </div>
  )
}

export default memo(BasicContent)
