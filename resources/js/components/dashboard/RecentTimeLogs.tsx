import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
        <Card className="overflow-hidden bg-white shadow-sm transition-colors dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Time Logs</CardTitle>
                    {!loading && (
                        <Link
                            href={recentLogs.allLogsLink}
                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            View all
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[280px] overflow-y-auto">
                    {loading ? (
                        <div className="p-4">
                            <Loader message="Loading recent logs..." />
                        </div>
                    ) : recentLogs.entries.length > 0 ? (
                        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                            {recentLogs.entries.map((log: TimeLogEntry, index: number) => (
                                <li key={index} className="dark:hover:bg-gray-750 p-1 transition-colors hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                                <ClockIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{log.user}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {new Date(log.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                            {roundToTwoDecimals(log.hours)} hrs
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                            <ClockIcon className="mb-2 h-10 w-10 opacity-40" />
                            <p className="mb-2 text-sm">No recent time logs found</p>
                            <Link
                                href={route('time-log.create')}
                                className="text-xs font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                                Create your first time log
                            </Link>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
