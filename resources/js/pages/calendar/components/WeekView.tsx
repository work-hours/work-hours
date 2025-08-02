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

    // Position time logs on the grid - only get logs that start in the current hour
    const getTimeLogsForCell = (day: Date, hour: number) => {
        return timeLogs.filter(log => {
            const startTime = parseISO(log.start);

            // Check if the log is on this day and starts in this hour
            return isSameDay(startTime, day) && startTime.getHours() === hour;
        });
    }

    // Calculate position for a time log within an hour cell
    const getTimeLogStyle = (timeLog: any) => {
        const startTime = parseISO(timeLog.start);
        const startMinutes = startTime.getMinutes();

        return {
            top: `${startMinutes}px`,
            height: `40px`, // Fixed height for better visibility
        };
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <div className="min-w-[800px]">
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
                        <div key={hour} className="grid grid-cols-8 border-b dark:border-gray-700">
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
                                    {getTimeLogsForCell(day, hour).map((timeLog, logIndex) => {
                                        const style = getTimeLogStyle(timeLog);

                                        return (
                                            <div
                                                key={`${timeLog.id}-${hour}`}
                                                className="absolute left-1 right-1 rounded-md p-1.5 overflow-hidden cursor-pointer shadow-sm border border-opacity-20 hover:z-20 hover:shadow-md transition-shadow group"
                                                style={{
                                                    ...style,
                                                    zIndex: logIndex + 1,
                                                    backgroundColor: timeLog.project.color + '15',
                                                    borderColor: timeLog.project.color,
                                                    borderLeftWidth: '4px',
                                                    // Add a slight offset based on index to avoid complete overlap
                                                    left: `${Math.min(5 * logIndex, 40)}%`,
                                                    width: `${Math.max(60 - (5 * logIndex), 40)}%`,
                                                }}
                                                onClick={() => onTimeLogClick(timeLog.id)}
                                            >
                                                <div className="flex justify-between">
                                                    <div className="font-medium truncate text-gray-800 dark:text-gray-200">{timeLog.project.name}</div>
                                                    <ChevronRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                                                    <Clock className="h-3 w-3 mr-1 shrink-0" />
                                                    {format(parseISO(timeLog.start), 'HH:mm')}
                                                    <span className="mx-1">·</span>
                                                    {timeLog.duration}h
                                                </div>
                                                {timeLog.task && (
                                                    <div className="mt-0.5 truncate text-gray-600 dark:text-gray-400 flex items-center text-xs">
                                                        <CalendarIcon className="h-3 w-3 mr-1 shrink-0" />
                                                        {timeLog.task.title}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Current time indicator */}
                    {days.some(day => isSameDay(day, new Date())) && (
                        <div className="absolute left-0 right-0 z-20 pointer-events-none" style={{
                            top: `${(new Date().getHours() * 60) + new Date().getMinutes()}px`
                        }}>
                            <div className="ml-[12.5%] h-0.5 w-[87.5%] bg-red-500"></div>
                            <div className="ml-[12.5%] h-3 w-3 rounded-full bg-red-500 absolute -left-1 -top-1.5"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
