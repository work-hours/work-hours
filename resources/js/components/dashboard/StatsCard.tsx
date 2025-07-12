import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
}

export default function StatsCard({ title, icon, value, description, trend }: StatsCardProps) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
                {trend && (
                    <div className={`mt-1 flex items-center text-xs ${trend.color}`}>
                        {trend.icon}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
