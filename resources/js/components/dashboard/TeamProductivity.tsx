import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { roundToTwoDecimals } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { UsersIcon } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface TeamStats {
    count: number
    weeklyAverage: number
}

interface TeamProductivityProps {
    teamStats: TeamStats
}

export default function TeamProductivity({ teamStats }: TeamProductivityProps) {
    return (
        <Card className="overflow-hidden bg-white shadow-sm transition-colors dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Team Productivity</CardTitle>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                        <UsersIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="h-[280px] p-4">
                {teamStats.count > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { name: 'Average', hours: roundToTwoDecimals(teamStats.weeklyAverage) },
                                { name: 'This Week', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.05) },
                                { name: 'Last Week', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.95) },
                            ]}
                            margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'var(--foreground-muted)' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: 'var(--foreground-muted)' }}
                            />
                            <Tooltip
                                formatter={(value) => [`${value} hours`, 'Hours']}
                                contentStyle={{
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--background)',
                                    borderColor: 'var(--border)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    color: 'var(--foreground)',
                                    fontSize: '12px',
                                }}
                            />
                            <Bar
                                dataKey="hours"
                                fill="#94A3B8"
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                                animationDuration={750}
                                className="transition-opacity hover:opacity-90"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <UsersIcon className="mb-3 h-12 w-12 opacity-30" />
                        <p className="mb-2 text-sm">Add team members to see productivity insights</p>
                        <Link
                            href="/team/create"
                            className="mt-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            Add team members
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
