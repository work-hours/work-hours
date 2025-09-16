import { ExportButton } from '@/components/action-buttons'
import TeamMemberDeleteAction from '@/components/team-member-delete-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { getFilterDescription } from '@/pages/team/components/TeamFilters'
import TeamFiltersOffCanvas from '@/pages/team/components/TeamFiltersOffCanvas'
import TeamMemberOffCanvas from '@/pages/team/components/TeamMemberOffCanvas'
import { teamBreadcrumbs, TeamPageProps } from '@/pages/team/types'
import { Head, Link } from '@inertiajs/react'
import { Clock, Edit, Filter, MoreVertical, UserPlus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Team({ teamMembers, filters, currencies }: TeamPageProps) {
    const [offOpen, setOffOpen] = useState(false)
    const [mode, setMode] = useState<'create' | 'edit'>('create')
    const [editUser, setEditUser] = useState<{
        id: number
        name: string
        email: string
        hourly_rate: number
        currency: string
        non_monetary: boolean
        is_employee: boolean
    } | null>(null)
    const [filtersOpen, setFiltersOpen] = useState(false)

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            if ((params.get('open') || '').toLowerCase() === 'true') {
                setMode('create')
                setEditUser(null)
                setOffOpen(true)
            }
        } catch {}
    }, [])

    return (
        <MasterLayout breadcrumbs={teamBreadcrumbs}>
            <Head title="Team" />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Team Management</h1>
                        <Link href={route('team.all-time-logs')}>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                                <Clock className="h-4 w-4" />
                                <span>All Time Logs</span>
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your team members and monitor their productivity</p>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Team Members</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    You have {teamMembers.length} team members
                                </CardDescription>

                                {(filters['start-date'] || filters['end-date'] || filters.search) && (
                                    <CardDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {getFilterDescription(filters)}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={filters['start-date'] || filters['end-date'] || filters.search ? 'default' : 'outline'}
                                    className={`flex items-center gap-2 ${
                                        filters['start-date'] || filters['end-date'] || filters.search
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter
                                        className={`h-4 w-4 ${filters['start-date'] || filters['end-date'] || filters.search ? 'text-primary dark:text-primary-foreground' : ''}`}
                                    />
                                    <span>{filters['start-date'] || filters['end-date'] || filters.search ? 'Filters Applied' : 'Filters'}</span>
                                </Button>
                                <ExportButton href={route('team.export') + window.location.search} label="Export" />
                                <Button
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setMode('create')
                                        setEditUser(null)
                                        setOffOpen(true)
                                    }}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    <span>Add Member</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {teamMembers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableHeaderRow>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Name / Email
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Hourly Rate
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Currency
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Total Hours
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Unpaid Hours
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Unpaid Amount
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Weekly Average
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Actions
                                            </TableHead>
                                        </TableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teamMembers.map((member) => (
                                            <TableRow
                                                key={member.id}
                                                className="dark:hover:bg-gray-750 border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700"
                                            >
                                                <TableCell className="py-3">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{member.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                                                    {member.is_employee ? (
                                                        <span className="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                            Employee
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {member.non_monetary ? '-' : member.hourly_rate}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {member.non_monetary ? '-' : member.currency}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {roundToTwoDecimals(member.totalHours)}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {roundToTwoDecimals(member.unpaidHours)}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {member.non_monetary ? '-' : `${member.currency} ${roundToTwoDecimals(member.unpaidAmount)}`}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {roundToTwoDecimals(member.weeklyAverage)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <Link href={route('team.time-logs', member.id)}>
                                                                <DropdownMenuItem className="group cursor-pointer">
                                                                    <Clock className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Time Logs</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuItem
                                                                className="group cursor-pointer"
                                                                onClick={() => {
                                                                    setMode('edit')
                                                                    setEditUser({
                                                                        id: member.id,
                                                                        name: member.name,
                                                                        email: member.email,
                                                                        hourly_rate: member.hourly_rate,
                                                                        currency: member.currency,
                                                                        non_monetary: member.non_monetary,
                                                                        is_employee: member.is_employee ?? false,
                                                                    })
                                                                    setOffOpen(true)
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                            <TeamMemberDeleteAction memberId={member.id} memberName={member.name} />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="rounded-md p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                                    <h3 className="mb-1 text-lg font-medium text-gray-800 dark:text-gray-200">No Team Members</h3>
                                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">You haven't added any team members yet.</p>
                                    <Button
                                        className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                        onClick={() => {
                                            setMode('create')
                                            setEditUser(null)
                                            setOffOpen(true)
                                        }}
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        <span>Add Team Member</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <TeamMemberOffCanvas open={offOpen} mode={mode} onClose={() => setOffOpen(false)} currencies={currencies} user={editUser ?? undefined} />
            <TeamFiltersOffCanvas open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} />
        </MasterLayout>
    )
}
