import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AddNewButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function AddNewButton({ className, children, ...props }: AddNewButtonProps) {
  return (
    <Button
      className={cn(
        'flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm',
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
