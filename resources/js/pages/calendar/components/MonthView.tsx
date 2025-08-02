import { eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, parseISO, startOfMonth } from 'date-fns'

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
}

export default function MonthView({ timeLogs, date, onTimeLogClick }: MonthViewProps) {
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
        <div className="rounded-lg bg-white shadow">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
                <div className="bg-gray-100 p-2 text-center font-medium">Sun</div>
                <div className="bg-gray-100 p-2 text-center font-medium">Mon</div>
                <div className="bg-gray-100 p-2 text-center font-medium">Tue</div>
                <div className="bg-gray-100 p-2 text-center font-medium">Wed</div>
                <div className="bg-gray-100 p-2 text-center font-medium">Thu</div>
                <div className="bg-gray-100 p-2 text-center font-medium">Fri</div>
                <div className="bg-gray-100 p-2 text-center font-medium">Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200">
                {allDays.map((day, index) => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const isCurrentMonth = isSameMonth(day, currentDate)
                    const isToday = isSameDay(day, new Date())
                    const dayLogs = logsByDate[dateKey] || []

                    return (
                        <div key={index} className={`min-h-[120px] bg-white p-2 ${isCurrentMonth ? '' : 'opacity-40'}`}>
                            <div
                                className={`mb-1 text-sm font-medium ${isToday ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white' : ''} `}
                            >
                                {format(day, 'd')}
                            </div>

                            <div className="max-h-[80px] space-y-1 overflow-y-auto">
                                {dayLogs.slice(0, 3).map((log) => (
                                    <div
                                        key={log.id}
                                        className="cursor-pointer truncate rounded p-1 text-xs"
                                        style={{ backgroundColor: log.project.color + '33' }}
                                        onClick={() => onTimeLogClick(log.id)}
                                    >
                                        {format(parseISO(log.start), 'HH:mm')} - {log.project.name}
                                    </div>
                                ))}

                                {dayLogs.length > 3 && <div className="text-xs text-gray-500">+{dayLogs.length - 3} more</div>}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
