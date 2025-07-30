import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-auto shadow-sm',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90 [a&]:hover:shadow-md',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90 [a&]:hover:shadow-md',
                accent:
                    'border-transparent bg-accent text-accent-foreground [a&]:hover:bg-accent/90 [a&]:hover:shadow-md',
                muted:
                    'border-transparent bg-muted text-muted-foreground [a&]:hover:bg-muted/90 [a&]:hover:shadow-md',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 [a&]:hover:shadow-md focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
                outline:
                    'text-foreground border-border [a&]:hover:bg-accent [a&]:hover:text-accent-foreground [a&]:hover:shadow-md',
                success:
                    'border-transparent bg-green-200 text-success-foreground [a&]:hover:bg-success/90 [a&]:hover:shadow-md',
                warning:
                    'border-transparent bg-yellow-200 text-warning-foreground [a&]:hover:bg-warning/90 [a&]:hover:shadow-md',
                'outline-primary':
                    'border-primary/50 text-primary bg-primary/5 [a&]:hover:bg-primary/10 [a&]:hover:shadow-md'
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

function Badge({
                   className,
                   variant,
                   asChild = false,
                   ...props
               }: React.ComponentProps<'span'> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : 'span'

    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
