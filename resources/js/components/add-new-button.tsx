import { Link } from '@inertiajs/react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type AddNewButtonProps = React.ComponentProps<typeof Link> & {
    className?: string
}

export default function AddNewButton({ className, children, ...linkProps }: AddNewButtonProps) {
    return (
        <Button
            asChild
            className={cn('flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600', className)}
        >
            <Link {...linkProps}>{children}</Link>
        </Button>
    )
}
