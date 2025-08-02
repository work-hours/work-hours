import { eachDayOfInterval, endOfMonth, format, isSameDay, isSameMonth, parseISO, startOfMonth } from 'date-fns'
import { Clock, Calendar } from 'lucide-react'

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
    const logsByDate: Record<string, any[]> = {};

    timeLogs.forEach(log => {
        const startDate = parseISO(log.start);
        const dateKey = format(startDate, 'yyyy-MM-dd');

        if (!logsByDate[dateKey]) {
            logsByDate[dateKey] = [];
        }

        logsByDate[dateKey].push(log);
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Sun</div>
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Mon</div>
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Tue</div>
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Wed</div>
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Thu</div>
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Fri</div>
                <div className="bg-gray-100 dark:bg-gray-750 p-3 text-center font-medium">Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {allDays.map((day, index) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isToday = isSameDay(day, new Date());
                    const dayLogs = logsByDate[dateKey] || [];

                    // Calculate total hours logged for this day
                    const totalHours = dayLogs.reduce((sum, log) => sum + log.duration, 0);
                    const hasLogs = dayLogs.length > 0;

                    return (
                        <div
                            key={index}
                            className={`min-h-[140px] p-3 bg-white dark:bg-gray-800 transition-colors ${
                                isCurrentMonth ? '' : 'opacity-40'
                            } ${hasLogs ? 'hover:bg-gray-50 dark:hover:bg-gray-750' : ''}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className={`
                                    ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200'}
                                    ${isToday ? 'rounded-full w-8 h-8 flex items-center justify-center' : ''}
                                    font-semibold
                                `}>
                                    {format(day, 'd')}
                                </div>
                                {totalHours > 0 && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {totalHours.toFixed(1)}h
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 overflow-y-auto max-h-[90px]">
                                {dayLogs.slice(0, 3).map(log => (
                                    <div
                                        key={log.id}
                                        className="text-xs p-1.5 rounded-md cursor-pointer hover:opacity-80 transition-opacity flex flex-col"
                                        style={{
                                            backgroundColor: log.project.color + '26',
                                            borderLeft: `3px solid ${log.project.color}`
                                        }}
                                        onClick={() => onTimeLogClick(log.id)}
                                    >
                                        <div className="font-medium truncate">{log.project.name}</div>
                                        <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                            <div className="truncate">{format(parseISO(log.start), 'HH:mm')}</div>
                                            <div className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {log.duration}h
                                            </div>
                                        </div>
                                        {log.task && (
                                            <div className="truncate text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {log.task.title}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {dayLogs.length > 3 && (
                                    <div
                                        className="text-xs py-1 px-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center"
                                        onClick={() => onTimeLogClick(dayLogs[3].id)}
                                    >
                                        +{dayLogs.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
