import { eachDayOfInterval, endOfWeek, format, isSameDay, parseISO, startOfWeek } from 'date-fns'
import { Calendar as CalendarIcon, ChevronRight, Clock } from 'lucide-react'

interface WeekViewProps {
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

export default function WeekView({ timeLogs, date, onTimeLogClick }: WeekViewProps) {
    const currentDate = parseISO(date)
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getTimeLogsForCell = (day: Date, hour: number) => {
        return timeLogs.filter((log) => {
            const startTime = parseISO(log.start)

            return isSameDay(startTime, day) && startTime.getHours() === hour
        })
    }

    const getTimeLogStyle = (timeLog: any) => {
        const startTime = parseISO(timeLog.start)
        const startMinutes = startTime.getMinutes()

        return {
            top: `${startMinutes}px`,
            height: `40px`, // Fixed height for better visibility
        }
    }

    return (
        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="min-w-[800px]">
                {/* Header with days */}
                <div className="grid grid-cols-8 border-b dark:border-gray-700">
                    <div className="sticky left-0 z-10 border-r bg-white p-3 text-center font-medium dark:border-gray-700 dark:bg-gray-800">
                        <span className="text-gray-600 dark:text-gray-300">Time</span>
                    </div>
                    {days.map((day, index) => (
                        <div key={index} className="border-r p-3 text-center last:border-r-0 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">{format(day, 'EEE')}</div>
                            <div
                                className={`my-1 text-lg font-medium ${isSameDay(day, new Date()) ? 'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-200'} `}
                            >
                                {format(day, 'd')}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, 'MMM')}</div>
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className="relative">
                    {hours.map((hour) => (
                        <div key={hour} className="grid grid-cols-8 border-b dark:border-gray-700">
                            <div className="sticky left-0 z-10 flex h-[60px] items-center justify-center border-r bg-white p-2 text-center dark:border-gray-700 dark:bg-gray-800">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                </span>
                            </div>

                            {days.map((day, dayIndex) => (
                                <div key={dayIndex} className="relative h-[60px] border-r last:border-r-0 dark:border-gray-700">
                                    {/* Render half-hour marker */}
                                    <div className="absolute top-1/2 right-0 left-0 border-t border-dotted border-gray-200 dark:border-gray-700"></div>

                                    {/* Render time logs for this day and hour */}
                                    {getTimeLogsForCell(day, hour).map((timeLog, logIndex) => {
                                        const style = getTimeLogStyle(timeLog)

                                        return (
                                            <div
                                                key={`${timeLog.id}-${hour}`}
                                                className="border-opacity-20 group absolute right-1 left-1 cursor-pointer overflow-hidden rounded-md border p-1.5 shadow-sm transition-shadow hover:z-20 hover:shadow-md"
                                                style={{
                                                    ...style,
                                                    zIndex: logIndex + 1,
                                                    backgroundColor: timeLog.project.color + '15',
                                                    borderColor: timeLog.project.color,
                                                    borderLeftWidth: '4px',

                                                    left: `${Math.min(5 * logIndex, 40)}%`,
                                                    width: `${Math.max(60 - 5 * logIndex, 40)}%`,
                                                }}
                                                onClick={() => onTimeLogClick(timeLog.id)}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="truncate font-medium text-gray-800 dark:text-gray-200">
                                                        {timeLog.project.name}
                                                    </div>
                                                    <ChevronRight className="h-3 w-3 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                                </div>
                                                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                    <Clock className="mr-1 h-3 w-3 shrink-0" />
                                                    {format(parseISO(timeLog.start), 'HH:mm')}
                                                    <span className="mx-1">·</span>
                                                    {timeLog.duration}h
                                                </div>
                                                {timeLog.task && (
                                                    <div className="mt-0.5 flex items-center truncate text-xs text-gray-600 dark:text-gray-400">
                                                        <CalendarIcon className="mr-1 h-3 w-3 shrink-0" />
                                                        {timeLog.task.title}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Current time indicator */}
                    {days.some((day) => isSameDay(day, new Date())) && (
                        <div
                            className="pointer-events-none absolute right-0 left-0 z-20"
                            style={{
                                top: `${new Date().getHours() * 60 + new Date().getMinutes()}px`,
                            }}
                        >
                            <div className="ml-[12.5%] h-0.5 w-[87.5%] bg-red-500"></div>
                            <div className="absolute -top-1.5 -left-1 ml-[12.5%] h-3 w-3 rounded-full bg-red-500"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
