import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useTimeTracker } from '@/contexts/time-tracker-context'
import { Clock, Edit3, Pause, Play, Square } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

function formatHMS(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function RunningTracker() {
    const { running, paused, task, elapsedMs, pause, resume, stop, adjustElapsed, setElapsedExact } = useTimeTracker()

    const timeStr = useMemo(() => formatHMS(elapsedMs), [elapsedMs])

    const [open, setOpen] = useState(false)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        if (open) {
            const totalSec = Math.floor(elapsedMs / 1000)
            const h = Math.floor(totalSec / 3600)
            const m = Math.floor((totalSec % 3600) / 60)
            const s = totalSec % 60
            setHours(h)
            setMinutes(m)
            setSeconds(s)
        }
    }, [open, elapsedMs])

    const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

    const applyQuick = (deltaMinutes: number) => {
        adjustElapsed(deltaMinutes * 60 * 1000)
    }

    const onSave = () => {
        const ms = (clamp(hours, 0, 999) * 3600 + clamp(minutes, 0, 59) * 60 + clamp(seconds, 0, 59)) * 1000
        setElapsedExact(ms)
        setOpen(false)
    }

    if (!running || !task) return null

    return (
        <div className="mx-4 flex max-w-full flex-1 items-center justify-center">
            <div className="flex items-center gap-6 backdrop-blur-sm transition-all dark:border-gray-800 dark:bg-gray-900/90">
                <div className="flex min-w-0 flex-row">
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 flex-shrink-0 rounded-full ${paused ? 'animate-pulse bg-amber-500' : 'bg-emerald-500'}`}></div>
                        <div className="text-xs font-medium tracking-tight break-words text-gray-900 dark:text-gray-50">
                            <span className="font-semibold">{task.project_name}</span> • <span className="line-clamp-1">{task.title}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="icon"
                        className="h-6 w-6 rounded-full bg-gray-50 p-1 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                        onClick={() => applyQuick(-5)}
                        title="Subtract 5 minutes"
                    >
                        -5m
                    </Button>
                    <Button
                        size="icon"
                        className="h-6 w-6 rounded-full bg-gray-50 p-1 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                        onClick={() => applyQuick(5)}
                        title="Add 5 minutes"
                    >
                        +5m
                    </Button>
                    <Button
                        size="icon"
                        className="h-6 w-6 rounded-full bg-gray-50 p-1 text-gray-700 hover:bg-gray-100 dark:bg-gray-900/50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                        onClick={() => setOpen(true)}
                        title="Edit time"
                    >
                        <Edit3 className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <div className="flex items-center gap-3">
                    {paused ? (
                        <Button
                            size="icon"
                            className="h-6 w-6 rounded-full bg-emerald-50 p-1 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                            onClick={resume}
                            title="Resume"
                        >
                            <Play className="h-3.5 w-3.5" />
                        </Button>
                    ) : (
                        <Button
                            size="icon"
                            className="h-6 w-6 rounded-full bg-amber-50 p-1 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:hover:bg-amber-900/50"
                            onClick={pause}
                            title="Pause"
                        >
                            <Pause className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        className="h-6 w-6 rounded-full bg-red-50 p-1 text-red-700 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
                        onClick={stop}
                        title="Stop"
                    >
                        <Square className="h-3.5 w-3.5" />
                    </Button>
                </div>
                <div className="flex items-center gap-2 text-lg font-medium text-blue-600 dark:text-blue-400">
                    <Clock className="h-3 w-3" />
                    {timeStr}
                </div>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Running Timer</DialogTitle>
                        <DialogDescription>Set an exact time or use quick adjustments.</DialogDescription>
                    </DialogHeader>

                    <div className="mt-2 flex items-center gap-3">
                        <div className="flex flex-col items-start w-1/3">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Hours</label>
                            <Input
                                type="number"
                                value={hours}
                                onChange={(e) => setHours(Number(e.target.value))}
                                min={0}
                                max={999}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col items-start w-1/3">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Minutes</label>
                            <Input
                                type="number"
                                value={minutes}
                                onChange={(e) => setMinutes(Number(e.target.value))}
                                min={0}
                                max={59}
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-col items-start w-1/3">
                            <label className="text-xs text-gray-500 dark:text-gray-400">Seconds</label>
                            <Input
                                type="number"
                                value={seconds}
                                onChange={(e) => setSeconds(Number(e.target.value))}
                                min={0}
                                max={59}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2 justify-between">
                        <Button variant="outline" onClick={() => applyQuick(-15)}>-15m</Button>
                        <Button variant="outline" onClick={() => applyQuick(-5)}>-5m</Button>
                        <Button variant="outline" onClick={() => applyQuick(-1)}>-1m</Button>
                        <Button variant="outline" onClick={() => applyQuick(1)}>+1m</Button>
                        <Button variant="outline" onClick={() => applyQuick(5)}>+5m</Button>
                        <Button variant="outline" onClick={() => applyQuick(15)}>+15m</Button>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className={'flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'} onClick={onSave}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
