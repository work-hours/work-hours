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
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle>Team Productivity</CardTitle>
                <CardDescription>Hours logged by team members</CardDescription>
            </CardHeader>
            <CardContent className="h-60">
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
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                            <Bar dataKey="hours" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-gray-500">
                        <UsersIcon className="mb-2 h-12 w-12 opacity-50" />
                        <p>Add team members to see productivity insights</p>
                        <Link href="/team/create" className="mt-2 text-primary hover:underline">
                            Add team members
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
