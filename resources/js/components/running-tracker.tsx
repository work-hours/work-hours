import { Button } from '@/components/ui/button'
import { useTimeTracker } from '@/contexts/time-tracker-context'
import { Clock, Pause, Play, Square } from 'lucide-react'
import { useMemo } from 'react'

function formatHMS(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function RunningTracker() {
    const { running, paused, task, elapsedMs, pause, resume, stop } = useTimeTracker()

    const timeStr = useMemo(() => formatHMS(elapsedMs), [elapsedMs])

    if (!running || !task) return null

    return (
        <div className="mx-4 flex max-w-full flex-1 items-center justify-center">
            <div className="flex items-center gap-4 rounded-lg border border-gray-100 bg-white/80 px-5 py-3 shadow-md backdrop-blur-sm transition-all dark:border-gray-800 dark:bg-gray-900/90">
                <div className="flex min-w-0 flex-col">
                    <div className="flex items-start gap-2">
                        <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${paused ? 'animate-pulse bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <div className="text-sm font-medium tracking-tight break-words text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{task.project_name}</span> • <span className="line-clamp-2">{task.title}</span>
                        </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                        <Clock className="h-3.5 w-3.5" />
                        {timeStr}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {paused ? (
                        <Button
                            size="sm"
                            className="rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                            onClick={resume}
                            title="Resume"
                        >
                            <Play className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            className="rounded-full bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:hover:bg-amber-900/50"
                            onClick={pause}
                            title="Pause"
                        >
                            <Pause className="h-4 w-4" />
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="rounded-full bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
                        onClick={stop}
                        title="Stop"
                    >
                        <Square className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
