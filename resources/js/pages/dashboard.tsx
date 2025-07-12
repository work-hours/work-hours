import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import HoursDistribution from '@/components/dashboard/HoursDistribution'
import StatsCards from '@/components/dashboard/StatsCards'
import TeamProductivity from '@/components/dashboard/TeamProductivity'
import WeeklyTrend from '@/components/dashboard/WeeklyTrend'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import AppLayout from '@/layouts/app-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import { stats } from '@actions/DashboardController'

interface TeamStats {
    count: number
    totalHours: number
    unpaidHours: number
    unpaidAmount: number
    currency: string
    weeklyAverage: number
}

interface DashboardProps {
    teamStats: TeamStats
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
]

export default function Dashboard() {
    const [teamStats setTeamStats] = useState<TeamStats>({
        count: 10,
        totalHours: 1200,
        unpaidHours: 300,
        unpaidAmount: 1500,
        currency: 'USD',
        weeklyAverage: 30,
    })

    const getStats = async (): Promise<void> => {
        try {
            const response = await stats.data({})
            setTeamStats(response)
        } catch (error: unknown) {
            console.error('Failed to fetch team stats:', error)
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
            <div className="mx-auto flex w-9/12 flex-col gap-6 p-6">
                <WelcomeSection />
                <StatsCards teamStats={teamStats} />

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <HoursDistribution hoursData={hoursData} />
                    <WeeklyTrend weeklyData={weeklyData} />
                </section>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <RecentTimeLogs />
                    <TeamProductivity teamStats={teamStats} />
                </section>
            </div>
        </AppLayout>
    )
}
