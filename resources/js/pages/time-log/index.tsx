import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { Briefcase, Calendar, CalendarIcon, CalendarRange, CheckCircle, ClockIcon, Download, PauseCircle, PlayCircle, PlusCircle, Search, TimerReset } from 'lucide-react'
import { ChangeEvent, FormEventHandler, forwardRef, ReactNode, useEffect, useState } from 'react'

interface CustomInputProps {
    value?: string
    onClick?: () => void
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    icon: ReactNode
    placeholder?: string
    disabled?: boolean
    required?: boolean
    autoFocus?: boolean
    tabIndex?: number
    id: string
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick, onChange, icon, placeholder, disabled, required, autoFocus, tabIndex, id }, ref) => (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{icon}</div>
            <Input
                id={id}
                ref={ref}
                value={value}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                className="pl-10"
                readOnly={!onChange}
            />
        </div>
    ),
)

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
]

type TimeLog = {
    id: number
    project_id: number
    project_name: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    is_paid: boolean
}

type Filters = {
    start_date: string
    end_date: string
    project_id: string
    is_paid: string
}

type Project = {
    id: number
    name: string
}

type Props = {
    timeLogs: TimeLog[]
    filters: Filters
    projects: Project[]
    totalDuration: number
    unpaidHours: number
    unpaidAmount: number
    currency: string
    weeklyAverage: number
}

