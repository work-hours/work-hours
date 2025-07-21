import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface HoursDistributionProps {
    hoursData: Array<{ name: string; value: number }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function HoursDistribution({ hoursData }: HoursDistributionProps) {
    return (
        <Card className="overflow-hidden border-l-4 border-l-blue-500 transition-colors dark:border-l-blue-400">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase">Hours Distribution</CardTitle>
                <CardDescription className="text-[10px]">Breakdown of total vs. unpaid hours</CardDescription>
            </CardHeader>
            <CardContent className="h-60 py-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={hoursData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {hoursData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} hours`, '']} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
