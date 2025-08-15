import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTimeTracker } from '@/contexts/time-tracker-context'
import type { Project as ProjectType, Task as TaskType } from '@/pages/task/types'
import type { SharedData } from '@/types'
import { projects as _projects, tasks as _tasks } from '@actions/DashboardController'
import { usePage } from '@inertiajs/react'
import { Play } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

interface QuickTrackModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function QuickTrackModal({ open, onOpenChange }: QuickTrackModalProps) {
    const { start, running } = useTimeTracker()

    const page = usePage<SharedData>()
    const currentUserId = page.props.auth?.user?.id

    const [loading, setLoading] = useState(false)
    const [projects, setProjects] = useState<ProjectType[]>([])
    const [tasks, setTasks] = useState<TaskType[]>([])
    const [projectId, setProjectId] = useState<string>('')

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const [pRes, tRes] = await Promise.all([_projects.data({ params: {} }), _tasks.data({ params: {} })])
                setProjects(pRes.projects || [])
                setTasks(tRes.tasks || [])
            } catch (e) {
                console.error('Failed to load quick track data', e)
            } finally {
                setLoading(false)
            }
        }
        if (open) {
            void load()
        }
    }, [open])

    useEffect(() => {
        if (!open) {
            setProjectId('')
        }
    }, [open])

    const filteredTasks = useMemo(() => {
        const pid = Number(projectId)
        if (!pid) return []

        return tasks.filter((t) => {
            if (t.project_id !== pid) return false
            if (!Array.isArray(t.assignees)) return true
            return t.assignees.some((u) => u.id === currentUserId)
        })
    }, [projectId, tasks, currentUserId])

    const selectedProject = useMemo(() => {
        const pid = Number(projectId)
        return projects.find((p) => p.id === pid) || null
    }, [projectId, projects])

    const handlePlay = (task: TaskType) => {
        if (running) {
            toast.info('Tracker in session')
            return
        }
        start({
            id: task.id,
            title: task.title,
            project_id: task.project_id,
            project_name: task.project?.name ?? selectedProject?.name ?? 'Project',
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-neutral-200 bg-white sm:max-w-3xl md:max-w-4xl dark:border-neutral-700 dark:bg-neutral-800">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <DialogTitle>Quick Track</DialogTitle>
                            <DialogDescription>Select a project to quickly start tracking one of your assigned tasks.</DialogDescription>
                        </div>
                        <div className="mr-12 hidden items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[10px] font-medium text-neutral-600 sm:flex dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-300">
                            <kbd className="rounded bg-white/70 px-1 py-[1px] shadow-sm dark:bg-neutral-700/60">Ctrl</kbd>
                            <span>+</span>
                            <kbd className="rounded bg-white/70 px-1 py-[1px] shadow-sm dark:bg-neutral-700/60">Shift</kbd>
                            <span>+</span>
                            <kbd className="rounded bg-white/70 px-1 py-[1px] shadow-sm dark:bg-neutral-700/60">T</kbd>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Project</label>
                        <Select value={projectId} onValueChange={(v) => setProjectId(v)} disabled={loading}>
                            <SelectTrigger>
                                <SelectValue placeholder={loading ? 'Loading projects…' : 'Select project'} />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((p) => (
                                    <SelectItem key={p.id} value={String(p.id)}>
                                        {p.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {projectId && (
                        <div>
                            <div className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">Your Tasks</div>
                            {loading ? (
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">Loading tasks…</div>
                            ) : filteredTasks.length === 0 ? (
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">No assigned tasks in this project.</div>
                            ) : (
                                <ul className="divide-y divide-neutral-200 rounded-md border border-neutral-200 dark:divide-neutral-700 dark:border-neutral-700">
                                    {filteredTasks.map((t) => (
                                        <li key={t.id} className="flex items-center justify-between gap-3 px-3 py-2">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm font-medium text-neutral-800 dark:text-neutral-200">{t.title}</div>
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                                    {selectedProject?.name || t.project?.name}
                                                </div>
                                            </div>
                                            <Button size="sm" className="gap-2" disabled={running} onClick={() => handlePlay(t)}>
                                                <Play className="h-4 w-4" /> Start
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="secondary" onClick={() => onOpenChange(false)} className="border-neutral-200 dark:border-neutral-700">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
