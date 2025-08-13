import { ArrowLeft } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type BackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string
}

export default function BackButton({ className, label = 'Back', onClick, ...props }: BackButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            onClick={onClick ?? (() => window.history.back())}
            className={cn(
                'flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
                className,
            )}
            {...props}
        >
            <ArrowLeft className="h-4 w-4" />
            {label}
        </Button>
    )
}
