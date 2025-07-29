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

export default function StatsCard({ title, icon, value, description, trend, borderColor = 'blue-500' }: StatsCardProps) {
    return (
        <Card
            className={`overflow-hidden border-l-4 border-l-${borderColor} dark:border-l-${borderColor.replace('-500', '-400')} w-full transition-colors`}
        >
            <CardContent className="">
                <div className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-bold uppercase">{title}</CardTitle>
                    <div className="h-3 w-3 text-gray-700">{icon}</div>
                </div>
                <div className="text-lg font-bold">{value}</div>
                {description && <p className="text-[10px] text-gray-700">{description}</p>}
                {trend && (
                    <div className={`flex items-center text-[10px] ${trend.color} `}>
                        {trend.icon}
                        <span>{trend.text}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
