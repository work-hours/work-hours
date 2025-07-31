import { cn } from '@/lib/utils'
import { type HTMLAttributes } from 'react'
import AppLogoIcon from './app-logo-icon'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel'

export default function AppLogo({ className }: HTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <div className="">
                <AppLogoIcon className="size-16 text-sidebar-primary-foreground" />
            </div>
            <div className={cn('ml-2 grid flex-1 text-left', className)}>
                <span className="-ml-4 truncate text-sm leading-tight font-bold tracking-tight">{appName}</span>
                <span className="-ml-4 text-xs">Time Tracking</span>
            </div>
        </>
    )
}
