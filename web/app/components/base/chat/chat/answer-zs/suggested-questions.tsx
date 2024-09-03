import type { FC } from 'react'
import { memo } from 'react'
import type { ChatItem } from '../../types'
import { useChatContext } from '../context'

type SuggestedQuestionsProps = {
  item: ChatItem
}
const SuggestedQuestions: FC<SuggestedQuestionsProps> = ({
  item,
}) => {
  const { onSend } = useChatContext()
  const {
    isOpeningStatement,
    suggestedQuestions,
  } = item

  if (!isOpeningStatement || !suggestedQuestions?.length)
    return null

  return (
    <div className='flex flex-wrap'>
      {suggestedQuestions.filter(q => !!q && q.trim()).map((question, index) => (
        <div
          key={index}
          className='mt-[14px] mr-[18px] max-w-full last:mr-0 shrink-0 py-[10px] leading-[14px] items-center px-[14px] rounded-2xl bg-white hover:bg-[#EAE9F7] text-[14px] font-normal text-[#212B36] cursor-pointer'
          onClick={() => onSend?.(question)}
        >
          {question}
        </div>),
      )}
    </div>
  )
}

export default memo(SuggestedQuestions)
