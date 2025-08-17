import HoursDistribution from '@/components/dashboard/HoursDistribution'
import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import StatsCards from '@/components/dashboard/StatsCards'
import DailyTrend from '@/components/dashboard/DailyTrend'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import Loader from '@/components/ui/loader'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { stats } from '@actions/DashboardController'
import { Head } from '@inertiajs/react'
import { BarChart2, Clock, Calendar, CalendarRange, Filter, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import DatePicker from '@/components/ui/date-picker'
import CustomInput from '@/components/ui/custom-input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

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

    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    const getStats = async (params: Record<string, string> = {}): Promise<void> => {
        try {
            setLoading(true)
            const response = await stats.data({ params })
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

                        <section className="relative mb-4 rounded-lg bg-white p-6 dark:bg-gray-800">
                            <div className="mb-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <BarChart2 className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Trend</h3>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex flex-col">
                                            <Label htmlFor="dashboard-start-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">Start Date</Label>
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => setStartDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                isClearable
                                                customInput={
                                                    <CustomInput
                                                        id="dashboard-start-date"
                                                        icon={<Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                        placeholder="Select start date"
                                                        className="h-9 w-44 border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <Label htmlFor="dashboard-end-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">End Date</Label>
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => setEndDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                isClearable
                                                customInput={
                                                    <CustomInput
                                                        id="dashboard-end-date"
                                                        icon={<CalendarRange className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                        placeholder="Select end date"
                                                        className="h-9 w-44 border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                                    />
                                                }
                                            />
                                        </div>
                                        <div className="flex items-end gap-2">
                                            <Button
                                                onClick={() => {
                                                    const params: Record<string, string> = {}
                                                    if (startDate) params['start-date'] = new Date(startDate).toISOString().split('T')[0]
                                                    if (endDate) params['end-date'] = new Date(endDate).toISOString().split('T')[0]
                                                    void getStats(params)
                                                }}
                                                size="sm"
                                                className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                                aria-label="Apply filters"
                                                title="Apply filters"
                                            >
                                                <Filter className="h-4 w-4" />
                                                <span className="sr-only">Apply</span>
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={() => {
                                                    setStartDate(null)
                                                    setEndDate(null)
                                                    void getStats()
                                                }}
                                                size="sm"
                                                className="h-9 w-9"
                                                aria-label="Reset filters"
                                                title="Reset filters"
                                            >
                                                <RotateCcw className="h-4 w-4" />
                                                <span className="sr-only">Reset</span>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <DailyTrend data={teamStats.dailyTrend || []} />
                            </div>
                        </section>

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
