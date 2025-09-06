import { ExportButton } from '@/components/action-buttons'
import StatsCards from '@/components/dashboard/StatsCards'
import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import MasterLayout from '@/layouts/master-layout'
import TimeLogFiltersOffCanvas from '@/pages/time-log/components/TimeLogFiltersOffCanvas'
import TimeLogOffCanvas from '@/pages/time-log/components/TimeLogOffCanvas'
import { type BreadcrumbItem } from '@/types'
import { TimeLogStatus } from '@/types/TimeLogStatus'
import { Head, router, useForm } from '@inertiajs/react'
import axios from 'axios'
import { AlertCircle, CheckCircle, ClockIcon, FileSpreadsheet, Filter, PlusCircle, Upload } from 'lucide-react'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

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
    hourly_rate?: number
    paid_amount?: number
}

type Filters = {
    'start-date': string
    'end-date': string
    project: string
    'is-paid': string
    status: string
    tag: string
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
    unpaidAmountsByCurrency: Record<string, number>
    paidHours: number
    paidAmountsByCurrency: Record<string, number>
    weeklyAverage: number
    unbillableHours: number
    tags: { id: number; name: string }[]
    tasks: { id: number; title: string; project_id: number; is_imported?: boolean; meta?: { source?: string; source_state?: string } }[]
    open?: boolean
}

