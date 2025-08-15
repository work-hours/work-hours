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
    color?: string
}

export default function StatsCard({ title, icon, value, description, trend, borderColor = 'primary', color }: StatsCardProps) {
    return (
        <Card
            className={`group w-full overflow-hidden border-l-[3px] ${color ? `border-l-${color}-500` : 'border-l-primary'} bg-white transition-all duration-200 hover:translate-y-[-1px] hover:shadow-sm dark:bg-gray-800/90`}
        >
            <CardContent className="p-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-medium text-gray-600 dark:text-gray-300">{title}</CardTitle>
                    {icon && (
                        <div className="flex h-2 w-2 items-center justify-center rounded-full bg-gray-100 transition-colors group-hover:bg-gray-200 dark:bg-gray-700 dark:group-hover:bg-gray-600">
                            <div className="mr-8 h-2 w-2 text-gray-600 dark:text-gray-300">{icon}</div>
                        </div>
                    )}
                </div>
                <div className="mt-1 flex items-baseline gap-x-1">
                    <span className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary dark:text-white">{value}</span>
                    {description && <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>}
                </div>
                {trend && (
                    <div className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${trend.color}`}>
                        {trend.icon}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