export default function TimeLog({ timeLogs, filters, projects, totalDuration, unpaidHours, unpaidAmount, currency, weeklyAverage }: Props) {
    const { data, setData, get, processing } = useForm<Filters>({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        project_id: filters.project_id || '',
        is_paid: filters.is_paid || '',
    })

    const [selectedProject, setSelectedProject] = useState<number | null>(projects.length > 0 ? projects[0].id : null)

    const [selectedLogs, setSelectedLogs] = useState<number[]>([])

    const [activeTimeLog, setActiveTimeLog] = useState<{
        id: number | null;
        project_id: number | null;
        project_name: string | null;
        start_timestamp: string | null;
        elapsed: number;
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
        const project = projects.find(p => p.id === selectedProject) || null

        const now = new Date().toISOString()
        const newTimeLog = {
            id: null,
            project_id: project?.id || null,
            project_name: project?.name || null,
            start_timestamp: now,
            elapsed: 0
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

    const handleSelectLog = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedLogs([...selectedLogs, id])
        } else {
            setSelectedLogs(selectedLogs.filter((logId) => logId !== id))
        }
    }

    const markAsPaid = () => {
        if (selectedLogs.length === 0) {
            return
        }

        router.post(
            route('time-log.mark-as-paid'),
            {
                time_log_ids: selectedLogs,
            },
            {
                onSuccess: () => {
                    setSelectedLogs([])
                },
            },
        )
    }

    const startDate = data.start_date ? new Date(data.start_date) : null
    const endDate = data.end_date ? new Date(data.end_date) : null

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setData('start_date', date.toISOString().split('T')[0])
        } else {
            setData('start_date', '')
        }
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setData('end_date', date.toISOString().split('T')[0])
        } else {
            setData('end_date', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        get(route('time-log.index'), {
            preserveState: true,
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Log" />
            <div className="mx-auto flex w-9/12 flex-col gap-6 p-6">
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Time Logs</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage your work hours</p>
                </section>

                {timeLogs.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{totalDuration}</div>
                                <p className="text-xs text-muted-foreground">
                                    {data.start_date && data.end_date
                                        ? `Hours logged from ${data.start_date} to ${data.end_date}`
                                        : data.start_date
                                          ? `Hours logged from ${data.start_date}`
                                          : data.end_date
                                            ? `Hours logged until ${data.end_date}`
                                            : 'Total hours logged'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Unpaid Hours</CardTitle>
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{unpaidHours}</div>
                                <p className="text-xs text-muted-foreground">Hours pending payment</p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                        <path d="M12 18V6" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-bold">
                                    {currency} {unpaidAmount}
                                </div>
                                <p className="text-xs text-muted-foreground">Amount pending payment</p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{weeklyAverage}</div>
                                <p className="text-xs text-muted-foreground">Hours per week</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-6">
                            <div className="grid gap-1">
                                <Label htmlFor="start_date" className="text-xs font-medium">
                                    Start Date
                                </Label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    disabled={processing}
                                    customInput={
                                        <CustomInput
                                            id="start_date"
                                            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                                            disabled={processing}
                                            placeholder="Select start date"
                                        />
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="end_date" className="text-xs font-medium">
                                    End Date
                                </Label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    disabled={processing}
                                    customInput={
                                        <CustomInput
                                            id="end_date"
                                            icon={<CalendarRange className="h-4 w-4 text-muted-foreground" />}
                                            disabled={processing}
                                            placeholder="Select end date"
                                        />
                                    }
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="project_id" className="text-xs font-medium">
                                    Project
                                </Label>
                                <SearchableSelect
                                    id="project_id"
                                    value={data.project_id}
                                    onChange={(value) => setData('project_id', value)}
                                    options={[{ id: '', name: 'All Projects' }, ...projects]}
                                    placeholder="Select project"
                                    disabled={processing}
                                    icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="is_paid" className="text-xs font-medium">
                                    Payment Status
                                </Label>
                                <SearchableSelect
                                    id="is_paid"
                                    value={data.is_paid}
                                    onChange={(value) => setData('is_paid', value)}
                                    options={[
                                        { id: '', name: 'All Statuses' },
                                        { id: 'true', name: 'Paid' },
                                        { id: 'false', name: 'Unpaid' },
                                    ]}
                                    placeholder="Select status"
                                    disabled={processing}
                                    icon={<CheckCircle className="h-4 w-4 text-muted-foreground" />}
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <Button type="submit" disabled={processing} className="flex h-9 items-center gap-1 px-3">
                                    <Search className="h-3.5 w-3.5" />
                                    <span>Filter</span>
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={processing || (!data.start_date && !data.end_date && !data.project_id && !data.is_paid)}
                                    onClick={() => {
                                        setData({
                                            start_date: '',
                                            end_date: '',
                                            project_id: '',
                                            is_paid: '',
                                        })
                                        get(route('time-log.index'), {
                                            preserveState: true,
                                        })
                                    }}
                                    className="flex h-9 items-center gap-1 px-3"
                                >
                                    <TimerReset className="h-3.5 w-3.5" />
                                    <span>Clear</span>
                                </Button>
                            </div>
                        </form>

                        <p className={'mt-4 text-sm text-muted-foreground'}>
                            {(data.start_date || data.end_date || data.project_id) && (
                                <CardDescription>
                                    {(() => {
                                        let description = ''

                                        if (data.start_date && data.end_date) {
                                            description = `Showing logs from ${data.start_date} to ${data.end_date}`
                                        } else if (data.start_date) {
                                            description = `Showing logs from ${data.start_date}`
                                        } else if (data.end_date) {
                                            description = `Showing logs until ${data.end_date}`
                                        }

                                        if (data.project_id) {
                                            const selectedProject = projects.find((project) => project.id.toString() === data.project_id)
                                            const projectName = selectedProject ? selectedProject.name : ''

                                            if (description) {
                                                description += ` for ${projectName}`
                                            } else {
                                                description = `Showing logs for ${projectName}`
                                            }
                                        }

                                        if (data.is_paid) {
                                            const paymentStatus = data.is_paid === 'true' ? 'paid' : 'unpaid'

                                            if (description) {
                                                description += ` (${paymentStatus})`
                                            } else {
                                                description = `Showing ${paymentStatus} logs`
                                            }
                                        }

                                        return description
                                    })()}
                                </CardDescription>
                            )}
                        </p>
                    </CardContent>
                </Card>

                {activeTimeLog ? (
                    <Card className="overflow-hidden transition-all hover:shadow-md bg-primary/5">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <ClockIcon className="h-5 w-5 text-primary animate-pulse" />
                                        <span>Time Tracking Active</span>
                                    </CardTitle>
                                    <CardDescription>
                                        {activeTimeLog.project_name ? `Tracking time for ${activeTimeLog.project_name}` : 'Tracking time'}
                                    </CardDescription>
                                    <div className="mt-4 text-3xl font-bold text-primary">
                                        {formatElapsedTime(activeTimeLog.elapsed)}
                                    </div>
                                    <div className="mt-1 text-sm text-muted-foreground">
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
                        <CardContent className="p-6">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <CardTitle className="text-xl">Quick Time Tracking</CardTitle>
                                    <CardDescription>
                                        Select a project and start tracking your time
                                    </CardDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="tracking_project" className="text-sm font-medium mb-2 block">
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
                                    <div className="flex items-end">
                                        <Button
                                            onClick={startTimeLog}
                                            variant="default"
                                            size="lg"
                                            className="flex items-center gap-2 w-full"
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

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Your Time Logs</CardTitle>
                                <CardDescription>
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <a href={route('time-log.export') + window.location.search} className="inline-block">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        <span>Export</span>
                                    </Button>
                                </a>
                                {selectedLogs.length > 0 && (
                                    <Button onClick={markAsPaid} variant="secondary" className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Mark as Paid ({selectedLogs.length})</span>
                                    </Button>
                                )}
                                <Link href={route('time-log.create')}>
                                    <Button className="flex items-center gap-2">
                                        <ClockIcon className="h-4 w-4" />
                                        <span>Log Time</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {timeLogs.length > 0 ? (
                            <TimeLogTable
                                timeLogs={timeLogs as TimeLogEntry[]}
                                showActions={true}
                                showCheckboxes={true}
                                selectedLogs={selectedLogs}
                                onSelectLog={handleSelectLog}
                            />
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Time Logs</h3>
                                    <p className="mb-4 text-muted-foreground">You haven't added any time logs yet.</p>
                                    <Link href={route('time-log.create')}>
                                        <Button className="flex items-center gap-2">
                                            <PlusCircle className="h-4 w-4" />
                                            <span>Add Time Log</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
