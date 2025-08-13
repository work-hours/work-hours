import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type FilterButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'apply' | 'clear'
}

export default function FilterButton({
  className,
  children,
  variant = 'apply',
  type,
  ...props
}: FilterButtonProps) {
  const base = 'flex h-10 w-10 items-center justify-center rounded-md p-0'
  const applyStyles =
    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
  const clearStyles =
    'border border-gray-300 dark:border-gray-600 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer'

  const variantClass = variant === 'apply' ? applyStyles : clearStyles

  const defaultType: 'submit' | 'button' = variant === 'apply' ? 'submit' : 'button'

  return (
    <Button
      type={type ?? defaultType}
      className={cn(base, variantClass, className)}
      {...props}
    >
      {children}
    </Button>
  )
}
