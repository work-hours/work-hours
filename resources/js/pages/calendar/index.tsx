import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MasterLayout from '@/layouts/master-layout'
import { PageProps } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import DayView from './components/DayView'
import LogDetailOffCanvas from './components/LogDetailOffCanvas'
import MonthView from './components/MonthView'
import WeekView from './components/WeekView'

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
    const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false)

    const handleViewChange = (newView: string) => {
        router.get(route('calendar.index'), { view: newView, date }, { preserveState: true })
    }

    const handleDateChange = (newDate: string) => {
        router.get(route('calendar.index'), { view, date: newDate }, { preserveState: true })
    }

    const handleTimeLogClick = (timeLogId: number) => {
        setSelectedTimeLog(timeLogId)
        setIsOffCanvasOpen(true)
    }

    const closeOffCanvas = () => {
        setIsOffCanvasOpen(false)
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
                        <MonthView timeLogs={timeLogs} date={date} onTimeLogClick={handleTimeLogClick} />
                    </TabsContent>

                    <TabsContent value="week">
                        <WeekView timeLogs={timeLogs} date={date} onTimeLogClick={handleTimeLogClick} />
                    </TabsContent>

                    <TabsContent value="day">
                        <DayView timeLogs={timeLogs} date={date} onTimeLogClick={handleTimeLogClick} />
                    </TabsContent>
                </Tabs>
            </div>

            {/* Off-canvas for time log details */}
            <LogDetailOffCanvas timeLogId={selectedTimeLog} isOpen={isOffCanvasOpen} onClose={closeOffCanvas} />
        </MasterLayout>
    )
}
