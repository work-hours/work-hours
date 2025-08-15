import { ExportButton } from '@/components/action-buttons'
import BackButton from '@/components/back-button'
import StatsCards from '@/components/dashboard/StatsCards'
import FilterButton from '@/components/filter-button'
import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { Pagination } from '@/components/ui/pagination'
import { SearchableSelect } from '@/components/ui/searchable-select'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router, useForm } from '@inertiajs/react'
import { AlertCircle, Briefcase, Calendar, CalendarRange, CheckCircle, ClockIcon, Search, TimerReset } from 'lucide-react'
import { FormEventHandler, useState } from 'react'

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
}

type User = {
    id: number
    name: string
    email: string
}

type Project = {
    id: number
    name: string
}

type Props = {
    timeLogs: TimeLog[]
    filters: Filters
    projects: Project[]
    user: User
    totalDuration: number
    unpaidHours: number
    paidHours: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmountsByCurrency: Record<string, number>
    currency: string
    weeklyAverage: number
    links?: { url: string | null; label: string; active: boolean }[]
}

export default function TeamMemberTimeLogs({
    timeLogs,
    filters,
    projects,
    user,
    totalDuration,
    unpaidHours,
    unpaidAmountsByCurrency,
    paidAmountsByCurrency,
    currency,
    weeklyAverage,
    links = [],
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Team',
            href: '/team',
        },
        {
            title: user.name,
            href: `/team/${user.id}/time-logs`,
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
        'start-date': filters['start-date'] || '',
        'end-date': filters['end-date'] || '',
        project: filters.project || '',
        'is-paid': filters['is-paid'] || '',
        status: filters.status || '',
    })

    const startDate = data['start-date'] ? new Date(data['start-date']) : null
    const endDate = data['end-date'] ? new Date(data['end-date']) : null

    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setData('start-date', date.toISOString().split('T')[0])
        } else {
            setData('start-date', '')
        }
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setData('end-date', date.toISOString().split('T')[0])
        } else {
            setData('end-date', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        get(route('team.time-logs', user.id), {
            preserveState: true,
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name}'s Time Logs`} />
            <div className="mx-auto flex flex-col gap-4 p-4">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">{user.name}'s Time Logs</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track and manage work hours for this team member</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                {/* Stats Cards */}
                {timeLogs.length > 0 && (
                    <section className="mb-4">
                        <StatsCards
                            teamStats={{
                                count: -1, // Just one team member
                                totalHours: totalDuration,
                                unpaidHours: unpaidHours,
                                unpaidAmount: Object.values(unpaidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                unpaidAmountsByCurrency: unpaidAmountsByCurrency,
                                paidAmount: Object.values(paidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                paidAmountsByCurrency: paidAmountsByCurrency,
                                currency: currency,
                                weeklyAverage: weeklyAverage,
                                clientCount: -1,
                            }}
                        />
                    </section>
                )}

                {/* Time Logs Card with filters in header */}
                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">{user.name}'s Time Logs</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>

                                {(data['start-date'] || data['end-date'] || data.project || data['is-paid'] || data.status) && (
                                    <CardDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
                                                    data.status === 'pending' ? 'pending' : data.status === 'approved' ? 'approved' : 'rejected'

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
                            <div className="flex items-center gap-2">
                                <ExportButton
                                    href={`${route('team.export-time-logs')}?user=${user.id}${window.location.search.replace('?', '&')}`}
                                    label="Export"
                                />
                                {selectedLogs.length > 0 && (
                                    <Button
                                        onClick={markAsPaid}
                                        className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        <span>Mark as Paid ({selectedLogs.length})</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <form onSubmit={submit} className="flex w-full flex-row flex-wrap gap-4">
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="start-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
                                                id="start-date"
                                                icon={<Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                disabled={processing}
                                                placeholder="Select start date"
                                                className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                            />
                                        }
                                    />
                                </div>
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="end-date" className="text-xs font-medium text-gray-600 dark:text-gray-400">
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
                                                id="end-date"
                                                icon={<CalendarRange className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                                disabled={processing}
                                                placeholder="Select end date"
                                                className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                            />
                                        }
                                    />
                                </div>
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="project" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Project
                                    </Label>
                                    <SearchableSelect
                                        id="project"
                                        value={data.project}
                                        onChange={(value) => setData('project', value)}
                                        options={[{ id: '', name: 'Projects' }, ...projects]}
                                        placeholder="Select project"
                                        disabled={processing}
                                        icon={<Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                        className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="is-paid" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Payment Status
                                    </Label>
                                    <SearchableSelect
                                        id="is-paid"
                                        value={data['is-paid']}
                                        onChange={(value) => setData('is-paid', value)}
                                        options={[
                                            { id: '', name: 'Statuses' },
                                            { id: 'true', name: 'Paid' },
                                            { id: 'false', name: 'Unpaid' },
                                        ]}
                                        placeholder="Select status"
                                        disabled={processing}
                                        icon={<CheckCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                        className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <div className="flex w-full flex-col gap-1 sm:w-auto sm:flex-1">
                                    <Label htmlFor="status" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Approval Status
                                    </Label>
                                    <SearchableSelect
                                        id="status"
                                        value={data.status}
                                        onChange={(value) => setData('status', value)}
                                        options={[
                                            { id: '', name: 'Statuses' },
                                            { id: 'pending', name: 'Pending' },
                                            { id: 'approved', name: 'Approved' },
                                            { id: 'rejected', name: 'Rejected' },
                                        ]}
                                        placeholder="Select approval status"
                                        disabled={processing}
                                        icon={<AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                                        className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    />
                                </div>
                                <div className="flex items-end gap-2">
                                    <FilterButton title="Apply filters" disabled={processing}>
                                        <Search className="h-4 w-4" />
                                    </FilterButton>

                                    <FilterButton
                                        variant="clear"
                                        disabled={
                                            processing ||
                                            (!data['start-date'] && !data['end-date'] && !data.project && !data['is-paid'] && !data.status)
                                        }
                                        onClick={() => {
                                            setData({
                                                'start-date': '',
                                                'end-date': '',
                                                project: '',
                                                'is-paid': '',
                                                status: '',
                                            })
                                            get(route('team.time-logs', user.id), {
                                                preserveState: true,
                                            })
                                        }}
                                        title="Clear filters"
                                    >
                                        <TimerReset className="h-4 w-4" />
                                    </FilterButton>
                                </div>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {timeLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <TimeLogTable
                                    timeLogs={timeLogs as TimeLogEntry[]}
                                    showCheckboxes={true}
                                    showActions={true}
                                    showEditDelete={false}
                                    selectedLogs={selectedLogs}
                                    onSelectLog={handleSelectLog}
                                />
                            </div>
                        ) : (
                            <div className="rounded-md p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                                    <h3 className="mb-1 text-lg font-medium text-gray-800 dark:text-gray-200">No Time Logs</h3>
                                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">{user.name} hasn't added any time logs yet.</p>
                                </div>
                            </div>
                        )}

                        {links && links.length > 0 && (
                            <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-700">
                                <Pagination links={links} />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
