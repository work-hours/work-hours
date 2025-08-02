import { eachDayOfInterval, endOfWeek, format, isSameDay, parseISO, startOfWeek } from 'date-fns'
import { Clock, Calendar as CalendarIcon, ChevronRight } from 'lucide-react'

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

    // Create hours array (from 0 to 23)
    const hours = Array.from({ length: 24 }, (_, i) => i)

    // Position time logs on the grid
    const getTimeLogPosition = (timeLog: any, day: Date) => {
        const startTime = parseISO(timeLog.start)
        const endTime = parseISO(timeLog.end)

        // Check if the time log is on the current day
        if (!isSameDay(startTime, day)) return null

        const hourStart = startTime.getHours() + startTime.getMinutes() / 60
        const hourEnd = endTime.getHours() + endTime.getMinutes() / 60
        const duration = hourEnd - hourStart

        return {
            top: `${hourStart * 60}px`, // 1 hour = 60px
            height: `${duration * 60}px`,
            timeLog,
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="min-w-[800px] overflow-x-auto">
                {/* Header with days */}
                <div className="grid grid-cols-8 border-b dark:border-gray-700">
                    <div className="p-3 text-center font-medium border-r dark:border-gray-700 sticky left-0 bg-white dark:bg-gray-800 z-10">
                        <span className="text-gray-600 dark:text-gray-300">Time</span>
                    </div>
                    {days.map((day, index) => (
                        <div
                            key={index}
                            className="p-3 text-center border-r dark:border-gray-700 last:border-r-0"
                        >
                            <div className="text-sm text-gray-500 dark:text-gray-400">{format(day, 'EEE')}</div>
                            <div className={`
                                text-lg font-medium my-1
                                ${isSameDay(day, new Date()) ? 'bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : 'text-gray-700 dark:text-gray-200'}
                            `}>
                                {format(day, 'd')}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, 'MMM')}</div>
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className="relative">
                    {hours.map(hour => (
                        <div key={hour} className="grid grid-cols-8 border-b dark:border-gray-700 relative">
                            <div className="p-2 text-center border-r dark:border-gray-700 h-[60px] sticky left-0 bg-white dark:bg-gray-800 z-10 flex items-center justify-center">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                                </span>
                            </div>

                            {days.map((day, dayIndex) => (
                                <div key={dayIndex} className="h-[60px] border-r dark:border-gray-700 last:border-r-0 relative">
                                    {/* Render half-hour marker */}
                                    <div className="absolute top-1/2 left-0 right-0 border-t border-dotted border-gray-200 dark:border-gray-700"></div>

                                    {/* Render time logs for this day and hour */}
                                    {timeLogs
                                        .map(log => getTimeLogPosition(log, day))
                                        .filter(Boolean)
                                        .map((position: any) => {
                                            const { timeLog } = position;
                                            const startHour = parseISO(timeLog.start).getHours();

                                            if (startHour === hour) {
                                                return (
                                                    <div
                                                        key={timeLog.id}
                                                        className="absolute left-0 right-0 mx-1 rounded-md p-1.5 overflow-hidden cursor-pointer text-xs shadow-sm border border-opacity-20 hover:z-20 hover:shadow-md transition-shadow group"
                                                        style={{
                                                            top: position.top,
                                                            height: position.height,
                                                            backgroundColor: timeLog.project.color + '20',
                                                            borderColor: timeLog.project.color,
                                                            borderLeftWidth: '3px'
                                                        }}
                                                        onClick={() => onTimeLogClick(timeLog.id)}
                                                    >
                                                        <div className="font-medium truncate text-gray-800 dark:text-gray-200">{timeLog.project.name}</div>
                                                        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-300">
                                                            <div className="truncate flex items-center">
                                                                <Clock className="h-3 w-3 mr-1 shrink-0" />
                                                                {format(parseISO(timeLog.start), 'HH:mm')} -
                                                                {format(parseISO(timeLog.end), 'HH:mm')}
                                                            </div>
                                                        </div>
                                                        {timeLog.task && (
                                                            <div className="truncate opacity-0 group-hover:opacity-100 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-800 p-1 transition-opacity text-gray-600 dark:text-gray-300 flex items-center text-[10px]">
                                                                <CalendarIcon className="h-3 w-3 mr-1 shrink-0" />
                                                                {timeLog.task.title}
                                                            </div>
                                                        )}
                                                        <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ChevronRight className="h-3 w-3 text-gray-500" />
                                                        </div>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Current time indicator */}
                    {days.some(day => isSameDay(day, new Date())) && (
                        <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{
                            top: `${new Date().getHours() * 60 + new Date().getMinutes()}px`
                        }}>
                            <div className="h-0.5 w-full bg-red-500"></div>
                            <div className="h-3 w-3 rounded-full bg-red-500 absolute -left-1.5 -top-1.5"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
