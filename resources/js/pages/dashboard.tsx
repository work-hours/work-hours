import HoursDistribution from '@/components/dashboard/HoursDistribution'
import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import StatsCards from '@/components/dashboard/StatsCards'
import TeamProductivity from '@/components/dashboard/TeamProductivity'
import WeeklyTrend from '@/components/dashboard/WeeklyTrend'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import Loader from '@/components/ui/loader'
import AppLayout from '@/layouts/app-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { stats } from '@actions/DashboardController'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface TeamStats {
    count: number
    totalHours: number
    unpaidHours: number
    unpaidAmount: number
    currency: string
    weeklyAverage: number
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
        currency: 'USD',
        weeklyAverage: 0,
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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-11/12 md:w-10/12 lg:w-9/12 flex-col gap-4 p-4">
                <WelcomeSection />

                {loading ? (
                    <>
                        <Loader message="Loading dashboard data..." className="h-40" />
                    </>
                ) : (
                    <>
                        <StatsCards teamStats={teamStats} />

                        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <HoursDistribution hoursData={hoursData} />
                            <WeeklyTrend weeklyData={weeklyData} />
                        </section>

                        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <RecentTimeLogs />
                            <TeamProductivity teamStats={teamStats} />
                        </section>
                    </>
                )}
            </div>
        </AppLayout>
    )
}
