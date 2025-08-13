import { ActionButton, ActionButtonGroup, ExportButton } from '@/components/action-buttons'
import DeleteTeamMember from '@/components/delete-team-member'
import { Button } from '@/components/ui/button'
import FilterButton from '@/components/filter-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { Calendar, CalendarRange, Clock, Edit, Search, TimerReset, UserPlus, Users } from 'lucide-react'
import { FormEventHandler } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
]

type TeamMember = {
    id: number
    name: string
    email: string
    hourly_rate: number
    currency: string
    non_monetary: boolean
    totalHours: number
    weeklyAverage: number
    unpaidHours: number
    unpaidAmount: number
}

type Filters = {
    'start-date': string
    'end-date': string
    search: string
}

type Props = {
    teamMembers: TeamMember[]
    filters: Filters
}

export default function Team({ teamMembers, filters }: Props) {
    const { data, setData, get, processing } = useForm<Filters>({
        'start-date': filters['start-date'] || '',
        'end-date': filters['end-date'] || '',
        search: filters.search || '',
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
        get(route('team.index'), {
            preserveState: true,
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
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
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Team Members</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    You have {teamMembers.length} team members
                                </CardDescription>

                                {(data['start-date'] || data['end-date'] || data.search) && (
                                    <CardDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {(() => {
                                            let description = ''

                                            if (data['start-date'] && data['end-date']) {
                                                description = `Showing team data from ${data['start-date']} to ${data['end-date']}`
                                            } else if (data['start-date']) {
                                                description = `Showing team data from ${data['start-date']}`
                                            } else if (data['end-date']) {
                                                description = `Showing team data until ${data['end-date']}`
                                            }

                                            if (data.search) {
                                                if (description) {
                                                    description += ` matching "${data.search}"`
                                                } else {
                                                    description = `Showing team members matching "${data.search}"`
                                                }
                                            }

                                            return description
                                        })()}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <ExportButton href={route('team.export') + window.location.search} label="Export" />
                                <Link href={route('team.create')}>
                                    <Button
                                        className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-sm"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        <span>Add Member</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                            <form onSubmit={submit} className="flex w-full flex-row gap-4">
                                <div className="flex w-full flex-col gap-1">
                                    <Label htmlFor="search" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Search
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="search"
                                            type="text"
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            placeholder="Search by name or email"
                                            className="border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col gap-1">
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
                                <div className="flex w-full flex-col gap-1">
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
                                <div className="flex items-end gap-2">
                                    <FilterButton
                                        title="Apply filters"
                                        disabled={processing}
                                    >
                                        <Search className="h-4 w-4" />
                                    </FilterButton>

                                    <FilterButton
                                        variant="clear"
                                        disabled={processing || (!data['start-date'] && !data['end-date'] && !data.search)}
                                        onClick={() => {
                                            setData({
                                                'start-date': '',
                                                'end-date': '',
                                                search: '',
                                            })
                                            get(route('team.index'), {
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
                        {teamMembers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableHeaderRow>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Name / Email</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Hourly Rate</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Currency</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Total Hours</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Unpaid Hours</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Unpaid Amount</TableHead>
                                            <TableHead className="bg-gray-50 text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Weekly Average</TableHead>
                                            <TableHead className="bg-gray-50 text-right text-xs font-medium text-gray-500 dark:bg-gray-750 dark:text-gray-400">Actions</TableHead>
                                        </TableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {teamMembers.map((member) => (
                                            <TableRow key={member.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750">
                                                <TableCell className="py-3">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{member.name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{member.non_monetary ? '-' : member.hourly_rate}</TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{member.non_monetary ? '-' : member.currency}</TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{roundToTwoDecimals(member.totalHours)}</TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{roundToTwoDecimals(member.unpaidHours)}</TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {member.non_monetary ? '-' : `${member.currency} ${roundToTwoDecimals(member.unpaidAmount)}`}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{roundToTwoDecimals(member.weeklyAverage)}</TableCell>
                                                <TableCell className="text-right">
                                                    <ActionButtonGroup>
                                                        <ActionButton
                                                            href={route('team.time-logs', member.id)}
                                                            title="View Time Logs"
                                                            icon={Clock}
                                                            label="Logs"
                                                            variant="info"
                                                        />
                                                        <ActionButton
                                                            href={route('team.edit', member.id)}
                                                            title="Edit Member"
                                                            icon={Edit}
                                                            variant="warning"
                                                            size="icon"
                                                        />
                                                        <DeleteTeamMember userId={member.id} />
                                                    </ActionButtonGroup>
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
                                    <Link href={route('team.create')}>
                                        <Button className="flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            <span>Add Team Member</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
