import { Appearance, useAppearance } from '@/hooks/use-appearance'
import { cn } from '@/lib/utils'
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react'
import { HTMLAttributes } from 'react'

export default function AppearanceToggleTab({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { appearance, updateAppearance } = useAppearance()

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ]

    return (
        <div className={cn('inline-flex gap-1.5 rounded-lg bg-muted/50 p-1.5 shadow-inner dark:bg-muted/30', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all duration-200',
                        appearance === value
                            ? 'bg-card text-foreground shadow-sm dark:bg-card dark:text-foreground'
                            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                    )}
                >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{label}</span>
                </button>
            ))}
        </div>
    )
}
