import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface WeeklyTrendProps {
    weeklyData: Array<{ name: string; hours: number }>
}

export default function WeeklyTrend({ weeklyData }: WeeklyTrendProps) {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle>Weekly Trend</CardTitle>
                <CardDescription>Hours logged over the past weeks</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
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
