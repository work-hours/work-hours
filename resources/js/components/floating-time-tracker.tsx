import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { router } from '@inertiajs/react'
import { Briefcase, ClockIcon, MessageCircle, PauseCircle, PlayCircle, X } from 'lucide-react'
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
    const [selectedProject, setSelectedProject] = useState<number | null>(projects.length > 0 ? projects[0].id : null)
    const [selectedTask, setSelectedTask] = useState<number | null>(null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
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

    // Load active time log from localStorage on the component mount
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

        // Check if the tracker was previously hidden
        const trackerVisible = localStorage.getItem('timeTrackerVisible')
        if (trackerVisible === 'false') {
            setIsVisible(false)
        }
    }, [])

    // Update localStorage and handle timer when activeTimeLog changes
    useEffect(() => {
        if (activeTimeLog) {
            // Save to localStorage
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

    // Save visibility state to localStorage
    useEffect(() => {
        localStorage.setItem('timeTrackerVisible', isVisible.toString())
    }, [isVisible])

    const startTimeLog = () => {
        const project = projects.find((p) => p.id === selectedProject) || null
        const task = selectedTask ? tasks.find((t) => t.id === selectedTask) || null : null

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
        setView('tracking')
        localStorage.setItem('activeTimeLog', JSON.stringify(newTimeLog))
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

    const toggleExpand = () => {
        if (activeTimeLog) {
            setView('note')
        } else {
            setIsExpanded(!isExpanded)
        }
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    // Chat-like bubble when minimized
    if (!isVisible) {
        return (
            <div className="fixed right-4 bottom-4 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                <Button onClick={toggleVisibility} variant="outline" size="icon" className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-red-500/5 border-4 border-red-800/40 shadow-xl shadow-red-500/10 hover:shadow-2xl hover:scale-105 hover:border-red-800/60 transition-all duration-300 rotate-3">
                    <div className="relative flex flex-col items-center justify-center gap-1">
                        <ClockIcon className="h-7 w-7 text-red-800 animate-float" />
                        <span className="text-xs font-bold text-red-800">Time</span>
                    </div>
                </Button>
            </div>
        )
    }

    // Compact floating bubble when tracking is active but not expanded
    if (activeTimeLog && view === 'tracking') {
        return (
            <div className="fixed right-4 bottom-4 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                <div className="flex flex-col items-end gap-2">
                    {activeTimeLog.task_id && (
                        <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-red-800 shadow-md">{activeTimeLog.task_title}</div>
                    )}
                    <Button
                        onClick={toggleExpand}
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-red-500/5 border-4 border-red-800/40 shadow-xl shadow-red-500/10 hover:shadow-2xl hover:scale-105 hover:border-red-800/60 transition-all duration-300 rotate-3"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <div className="absolute inset-0 rounded-full animate-pulse-slow bg-red-500/10 scale-90"></div>
                            <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-800/20"></div>
                            <ClockIcon className="h-7 w-7 text-red-800 animate-float" />
                            <span className="text-xs font-bold text-red-800">
                                {formatElapsedTime(activeTimeLog.elapsed).split(':').slice(0, 2).join(':')}
                            </span>
                        </div>
                    </Button>
                </div>
            </div>
        )
    }

    // Note the input view when tracking is active and the user clicked the bubble
    if (activeTimeLog && view === 'note') {
        return (
            <div className="fixed right-4 bottom-4 z-50 w-full max-w-md">
                <Card className="overflow-hidden rounded-2xl bg-red-500/5 shadow-lg transition-all duration-300 dark:bg-red-500/10">
                    <div className="flex items-center justify-between border-b border-gray-200 bg-red-500/10 p-3 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <ClockIcon className="h-5 w-5 animate-pulse text-red-800" />
                            <span className="font-bold">{formatElapsedTime(activeTimeLog.elapsed)}</span>
                        </div>
                        <Button onClick={() => setView('tracking')} variant="ghost" size="sm" className="h-8 w-8 p-1">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-left text-lg font-bold">
                                    <span>{activeTimeLog.project_name}</span>
                                </CardTitle>
                                {activeTimeLog.task_id && (
                                    <div className="mt-1 text-sm font-medium text-red-800">Task: {activeTimeLog.task_title}</div>
                                )}
                                <CardDescription className="mt-1">
                                    Started at {new Date(activeTimeLog.start_timestamp || '').toLocaleTimeString()}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div>
                                    <Label htmlFor="note" className="mb-1 block text-sm font-bold text-gray-800 dark:text-gray-200">
                                        What did you work on?
                                    </Label>
                                    <Input
                                        id="note"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Enter your note here..."
                                        required
                                        className="w-full"
                                        autoFocus
                                    />
                                </div>
                                <Button
                                    onClick={stopTimeLog}
                                    variant="destructive"
                                    size="lg"
                                    className="mt-2 flex w-full items-center gap-2"
                                    disabled={!note.trim()}
                                >
                                    <PauseCircle className="h-5 w-5" />
                                    <span>Stop Tracking</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Project selection view
    return (
        <div className="fixed right-4 bottom-4 z-50 w-full max-w-md">
            <Card className="overflow-hidden rounded-2xl shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between border-b border-gray-200 bg-blue-500/10 p-3 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5 text-blue-800" />
                        <span className="font-bold">Time Tracker</span>
                    </div>
                    <Button onClick={toggleVisibility} variant="ghost" size="sm" className="h-8 w-8 p-1">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                        <CardDescription className="">Select a project and start tracking your time</CardDescription>
                        <div>
                            <Label htmlFor="tracking_project" className="mb-1 block text-sm font-bold text-gray-800 dark:text-gray-200">
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
                                icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                            />
                        </div>

                        {selectedProject && (
                            <div>
                                <Label htmlFor="tracking_task" className="mb-1 block text-sm font-bold text-gray-800 dark:text-gray-200">
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
                                    <p className="text-xs text-muted-foreground">No tasks assigned to you in this project</p>
                                )}
                            </div>
                        )}
                        <Button
                            onClick={startTimeLog}
                            variant="default"
                            size="lg"
                            className="mt-2 flex w-full items-center gap-2"
                            disabled={selectedProject === null}
                        >
                            <PlayCircle className="h-5 w-5" />
                            <span>Start Tracking</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
