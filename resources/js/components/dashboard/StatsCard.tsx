import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { ReactNode } from 'react'

interface TrendInfo {
    icon: ReactNode
    text: string
    color: string
}

interface StatsCardProps {
    title: string
    icon: ReactNode
    value: string | number
    description?: string
    trend?: TrendInfo
    borderColor?: string
}

export default function StatsCard({ title, icon, value, description, trend }: StatsCardProps) {
    return (
        <Card
            className={
                // Theme-aligned accent using primary color; subtle hover polish
                'overflow-hidden w-full transition-colors border-l-4 [border-left-color:rgba(var(--color-primary),0.65)] dark:[border-left-color:rgba(var(--color-primary),0.55)] hover:shadow-sm'
            }
        >
            <CardContent>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-[10px] tracking-wider font-extrabold uppercase text-foreground/80">
                        {title}
                    </CardTitle>
                    <div className="flex h-6 w-6 items-center justify-center bg-[rgba(var(--color-primary),0.08)] dark:bg-[rgba(var(--color-primary),0.12)]">
                        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
                    </div>
                </div>
                <div className="mt-1 text-xl font-bold tracking-tight text-foreground">{value}</div>
                {description && <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{description}</p>}
                {trend && (
                    <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${trend.color}`}>
                        {trend.icon}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
