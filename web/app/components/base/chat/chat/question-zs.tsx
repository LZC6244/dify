import type {
  FC,
  ReactNode,
} from 'react'
import {
  memo,
} from 'react'
import type { ChatItem } from '../types'
import type { Theme } from '../embedded-chatbot/theme/theme-context'
import { User } from '@/app/components/base/icons/src/public/avatar'
import { Markdown } from '@/app/components/base/markdown'
import ImageGallery from '@/app/components/base/image-gallery'

type QuestionProps = {
  item: ChatItem
  questionIcon?: ReactNode
  theme: Theme | null | undefined
}
const Question: FC<QuestionProps> = ({
  item,
  questionIcon,
  theme,
}) => {
  const {
    content,
    message_files,
  } = item

  const imgSrcs = message_files?.length ? message_files.map(item => item.url) : []
  return (
    <div className='flex justify-end mb-2 last:mb-0 pl-[50px]'>
      <div className='group relative mr-[10px]'>
        {/* <QuestionTriangle
          className='absolute -right-2 top-0 w-2 h-3 text-[#D1E9FF]/50'
          style={theme ? { color: theme.chatBubbleColor } : {}}
        /> */}
        <div className='px-4 py-3 bg-[#7365FF] rounded-xl rounded-tr-none '>
          {
            !!imgSrcs.length && (
              <ImageGallery srcs={imgSrcs} />
            )
          }
          <Markdown content={content} className='!text-[#fff] !text-[16px] leading-[30px]' />
        </div>
        <div className='mt-1 h-[18px]' />
      </div>
      <div className='shrink-0 w-10 h-10'>
        {
          questionIcon || (
            <div className='w-full h-full rounded-full border-[0.5px] border-black/5'>
              <User className='w-full h-full' />
            </div>
          )
        }
      </div>
    </div>
  )
}

export default memo(Question)
