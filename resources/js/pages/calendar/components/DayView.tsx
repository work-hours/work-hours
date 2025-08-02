import { format, isSameDay, parseISO } from 'date-fns'
import { Clock, Calendar as CalendarIcon, MoreHorizontal, ChevronRight } from 'lucide-react'

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

    // Filter logs for the current day
    const dayLogs = timeLogs.filter((log) => {
        const startDate = parseISO(log.start)
        return isSameDay(startDate, currentDate)
    })

    // Create hours array (from 0 to 23)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // Position time logs on the grid
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

    // Calculate total hours for the day
    const totalHours = dayLogs.reduce((sum, log) => sum + log.duration, 0);

    // Group logs by project for the summary
    const projectSummary = dayLogs.reduce((acc: Record<string, { duration: number; color: string; name: string }>, log) => {
        const projectId = log.project.id.toString();
        if (!acc[projectId]) {
            acc[projectId] = {
                duration: 0,
                color: log.project.color,
                name: log.project.name
            };
        }
        acc[projectId].duration += log.duration;
        return acc;
    }, {});

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Header with date and summary */}
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
                    {format(currentDate, 'EEEE, MMMM d, yyyy')}
                </h2>

                {dayLogs.length > 0 && (
                    <div className="mt-3 bg-gray-50 dark:bg-gray-750 p-3 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Day Summary</h3>
                            <div className="text-sm font-medium flex items-center text-gray-700 dark:text-gray-300">
                                <Clock className="w-4 h-4 mr-1.5" />
                                {totalHours.toFixed(1)} hours
                            </div>
                        </div>

                        <div className="space-y-2">
                            {Object.entries(projectSummary).map(([projectId, { name, color, duration }]) => (
                                <div key={projectId} className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{ backgroundColor: color }}
                                        ></div>
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
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        No time logs recorded for this day
                    </div>
                ) : (
                    <>
                        {hours.map((hour) => {
                            const logsForHour = getTimeLogsForHour(hour)

                            return (
                                <div key={hour} className="flex border-b dark:border-gray-700">
                                    <div className="p-2 text-center w-24 border-r dark:border-gray-700 flex-shrink-0 flex items-center justify-center">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-h-[60px] relative">
                                        {/* Half-hour marker */}
                                        <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-gray-200 dark:border-gray-700"></div>

                                        {logsForHour.map((log, index) => (
                                            <div
                                                key={log.id}
                                                className="absolute rounded-md p-3 overflow-hidden cursor-pointer shadow-sm border border-opacity-20 group transition hover:shadow-md hover:z-10"
                                                style={{
                                                    ...getTimeLogStyle(log),
                                                    left: `${index * 25}%`,
                                                    width: '75%',
                                                    backgroundColor: log.project.color + '15',
                                                    borderColor: log.project.color,
                                                    borderLeftWidth: '4px'
                                                }}
                                                onClick={() => onTimeLogClick(log.id)}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{log.project.name}</div>
                                                    <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                    {format(parseISO(log.start), 'HH:mm')} - {format(parseISO(log.end), 'HH:mm')}
                                                    <span className="mx-1">·</span>
                                                    {log.duration}h
                                                </div>
                                                {log.task && (
                                                    <div className="mt-1 text-sm flex items-center text-gray-600 dark:text-gray-400">
                                                        <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                                                        {log.task.title}
                                                    </div>
                                                )}
                                                {log.note && (
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                        {log.note}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Current time indicator (if viewing today) */}
                        {isSameDay(currentDate, new Date()) && (
                            <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{
                                top: `${new Date().getHours() * 60 + new Date().getMinutes() + 60}px`
                            }}>
                                <div className="h-0.5 w-full bg-red-500"></div>
                                <div className="h-3 w-3 rounded-full bg-red-500 absolute -left-1.5 -top-1.5"></div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
