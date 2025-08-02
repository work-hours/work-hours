import { eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, parseISO, startOfMonth } from 'date-fns'
import { Calendar, CalendarDays, Clock } from 'lucide-react'

interface MonthViewProps {
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
    date: string
    onTimeLogClick: (timeLogId: number) => void
    onSwitchToDay: (date: string) => void
}

export default function MonthView({ timeLogs, date, onTimeLogClick, onSwitchToDay }: MonthViewProps) {
    const currentDate = parseISO(date)
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Add days before the start of the month to fill the first week
    const firstDayOfWeek = monthStart.getDay() // 0 = Sunday, 1 = Monday, etc.
    const daysBeforeMonth = []
    for (let i = 0; i < firstDayOfWeek; i++) {
        const prevDate = new Date(monthStart)
        prevDate.setDate(prevDate.getDate() - (firstDayOfWeek - i))
        daysBeforeMonth.push(prevDate)
    }

    // Add days after the end of the month to fill the last week
    const lastDayOfWeek = monthEnd.getDay()
    const daysAfterMonth = []
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
        const nextDate = new Date(monthEnd)
        nextDate.setDate(nextDate.getDate() + i)
        daysAfterMonth.push(nextDate)
    }

    // Combine all days
    const allDays = [...daysBeforeMonth, ...days, ...daysAfterMonth]

    // Group logs by date
    const logsByDate: Record<string, any[]> = {}

    timeLogs.forEach((log) => {
        const startDate = parseISO(log.start)
        const dateKey = format(startDate, 'yyyy-MM-dd')

        if (!logsByDate[dateKey]) {
            logsByDate[dateKey] = []
        }

        logsByDate[dateKey].push(log)
    })

    return (
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Sun</div>
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Mon</div>
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Tue</div>
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Wed</div>
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Thu</div>
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Fri</div>
                <div className="dark:bg-gray-750 bg-gray-100 p-3 text-center font-medium">Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {allDays.map((day, index) => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isToday = isSameDay(day, new Date())
                    const dayLogs = logsByDate[dateKey] || []

                    // Calculate total hours logged for this day
                    const totalHours = dayLogs.reduce((sum, log) => sum + log.duration, 0)
                    const hasLogs = dayLogs.length > 0

                    return (
                        <div
                            key={index}
                            className={`min-h-[140px] bg-white p-3 transition-colors dark:bg-gray-800 ${
                                isCurrentMonth ? '' : 'opacity-40'
                            } ${hasLogs ? 'dark:hover:bg-gray-750 hover:bg-gray-50' : ''}`}
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <div
                                    className={` ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200'} ${isToday ? 'flex h-8 w-8 items-center justify-center rounded-full' : ''} font-semibold`}
                                >
                                    {format(day, 'd')}
                                </div>
                                <div className="flex items-center space-x-2">
                                    {totalHours > 0 && (
                                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                            <Clock className="mr-1 h-3 w-3" />
                                            {totalHours.toFixed(1)}h
                                        </div>
                                    )}
                                    <button
                                        className={`flex cursor-pointer items-center justify-center rounded-md p-1 text-xs transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700 ${isCurrentMonth ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 opacity-60 dark:text-gray-400'}`}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            // Use a more direct approach with window.location
                                            const dayDate = format(day, 'yyyy-MM-dd')
                                            window.location.href = `/calendar?view=day&date=${dayDate}`
                                        }}
                                        title="View day"
                                    >
                                        <CalendarDays className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="max-h-[90px] space-y-1.5 overflow-y-auto">
                                {dayLogs.slice(0, 3).map((log) => (
                                    <div
                                        key={log.id}
                                        className="flex cursor-pointer flex-col rounded-md p-1.5 text-xs transition-opacity hover:opacity-80"
                                        style={{
                                            backgroundColor: log.project.color + '26',
                                            borderLeft: `3px solid ${log.project.color}`,
                                        }}
                                        onClick={() => onTimeLogClick(log.id)}
                                    >
                                        <div className="truncate font-medium">{log.project.name}</div>
                                        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                                            <div className="truncate">{format(parseISO(log.start), 'HH:mm')}</div>
                                            <div className="flex items-center">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {log.duration}h
                                            </div>
                                        </div>
                                        {log.task && (
                                            <div className="mt-0.5 flex items-center truncate text-gray-500 dark:text-gray-400">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                {log.task.title}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {dayLogs.length > 3 && (
                                    <div
                                        className="cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-center text-xs text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                        onClick={() => onTimeLogClick(dayLogs[3].id)}
                                    >
                                        +{dayLogs.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
