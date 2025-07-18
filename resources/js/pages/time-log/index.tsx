import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import TimeTracker from '@/components/time-tracker'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DatePicker from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, router, useForm } from '@inertiajs/react'
import axios from 'axios'
import {
    AlertCircle,
    Briefcase,
    Calendar,
    CalendarIcon,
    CalendarRange,
    CheckCircle,
    ClockIcon,
    Download,
    FileSpreadsheet,
    PlusCircle,
    Search,
    TimerReset,
    Upload,
} from 'lucide-react'
import { ChangeEvent, FormEventHandler, forwardRef, ReactNode, useRef, useState } from 'react'

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
    hourly_rate?: number
    paid_amount?: number
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
    unpaidAmount: Record<string, number>
    paidHours: number
    paidAmount: Record<string, number>
    currency: string
    weeklyAverage: number
}

export default function TimeLog({ timeLogs, filters, projects, totalDuration, unpaidHours, unpaidAmount, paidHours, paidAmount, currency, weeklyAverage }: Props) {
    const { data, setData, get, processing } = useForm<Filters>({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        project_id: filters.project_id || '',
        is_paid: filters.is_paid || '',
    })

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
            <div className="mx-auto flex w-10/12 flex-col gap-6 p-6">
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Time Logs</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage your work hours</p>
                </section>

                {timeLogs.length > 0 && (
                    <div className="mb-4">
                        <h3 className="mb-2 text-sm font-medium text-muted-foreground">Metrics Dashboard</h3>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
                            {/* Time Metrics */}
                            <Card className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-400 transition-all hover:shadow-md">
                                <CardContent className="py-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-medium">Total Hours</CardTitle>
                                        <ClockIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-lg font-bold">{totalDuration}</div>
                                    <p className="text-[10px] text-muted-foreground">
                                        {data.start_date && data.end_date
                                            ? `${data.start_date} - ${data.end_date}`
                                            : data.start_date
                                              ? `From ${data.start_date}`
                                              : data.end_date
                                                ? `Until ${data.end_date}`
                                                : 'Total logged'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-400 transition-all hover:shadow-md">
                                <CardContent className="py-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-medium">Unpaid Hours</CardTitle>
                                        <ClockIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-lg font-bold">{unpaidHours}</div>
                                    <p className="text-[10px] text-muted-foreground">Hours pending payment</p>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden border-l-4 border-l-blue-500 dark:border-l-blue-400 transition-all hover:shadow-md">
                                <CardContent className="py-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-medium">Paid Hours</CardTitle>
                                        <ClockIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-lg font-bold">{paidHours}</div>
                                    <p className="text-[10px] text-muted-foreground">Hours already paid</p>
                                </CardContent>
                            </Card>

                            {/* Financial Metrics */}
                            <Card className="overflow-hidden border-l-4 border-l-green-500 dark:border-l-green-400 transition-all hover:shadow-md">
                                <CardContent className="py-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-medium">Unpaid Amount</CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-3 w-3 text-muted-foreground"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                            <path d="M12 18V6" />
                                        </svg>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {currency} {unpaidAmount[currency] || 0}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Amount pending payment</p>
                                </CardContent>
                            </Card>

                            <Card className="overflow-hidden border-l-4 border-l-green-500 dark:border-l-green-400 transition-all hover:shadow-md">
                                <CardContent className="py-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-medium">Paid Amount</CardTitle>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="h-3 w-3 text-muted-foreground"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                                            <path d="M12 18V6" />
                                        </svg>
                                    </div>
                                    <div className="text-lg font-bold">
                                        {currency} {paidAmount[currency] || 0}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Amount already paid</p>
                                </CardContent>
                            </Card>

                            {/* Periodic Metrics */}
                            <Card className="overflow-hidden border-l-4 border-l-purple-500 dark:border-l-purple-400 transition-all hover:shadow-md">
                                <CardContent className="py-1">
                                    <div className="flex flex-row items-center justify-between">
                                        <CardTitle className="text-xs font-medium">Weekly Average</CardTitle>
                                        <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div className="text-lg font-bold">{weeklyAverage}</div>
                                    <p className="text-[10px] text-muted-foreground">Hours per week</p>
                                </CardContent>
                            </Card>
                        </div>
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

                <TimeTracker projects={projects} />

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
                                <a href={route('time-log.template')} className="inline-block">
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4" />
                                        <span>Template</span>
                                    </Button>
                                </a>
                                <Button variant="outline" className="flex items-center gap-2" onClick={() => setImportDialogOpen(true)}>
                                    <Upload className="h-4 w-4" />
                                    <span>Import</span>
                                </Button>
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

                {/* Import Dialog */}
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
                                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    <AlertTitle className="text-green-800 dark:text-green-400">Success</AlertTitle>
                                    <AlertDescription className="text-green-700 dark:text-green-400">{importSuccess}</AlertDescription>
                                </Alert>
                            )}

                            {importErrors.length > 0 && (
                                <Alert className="border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/20">
                                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
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
        </AppLayout>
    )
}
