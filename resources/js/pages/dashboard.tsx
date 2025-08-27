import DailyTrendSection from '@/components/dashboard/DailyTrendSection'
import HoursDistribution from '@/components/dashboard/HoursDistribution'
import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import StatsCards from '@/components/dashboard/StatsCards'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import Loader from '@/components/ui/loader'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { stats } from '@actions/DashboardController'
import { Head } from '@inertiajs/react'
import { Clock } from 'lucide-react'
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
    dailyTrend: Array<{ date: string; userHours: number; teamHours: number }>
    unbillableHours?: number
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
        dailyTrend: [],
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

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="relative mx-auto flex flex-col gap-4">
                <div className="relative rounded-lg bg-white pl-6 dark:bg-gray-800">
                    <WelcomeSection />
                </div>

                {loading ? (
                    <div className="relative rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <Loader message="Loading dashboard data..." className="h-40" />
                    </div>
                ) : (
                    <>
                        <StatsCards teamStats={teamStats} />

                        <DailyTrendSection />

                        <section className="relative mb-4 rounded-lg bg-white p-6 dark:bg-gray-800">
                            <div className="mb-4">
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <HoursDistribution hoursData={hoursData} />
                                <RecentTimeLogs />
                            </div>
                        </section>
                    </>
                )}
            </div>
        </MasterLayout>
    )
}
