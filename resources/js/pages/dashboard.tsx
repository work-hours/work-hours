import HoursDistribution from '@/components/dashboard/HoursDistribution'
import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import StatsCards from '@/components/dashboard/StatsCards'
import TeamProductivity from '@/components/dashboard/TeamProductivity'
import WeeklyTrend from '@/components/dashboard/WeeklyTrend'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import Loader from '@/components/ui/loader'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { stats } from '@actions/DashboardController'
import { Head } from '@inertiajs/react'
import { BarChart2, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TeamStats {
    count: number
    totalHours: number
    unpaidHours: number
    unpaidAmount: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmount: number
    paidAmountsByCurrency: Record<string, number>
    currency: string
    weeklyAverage: number
    clientCount: number
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
]

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [teamStats, setTeamStats] = useState<TeamStats>({
        count: 0,
        totalHours: 0,
        unpaidHours: 0,
        unpaidAmount: 0,
        unpaidAmountsByCurrency: {},
        paidAmount: 0,
        paidAmountsByCurrency: {},
        currency: 'USD',
        weeklyAverage: 0,
        clientCount: 0,
    })

    const getStats = async (): Promise<void> => {
        try {
            setLoading(true)
            const response = await stats.data({})
            setTeamStats(response)
        } catch (error: unknown) {
            console.error('Failed to fetch team stats:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getStats().then()
    }, [])

    const hoursData = [
        { name: 'Unpaid', value: roundToTwoDecimals(teamStats.unpaidHours) },
        { name: 'Paid', value: roundToTwoDecimals(teamStats.totalHours - teamStats.unpaidHours) },
    ]

    const weeklyData = [
        { name: 'Week 1', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.9) },
        { name: 'Week 2', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.1) },
        { name: 'Week 3', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.95) },
        { name: 'Week 4', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.05) },
    ]

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="relative mx-auto flex flex-col gap-6 p-3">
                <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <WelcomeSection />
                </div>

                {loading ? (
                    <div className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <Loader message="Loading dashboard data..." className="h-40" />
                    </div>
                ) : (
                    <>
                        <StatsCards teamStats={teamStats} />

                        <section className="relative mb-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Form-like header */}
                            <div className="mb-2 border-b border-gray-400 pb-2 dark:border-gray-600">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center border border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                                        <BarChart2 className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-gray-200">Analytics</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <HoursDistribution hoursData={hoursData} />
                                <WeeklyTrend weeklyData={weeklyData} />
                            </div>
                        </section>

                        <section className="relative mb-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            {/* Form-like header */}
                            <div className="mb-2 border-b border-gray-400 pb-2 dark:border-gray-600">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-8 w-8 items-center justify-center border border-gray-400 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                                        <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-gray-200">Activity</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                <RecentTimeLogs />
                                <TeamProductivity teamStats={teamStats} />
                            </div>
                        </section>
                    </>
                )}
            </div>
        </MasterLayout>
    )
}
