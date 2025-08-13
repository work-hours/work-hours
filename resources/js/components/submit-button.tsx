import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
  idleLabel: string
  loadingLabel: string
  idleIcon?: React.ReactNode
  loadingIcon?: React.ReactNode
}

export default function SubmitButton({
  className,
  loading = false,
  idleLabel,
  loadingLabel,
  idleIcon,
  loadingIcon,
  disabled,
  type,
  ...props
}: SubmitButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Button
      type={type ?? 'submit'}
      disabled={isDisabled}
      className={cn(
        'flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600',
        className,
      )}
      {...props}
    >
      {loading ? loadingIcon : idleIcon}
      {loading ? loadingLabel : idleLabel}
    </Button>
  )
}
