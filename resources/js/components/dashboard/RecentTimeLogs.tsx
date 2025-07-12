import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Loader from '@/components/ui/loader'
import { roundToTwoDecimals } from '@/lib/utils'
import { recentLogs as _recentLogs } from '@actions/DashboardController'
import { Link } from '@inertiajs/react'
import { ClockIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TimeLogEntry {
    user: string
    date: string
    hours: number
}

interface RecentLogsData {
    entries: TimeLogEntry[]
    allLogsLink: string
}

export default function RecentTimeLogs() {
    const [recentLogs, setRecentLogs] = useState<RecentLogsData>({
        entries: [],
        allLogsLink: '',
    })
    const [loading, setLoading] = useState(true)

    const getRecentLogs = async (): Promise<void> => {
        try {
            setLoading(true)
            const data: RecentLogsData = await _recentLogs.data({})
            setRecentLogs(data)
        } catch (error: unknown) {
            console.error('Failed to fetch recent logs:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getRecentLogs().then()
    }, [])

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Recent Time Logs</CardTitle>
                        <CardDescription>Your team's latest activity</CardDescription>
                    </div>
                    {!loading && (
                        <Link href={recentLogs.allLogsLink} className="text-sm text-primary hover:underline">
                            View all logs
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                        <Loader message="Loading recent logs..." />
                    ) : recentLogs.entries.length > 0 ? (
                        recentLogs.entries.map((log: TimeLogEntry, index: number) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full bg-primary/10 p-1">
                                        <ClockIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {log.user} on{' '}
                                            {new Date(log.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm font-medium">{roundToTwoDecimals(log.hours)} hours</div>
                            </div>
                        ))
                    ) : (
                        <div className="py-4 text-center text-gray-500">
                            <p>No recent time logs found</p>
                            <Link href={route('time-log.create')} className="mt-2 inline-block text-primary hover:underline">
                                Create your first time log
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
