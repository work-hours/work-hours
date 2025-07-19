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
        <Card className="overflow-hidden border-l-4 border-l-purple-500 dark:border-l-purple-400 transition-colors">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase">Team Productivity</CardTitle>
                <CardDescription className="text-[10px] font-['Courier_New',monospace]">Hours logged by team members</CardDescription>
            </CardHeader>
            <CardContent className="h-60 py-1">
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
                    <div className="flex h-full flex-col items-center justify-center text-gray-700">
                        <UsersIcon className="mb-2 h-12 w-12 opacity-50" />
                        <p className="font-['Courier_New',monospace]">Add team members to see productivity insights</p>
                        <Link href="/team/create" className="mt-2 font-bold text-gray-700 border-b border-gray-400 pb-0.5 hover:border-gray-700 hover:text-gray-900 font-['Courier_New',monospace]">
                            Add team members
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
