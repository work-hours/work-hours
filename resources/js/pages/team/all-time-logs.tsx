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
import { ArrowLeft, Briefcase, Calendar, CalendarIcon, CalendarRange, CheckCircle, ClockIcon, Download, Search, TimerReset } from 'lucide-react'
import { FormEventHandler, forwardRef, useState } from 'react'

type TimeLog = {
    id: number
    user_name: string
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
    user_id: string
    project_id: string
    is_paid: string
}

interface CustomInputProps {
    value?: string
    onClick?: () => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
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

type TeamMember = {
    id: number
    name: string
}

type Project = {
    id: number
    name: string
}

type Props = {
    timeLogs: TimeLog[]
    filters: Filters
    teamMembers: TeamMember[]
    projects: Project[]
    totalDuration: number
    unpaidHours: number
    unpaidAmount: number
    currency: string
    weeklyAverage: number
}

export default function AllTeamTimeLogs({
    timeLogs,
    filters,
    teamMembers,
    projects,
    totalDuration,
    unpaidHours,
    unpaidAmount,
    currency,
    weeklyAverage,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Team',
            href: '/team',
        },
        {
            title: 'All Time Logs',
            href: '/team/all-time-logs',
        },
    ]

    const [selectedLogs, setSelectedLogs] = useState<number[]>([])

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

    const { data, setData, get, processing } = useForm<Filters>({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
        user_id: filters.user_id || '',
        project_id: filters.project_id || '',
        is_paid: filters.is_paid || '',
    })

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
        get(route('team.all-time-logs'), {
            preserveState: true,
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Team Time Logs" />
            <div className="mx-auto flex w-10/12 flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <Link href={route('team.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to Team</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">All Team Time Logs</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage work hours across all team members</p>
                        </div>
                    </div>
                </section>

                {timeLogs.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Total Team Hours</CardTitle>
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{totalDuration}</div>
                                <p className="text-xs text-muted-foreground">
                                    {(() => {
                                        let description = ''

                                        if (filters.start_date && filters.end_date) {
                                            description = `Hours logged from ${filters.start_date} to ${filters.end_date}`
                                        } else if (filters.start_date) {
                                            description = `Hours logged from ${filters.start_date}`
                                        } else if (filters.end_date) {
                                            description = `Hours logged until ${filters.end_date}`
                                        } else {
                                            description = 'Total hours logged'
                                        }

                                        if (filters.user_id) {
                                            const selectedMember = teamMembers.find((member) => member.id.toString() === filters.user_id)
                                            const memberName = selectedMember ? selectedMember.name : ''

                                            if (memberName) {
                                                description += ` by ${memberName}`
                                            }
                                        } else {
                                            description += ' by all team members'
                                        }

                                        return description
                                    })()}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Unpaid Team Hours</CardTitle>
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{unpaidHours}</div>
                                <p className="text-xs text-muted-foreground">
                                    {filters.user_id
                                        ? (() => {
                                              const selectedMember = teamMembers.find((member) => member.id.toString() === filters.user_id)
                                              return selectedMember ? `Hours pending payment for ${selectedMember.name}` : 'Hours pending payment'
                                          })()
                                        : 'Hours pending payment across all team members'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Unpaid amount card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Unpaid Team Amount</CardTitle>
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
                                <p className="text-xs text-muted-foreground">
                                    {filters.user_id
                                        ? (() => {
                                              const selectedMember = teamMembers.find((member) => member.id.toString() === filters.user_id)
                                              return selectedMember ? `Amount pending payment for ${selectedMember.name}` : 'Amount pending payment'
                                          })()
                                        : 'Amount pending payment across all team members'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Weekly average card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardContent>
                                <div className="mb-2 flex flex-row items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Team Weekly Average</CardTitle>
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="text-2xl font-bold">{weeklyAverage}</div>
                                <p className="text-xs text-muted-foreground">
                                    {filters.user_id
                                        ? (() => {
                                              const selectedMember = teamMembers.find((member) => member.id.toString() === filters.user_id)
                                              return selectedMember ? `Hours per week for ${selectedMember.name}` : 'Hours per week'
                                          })()
                                        : 'Hours per week across all team members'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6">
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
                                <Label htmlFor="user_id" className="text-xs font-medium">
                                    Team Member
                                </Label>
                                <SearchableSelect
                                    id="user_id"
                                    value={data.user_id}
                                    onChange={(value) => setData('user_id', value)}
                                    options={[{ id: '', name: 'Team' }, ...teamMembers]}
                                    placeholder="Select team member"
                                    disabled={processing}
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
                                    disabled={
                                        processing ||
                                        (!data.start_date && !data.end_date && !data.user_id && !data.project_id && !data.is_paid)
                                    }
                                    onClick={() => {
                                        setData({
                                            start_date: '',
                                            end_date: '',
                                            user_id: '',
                                            project_id: '',
                                            is_paid: '',
                                        })
                                        get(route('team.all-time-logs'), {
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
                            {(data.start_date || data.end_date || data.user_id || data.project_id) && (
                                <CardDescription>
                                    {(() => {
                                        let description = ''

                                        // Date range description
                                        if (data.start_date && data.end_date) {
                                            description = `Showing logs from ${data.start_date} to ${data.end_date}`
                                        } else if (data.start_date) {
                                            description = `Showing logs from ${data.start_date}`
                                        } else if (data.end_date) {
                                            description = `Showing logs until ${data.end_date}`
                                        }

                                        // Team member description
                                        if (data.user_id) {
                                            const selectedMember = teamMembers.find((member) => member.id.toString() === data.user_id)
                                            const memberName = selectedMember ? selectedMember.name : ''

                                            if (description) {
                                                description += ` for ${memberName}`
                                            } else {
                                                description = `Showing logs for ${memberName}`
                                            }
                                        }

                                        // Project description
                                        if (data.project_id) {
                                            const selectedProject = projects.find((project) => project.id.toString() === data.project_id)
                                            const projectName = selectedProject ? selectedProject.name : ''

                                            if (description) {
                                                description += ` on ${projectName}`
                                            } else {
                                                description = `Showing logs for ${projectName}`
                                            }
                                        }

                                        // Payment status description
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

                {/* Time Logs Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Team Time Logs</CardTitle>
                                <CardDescription>
                                    {timeLogs.length > 0
                                        ? (() => {
                                              let description = `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`

                                              if (filters.user_id) {
                                                  const selectedMember = teamMembers.find((member) => member.id.toString() === filters.user_id)
                                                  if (selectedMember) {
                                                      description += ` from ${selectedMember.name}`
                                                  }
                                              } else {
                                                  description += ' from all team members'
                                              }

                                              return description
                                          })()
                                        : 'No time logs found for the selected period'}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={route('team.export-time-logs') + window.location.search} className="inline-block">
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
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {timeLogs.length > 0 ? (
                            <TimeLogTable
                                timeLogs={timeLogs as TimeLogEntry[]}
                                showTeamMember={true}
                                showCheckboxes={true}
                                selectedLogs={selectedLogs}
                                onSelectLog={handleSelectLog}
                            />
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Time Logs</h3>
                                    <p className="mb-4 text-muted-foreground">No team members have added any time logs yet.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
