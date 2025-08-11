import { format, isSameDay, parseISO } from 'date-fns'
import { Calendar as CalendarIcon, ChevronRight, Clock } from 'lucide-react'

interface DayViewProps {
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

export default function DayView({ timeLogs, date, onTimeLogClick }: DayViewProps) {
    const currentDate = parseISO(date)

    const dayLogs = timeLogs.filter((log) => {
        const startDate = parseISO(log.start)
        return isSameDay(startDate, currentDate)
    })

    const hours = Array.from({ length: 24 }, (_, i) => i)

    const getTimeLogsForHour = (hour: number) => {
        return dayLogs.filter((log) => {
            const startTime = parseISO(log.start)
            return startTime.getHours() === hour
        })
    }

    const getTimeLogStyle = (timeLog: any) => {
        const startTime = parseISO(timeLog.start)
        const endTime = parseISO(timeLog.end)

        const startMinutes = startTime.getMinutes()
        const startHour = startTime.getHours()
        const endMinutes = endTime.getMinutes()
        const endHour = endTime.getHours()

        const durationInMinutes = (endHour - startHour) * 60 + (endMinutes - startMinutes)

        return {
            top: `${startMinutes}px`,
            height: `${Math.min(durationInMinutes, 60)}px`,
        }
    }

    const totalHours = dayLogs.reduce((sum, log) => sum + log.duration, 0)

    const projectSummary = dayLogs.reduce((acc: Record<string, { duration: number; color: string; name: string }>, log) => {
        const projectId = log.project.id.toString()
        if (!acc[projectId]) {
            acc[projectId] = {
                duration: 0,
                color: log.project.color,
                name: log.project.name,
            }
        }
        acc[projectId].duration += log.duration
        return acc
    }, {})

    return (
        <div className="rounded-lg bg-white shadow dark:bg-gray-800">
            {/* Header with date and summary */}
            <div className="border-b p-4 dark:border-gray-700">
                <h2 className="text-center text-xl font-semibold text-gray-800 dark:text-gray-200">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>

                {dayLogs.length > 0 && (
                    <div className="dark:bg-gray-750 mt-3 rounded-md bg-gray-50 p-3">
                        <div className="mb-2 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Day Summary</h3>
                            <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                <Clock className="mr-1.5 h-4 w-4" />
                                {totalHours.toFixed(1)} hours
                            </div>
                        </div>

                        <div className="space-y-2">
                            {Object.entries(projectSummary).map(([projectId, { name, color, duration }]) => (
                                <div key={projectId} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: color }}></div>
                                        <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{duration.toFixed(1)}h</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Time grid */}
            <div className="relative">
                {dayLogs.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">No time logs recorded for this day</div>
                ) : (
                    <>
                        {hours.map((hour) => {
                            const logsForHour = getTimeLogsForHour(hour)

                            return (
                                <div key={hour} className="flex border-b dark:border-gray-700">
                                    <div className="flex w-24 flex-shrink-0 items-center justify-center border-r p-2 text-center dark:border-gray-700">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                        </span>
                                    </div>

                                    <div className="relative min-h-[60px] flex-1">
                                        {/* Half-hour marker */}
                                        <div className="absolute top-1/2 right-0 left-0 border-t border-dashed border-gray-200 dark:border-gray-700"></div>

                                        {logsForHour.map((log, index) => (
                                            <div
                                                key={log.id}
                                                className="border-opacity-20 group absolute cursor-pointer overflow-hidden rounded-md border p-3 shadow-sm transition hover:z-10 hover:shadow-md"
                                                style={{
                                                    ...getTimeLogStyle(log),
                                                    left: `${index * 25}%`,
                                                    width: '75%',
                                                    backgroundColor: log.project.color + '15',
                                                    borderColor: log.project.color,
                                                    borderLeftWidth: '4px',
                                                }}
                                                onClick={() => onTimeLogClick(log.id)}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{log.project.name}</div>
                                                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100" />
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <Clock className="mr-1.5 h-3.5 w-3.5" />
                                                    {format(parseISO(log.start), 'HH:mm')} - {format(parseISO(log.end), 'HH:mm')}
                                                    <span className="mx-1">·</span>
                                                    {log.duration}h
                                                </div>
                                                {log.task && (
                                                    <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                                                        {log.task.title}
                                                    </div>
                                                )}
                                                {log.note && (
                                                    <div className="mt-1 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">{log.note}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Current time indicator (if viewing today) */}
                        {isSameDay(currentDate, new Date()) && (
                            <div
                                className="pointer-events-none absolute right-0 left-0 z-10"
                                style={{
                                    top: `${new Date().getHours() * 60 + new Date().getMinutes() + 60}px`,
                                }}
                            >
                                <div className="h-0.5 w-full bg-red-500"></div>
                                <div className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-red-500"></div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
