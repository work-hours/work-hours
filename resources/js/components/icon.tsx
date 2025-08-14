import { cn } from '@/lib/utils'
import { type LucideProps } from 'lucide-react'
import { type ComponentType } from 'react'

interface IconProps extends Omit<LucideProps, 'ref'> {
    iconNode: ComponentType<LucideProps>
}

export function Icon({ iconNode: IconComponent, className, ...props }: IconProps) {
    return <IconComponent className={cn('h-4 w-4 text-neutral-700 dark:text-neutral-300', className)} {...props} />
}
