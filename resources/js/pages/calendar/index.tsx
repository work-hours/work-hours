import TimeLogDetailsSheet from '@/components/time-log-details-sheet'
import { TimeLogEntry } from '@/components/time-log-table'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MasterLayout from '@/layouts/master-layout'
import { Head, router } from '@inertiajs/react'
import axios from 'axios'
import { endOfWeek, format, startOfWeek } from 'date-fns'
import { CalendarDays, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import DayView from './components/DayView'
import MonthView from './components/MonthView'
import WeekView from './components/WeekView'

interface PageProps {
    auth?: {
        user: {
            id: number
            name: string
            email: string
        }
    }
}

interface CalendarProps extends PageProps {
    timeLogs: Array<{
        id: number
        project: {
            id: number
            name: string
            color: string
        }
        task: {
            id: number
            title: string
        } | null
        start: string
        end: string
        duration: number
        note: string
        status: string
    }>
    view: string
    date: string
    period: {
        start: string
        end: string
    }
}

export default function Calendar({ timeLogs, view = 'month', date, period }: CalendarProps) {
    const [selectedTimeLog, setSelectedTimeLog] = useState<number | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [timeLogDetails, setTimeLogDetails] = useState<TimeLogEntry | null>(null)
    const [activeView, setActiveView] = useState(view)

    useEffect(() => {
        setActiveView(view)
    }, [view])

    const handleViewChange = (newView: string) => {
        setActiveView(newView)
        router.get(
            route('calendar.index'),
            { view: newView, date },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    const handleDateChange = (newDate: string) => {
        router.get(
            route('calendar.index'),
            { view, date: newDate },
            {
                preserveState: true,
                preserveScroll: true,
            },
        )
    }

    const handleTimeLogClick = (timeLogId: number) => {
        setSelectedTimeLog(timeLogId)

        axios
            .get(route('calendar.detail', timeLogId))
            .then((response) => {
                const data = response.data

                const formattedData: TimeLogEntry = {
                    id: data.id,
                    project_name: data.project ? data.project.name : null,
                    project_id: data.project ? data.project.id : undefined,
                    start_timestamp: data.start_timestamp,
                    end_timestamp: data.end_timestamp,
                    duration: data.duration,
                    is_paid: data.is_paid || false,
                    hourly_rate: data.hourly_rate,
                    currency: data.currency,
                    note: data.note || '',
                    status: data.status ? data.status.toLowerCase() : 'pending',
                    user_name: data.user ? data.user.name : undefined,
                    task_title: data.task ? data.task.title : undefined,
                    task_status: data.task ? data.task.status : undefined,
                    task_priority: data.task ? data.task.priority : undefined,
                    task_due_date: data.task ? data.task.due_date : null,
                    task_description: data.task ? data.task.description : null,
                    comment: data.comment || '',
                    approved_by: data.approved_by || undefined,
                    approver_name: data.approver_name || undefined,
                    user_non_monetary: data.user_non_monetary || false,
                    paid_amount: data.paid_amount,
                }

                setTimeLogDetails(formattedData)
                setIsSheetOpen(true)
            })
            .catch((error) => {
                console.error('Error fetching time log details:', error)
            })
    }

    const closeOffCanvas = () => {
        setIsSheetOpen(false)
        setTimeout(() => {
            setSelectedTimeLog(null)
        }, 300) // Wait for animation to complete
    }

    return (
        <MasterLayout>
            <Head title="Calendar" />
            <div className="container p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Calendar</h1>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="dark:hover:bg-gray-750 flex items-center gap-1 bg-white shadow-sm hover:bg-gray-50 dark:bg-gray-800"
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0]
                                handleDateChange(today)
                            }}
                        >
                            <CalendarDays className="h-4 w-4" />
                            Today
                        </Button>
                        <div className="flex rounded-md shadow-sm">
                            <Button
                                variant="outline"
                                size="sm"
                                className="dark:hover:bg-gray-750 rounded-r-none border-r-0 bg-white hover:bg-gray-50 dark:bg-gray-800"
                                onClick={() => {
                                    const currentDate = new Date(date)
                                    let newDate: Date

                                    switch (view) {
                                        case 'month':
                                            newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                                            break
                                        case 'week':
                                            newDate = new Date(currentDate.setDate(currentDate.getDate() - 7))
                                            break
                                        case 'day':
                                        default:
                                            newDate = new Date(currentDate.setDate(currentDate.getDate() - 1))
                                            break
                                    }

                                    handleDateChange(newDate.toISOString().split('T')[0])
                                }}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Previous</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="dark:hover:bg-gray-750 rounded-l-none bg-white hover:bg-gray-50 dark:bg-gray-800"
                                onClick={() => {
                                    const currentDate = new Date(date)
                                    let newDate: Date

                                    switch (view) {
                                        case 'month':
                                            newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                                            break
                                        case 'week':
                                            newDate = new Date(currentDate.setDate(currentDate.getDate() + 7))
                                            break
                                        case 'day':
                                        default:
                                            newDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
                                            break
                                    }

                                    handleDateChange(newDate.toISOString().split('T')[0])
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">Next</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Current Month/Week/Day Display */}
                <div className="mb-4 text-center">
                    <h2 className="text-xl font-semibold">
                        {(() => {
                            const currentDate = new Date(date)

                            switch (view) {
                                case 'month':
                                    return format(currentDate, 'MMMM yyyy')
                                case 'week':
                                    const weekStart = startOfWeek(currentDate)
                                    const weekEnd = endOfWeek(currentDate)
                                    if (format(weekStart, 'MMM') === format(weekEnd, 'MMM')) {
                                        return format(weekStart, 'MMMM yyyy')
                                    } else {
                                        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
                                    }
                                case 'day':
                                    return format(currentDate, 'MMMM d, yyyy')
                                default:
                                    return ''
                            }
                        })()}
                    </h2>
                </div>

                <Tabs defaultValue={view} onValueChange={handleViewChange}>
                    <TabsList className="mb-4 rounded-lg border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <TabsTrigger value="month" className="flex items-center gap-2 px-4 py-2">
                            <CalendarDays className="h-4 w-4" />
                            Month
                        </TabsTrigger>
                        <TabsTrigger value="week" className="flex items-center gap-2 px-4 py-2">
                            <CalendarIcon className="h-4 w-4" />
                            Week
                        </TabsTrigger>
                        <TabsTrigger value="day" className="flex items-center gap-2 px-4 py-2">
                            <CalendarIcon className="h-4 w-4" />
                            Day
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="month">
                        <MonthView
                            timeLogs={timeLogs}
                            date={date}
                            onTimeLogClick={handleTimeLogClick}
                            onSwitchToDay={(selectedDate) => {
                                router.get(route('calendar.index'), { view: 'day', date: selectedDate }, { preserveState: true })
                            }}
                        />
                    </TabsContent>

                    <TabsContent value="week">
                        <WeekView timeLogs={timeLogs} date={date} onTimeLogClick={handleTimeLogClick} />
                    </TabsContent>

                    <TabsContent value="day">
                        <DayView timeLogs={timeLogs} date={date} onTimeLogClick={handleTimeLogClick} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Time log details sheet */}
            <TimeLogDetailsSheet timeLog={timeLogDetails} open={isSheetOpen} onOpenChange={setIsSheetOpen} />
        </MasterLayout>
    )
}
