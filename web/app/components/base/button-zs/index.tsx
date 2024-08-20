import type { CSSProperties } from 'react'
import React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import Spinner from '../spinner'
import s from './style.module.css'
import classNames from '@/utils/classnames'

const buttonVariants = cva(
  'btn disabled:btn-disabled',
  {
    variants: {
      variant: {
        'primary': 'btn-primary',
        'warning': 'btn-warning',
        'secondary': 'btn-secondary',
        'secondary-accent': 'btn-secondary-accent',
        'ghost': 'btn-ghost',
        'ghost-accent': 'btn-ghost-accent',
        'tertiary': 'btn-tertiary',
      },
      size: {
        small: 'btn-small',
        medium: 'btn-medium',
        large: 'btn-large',
      },
    },
    defaultVariants: {
      variant: 'secondary',
      size: 'medium',
    },
  },
)

export type ButtonProps = {
  loading?: boolean
  styleCss?: CSSProperties
} & React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, styleCss, children, ...props }, ref) => {
    return (
      <button
        type='button'
        className={classNames(
          'flex flex-row items-center justify-center py-[10px] text-white text-[16px] font-semibold rounded-lg cursor-pointer',
          s.newApp,
          className || '',
        )}
        ref={ref}
        style={styleCss}
        {...props}
      >
        {children}
        {loading && <Spinner loading={loading} className='!text-white !h-3 !w-3 !border-2 !ml-1' />}
      </button>
    )
  },
)
Button.displayName = 'ButtonZS'

export default Button
export { Button, buttonVariants }
