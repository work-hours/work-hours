import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type DailyPoint = {
    date: string
    userHours: number
    teamHours: number
}

export default function DailyTrend({ data }: { data: DailyPoint[] }) {
    const tooltipStyle = {
        borderRadius: '4px',
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    } as const

    const tickStyle = { fontSize: 12, fill: 'var(--foreground-muted)' }

    return (
        <Card className="overflow-hidden bg-white shadow-sm transition-colors dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-56 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorTeam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={tickStyle} />
                        <YAxis axisLine={false} tickLine={false} tick={tickStyle} tickFormatter={(value) => `${value}`} />
                        <Tooltip
                            formatter={(value, name) => [`${value} hours`, name === 'userHours' ? 'You' : 'Team']}
                            contentStyle={tooltipStyle}
                            itemStyle={{ color: 'var(--foreground)' }}
                        />
                        <Legend formatter={(value) => (value === 'userHours' ? 'You' : 'Team')} />
                        <Area
                            type="monotone"
                            dataKey="userHours"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fill="url(#colorUser)"
                            activeDot={{ r: 5, strokeWidth: 0 }}
                            animationDuration={750}
                        />
                        <Area
                            type="monotone"
                            dataKey="teamHours"
                            stroke="#10B981"
                            strokeWidth={2}
                            fill="url(#colorTeam)"
                            activeDot={{ r: 5, strokeWidth: 0 }}
                            animationDuration={750}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
