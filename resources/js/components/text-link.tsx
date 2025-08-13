import { cn } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { ComponentProps } from 'react'

type LinkProps = ComponentProps<typeof Link>

export default function TextLink({ className = '', children, ...props }: LinkProps) {
    return (
        <Link
            className={cn(
                'cursor-pointer text-neutral-700 underline decoration-neutral-300 underline-offset-4 transition-all duration-200 ease-out hover:text-neutral-900 hover:decoration-neutral-500 dark:text-neutral-300 dark:decoration-neutral-600 dark:hover:text-neutral-100 dark:hover:decoration-neutral-400',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    )
}
