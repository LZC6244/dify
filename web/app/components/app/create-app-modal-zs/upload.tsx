'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import upload from './upload.svg'

type FileUploadProps = {
  value: string
  onImageChange?: (base64String: string) => void
}
export default function Upload({ value, onImageChange }: FileUploadProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null)

  useEffect(() => {
    if (value.includes('base64') || value.startsWith('http'))
      setImageBase64(value)
  }, [value])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64String = e.target?.result as string
        setImageBase64(base64String)
        if (onImageChange)
          onImageChange(base64String)
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div className='flex flex-row items-center'>
      <div className='group w-[72px] h-[72px] relative flex items-center justify-center overflow-hidden cursor-pointer rounded-lg border-[1px] border-[#9EADB9] border-dashed hover:border-[#5E3EFB]'>
        <input type="file" className='opacity-0 z-30 w-[72px] h-[72px] absolute top-0 left-0 right-0 bottom-0 cursor-pointer' accept="image/*" onChange={handleFileChange} />
        {imageBase64
          ? <div
            style={{
              backgroundImage: `url(${imageBase64})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
            className='w-[72px] h-[72px] cursor-pointer' />
          // <Image width={72} height={72} src={imageBase64} className='w-[72px] cursor-pointer' alt="Selected Image" />
          : <Image src={upload} className='w-[18px] h-[18px] cursor-pointer' alt='' />
        }
        {
          imageBase64
          && <div className=' opacity-0 flex flex-col items-center justify-center absolute top-0 left-0 w-[72px] h-[72px] z-20 bg-[rgba(0,0,0,0.6)] cursor-pointer group-hover:opacity-100'>
            <Image src={upload} className='w-[18px] h-[18px] cursor-pointer' alt='' />
            <span className='mt-2 text-[12px] text-white opacity-60'>重新上传</span>
          </div>
        }
      </div>
      <div className='text-[14px] leading-[22px] text-[#9EADB9] ml-[15px]'>
        <div>建议比例1:1， </div>
        <div>支持格式png、jpg、jpeg、webp</div>
      </div>
    </div>
  )
}
