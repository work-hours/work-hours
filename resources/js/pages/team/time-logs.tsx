import { ExportButton } from '@/components/action-buttons'
import BackButton from '@/components/back-button'
import StatsCards from '@/components/dashboard/StatsCards'
import TimeLogTable, { TimeLogEntry } from '@/components/time-log-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import MasterLayout from '@/layouts/master-layout'
import MemberTimeLogsFiltersOffCanvas from '@/pages/team/components/MemberTimeLogsFiltersOffCanvas'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { CheckCircle, ClockIcon, Filter } from 'lucide-react'
import { useState } from 'react'

import type { MemberTimeLogsProps as Props } from '@/@types/team-time-logs'

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
    unbillableHours,
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
            <Head title={`${user.name}'s Time Logs`} />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">{user.name}'s Time Logs</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track and manage work hours for this team member</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

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
                                unbillableHours: unbillableHours,
                            }}
                        />
                    </section>
                )}

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">{user.name}'s Time Logs</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    {timeLogs.length > 0
                                        ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                        : 'No time logs found for the selected period'}
                                </CardDescription>

                                {(filters['start-date'] || filters['end-date'] || filters.project || filters['is-paid'] || filters.status) && (
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

                                            if (filters.project) {
                                                const selectedProject = projects.find((project) => project.id.toString() === filters.project)
                                                const projectName = selectedProject ? selectedProject.name : ''

                                                if (description) {
                                                    description += ` for ${projectName}`
                                                } else {
                                                    description = `Showing logs for ${projectName}`
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
                                    variant={
                                        filters['start-date'] || filters['end-date'] || filters.project || filters['is-paid'] || filters.status
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className={`flex items-center gap-2 ${
                                        filters['start-date'] || filters['end-date'] || filters.project || filters['is-paid'] || filters.status
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter
                                        className={`h-4 w-4 ${filters['start-date'] || filters['end-date'] || filters.project || filters['is-paid'] || filters.status ? 'text-primary dark:text-primary-foreground' : ''}`}
                                    />
                                    <span>
                                        {filters['start-date'] || filters['end-date'] || filters.project || filters['is-paid'] || filters.status
                                            ? 'Filters Applied'
                                            : 'Filters'}
                                    </span>
                                </Button>
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

                <MemberTimeLogsFiltersOffCanvas
                    open={filtersOpen}
                    onOpenChange={setFiltersOpen}
                    filters={filters}
                    projects={projects}
                    userId={user.id}
                />
            </div>
        </MasterLayout>
    )
}
