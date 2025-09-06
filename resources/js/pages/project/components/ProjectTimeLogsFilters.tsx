import { useForm } from '@inertiajs/react'
import { AlertCircle, Calendar, CalendarRange, CheckCircle, Search, TimerReset, User } from 'lucide-react'
import { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'

export type ProjectTimeLogFilters = {
    'start-date': string
    'end-date': string
    user: string
    'is-paid': string
    status: string
}

type TeamMember = { id: number; name: string }

interface ProjectTimeLogsFiltersProps {
    filters: ProjectTimeLogFilters
    teamMembers: TeamMember[]
    projectId: number
}

export default function ProjectTimeLogsFilters({ filters, teamMembers, projectId }: ProjectTimeLogsFiltersProps) {
    const { data, setData, get, processing } = useForm<ProjectTimeLogFilters>({
        'start-date': filters['start-date'] || '',
        'end-date': filters['end-date'] || '',
        user: filters.user || '',
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
        get(route('project.time-logs', projectId), {
            preserveState: true,
        })
    }

    const resetFilters = () => {
        setData({
            'start-date': '',
            'end-date': '',
            user: '',
            'is-paid': '',
            status: '',
        })
        get(route('project.time-logs', projectId), {
            preserveState: true,
        })
    }

    const hasActiveFilters = !!(data['start-date'] || data['end-date'] || data.user || data['is-paid'] || data.status)

    return (
        <form onSubmit={submit} className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
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

            <div className="flex w-full flex-col gap-2">
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

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="user" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Team Member
                </Label>
                <SearchableSelect
                    id="user"
                    value={data.user}
                    onChange={(value) => setData('user', value)}
                    options={[{ id: '', name: 'Team Members' }, ...teamMembers]}
                    placeholder="Select team member"
                    disabled={processing}
                    icon={<User className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                    className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                />
            </div>

            <div className="flex w-full flex-col gap-2">
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

            <div className="flex w-full flex-col gap-2">
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

            <div className="mt-2 flex w-full flex-col gap-3">
                <FilterButton title="Apply filters" disabled={processing} className="w-full justify-center">
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                </FilterButton>

                <FilterButton
                    variant="clear"
                    disabled={processing || !hasActiveFilters}
                    onClick={resetFilters}
                    title="Clear filters"
                    className="w-full justify-center"
                >
                    <TimerReset className="mr-2 h-4 w-4" />
                    Clear Filters
                </FilterButton>
            </div>
        </form>
    )
}
