import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';
import AppLogoIcon from './app-logo-icon';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function AppLogo({ className }: HTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <div className="flex aspect-square size-9 items-center justify-center rounded-md bg-sidebar-primary shadow-sm text-sidebar-primary-foreground transition-all duration-200 hover:shadow-md">
                <AppLogoIcon className="size-6 fill-current text-sidebar-primary-foreground" />
            </div>
            <div className={cn('ml-2 grid flex-1 text-left', className)}>
                <span className="truncate leading-tight font-bold text-sm tracking-tight">{appName}</span>
                <span className="text-xs text-sidebar-foreground/70">Time Tracking</span>
            </div>
        </>
    );
}
