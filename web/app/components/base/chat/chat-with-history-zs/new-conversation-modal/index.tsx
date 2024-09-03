'use client'

import Modal from '@/app/components/base/modal'

type CreateNewConversationModalProps = {
  show: boolean
  onSuccess: () => void
  onClose: () => void
}

const CreateNewConversationModal = ({ show, onSuccess, onClose }: CreateNewConversationModalProps) => {
  return (
    <Modal
      wrapperClassName='z-20'
      className='px-8 py-8 max-w-[370px] w-[370px] rounded-xl bg-white shadow-[0px_0px_12px_0px_rgba(0,0,0,0.12)]'
      isShow={show}
      onClose={() => {
        onClose && onClose()
      }}
    >
      <div className='relative text-[#0C0336] text-sm'>
        是否清除内容并开始新对话
      </div>
      <div className='pt-[40px] flex justify-end'>
        <div className='text-[#fff] cursor-pointer text-sm px-[23px] py-[9px] rounded-2xl' style={{ background: 'linear-gradient( 270deg, #7B60FF 0%, #5E3EFB 100%)' }} onClick={onSuccess}>
          确定
        </div>
        <div className='ml-3 text-[#637381] cursor-pointer text-sm px-[23px] py-[9px] rounded-2xl bg-[#EEEEFF]' onClick={onClose}>
          取消
        </div>
      </div>
    </Modal>
  )
}

export default CreateNewConversationModal
