import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TimeLogDetailsSheet from '@/components/time-log-details-sheet'
import MasterLayout from '@/layouts/master-layout'
import { PageProps } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useEffect, useState } from 'react'
import DayView from './components/DayView'
import MonthView from './components/MonthView'
import WeekView from './components/WeekView'
import { TimeLogEntry } from '@/components/time-log-table'
import axios from 'axios'

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

    // Update activeView whenever the view prop changes (from URL)
    useEffect(() => {
        setActiveView(view)
    }, [view])

    const handleViewChange = (newView: string) => {
        setActiveView(newView)
        router.get(route('calendar.index'), { view: newView, date }, {
            preserveState: true,
            preserveScroll: true
        })
    }

    const handleDateChange = (newDate: string) => {
        router.get(route('calendar.index'), { view, date: newDate }, {
            preserveState: true,
            preserveScroll: true
        })
    }

    const handleTimeLogClick = (timeLogId: number) => {
        setSelectedTimeLog(timeLogId)

        // Fetch time log details for the sheet
        axios.get(route('calendar.detail', timeLogId))
            .then(response => {
                const data = response.data;

                // Format the data to match TimeLogEntry expected by TimeLogDetailsSheet
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
                };

                setTimeLogDetails(formattedData);
                setIsSheetOpen(true);
            })
            .catch(error => {
                console.error('Error fetching time log details:', error);
            });
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
                            onClick={() => {
                                const today = new Date().toISOString().split('T')[0]
                                handleDateChange(today)
                            }}
                        >
                            Today
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const currentDate = new Date(date)
                                let newDate

                                switch (view) {
                                    case 'month':
                                        newDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                                        break
                                    case 'week':
                                        newDate = new Date(currentDate.setDate(currentDate.getDate() - 7))
                                        break
                                    case 'day':
                                        newDate = new Date(currentDate.setDate(currentDate.getDate() - 1))
                                        break
                                }

                                handleDateChange(newDate.toISOString().split('T')[0])
                            }}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const currentDate = new Date(date)
                                let newDate

                                switch (view) {
                                    case 'month':
                                        newDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                                        break
                                    case 'week':
                                        newDate = new Date(currentDate.setDate(currentDate.getDate() + 7))
                                        break
                                    case 'day':
                                        newDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
                                        break
                                }

                                handleDateChange(newDate.toISOString().split('T')[0])
                            }}
                        >
                            Next
                        </Button>
                    </div>
                </div>

                <Tabs defaultValue={view} onValueChange={handleViewChange}>
                    <TabsList className="mb-4">
                        <TabsTrigger value="month">Month</TabsTrigger>
                        <TabsTrigger value="week">Week</TabsTrigger>
                        <TabsTrigger value="day">Day</TabsTrigger>
                    </TabsList>

                    <TabsContent value="month">
                        <MonthView
                            timeLogs={timeLogs}
                            date={date}
                            onTimeLogClick={handleTimeLogClick}
                            onSwitchToDay={(selectedDate) => {
                                // Switch to day view and update the date
                                router.get(
                                    route('calendar.index'),
                                    { view: 'day', date: selectedDate },
                                    { preserveState: true }
                                )
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
            <TimeLogDetailsSheet
                timeLog={timeLogDetails}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
            />
        </MasterLayout>
    )
}
