import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'
import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface ActionButtonProps {
    href: string
    title?: string
    icon: LucideIcon
    label?: string
    variant?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success' | 'info'
    size?: 'default' | 'icon'
    className?: string
}

const variantStyles = {
    primary: 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/50 dark:text-neutral-300',
    secondary: 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/50 dark:text-neutral-400',
    warning: 'border-amber-100 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:text-amber-300',
    danger: 'border-red-100 bg-red-50 hover:bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-300',
    success: 'border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-300',
    info: 'border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300',
}

export function ActionButton({ href, title, icon: Icon, label, variant = 'primary', size = 'default', className = '' }: ActionButtonProps) {
    const baseClasses = `transition-all duration-200 shadow-sm ${variantStyles[variant]}`
    const sizeClasses = size === 'icon' ? 'w-7 p-0' : 'px-2 text-xs'

    return (
        <Link href={href}>
            <Button variant="outline" size="xs" className={`${baseClasses} ${sizeClasses} ${className}`} title={title}>
                <Icon className={`h-3.5 w-3.5 ${size === 'default' && label ? 'mr-1.5' : ''}`} />
                {size === 'default' && label && <span className="hidden sm:inline">{label}</span>}
                {size === 'icon' && <span className="sr-only">{title}</span>}
            </Button>
        </Link>
    )
}

interface ExportButtonProps {
    href: string
    label?: string
    className?: string
}

export function ExportButton({ href, label = 'Export', className = '' }: ExportButtonProps) {
    return (
        <a href={href} className="inline-block">
            <Button
                variant="outline"
                size="default"
                className={`flex items-center gap-2 ${variantStyles.success} shadow-sm transition-all duration-200 ${className}`}
            >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <span className="hidden sm:inline">{label}</span>
            </Button>
        </a>
    )
}

export function ActionButtonGroup({ children, className = '' }: { children: ReactNode; className?: string }) {
    return <div className={`flex justify-end gap-1.5 ${className}`}>{children}</div>
}
