import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { router } from '@inertiajs/react'
import { Briefcase, ClockIcon, MessageCircle, PauseCircle, PlayCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type Project = {
    id: number
    name: string
}

type Task = {
    id: number
    title: string
    project_id: number
}

type FloatingTimeTrackerProps = {
    projects: Project[]
    tasks: Task[]
}

export default function FloatingTimeTracker({ projects, tasks }: FloatingTimeTrackerProps) {
    const [selectedProject, setSelectedProject] = useState<number | null>(null)
    const [selectedTask, setSelectedTask] = useState<number | null>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<'select' | 'tracking' | 'note'>('select')
    const [activeTimeLog, setActiveTimeLog] = useState<{
        id: number | null
        project_id: number | null
        project_name: string | null
        task_id: number | null
        task_title: string | null
        start_timestamp: string | null
        elapsed: number
        note?: string
    } | null>(null)

    const [note, setNote] = useState('')
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const handleOpenTimeTracker = () => {
            setIsOpen(true)
            const savedTimeLog = localStorage.getItem('activeTimeLog')
            if (savedTimeLog) {
                setView('note')
            }
        }

        const handleTaskTimeTrackerStart = (e: Event) => {
            const detail = (e as CustomEvent<{ projectId: number; taskId: number }>).detail
            if (detail) {
                startTimeLog(detail.projectId, detail.taskId)
            }
        }

        window.addEventListener('open-time-tracker', handleOpenTimeTracker)

        window.addEventListener('task-time-tracker-start', handleTaskTimeTrackerStart)

        return () => {
            window.removeEventListener('open-time-tracker', handleOpenTimeTracker)

            window.removeEventListener('task-time-tracker-start', handleTaskTimeTrackerStart)
        }
    }, [])

    useEffect(() => {
        const savedTimeLog = localStorage.getItem('activeTimeLog')
        if (savedTimeLog) {
            try {
                const parsedTimeLog = JSON.parse(savedTimeLog)
                setActiveTimeLog(parsedTimeLog)
                setView('tracking')
            } catch (e) {
                console.error('Failed to parse saved time log', e)
                localStorage.removeItem('activeTimeLog')
            }
        }

        const trackerVisible = localStorage.getItem('timeTrackerVisible')
        if (trackerVisible === 'false') {
            setIsVisible(false)
        }
    }, [])

    useEffect(() => {
        if (activeTimeLog) {
            localStorage.setItem('activeTimeLog', JSON.stringify(activeTimeLog))

            const interval = setInterval(() => {
                setActiveTimeLog((prev) => {
                    if (!prev) return null
                    const startTime = prev.start_timestamp ? new Date(prev.start_timestamp).getTime() : Date.now()
                    const elapsed = (Date.now() - startTime) / 1000 / 60 / 60 // Convert to hours
                    const updatedTimeLog = { ...prev, elapsed }

                    localStorage.setItem('activeTimeLog', JSON.stringify(updatedTimeLog))

                    return updatedTimeLog
                })
            }, 1000)
            setTimerInterval(interval)
            return () => clearInterval(interval)
        } else if (timerInterval) {
            clearInterval(timerInterval)
            setTimerInterval(null)
            localStorage.removeItem('activeTimeLog')
        }
    }, [activeTimeLog])

    useEffect(() => {
        localStorage.setItem('timeTrackerVisible', isVisible.toString())
    }, [isVisible])

    const startTimeLog = (projectId?: number, taskId?: number) => {
        projectId = selectedProject ? selectedProject : projectId
        taskId = selectedTask ? selectedTask : taskId

        const project = projects.find((p) => p.id === projectId) || null
        const task = taskId ? tasks.find((t) => t.id === taskId) || null : null

        const now = new Date().toISOString()
        const newTimeLog = {
            id: null,
            project_id: project?.id || null,
            project_name: project?.name || null,
            task_id: task?.id || null,
            task_title: task?.title || null,
            start_timestamp: now,
            elapsed: 0,
            note: '',
        }

        setActiveTimeLog(newTimeLog)
        setNote('')
        setView('note')
        localStorage.setItem('activeTimeLog', JSON.stringify(newTimeLog))
        window.dispatchEvent(new Event('time-tracker-started'))
    }

    const stopTimeLog = () => {
        if (!activeTimeLog) return

        if (!note.trim()) {
            alert('Please enter a note before stopping time tracking')
            return
        }

        router.post(
            route('time-log.store'),
            {
                project_id: activeTimeLog.project_id,
                task_id: activeTimeLog.task_id,
                start_timestamp: activeTimeLog.start_timestamp,
                end_timestamp: new Date().toISOString(),
                note: note,
            },
            {
                onSuccess: () => {
                    setActiveTimeLog(null)
                    setNote('')
                    setView('select')
                    localStorage.removeItem('activeTimeLog')
                    if (timerInterval) {
                        clearInterval(timerInterval)
                        setTimerInterval(null)
                    }

                    setTimeout(() => {
                        window.dispatchEvent(new Event('time-tracker-stopped'))
                    }, 500)
                },
            },
        )
    }

    const formatElapsedTime = (hours: number): string => {
        const totalSeconds = Math.floor(hours * 60 * 60)
        const h = Math.floor(totalSeconds / 3600)
        const m = Math.floor((totalSeconds % 3600) / 60)
        const s = totalSeconds % 60
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    const handleOpenSheet = () => {
        setIsOpen(true)
    }

    const toggleExpand = () => {
        if (activeTimeLog) {
            setView('note')
            setIsOpen(true)
        }
    }

    if (!isVisible) {
        return (
            <div className="fixed right-4 bottom-4 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                <Button
                    onClick={toggleVisibility}
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-xl border border-neutral-200 bg-white shadow-md transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/70"
                >
                    <div className="relative flex flex-col items-center justify-center gap-1">
                        <ClockIcon className="h-7 w-7 text-neutral-700 dark:text-neutral-300" />
                        <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Time</span>
                    </div>
                </Button>
            </div>
        )
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            {/* Floating button or compact tracking view */}
            <div className="fixed right-4 bottom-4 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                <div className="flex flex-col items-end gap-2">
                    {activeTimeLog && activeTimeLog.task_id && (
                        <div className="hidden rounded-md bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm dark:bg-neutral-800 dark:text-neutral-300">
                            {activeTimeLog.task_title}
                        </div>
                    )}

                    {activeTimeLog ? (
                        <SheetTrigger asChild>
                            <Button
                                onClick={toggleExpand}
                                variant="outline"
                                size="icon"
                                className="hidden h-16 w-16 rounded-xl border border-neutral-200 bg-white shadow-md transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/70"
                            >
                                <div className="relative flex flex-col items-center justify-center gap-1">
                                    <ClockIcon className="h-7 w-7 text-neutral-700 dark:text-neutral-300" />
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                                        {formatElapsedTime(activeTimeLog.elapsed).split(':').slice(0, 2).join(':')}
                                    </span>
                                </div>
                            </Button>
                        </SheetTrigger>
                    ) : (
                        <SheetTrigger asChild>
                            <Button
                                onClick={handleOpenSheet}
                                variant="outline"
                                size="icon"
                                className="hidden h-16 w-16 rounded-xl border border-neutral-200 bg-white shadow-md transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/70"
                            >
                                <div className="relative flex flex-col items-center justify-center gap-1">
                                    <ClockIcon className="h-7 w-7 text-neutral-700 dark:text-neutral-300" />
                                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">Time</span>
                                </div>
                            </Button>
                        </SheetTrigger>
                    )}
                </div>
            </div>

            {/* Sheet content */}
            <SheetContent className="overflow-hidden p-0">
                <SheetHeader className="border-b border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                    <div className="flex items-center">
                        <div className="flex items-center gap-2">
                            {activeTimeLog ? (
                                <>
                                    <ClockIcon className="h-5 w-5 animate-pulse text-neutral-700 dark:text-neutral-300" />
                                    <SheetTitle className="font-medium text-neutral-900 dark:text-neutral-100">{formatElapsedTime(activeTimeLog.elapsed)}</SheetTitle>
                                </>
                            ) : (
                                <>
                                    <MessageCircle className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
                                    <SheetTitle className="font-medium text-neutral-900 dark:text-neutral-100">Time Tracker</SheetTitle>
                                </>
                            )}
                        </div>
                    </div>
                </SheetHeader>

                {/* Conditional content based on state */}
                <div className="p-4">
                    {activeTimeLog && view === 'note' ? (
                        <div className="flex flex-col gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-left text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                    <span>{activeTimeLog.project_name}</span>
                                </CardTitle>
                                {activeTimeLog.task_id && (
                                    <div className="mt-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">Task: {activeTimeLog.task_title}</div>
                                )}
                                <CardDescription className="mt-1 text-neutral-600 dark:text-neutral-400">
                                    Started at {new Date(activeTimeLog.start_timestamp || '').toLocaleTimeString()}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <Label htmlFor="note" className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                        What did you work on?
                                    </Label>
                                    <Input
                                        id="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Enter your note here..."
                                        required
                                        className="w-full border-neutral-200 focus:border-neutral-400 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-neutral-500 dark:focus:ring-neutral-500"
                                        autoFocus
                                    />
                                </div>
                                <Button
                                    onClick={stopTimeLog}
                                    variant="destructive"
                                    size="lg"
                                    className="mt-2 flex w-full items-center gap-2 bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-700/80 dark:hover:bg-red-700"
                                    disabled={!note.trim()}
                                >
                                    <PauseCircle className="h-5 w-5" />
                                    <span>Stop Tracking</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <CardDescription className="text-neutral-600 dark:text-neutral-400">Select a project and start tracking your time</CardDescription>
                            <div>
                                <Label htmlFor="tracking_project" className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                    Project
                                </Label>
                                <SearchableSelect
                                    id="tracking_project"
                                    value={selectedProject?.toString() || ''}
                                    onChange={(value) => {
                                        setSelectedProject(value ? parseInt(value) : null)
                                        setSelectedTask(null) // Reset task when project changes
                                    }}
                                    options={projects}
                                    placeholder="Select project"
                                    icon={<Briefcase className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />}
                                />
                            </div>

                            {selectedProject && (
                                <div>
                                    <Label htmlFor="tracking_task" className="mb-1 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                        Task (Optional)
                                    </Label>
                                    <SearchableSelect
                                        id="tracking_task"
                                        value={selectedTask?.toString() || ''}
                                        onChange={(value) => setSelectedTask(value ? parseInt(value) : null)}
                                        options={tasks
                                            .filter((task) => task.project_id === selectedProject)
                                            .map((task) => ({
                                                id: task.id,
                                                name: task.title,
                                            }))}
                                        placeholder="Select task (optional)"
                                        disabled={!selectedProject}
                                    />
                                    {selectedProject && tasks.filter((task) => task.project_id === selectedProject).length === 0 && (
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">No tasks assigned to you in this project</p>
                                    )}
                                </div>
                            )}
                            <Button
                                onClick={() => startTimeLog()}
                                variant="default"
                                size="lg"
                                className="mt-2 flex w-full items-center gap-2 bg-neutral-900 text-white transition-colors duration-200 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                                disabled={selectedProject === null}
                            >
                                <PlayCircle className="h-5 w-5" />
                                <span>Start Tracking</span>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
