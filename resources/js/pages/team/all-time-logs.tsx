import { ExportButton } from '@/components/action-buttons'
import BackButton from '@/components/back-button'
import StatsCards from '@/components/dashboard/StatsCards'
import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { CheckCircle, ClockIcon, Filter } from 'lucide-react'
import { useState } from 'react'
import AllTimeLogsFiltersOffCanvas from '@/pages/team/components/AllTimeLogsFiltersOffCanvas'

type TimeLog = {
    id: number
    user_name: string
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
    user: string
    project: string
    'is-paid': string
    status: string
    tag: string
}

type TeamMember = {
    id: number
    name: string
}

type Project = {
    id: number
    name: string
}

type Tag = {
    id: number
    name: string
}

type Props = {
    timeLogs: TimeLog[]
    filters: Filters
    teamMembers: TeamMember[]
    projects: Project[]
    tags: Tag[]
    totalDuration: number
    unpaidHours: number
    paidHours: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmountsByCurrency: Record<string, number>
    currency: string
    weeklyAverage: number
    unbillableHours: number
    links?: { url: string | null; label: string; active: boolean }[]
}

export default function AllTeamTimeLogs({
    timeLogs,
    filters,
    teamMembers,
    projects,
    tags,
    totalDuration,
    unpaidHours,
    unpaidAmountsByCurrency,
    paidAmountsByCurrency,
    currency,
    weeklyAverage,
    unbillableHours,
    links = [],
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

    const [filtersOpen, setFiltersOpen] = useState(false)

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="All Team Time Logs" />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">All Team Time Logs</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and manage time logs for all team members</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                {timeLogs.length > 0 && (
                    <section className="mb-4">
                        <StatsCards
                            teamStats={{
                                count: teamMembers.length,
                                totalHours: totalDuration,
                                unpaidHours: unpaidHours,
                                unpaidAmount: Object.values(unpaidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                unpaidAmountsByCurrency: unpaidAmountsByCurrency,
                                paidAmount: Object.values(paidAmountsByCurrency).reduce((sum, amount) => sum + amount, 0),
                                paidAmountsByCurrency: paidAmountsByCurrency,
                                currency: currency,
                                weeklyAverage: weeklyAverage,
                                clientCount: -1,
                                unbillableHours: unbillableHours,
                            }}
                        />
                    </section>
                )}

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Team Time Logs</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>

                                {(filters['start-date'] ||
                                    filters['end-date'] ||
                                    filters.user ||
                                    filters.project ||
                                    filters['is-paid'] ||
                                    filters.status ||
                                    filters.tag) && (
                                    <CardDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {(() => {
                                            let description = ''

                                            if (filters['start-date'] && filters['end-date']) {
                                                description = `Showing logs from ${filters['start-date']} to ${filters['end-date']}`
                                            } else if (filters['start-date']) {
                                                description = `Showing logs from ${filters['start-date']}`
                                            } else if (filters['end-date']) {
                                                description = `Showing logs until ${filters['end-date']}`
                                            }

                                            if (filters.user) {
                                                const selectedUser = teamMembers.find((member) => member.id.toString() === filters.user)
                                                const userName = selectedUser ? selectedUser.name : ''

                                                if (description) {
                                                    description += ` for ${userName}`
                                                } else {
                                                    description = `Showing logs for ${userName}`
                                                }
                                            }

                                            if (filters.project) {
                                                const selectedProject = projects.find((project) => project.id.toString() === filters.project)
                                                const projectName = selectedProject ? selectedProject.name : ''

                                                if (description) {
                                                    description += ` on ${projectName}`
                                                } else {
                                                    description = `Showing logs for ${projectName}`
                                                }
                                            }

                                            if (filters.tag) {
                                                const selectedTag = tags.find((tag) => tag.id.toString() === filters.tag)
                                                const tagName = selectedTag ? selectedTag.name : ''

                                                if (description) {
                                                    description += ` tagged with ${tagName}`
                                                } else {
                                                    description = `Showing logs tagged with ${tagName}`
                                                }
                                            }

                                            if (filters['is-paid']) {
                                                const paymentStatus = filters['is-paid'] === 'true' ? 'paid' : 'unpaid'

                                                if (description) {
                                                    description += ` (${paymentStatus})`
                                                } else {
                                                    description = `Showing ${paymentStatus} logs`
                                                }
                                            }

                                            if (filters.status) {
                                                const statusText =
                                                    filters.status === 'pending' ? 'pending' : filters.status === 'approved' ? 'approved' : 'rejected'

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
                                <Button
                                    variant={filters['start-date'] || filters['end-date'] || filters.user || filters.project || filters.tag || filters['is-paid'] || filters.status ? 'default' : 'outline'}
                                    className={`flex items-center gap-2 ${
                                        filters['start-date'] || filters['end-date'] || filters.user || filters.project || filters.tag || filters['is-paid'] || filters.status
                                            ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/30 dark:bg-primary/20 dark:border-primary/30 dark:hover:bg-primary/30 dark:text-primary-foreground'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter className={`h-4 w-4 ${filters['start-date'] || filters['end-date'] || filters.user || filters.project || filters.tag || filters['is-paid'] || filters.status ? 'text-primary dark:text-primary-foreground' : ''}`} />
                                    <span>{filters['start-date'] || filters['end-date'] || filters.user || filters.project || filters.tag || filters['is-paid'] || filters.status ? 'Filters Applied' : 'Filters'}</span>
                                </Button>

                                <ExportButton href={`${route('team.export-time-logs')}${window.location.search}`} label="Export" />
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

                    </CardHeader>
                    <CardContent className="p-0">
                        {timeLogs.length > 0 ? (
                            <div className="overflow-x-auto">
                                <TimeLogTable
                                    timeLogs={timeLogs as TimeLogEntry[]}
                                    showCheckboxes={true}
                                    showActions={true}
                                    showEditDelete={false}
                                    showMember={true}
                                    selectedLogs={selectedLogs}
                                    onSelectLog={handleSelectLog}
                                />
                            </div>
                        ) : (
                            <div className="rounded-md p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                                    <h3 className="mb-1 text-lg font-medium text-gray-800 dark:text-gray-200">No Time Logs</h3>
                                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">No time logs found with the selected filters.</p>
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

                <AllTimeLogsFiltersOffCanvas
                    open={filtersOpen}
                    onOpenChange={setFiltersOpen}
                    filters={filters}
                    teamMembers={teamMembers}
                    projects={projects}
                    tags={tags}
                />
            </div>
        </MasterLayout>
    )
}
