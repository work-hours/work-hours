import { eachDayOfInterval, endOfWeek, format, isSameDay, parseISO, startOfWeek } from 'date-fns'

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
        <div className="overflow-x-auto rounded-lg bg-white shadow">
            <div className="min-w-[800px]">
                {/* Header with days */}
                <div className="grid grid-cols-8 border-b">
                    <div className="sticky left-0 z-10 border-r bg-white p-2 text-center font-medium">Time</div>
                    {days.map((day, index) => (
                        <div key={index} className="p-2 text-center font-medium">
                            <div className="text-sm">{format(day, 'EEE')}</div>
                            <div
                                className={`text-lg ${isSameDay(day, new Date()) ? 'mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white' : ''} `}
                            >
                                {format(day, 'd')}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Time grid */}
                <div className="relative">
                    {hours.map((hour) => (
                        <div key={hour} className="relative grid grid-cols-8 border-b">
                            <div className="sticky left-0 z-10 h-[60px] border-r bg-white p-2 text-center">
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                            </div>

                            {days.map((day, dayIndex) => (
                                <div key={dayIndex} className="relative h-[60px] border-r">
                                    {/* Render time logs for this day and hour */}
                                    {timeLogs
                                        .map((log) => getTimeLogPosition(log, day))
                                        .filter(Boolean)
                                        .map((position: any) => {
                                            const { timeLog } = position
                                            const startHour = parseISO(timeLog.start).getHours()

                                            if (startHour === hour) {
                                                return (
                                                    <div
                                                        key={timeLog.id}
                                                        className="absolute right-0 left-0 mx-1 cursor-pointer overflow-hidden rounded p-1 text-xs"
                                                        style={{
                                                            top: position.top,
                                                            height: position.height,
                                                            backgroundColor: timeLog.project.color + '33',
                                                        }}
                                                        onClick={() => onTimeLogClick(timeLog.id)}
                                                    >
                                                        <div className="truncate font-medium">{timeLog.project.name}</div>
                                                        <div className="truncate">
                                                            {format(parseISO(timeLog.start), 'HH:mm')} -{format(parseISO(timeLog.end), 'HH:mm')}
                                                        </div>
                                                        {timeLog.task && <div className="truncate">{timeLog.task.title}</div>}
                                                    </div>
                                                )
                                            }
                                            return null
                                        })}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
