import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useChatWithHistoryContext } from '../context'
import Input from './form-input'
import Select from '@/app/components/base/select-zs'

const Form = () => {
  const { t } = useTranslation()
  const {
    inputsForms,
    newConversationInputs,
    handleNewConversationInputsChange,
    isMobile,
  } = useChatWithHistoryContext()

  const handleFormChange = useCallback((variable: string, value: string) => {
    handleNewConversationInputsChange({
      ...newConversationInputs,
      [variable]: value,
    })
  }, [newConversationInputs, handleNewConversationInputsChange])

  const renderField = (form: any) => {
    const {
      label,
      required,
      variable,
      options,
    } = form

    if (form.type === 'text-input' || form.type === 'paragraph') {
      return (
        <Input
          form={form}
          value={newConversationInputs[variable]}
          onChange={handleFormChange}
        />
      )
    }
    if (form.type === 'number') {
      return (
        <input
          className="grow h-[42px] rounded-lg bg-[#F3F4F7] px-[18px] outline-none appearance-none"
          type="number"
          value={newConversationInputs[variable] || ''}
          onChange={e => handleFormChange(variable, e.target.value)}
          placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
        />
      )
    }

    return (
      <Select
        className="w-full"
        defaultValue={newConversationInputs[variable] || ''}
        items={options.map((option: string) => ({ value: option, name: option })) || []}
        onSelect={item => handleFormChange(variable, item.value as string)}
        allowSearch={false}
        placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
      />
      // <PortalSelect
      //   popupClassName='w-[200px]'
      //   value={newConversationInputs[variable]}
      //   items={options.map((option: string) => ({ value: option, name: option }))}
      //   onSelect={item => handleFormChange(variable, item.value as string)}
      //   placeholder={`${label}${!required ? `(${t('appDebug.variableTable.optional')})` : ''}`}
      // />
    )
  }

  if (!inputsForms.length)
    return null

  return (
    <div className='mb-5 py-0'>
      {
        inputsForms.map(form => (
          <div
            key={form.variable}
            className={`flex mb-3 last-of-type:mb-0 text-sm text-gray-900 ${isMobile && '!flex-wrap'}`}
          >
            {/* <div className={`shrink-0 mr-2 py-2 w-[128px] ${isMobile && '!w-full'}`}>{form.label}</div> */}
            {renderField(form)}
          </div>
        ))
      }
    </div>
  )
}

export default Form
