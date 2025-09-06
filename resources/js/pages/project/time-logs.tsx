import { ExportButton } from '@/components/action-buttons'
import BackButton from '@/components/back-button'
import StatsCards from '@/components/dashboard/StatsCards'
import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { CheckCircle, ClockIcon, Filter } from 'lucide-react'
import { useState } from 'react'
import ProjectTimeLogsFiltersOffCanvas from '@/pages/project/components/ProjectTimeLogsFiltersOffCanvas'

type TimeLog = {
    id: number
    user_id: number
    user_name: string
    project_name?: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    is_paid: boolean
    note?: string
    hourly_rate?: number
    paid_amount?: number
    currency?: string
    user_non_monetary: boolean
}

type Filters = {
    'start-date': string
    'end-date': string
    user: string
    'is-paid': string
    status: string
}

type Project = {
    id: number
    name: string
    description: string | null
    paid_amount: number
    user: {
        id: number
        name: string
        email: string
    }
}

type TeamMember = {
    id: number
    name: string
    email: string
}


type Props = {
    timeLogs: TimeLog[]
    filters: Filters
    project: Project
    teamMembers: TeamMember[]
    totalDuration: number
    unpaidHours: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmountsByCurrency: Record<string, number>
    weeklyAverage: number
    unbillableHours: number
    isCreator: boolean
}

export default function ProjectTimeLogs({
    timeLogs,
    filters,
    project,
    teamMembers,
    totalDuration,
    unpaidHours,
    unpaidAmountsByCurrency,
    paidAmountsByCurrency,
    weeklyAverage,
    unbillableHours,
    isCreator,
}: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Projects',
            href: '/project',
        },
        {
            title: project.name,
            href: `/project/${project.id}/time-logs`,
        },
    ]

    const [selectedLogs, setSelectedLogs] = useState<number[]>([])
        const [filtersOpen, setFiltersOpen] = useState(false)

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


    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${project.name} - Time Logs`} />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{project.name} - Time Logs</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage work hours for this project</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                {timeLogs.length > 0 && (
                    <section className="mb-4">
                        <StatsCards
                            teamStats={{
                                count: -1,
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
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">{project.name} - Time Logs</CardTitle>
                                <CardDescription>
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>

                                {(filters['start-date'] || filters['end-date'] || filters.user || filters['is-paid'] || filters.status) && (
                                    <CardDescription className="mt-1">
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
                                                const selectedMember = teamMembers.find((member) => member.id.toString() === filters.user)
                                                const memberName = selectedMember ? selectedMember.name : ''

                                                if (description) {
                                                    description += ` for ${memberName}`
                                                } else {
                                                    description = `Showing logs for ${memberName}`
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
                                    variant={filters['start-date'] || filters['end-date'] || filters.user || filters['is-paid'] || filters.status ? 'default' : 'outline'}
                                    className={`flex items-center gap-2 ${
                                        filters['start-date'] || filters['end-date'] || filters.user || filters['is-paid'] || filters.status
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter className={`h-4 w-4 ${filters['start-date'] || filters['end-date'] || filters.user || filters['is-paid'] || filters.status ? 'text-primary dark:text-primary-foreground' : ''}`} />
                                    <span>{filters['start-date'] || filters['end-date'] || filters.user || filters['is-paid'] || filters.status ? 'Filters Applied' : 'Filters'}</span>
                                </Button>
                                <ExportButton
                                    href={`${route('project.export-time-logs')}?project=${project.id}${window.location.search.replace('?', '&')}`}
                                    label="Export"
                                />
                                {isCreator && selectedLogs.length > 0 && (
                                    <Button
                                        onClick={markAsPaid}
                                        className="flex items-center gap-2 bg-gray-900 text-sm text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Mark as Paid ({selectedLogs.length})</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                    </CardHeader>
                    <CardContent className="p-0">
                        {timeLogs.length > 0 ? (
                            <TimeLogTable
                                timeLogs={timeLogs as TimeLogEntry[]}
                                showCheckboxes={isCreator}
                                showTeamMember={true}
                                showProject={false}
                                showActions={true}
                                showEditDelete={false}
                                selectedLogs={selectedLogs}
                                onSelectLog={handleSelectLog}
                            />
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Time Logs</h3>
                                    <p className="mb-4 text-muted-foreground">No time logs have been added to this project yet.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <ProjectTimeLogsFiltersOffCanvas open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} teamMembers={teamMembers} projectId={project.id} />
        </MasterLayout>
    )
}
