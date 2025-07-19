import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface WeeklyTrendProps {
    weeklyData: Array<{ name: string; hours: number }>
}

export default function WeeklyTrend({ weeklyData }: WeeklyTrendProps) {
    return (
        <Card className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-400 transition-colors">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase">Weekly Trend</CardTitle>
                <CardDescription className="text-[10px] font-['Courier_New',monospace]">Hours logged over the past weeks</CardDescription>
            </CardHeader>
            <CardContent className="h-60 py-1">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                        <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
