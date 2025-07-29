import { CardDescription, CardTitle } from '@/components/ui/card'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ClockIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SidebarTrackerDisplay({ collapsed }: { collapsed?: boolean }) {
    const [activeTimeLog, setActiveTimeLog] = useState({
        project_name: '',
        task_id: null,
        task_title: '',
        start_timestamp: '',
        elapsed: 0,
    })

    const updateActiveTimeLog = () => {
        const storedTimeLog = localStorage.getItem('activeTimeLog')
        if (storedTimeLog) {
            setActiveTimeLog(JSON.parse(storedTimeLog))
        } else {
            setActiveTimeLog({
                project_name: '',
                task_id: null,
                task_title: '',
                start_timestamp: '',
                elapsed: 0,
            })
        }
    }

    const formatElapsedTime = (hours: number): string => {
        const totalSeconds = Math.floor(hours * 60 * 60)
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    useEffect(() => {
        updateActiveTimeLog()

        setInterval(() => {
            const storedTimeLog = localStorage.getItem('activeTimeLog')
            if (storedTimeLog) {
                const timeLog = JSON.parse(storedTimeLog)
                if (timeLog.start_timestamp) {
                    const startTimestamp = new Date(timeLog.start_timestamp).getTime()
                    const currentTime = Date.now()
                    const elapsed = (currentTime - startTimestamp) / 1000 / 60 / 60 // Convert to hours
                    timeLog.elapsed = elapsed
                    setActiveTimeLog(timeLog)
                }
            }
        }
        , 1000) // Update every second

        window.addEventListener('time-tracker-started', updateActiveTimeLog)
        window.addEventListener('time-tracker-stopped', updateActiveTimeLog)
        return () => {
            window.removeEventListener('time-tracker-started', updateActiveTimeLog)
            window.removeEventListener('time-tracker-stopped', updateActiveTimeLog)
        }
    }, [])

    return (
        <>
            {activeTimeLog.project_name && (
                <div className={`border-t border-gray-400 pt-4 pb-4 dark:border-gray-600 ${collapsed ? '' : 'ml-4'}`}>
                    <div className="mb-4">
                        <h3
                            className={`mb-2 text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-gray-200 ${collapsed ? 'text-center' : ''}`}
                        >
                            {collapsed ? 'Running' : 'Running'}
                        </h3>
                        {collapsed ? (
                            <div className="relative flex flex-col items-center justify-center gap-1">
                                <ClockIcon className="h-7 w-7 text-primary" />
                                <span className="text-xs font-semibold text-primary">
                                    {formatElapsedTime(activeTimeLog.elapsed).split(':').slice(0, 2).join(':')}
                                </span>
                            </div>
                        ) : (
                            <div className="relative flex flex-row items-center justify-start gap-2">
                                <ClockIcon className="h-7 w-7 text-primary" />
                                <span className="text-xs font-semibold text-primary">
                                    {formatElapsedTime(activeTimeLog.elapsed).split(':').slice(0, 2).join(':')}
                                </span>
                            </div>
                        )}

                        {collapsed ? (
                            ''
                        ) : (
                            <TooltipProvider>
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-left text-lg font-bold">
                                        <span>{activeTimeLog.project_name}</span>
                                    </CardTitle>
                                    {activeTimeLog.task_id && <div className="mt-1 text-sm font-medium text-primary">{activeTimeLog.task_title}</div>}
                                    <CardDescription className="mt-1">
                                        Started at {new Date(activeTimeLog.start_timestamp || '').toLocaleTimeString()}
                                    </CardDescription>
                                </div>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