export default function TimeLog({
    timeLogs,
    filters,
    projects,
    totalDuration,
    unpaidHours,
    unpaidAmountsByCurrency,
    paidAmountsByCurrency,
    weeklyAverage,
    unbillableHours,
    tags,
    tasks,
    open,
}: Props) {
    const [offOpen, setOffOpen] = useState(Boolean(open))
    const [mode, setMode] = useState<'create' | 'edit'>('create')
    const [editLog, setEditLog] = useState<TimeLogEntry | null>(null)
    const [filtersOpen, setFiltersOpen] = useState(false)
    const { data, setData, get, processing } = useForm<Filters>({
        'start-date': filters['start-date'] || '',
        'end-date': filters['end-date'] || '',
        project: filters.project || '',
        'is-paid': filters['is-paid'] || '',
        status: filters.status || '',
        tag: filters.tag || '',
    })

    const [hasActiveFilters, setHasActiveFilters] = useState(false)

    const [selectedLogs, setSelectedLogs] = useState<number[]>([])
    const [importDialogOpen, setImportDialogOpen] = useState(false)
    const [importFile, setImportFile] = useState<File | null>(null)
    const [importing, setImporting] = useState(false)
    const [importSuccess, setImportSuccess] = useState<string | null>(null)
    const [importErrors, setImportErrors] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleSelectLog = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedLogs([...selectedLogs, id])
        } else {
            setSelectedLogs(selectedLogs.filter((logId) => logId !== id))
        }
    }

    useEffect(() => {
        setHasActiveFilters(Boolean(data['start-date'] || data['end-date'] || data.project || data['is-paid'] || data.status || data.tag))
        const handler = () => {
            get(route('time-log.index'), { preserveState: true })
        }
        window.addEventListener('refresh-time-logs', handler)
        return () => window.removeEventListener('refresh-time-logs', handler)
    }, [])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImportFile(e.target.files[0])
        }
    }

    const handleImport = async () => {
        if (!importFile) return

        setImporting(true)
        setImportSuccess(null)
        setImportErrors([])

        const formData = new FormData()
        formData.append('file', importFile)

        try {
            const response = await axios.post(route('time-log.import'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            setImportSuccess(response.data.message)

            if (response.data.errors && response.data.errors.length > 0) {
                setImportErrors(response.data.errors)
            } else {
                setTimeout(() => resetImport(), 1000)
            }

            setTimeout(() => {
                get(route('time-log.index'), { preserveState: true })
            }, 2000)
        } catch (error) {
            const axiosError = error as {
                response?: {
                    data?: {
                        errors?: string[]
                        message?: string
                    }
                }
            }

            if (axiosError.response && axiosError.response.data) {
                if (axiosError.response.data.errors) {
                    setImportErrors(axiosError.response.data.errors)
                } else if (axiosError.response.data.message) {
                    setImportErrors([axiosError.response.data.message])
                }
            } else {
                setImportErrors(['An unexpected error occurred. Please try again.'])
            }
        } finally {
            setImporting(false)
        }
    }

    const resetImport = () => {
        setImportFile(null)
        setImportSuccess(null)
        setImportErrors([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const closeImportDialog = () => {
        setImportDialogOpen(false)
        resetImport()
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

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Log" />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="">
                    <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Time Logs</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage your work hours</p>
                </section>

                {timeLogs.length > 0 && (
                    <section className="">
                        <StatsCards
                            teamStats={{
                                count: -1, // Just one user (personal time logs)
                                totalHours: totalDuration,
                                unpaidHours: unpaidHours,
                                unpaidAmount: Object.values(unpaidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                unpaidAmountsByCurrency: unpaidAmountsByCurrency,
                                paidAmount: Object.values(paidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                paidAmountsByCurrency: paidAmountsByCurrency,
                                currency: Object.keys(unpaidAmountsByCurrency)[0] || Object.keys(paidAmountsByCurrency)[0] || 'USD',
                                weeklyAverage: weeklyAverage,
                                clientCount: -1,
                                unbillableHours: unbillableHours,
                            }}
                        />
                    </section>
                )}

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Your Time Logs</CardTitle>
                                <CardDescription>
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>

                                {(data['start-date'] || data['end-date'] || data.project || data.status) && (
                                    <CardDescription className="mt-1">
                                        {(() => {
                                            let description = ''

                                            if (data['start-date'] && data['end-date']) {
                                                description = `Showing logs from ${data['start-date']} to ${data['end-date']}`
                                            } else if (data['start-date']) {
                                                description = `Showing logs from ${data['start-date']}`
                                            } else if (data['end-date']) {
                                                description = `Showing logs until ${data['end-date']}`
                                            }

                                            if (data.project) {
                                                const selectedProject = projects.find((project) => project.id.toString() === data.project)
                                                const projectName = selectedProject ? selectedProject.name : ''

                                                if (description) {
                                                    description += ` for ${projectName}`
                                                } else {
                                                    description = `Showing logs for ${projectName}`
                                                }
                                            }

                                            if (data['is-paid']) {
                                                const paymentStatus = data['is-paid'] === 'true' ? 'paid' : 'unpaid'

                                                if (description) {
                                                    description += ` (${paymentStatus})`
                                                } else {
                                                    description = `Showing ${paymentStatus} logs`
                                                }
                                            }

                                            if (data.status) {
                                                const statusText =
                                                    data.status === TimeLogStatus.PENDING
                                                        ? 'pending'
                                                        : data.status === TimeLogStatus.APPROVED
                                                          ? 'approved'
                                                          : 'rejected'

                                                if (description) {
                                                    description += ` with ${statusText} status`
                                                } else {
                                                    description = `Showing logs with ${statusText} status`
                                                }
                                            }

                                            return description
                                        })()}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={hasActiveFilters ? 'default' : 'outline'}
                                    className={`flex items-center gap-2 ${
                                        hasActiveFilters
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter className={`h-3 w-3 ${hasActiveFilters ? 'text-primary dark:text-primary-foreground' : ''}`} />
                                    <span>{hasActiveFilters ? 'Filters Applied' : 'Filters'}</span>
                                </Button>
                                <ExportButton href={route('time-log.export') + window.location.search} label="Export" />
                                <a href={route('time-log.template')} className="inline-block">
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        <FileSpreadsheet className="h-3 w-3" />
                                        <span>Template</span>
                                    </Button>
                                </a>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2 border-gray-200 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                    onClick={() => setImportDialogOpen(true)}
                                >
                                    <Upload className="h-3 w-3" />
                                    <span>Import</span>
                                </Button>
                                {selectedLogs.length > 0 && (
                                    <Button
                                        onClick={markAsPaid}
                                        className="flex items-center gap-2 bg-gray-900 text-sm text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Mark as Paid ({selectedLogs.length})</span>
                                    </Button>
                                )}
                                <Button
                                    variant="default"
                                    className="flex items-center gap-2 bg-gray-900 text-sm text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setMode('create')
                                        setEditLog(null)
                                        setOffOpen(true)
                                    }}
                                >
                                    <ClockIcon className="h-3 w-3" />
                                    <span>Log Time</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {timeLogs.length > 0 ? (
                            <TimeLogTable
                                timeLogs={timeLogs as TimeLogEntry[]}
                                showActions={true}
                                showCheckboxes={true}
                                selectedLogs={selectedLogs}
                                onSelectLog={handleSelectLog}
                                onEdit={(log) => {
                                    setMode('edit')
                                    setEditLog(log)
                                    setOffOpen(true)
                                }}
                            />
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Time Logs</h3>
                                    <p className="mb-4 text-muted-foreground">You haven't added any time logs yet.</p>
                                    <Button
                                        className="flex items-center gap-2 bg-gray-900 text-sm text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                        onClick={() => {
                                            setMode('create')
                                            setEditLog(null)
                                            setOffOpen(true)
                                        }}
                                    >
                                        <PlusCircle className="h-3 w-3" />
                                        <span>Add Time Log</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Import Time Logs</DialogTitle>
                            <DialogDescription>
                                Upload an Excel file with time logs to import.
                                <a href={route('time-log.template')} className="ml-1 text-primary hover:underline">
                                    Download template
                                </a>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="file-upload">Excel File</Label>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                    disabled={importing}
                                />
                                <p className="text-sm text-muted-foreground">Only .xlsx and .xls files are supported (max 2MB)</p>
                            </div>

                            {importSuccess && (
                                <Alert className="border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/20">
                                    <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400" />
                                    <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">{importSuccess}</AlertDescription>
                                </Alert>
                            )}

                            {importErrors.length > 0 && (
                                <Alert className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20">
                                    <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                                    <AlertTitle className="text-red-800 dark:text-red-400">Error</AlertTitle>
                                    <AlertDescription className="text-red-700 dark:text-red-400">
                                        <ul className="mt-2 list-disc space-y-1 pl-5">
                                            {importErrors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                        <DialogFooter className="sm:justify-between">
                            <Button type="button" variant="secondary" onClick={closeImportDialog} disabled={importing}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleImport} disabled={!importFile || importing}>
                                {importing ? 'Importing...' : 'Import'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <TimeLogFiltersOffCanvas
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                filters={data}
                projects={projects}
                tags={tags}
                setHasActiveFilters={setHasActiveFilters}
            />

            <TimeLogOffCanvas
                open={offOpen}
                mode={mode}
                onClose={() => setOffOpen(false)}
                projects={projects}
                tasks={tasks}
                timeLog={
                    editLog
                        ? {
                              id: editLog.id,
                              project_id: editLog.project_id || 0,
                              task_id: (editLog as unknown as { task_id?: number | null }).task_id ?? null,
                              start_timestamp: editLog.start_timestamp,
                              end_timestamp: editLog.end_timestamp || '',
                              note: editLog.note || '',
                              non_billable: Boolean(editLog.non_billable),
                              tags: (editLog.tags || []).map((t) => t.name),
                          }
                        : undefined
                }
            />
        </MasterLayout>
    )
}
