import { format, isSameDay, parseISO } from 'date-fns'

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
            height: `${durationInMinutes}px`,
            maxHeight: '60px', // Cap at one hour (if spans multiple hours)
        }
    }

    return (
        <div className="rounded-lg bg-white shadow">
            <div className="border-b p-4 text-center">
                <h2 className="text-xl font-semibold">{format(currentDate, 'EEEE, MMMM d, yyyy')}</h2>
            </div>

            <div className="relative">
                {hours.map((hour) => {
                    const logsForHour = getTimeLogsForHour(hour)

                    return (
                        <div key={hour} className="flex border-b">
                            <div className="w-20 flex-shrink-0 border-r p-2 text-center">
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                            </div>

                            <div className="relative min-h-[60px] flex-1">
                                {logsForHour.map((log, index) => (
                                    <div
                                        key={log.id}
                                        className="absolute right-0 left-0 mx-2 cursor-pointer overflow-hidden rounded p-2"
                                        style={{
                                            ...getTimeLogStyle(log),
                                            backgroundColor: log.project.color + '33',
                                            left: `${index * 20}%`,
                                            width: '80%',
                                            zIndex: index + 1,
                                        }}
                                        onClick={() => onTimeLogClick(log.id)}
                                    >
                                        <div className="font-medium">{log.project.name}</div>
                                        <div>
                                            {format(parseISO(log.start), 'HH:mm')} -{format(parseISO(log.end), 'HH:mm')}({log.duration} hrs)
                                        </div>
                                        {log.task && <div>{log.task.title}</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
