'use client'
import type { FC } from 'react'
import React, { useCallback } from 'react'
import produce from 'immer'
import { useTranslation } from 'react-i18next'
import { useEdgesInteractions } from '../../../hooks'
import Item from './class-item'
import type { Topic } from '@/app/components/workflow/nodes/knowledge-filter/types'
import { useToastContext } from '@/app/components/base/toast'

const i18nPrefix = 'workflow.nodes.knowledgeFilter'

type Props = {
  id: string
  list: Topic[]
  onChange: (list: Topic[]) => void
  readonly?: boolean
}

const ClassList: FC<Props> = ({
  id,
  list,
  onChange,
  readonly,
}) => {
  const { t } = useTranslation()
  const { notify } = useToastContext()
  const { handleEdgeDeleteByDeleteBranch } = useEdgesInteractions()

  // 判断是否降薪数组
  const isDescending = (arr: Topic[]) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i].threshold > arr[i - 1].threshold)
        return false
    }
    return true
  }

  const handleClassChange = useCallback((index: number) => {
    return (value: Topic) => {
      const newList = produce(list, (draft) => {
        draft[index] = value
      })
      if (!isDescending(newList)) {
        notify({ type: 'error', message: '分类数据必须是降序的' })
        return
      }
      onChange(newList)
    }
  }, [list, onChange])

  // const handleAddClass = useCallback(() => {
  //   const newList = produce(list, (draft) => {
  //     draft.push({ id: `${Date.now()}`, name:'', threshold: '' })
  //   })
  //   onChange(newList)
  // }, [list, onChange])

  // const handleRemoveClass = useCallback((index: number) => {
  //   return () => {
  //     handleEdgeDeleteByDeleteBranch(id, list[index].id)
  //     const newList = produce(list, (draft) => {
  //       draft.splice(index, 1)
  //     })
  //     onChange(newList)
  //   }
  // }, [list, onChange, handleEdgeDeleteByDeleteBranch, id])

  // Todo Remove; edit topic name
  return (
    <div className='space-y-2'>
      {
        list.map((item, index) => {
          return (
            <Item
              key={index}
              payload={item}
              onChange={handleClassChange(index)}
              // onRemove={handleRemoveClass(index)}
              index={index + 1}
              readonly={readonly}
            />
          )
        })
      }

    </div>
  )
}
export default React.memo(ClassList)
