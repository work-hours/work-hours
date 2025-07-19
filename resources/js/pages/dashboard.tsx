import HoursDistribution from '@/components/dashboard/HoursDistribution'
import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import StatsCards from '@/components/dashboard/StatsCards'
import TeamProductivity from '@/components/dashboard/TeamProductivity'
import WeeklyTrend from '@/components/dashboard/WeeklyTrend'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import TimeTracker from '@/components/time-tracker'
import Loader from '@/components/ui/loader'
import AppLayout from '@/layouts/app-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { projects, stats } from '@actions/DashboardController'
import { Head } from '@inertiajs/react'
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

interface Project {
    id: number
    name: string
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
    const [userProjects, setUserProjects] = useState<Project[]>([])

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

    const getProjects = async (): Promise<void> => {
        try {
            const response = await projects.data({})
            setUserProjects(response.projects)
        } catch (error: unknown) {
            console.error('Failed to fetch projects:', error)
        }
    }

    useEffect(() => {
        getStats().then()
        getProjects().then()
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
            <div className="mx-auto flex w-10/12 flex-col gap-4 p-4">
                <WelcomeSection />

                {!loading && (
                    <section className="mb-4">
                        <TimeTracker projects={userProjects} />
                    </section>
                )}

                {loading ? (
                    <>
                        <Loader message="Loading dashboard data..." className="h-40" />
                    </>
                ) : (
                    <>
                        <section className="mb-4">
                            <h3 className="mb-2 text-sm font-bold uppercase text-gray-700 font-['Courier_New',monospace]">Metrics Dashboard</h3>
                            <StatsCards teamStats={teamStats} />
                        </section>

                        <section className="mb-4">
                            <h3 className="mb-2 text-sm font-bold uppercase text-gray-700 font-['Courier_New',monospace]">Analytics</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <HoursDistribution hoursData={hoursData} />
                                <WeeklyTrend weeklyData={weeklyData} />
                            </div>
                        </section>

                        <section className="mb-4">
                            <h3 className="mb-2 text-sm font-bold uppercase text-gray-700 font-['Courier_New',monospace]">Activity</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <RecentTimeLogs />
                                <TeamProductivity teamStats={teamStats} />
                            </div>
                        </section>
                    </>
                )}
            </div>
        </AppLayout>
    )
}
