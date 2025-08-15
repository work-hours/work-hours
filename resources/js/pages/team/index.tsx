import { ExportButton } from '@/components/action-buttons'
import AddNewButton from '@/components/add-new-button'
import FilterButton from '@/components/filter-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, router, useForm } from '@inertiajs/react'
import { Calendar, CalendarRange, Clock, Edit, Search, TimerReset, UserPlus, Users, MoreVertical, Trash2 } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

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
                                <AddNewButton href={route('team.create')}>
                                    <UserPlus className="h-4 w-4" />
                                    <span>Add Member</span>
                                </AddNewButton>
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
                                    <FilterButton title="Apply filters" disabled={processing}>
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
                                                                <DropdownMenuItem className="cursor-pointer group">
                                                                    <Clock className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Time Logs</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link href={route('team.edit', member.id)}>
                                                                <DropdownMenuItem className="cursor-pointer group">
                                                                    <Edit className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Edit</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <DropdownMenuItem className="cursor-pointer group">
                                                                        <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700 dark:text-red-400 dark:group-hover:text-red-300" />
                                                                        <span className="text-red-600 dark:text-red-400">Delete</span>
                                                                    </DropdownMenuItem>
                                                                </DialogTrigger>
                                                                <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                                                                    <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
                                                                        Are you sure you want to delete this team member?
                                                                    </DialogTitle>
                                                                    <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                                                                        Once the team member is deleted, all of their data will be permanently removed. This action cannot be undone.
                                                                    </DialogDescription>
                                                                    <form className="space-y-6" onSubmit={(e) => {
                                                                        e.preventDefault();
                                                                        router.delete(route('team.destroy', member.id), {
                                                                            preserveScroll: true,
                                                                            onSuccess: () => toast.success('Team member deleted successfully')
                                                                        });
                                                                    }}>
                                                                        <DialogFooter className="gap-2">
                                                                            <DialogClose asChild>
                                                                                <Button
                                                                                    variant="secondary"
                                                                                    className="border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                                                                                >
                                                                                    Cancel
                                                                                </Button>
                                                                            </DialogClose>

                                                                            <Button
                                                                                variant="destructive"
                                                                                className="bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-700/80 dark:hover:bg-red-700"
                                                                                asChild
                                                                            >
                                                                                <button type="submit">Delete Team Member</button>
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </form>
                                                                </DialogContent>
                                                            </Dialog>
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
                                    <AddNewButton href={route('team.create')}>
                                        <UserPlus className="h-4 w-4" />
                                        <span>Add Team Member</span>
                                    </AddNewButton>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
