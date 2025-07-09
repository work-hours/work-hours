import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';
import AppLogoIcon from './app-logo-icon';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

export default function AppLogo({ className }: HTMLAttributes<HTMLDivElement>) {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-sidebar-primary-foreground" />
            </div>
            <div className={cn('ml-1 grid flex-1 text-left text-sm', className)}>
                <span className="mb-0.5 truncate leading-tight font-semibold">{appName}</span>
            </div>
        </>
    );
}
