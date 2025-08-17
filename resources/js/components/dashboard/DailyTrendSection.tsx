import DailyTrend from '@/components/dashboard/DailyTrend'
import { Button } from '@/components/ui/button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import Loader from '@/components/ui/loader'
import { stats } from '@actions/DashboardController'
import { BarChart2, Calendar, CalendarRange, Filter, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

export type DailyPoint = {
    date: string
    userHours: number
    teamHours: number
}

export default function DailyTrendSection() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<DailyPoint[]>([])
    const getDefaultDates = (): { start: Date; end: Date } => {
        const end = new Date()
        const start = new Date(end)
        start.setDate(start.getDate() - 6)
        return { start, end }
    }
    const { start: defaultStartDate, end: defaultEndDate } = getDefaultDates()
    const [startDate, setStartDate] = useState<Date | null>(defaultStartDate)
    const [endDate, setEndDate] = useState<Date | null>(defaultEndDate)

    const fetchTrend = async (params: Record<string, string> = {}): Promise<void> => {
        try {
            setLoading(true)
            const response = await stats.data({ params })
            setData(response.dailyTrend ?? [])
        } catch (e) {
            console.error('Failed to fetch daily trend:', e)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const params: Record<string, string> = {
            'start-date': defaultStartDate.toISOString().split('T')[0],
            'end-date': defaultEndDate.toISOString().split('T')[0],
        }
        fetchTrend(params).then()
    }, [])

    return (
        <section className="relative mb-4 rounded-lg bg-white p-6 dark:bg-gray-800">
            <div className="mb-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <BarChart2 className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Trend</h3>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex flex-col">
                            <Label htmlFor="dashboard-start-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                Start Date
                            </Label>
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
                            <Label htmlFor="dashboard-end-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                End Date
                            </Label>
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
                                    void fetchTrend(params)
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
                                    setStartDate(defaultStartDate)
                                    setEndDate(defaultEndDate)
                                    const params: Record<string, string> = {
                                        'start-date': defaultStartDate.toISOString().split('T')[0],
                                        'end-date': defaultEndDate.toISOString().split('T')[0],
                                    }
                                    void fetchTrend(params)
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

            {loading ? (
                <div className="relative rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <Loader message="Loading trend..." className="h-40" />
                </div>
            ) : (
                <div>
                    <DailyTrend data={data} />
                </div>
            )}
        </section>
    )
}
