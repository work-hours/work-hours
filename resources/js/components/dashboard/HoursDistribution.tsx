import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

interface HoursDistributionProps {
    hoursData: Array<{ name: string; value: number }>
}

// Soft, muted colors that work well with both light and dark modes
const COLORS = ['#94A3B8', '#64748B', '#475569', '#334155']

export default function HoursDistribution({ hoursData }: HoursDistributionProps) {
    return (
        <Card className="overflow-hidden bg-white shadow-sm transition-colors dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Hours Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-56 p-4">
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
                            animationDuration={750}
                            animationEasing="ease-out"
                        >
                            {hoursData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    className="transition-opacity hover:opacity-80"
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value) => [`${value} hours`, '']}
                            contentStyle={{
                                borderRadius: '4px',
                                backgroundColor: 'var(--background)',
                                borderColor: 'var(--border)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                            itemStyle={{ color: 'var(--foreground)' }}
                        />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
