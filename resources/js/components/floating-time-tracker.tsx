import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { router } from '@inertiajs/react'
import { Briefcase, ChevronDown, ChevronUp, ClockIcon, PauseCircle, PlayCircle, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Project = {
    id: number
    name: string
}

type FloatingTimeTrackerProps = {
    projects: Project[]
}

export default function FloatingTimeTracker({ projects }: FloatingTimeTrackerProps) {
    const [selectedProject, setSelectedProject] = useState<number | null>(projects.length > 0 ? projects[0].id : null)
    const [isExpanded, setIsExpanded] = useState(false)
    const [isVisible, setIsVisible] = useState(true)

    const [activeTimeLog, setActiveTimeLog] = useState<{
        id: number | null
        project_id: number | null
        project_name: string | null
        start_timestamp: string | null
        elapsed: number
        note?: string
    } | null>(null)

    const [note, setNote] = useState('')
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

    // Load active time log from localStorage on component mount
    useEffect(() => {
        const savedTimeLog = localStorage.getItem('activeTimeLog')
        if (savedTimeLog) {
            try {
                const parsedTimeLog = JSON.parse(savedTimeLog)
                setActiveTimeLog(parsedTimeLog)
                setIsExpanded(true) // Auto-expand if there's an active time log
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

        const now = new Date().toISOString()
        const newTimeLog = {
            id: null,
            project_id: project?.id || null,
            project_name: project?.name || null,
            start_timestamp: now,
            elapsed: 0,
            note: '',
        }

        setActiveTimeLog(newTimeLog)
        setNote('')
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
                start_timestamp: activeTimeLog.start_timestamp,
                end_timestamp: new Date().toISOString(),
                note: note,
            },
            {
                onSuccess: () => {
                    setActiveTimeLog(null)
                    setNote('')
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
        setIsExpanded(!isExpanded)
    }

    const toggleVisibility = () => {
        setIsVisible(!isVisible)
    }

    if (!isVisible) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <Button
                    onClick={toggleVisibility}
                    variant="default"
                    size="sm"
                    className="flex items-center gap-2 rounded-full shadow-lg"
                >
                    <ClockIcon className="h-4 w-4" />
                    <span>Show Time Tracker</span>
                </Button>
            </div>
        )
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
            <Card className={`overflow-hidden transition-all duration-300 shadow-lg ${activeTimeLog ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
                <div className="flex items-center justify-between border-b border-gray-200 p-2 dark:border-gray-700">
                    <Button
                        onClick={toggleExpand}
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 p-1"
                    >
                        <ClockIcon className="h-4 w-4" />
                        <span className="font-['Courier_New',monospace] font-bold">
                            {activeTimeLog ? 'Time Tracking Active' : 'Time Tracker'}
                        </span>
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                    </Button>
                    <Button
                        onClick={toggleVisibility}
                        variant="ghost"
                        size="sm"
                        className="p-1 h-8 w-8"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {isExpanded && (
                    <CardContent className="p-4">
                        {activeTimeLog ? (
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-left font-['Courier_New',monospace] text-xl font-bold uppercase">
                                        <ClockIcon className="h-5 w-5 animate-pulse text-primary" />
                                        <span>Time Tracking</span>
                                    </CardTitle>
                                    <CardDescription className="font-['Courier_New',monospace]">
                                        {activeTimeLog.project_name ? `Tracking time for ${activeTimeLog.project_name}` : 'Tracking time'}
                                    </CardDescription>
                                    <div className="mt-2 font-['Courier_New',monospace] text-3xl font-bold text-primary">
                                        {formatElapsedTime(activeTimeLog.elapsed)}
                                    </div>
                                    <div className="font-['Courier_New',monospace] text-sm text-gray-700 dark:text-gray-300">
                                        Started at {new Date(activeTimeLog.start_timestamp || '').toLocaleTimeString()}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 md:w-1/2">
                                    <div>
                                        <Label
                                            htmlFor="note"
                                            className="mb-1 block font-['Courier_New',monospace] text-sm font-bold text-gray-800 uppercase dark:text-gray-200"
                                        >
                                            Note (required)
                                        </Label>
                                        <Input
                                            id="note"
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="What did you work on?"
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                    <Button
                                        onClick={stopTimeLog}
                                        variant="default"
                                        size="lg"
                                        className="flex w-full items-center gap-2"
                                        disabled={!note.trim()}
                                    >
                                        <PauseCircle className="h-5 w-5" />
                                        <span>Stop Tracking</span>
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                <div>
                                    <CardTitle className="text-left font-['Courier_New',monospace] text-xl font-bold uppercase">
                                        Quick Time Tracking
                                    </CardTitle>
                                    <CardDescription className="font-['Courier_New',monospace]">
                                        Select a project and start tracking your time
                                    </CardDescription>
                                </div>
                                <div className="grid grid-cols-1 gap-2 md:w-1/2">
                                    <div>
                                        <Label
                                            htmlFor="tracking_project"
                                            className="mb-1 block font-['Courier_New',monospace] text-sm font-bold text-gray-800 uppercase dark:text-gray-200"
                                        >
                                            Project
                                        </Label>
                                        <SearchableSelect
                                            id="tracking_project"
                                            value={selectedProject?.toString() || ''}
                                            onChange={(value) => setSelectedProject(value ? parseInt(value) : null)}
                                            options={projects}
                                            placeholder="Select project"
                                            icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                                        />
                                    </div>
                                    <div>
                                        <Button
                                            onClick={startTimeLog}
                                            variant="default"
                                            size="lg"
                                            className="flex w-full items-center gap-2"
                                            disabled={selectedProject === null}
                                        >
                                            <PlayCircle className="h-5 w-5" />
                                            <span>Start Tracking</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>
        </div>
    )
}
