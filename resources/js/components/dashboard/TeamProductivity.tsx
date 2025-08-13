import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
        <Card className="overflow-hidden transition-colors hover:shadow-md">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-extrabold tracking-wider text-foreground/80 uppercase">Team Productivity</CardTitle>
                    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[rgba(var(--color-primary),0.08)] dark:bg-[rgba(var(--color-primary),0.12)]">
                        <UsersIcon className="h-3 w-3 text-muted-foreground" />
                    </div>
                </div>
                <CardDescription className="text-[10px] text-muted-foreground">Hours logged by team members</CardDescription>
            </CardHeader>
            <CardContent className="h-48 py-1">
                {teamStats.count > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { name: 'Average', hours: roundToTwoDecimals(teamStats.weeklyAverage) },
                                { name: 'This Week', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.05) },
                                { name: 'Last Week', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.95) },
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={11} />
                            <YAxis axisLine={false} tickLine={false} fontSize={11} />
                            <Tooltip
                                formatter={(value) => [`${value} hours`, 'Hours']}
                                contentStyle={{
                                    borderRadius: '4px',
                                    border: '1px solid var(--color-border)',
                                    backgroundColor: 'var(--color-card)',
                                    color: 'var(--color-card-foreground)',
                                    fontSize: '12px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Bar dataKey="hours" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} barSize={40} animationDuration={750} />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                        <UsersIcon className="mb-2 h-12 w-12 opacity-50" />
                        <p className="text-sm">Add team members to see productivity insights</p>
                        <Link
                            href="/team/create"
                            className="mt-2 border-b border-muted-foreground/40 pb-0.5 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground hover:text-foreground"
                        >
                            Add team members
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
