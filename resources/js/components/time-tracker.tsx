import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { router } from '@inertiajs/react'
import { Briefcase, ClockIcon, PauseCircle, PlayCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type Project = {
    id: number
    name: string
}

type TimeTrackerProps = {
    projects: Project[]
}

export default function TimeTracker({ projects }: TimeTrackerProps) {
    const [selectedProject, setSelectedProject] = useState<number | null>(projects.length > 0 ? projects[0].id : null)

    const [activeTimeLog, setActiveTimeLog] = useState<{
        id: number | null
        project_id: number | null
        project_name: string | null
        start_timestamp: string | null
        elapsed: number
    } | null>(null)

    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null)

    useEffect(() => {
        const savedTimeLog = localStorage.getItem('activeTimeLog')
        if (savedTimeLog) {
            try {
                const parsedTimeLog = JSON.parse(savedTimeLog)
                setActiveTimeLog(parsedTimeLog)
            } catch (e) {
                console.error('Failed to parse saved time log', e)
                localStorage.removeItem('activeTimeLog')
            }
        }
    }, [])

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

    const startTimeLog = () => {
        const project = projects.find((p) => p.id === selectedProject) || null

        const now = new Date().toISOString()
        const newTimeLog = {
            id: null,
            project_id: project?.id || null,
            project_name: project?.name || null,
            start_timestamp: now,
            elapsed: 0,
        }

        setActiveTimeLog(newTimeLog)
        localStorage.setItem('activeTimeLog', JSON.stringify(newTimeLog))
    }

    const stopTimeLog = () => {
        if (!activeTimeLog) return

        router.post(
            route('time-log.store'),
            {
                project_id: activeTimeLog.project_id,
                start_timestamp: activeTimeLog.start_timestamp,
                end_timestamp: new Date().toISOString(),
            },
            {
                onSuccess: () => {
                    setActiveTimeLog(null)
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

    return (
        <>
            {activeTimeLog ? (
                <Card className="overflow-hidden bg-primary/5 transition-all hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-xl text-left">
                                    <ClockIcon className="h-5 w-5 animate-pulse text-primary" />
                                    <span>Time Tracking Active</span>
                                </CardTitle>
                                <CardDescription>
                                    {activeTimeLog.project_name ? `Tracking time for ${activeTimeLog.project_name}` : 'Tracking time'}
                                </CardDescription>
                                <div className="mt-2 text-3xl font-bold text-primary">{formatElapsedTime(activeTimeLog.elapsed)}</div>
                                <div className="text-sm text-muted-foreground">
                                    Started at {new Date(activeTimeLog.start_timestamp || '').toLocaleTimeString()}
                                </div>
                            </div>
                            <div>
                                <Button onClick={stopTimeLog} variant="default" size="lg" className="flex items-center gap-2">
                                    <PauseCircle className="h-5 w-5" />
                                    <span>Stop Tracking</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                                <CardTitle className="text-xl text-left">Quick Time Tracking</CardTitle>
                                <CardDescription>Select a project and start tracking your time</CardDescription>
                            </div>
                            <div className="grid grid-cols-1 gap-2 md:w-1/2">
                                <div>
                                    <Label htmlFor="tracking_project" className="mb-1 block text-sm font-medium">
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
                    </CardContent>
                </Card>
            )}
        </>
    )
}
