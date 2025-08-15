import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function WeeklyTrend({ weeklyData }: { weeklyData: Array<{ name: string; hours: number }> }) {
    const tooltipStyle = {
        borderRadius: '4px',
        backgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }

    const tickStyle = { fontSize: 12, fill: 'var(--foreground-muted)' }

    return (
        <Card className="overflow-hidden bg-white shadow-sm transition-colors dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Trend</CardTitle>
            </CardHeader>
            <CardContent className="h-56 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={tickStyle} />
                        <YAxis axisLine={false} tickLine={false} tick={tickStyle} tickFormatter={(value) => `${value}`} />
                        <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} contentStyle={tooltipStyle} itemStyle={{ color: 'var(--foreground)' }} />
                        <Area type="monotone" dataKey="hours" stroke="#64748B" strokeWidth={2} fill="url(#colorHours)" activeDot={{ r: 6, strokeWidth: 0 }} animationDuration={750} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
