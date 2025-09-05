import { useForm } from '@inertiajs/react'
import { Calendar, CalendarRange, Search, TimerReset, Briefcase, CheckCircle, AlertCircle } from 'lucide-react'
import { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'

type Filters = {
    'start-date': string
    'end-date': string
    project: string
    'is-paid': string
    status: string
}

type Project = { id: number; name: string }

interface MemberTimeLogsFiltersProps {
    filters: Filters
    projects: Project[]
    userId: number
}

export default function MemberTimeLogsFilters({ filters, projects, userId }: MemberTimeLogsFiltersProps) {
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
        get(route('team.time-logs', userId), {
            preserveState: true,
        })
    }

    const resetFilters = () => {
        setData({
            'start-date': '',
            'end-date': '',
            project: '',
            'is-paid': '',
            status: '',
        })
        get(route('team.time-logs', userId), {
            preserveState: true,
        })
    }

    const hasActiveFilters = !!(data['start-date'] || data['end-date'] || data.project || data['is-paid'] || data.status)

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
