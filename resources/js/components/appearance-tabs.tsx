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
        <div className={cn('inline-flex gap-1.5 rounded-lg bg-neutral-100 p-1.5 shadow-inner dark:bg-neutral-800/50', className)} {...props}>
            {tabs.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => updateAppearance(value)}
                    className={cn(
                        'flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-all duration-200',
                        appearance === value
                            ? 'bg-white text-neutral-800 shadow-sm dark:bg-neutral-700 dark:text-neutral-200'
                            : 'text-neutral-500 hover:bg-neutral-200/80 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700/80 dark:hover:text-neutral-300',
                    )}
                >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{label}</span>
                </button>
            ))}
        </div>
    )
}
