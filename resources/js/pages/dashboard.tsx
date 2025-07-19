import HoursDistribution from '@/components/dashboard/HoursDistribution'
import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import StatsCards from '@/components/dashboard/StatsCards'
import TeamProductivity from '@/components/dashboard/TeamProductivity'
import WeeklyTrend from '@/components/dashboard/WeeklyTrend'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import TimeTracker from '@/components/time-tracker'
import Loader from '@/components/ui/loader'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { projects, stats } from '@actions/DashboardController'
import { Head } from '@inertiajs/react'
import { BarChart2, Clock, LayoutGrid } from 'lucide-react'
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
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="relative flex flex-col gap-6 mx-auto">
                <div className="relative border-2 border-gray-300 bg-white p-6">
                    <WelcomeSection />
                </div>

                {!loading && <TimeTracker projects={userProjects} />}

                {loading ? (
                    <div className="relative border-2 border-gray-300 bg-white p-6">
                        <Loader message="Loading dashboard data..." className="h-40" />
                    </div>
                ) : (
                    <>
                        <section className="relative mb-6 border-2 border-gray-300 bg-white p-6">
                            {/* Form-like header */}
                            <div className="mb-4 border-b border-gray-400 pb-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                        <LayoutGrid className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Metrics Dashboard</h3>
                                </div>
                            </div>

                            <StatsCards teamStats={teamStats} />
                        </section>

                        <section className="relative mb-6 border-2 border-gray-300 bg-white p-6">
                            {/* Form-like header */}
                            <div className="mb-4 border-b border-gray-400 pb-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                        <BarChart2 className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Analytics</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <HoursDistribution hoursData={hoursData} />
                                <WeeklyTrend weeklyData={weeklyData} />
                            </div>
                        </section>

                        <section className="relative mb-6 border-2 border-gray-300 bg-white p-6">
                            {/* Form-like header */}
                            <div className="mb-4 border-b border-gray-400 pb-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                        <Clock className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                    </div>
                                    <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Activity</h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
