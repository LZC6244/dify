/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'

type FileUploadProps = {
  onImageChange?: (base64String: string) => void
}
export default function Upload({ onImageChange }: FileUploadProps) {
  const [imageBase64, setImageBase64] = useState<string | null>(null)

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
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imageBase64 && <img src={imageBase64} className='max-w-[80px]' alt="Selected Image" />}
    </div>
  )
}
