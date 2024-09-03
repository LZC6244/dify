// import { useTranslation } from 'react-i18next'
import s from './index.module.css'
import cn from '@/utils/classnames'

type Props = {
  nextDisabled: boolean
  nextBtnText: string
  modalBtnText: string
  onStepChange: () => void
  datasetId?: string | null
  modalShowHandle: () => void
}

export default function StepButton({
  nextDisabled,
  nextBtnText,
  modalBtnText,
  onStepChange,
  datasetId,
  modalShowHandle,
}: Props) {
  // const { t } = useTranslation()
  return (
    <div className='flex flex-row items-center mt-4'>
      <div
        className={cn(s.submitButton, nextDisabled && s.btnDisabled)}
        onClick={() => {
          if (nextDisabled)
            return

          onStepChange()
        }}>
        {nextBtnText}
      </div>
      {!datasetId && (
        <>
          <div onClick={modalShowHandle} className={s.OtherCreationOption}>
            {modalBtnText}
          </div>
        </>
      )}
    </div>
  )
}
