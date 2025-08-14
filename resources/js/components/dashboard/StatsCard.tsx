import { Card, CardContent, CardTitle } from '@/components/ui/card'
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
        <Card className="w-full overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</CardTitle>
                    {icon && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                            <div className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400">{icon}</div>
                        </div>
                    )}
                </div>
                <div className="mt-2 flex items-baseline gap-x-2">
                    <span className="text-2xl font-medium text-gray-800 dark:text-gray-100">{value}</span>
                    {description && <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>}
                </div>
                {trend && (
                    <div className={`mt-1 flex items-center gap-1 text-xs ${trend.color}`}>
                        {trend.icon}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
