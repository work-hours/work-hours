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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-10/12 flex-col gap-6 p-4 relative">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-100 -z-10"></div>

                {/* Horizontal lines like a timesheet */}
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem] -z-10" aria-hidden="true"></div>

                {/* Vertical lines like a timesheet */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%] -z-10" aria-hidden="true"></div>
                {/* Welcome Section with paper styling */}
                <div className="relative border-2 border-gray-300 bg-white p-6">
                    {/* Corner fold effect */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>
                    <WelcomeSection />
                </div>

                {!loading && (
                    <section className="mb-4 relative border-2 border-gray-300 bg-white p-6">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>
                        <TimeTracker projects={userProjects} />
                    </section>
                )}

                {loading ? (
                    <div className="relative border-2 border-gray-300 bg-white p-6">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>
                        <Loader message="Loading dashboard data..." className="h-40" />
                    </div>
                ) : (
                    <>
                        <section className="mb-6 relative border-2 border-gray-300 bg-white p-6">
                            {/* Corner fold effect */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                            {/* Form-like header */}
                            <div className="border-b border-gray-400 pb-4 mb-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                        <LayoutGrid className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                        Metrics Dashboard
                                    </h3>
                                </div>
                            </div>

                            <StatsCards teamStats={teamStats} />
                        </section>

                        <section className="mb-6 relative border-2 border-gray-300 bg-white p-6">
                            {/* Corner fold effect */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                            {/* Form-like header */}
                            <div className="border-b border-gray-400 pb-4 mb-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                        <BarChart2 className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                        Analytics
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <HoursDistribution hoursData={hoursData} />
                                <WeeklyTrend weeklyData={weeklyData} />
                            </div>
                        </section>

                        <section className="mb-6 relative border-2 border-gray-300 bg-white p-6">
                            {/* Corner fold effect */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                            {/* Form-like header */}
                            <div className="border-b border-gray-400 pb-4 mb-4">
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                        <Clock className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                        Activity
                                    </h3>
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
        </AppLayout>
    )
}
