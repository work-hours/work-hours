import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface TrendInfo {
    icon: ReactNode
    text: string
    color: string
}

interface StatsCardProps {
    title: string
    icon?: ReactNode
    value: string | number
    description?: string
    trend?: TrendInfo
    borderColor?: string
}

export default function StatsCard({ title, icon, value, description, trend, borderColor = 'primary' }: StatsCardProps) {
    return (
        <Card
            className={cn(
                'overflow-hidden w-full transition-all border-l-4 hover:shadow-md',
                {
                    'border-l-primary': borderColor === 'primary',
                    'border-l-green-500': borderColor === 'green-500',
                    'border-l-blue-500': borderColor === 'blue-500',
                    'border-l-amber-500': borderColor === 'amber-500',
                    'border-l-purple-500': borderColor === 'purple-500',
                    'border-l-red-500': borderColor === 'red-500',
                }
            )}
        >
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] tracking-wider font-extrabold uppercase text-foreground/80">
                        {title}
                    </CardTitle>
                    {icon && (
                        <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[rgba(var(--color-primary),0.08)] dark:bg-[rgba(var(--color-primary),0.12)]">
                            <div className="h-3 w-3 text-muted-foreground">{icon}</div>
                        </div>
                    )}
                </div>
                <div className="flex items-baseline gap-x-2 mt-1">
                    <span className="text-lg font-bold tracking-tight text-foreground">{value}</span>
                    {description && <span className="text-[10px] text-muted-foreground">{description}</span>}
                </div>
                {trend && (
                    <div className={`mt-1 flex items-center gap-1 text-[10px] ${trend.color}`}>
                        {trend.icon}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
