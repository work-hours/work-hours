import { useForm } from '@inertiajs/react'
import { AlertCircle, Briefcase, Calendar, CalendarRange, CheckCircle, Search, Tag as TagIcon, TimerReset } from 'lucide-react'
import type { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { TimeLogStatus, timeLogStatusOptions } from '@/types/TimeLogStatus'

export type TimeLogFilters = {
    'start-date': string
    'end-date': string
    project: string
    'is-paid': string
    status: string
    tag: string
}

interface Props {
    filters: TimeLogFilters
    projects: { id: number; name: string }[]
    tags: { id: number; name: string }[]
    setHasActiveFilters?: (val: boolean) => void
}

export default function TimeLogFiltersForm({ filters, projects, tags, setHasActiveFilters }: Props) {
    const { data, setData, get, processing } = useForm<TimeLogFilters>({
        'start-date': filters['start-date'] || '',
        'end-date': filters['end-date'] || '',
        project: filters.project || '',
        'is-paid': filters['is-paid'] || '',
        status: filters.status || '',
        tag: filters.tag || '',
    })

    const startDate = data['start-date'] ? new Date(data['start-date']) : null
    const endDate = data['end-date'] ? new Date(data['end-date']) : null

    const handleStartDateChange = (date: Date | null) => {
        setData('start-date', date ? date.toISOString().split('T')[0] : '')
    }
    const handleEndDateChange = (date: Date | null) => {
        setData('end-date', date ? date.toISOString().split('T')[0] : '')
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        if (setHasActiveFilters) {
            setHasActiveFilters(Boolean(data['start-date'] || data['end-date'] || data.project || data['is-paid'] || data.status || data.tag))
        }
        get(route('time-log.index'), { preserveState: true })
    }

    const hasActive = Boolean(data['start-date'] || data['end-date'] || data.project || data['is-paid'] || data.status || data.tag)

    const resetFilters = () => {
        setData({ 'start-date': '', 'end-date': '', project: '', 'is-paid': '', status: '', tag: '' })
    }

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
                    options={[{ id: '', name: 'All Projects' }, ...projects]}
                    placeholder="Select project"
                    disabled={processing}
                    icon={<Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
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
                        { id: '', name: 'All Statuses' },
                        { id: 'true', name: 'Paid' },
                        { id: 'false', name: 'Unpaid' },
                    ]}
                    placeholder="Select status"
                    disabled={processing}
                    icon={<CheckCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
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
                    options={[{ id: '', name: 'All Statuses' }, ...timeLogStatusOptions]}
                    placeholder="Approval status"
                    disabled={processing}
                    icon={<AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>
            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="tag" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Tag
                </Label>
                <SearchableSelect
                    id="tag"
                    value={data.tag}
                    onChange={(value) => setData('tag', value)}
                    options={[{ id: '', name: 'All Tags' }, ...tags]}
                    placeholder="Select tag"
                    disabled={processing}
                    icon={<TagIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="mt-2 flex w-full flex-col gap-3 p-1">
                <FilterButton title="Apply filters" disabled={processing} className="w-full justify-center">
                    <Search className="mr-2 h-4 w-4" />
                    Apply Filters
                </FilterButton>
                <FilterButton
                    variant="clear"
                    disabled={processing || !hasActive}
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

export const getTimeLogFilterDescription = (filters: TimeLogFilters, projects: { id: number; name: string }[]): string => {
    let description = ''
    if (filters['start-date'] && filters['end-date']) {
        description = `Showing logs from ${filters['start-date']} to ${filters['end-date']}`
    } else if (filters['start-date']) {
        description = `Showing logs from ${filters['start-date']}`
    } else if (filters['end-date']) {
        description = `Showing logs until ${filters['end-date']}`
    }
    if (filters.project) {
        const project = projects.find((p) => String(p.id) === filters.project)
        if (project) description = description ? `${description} for ${project.name}` : `Showing logs for ${project.name}`
    }
    if (filters['is-paid']) {
        const paymentStatus = filters['is-paid'] === 'true' ? 'paid' : 'unpaid'
        description = description ? `${description} (${paymentStatus})` : `Showing ${paymentStatus} logs`
    }
    if (filters.status) {
        const statusText = filters.status === TimeLogStatus.PENDING ? 'pending' : filters.status === TimeLogStatus.APPROVED ? 'approved' : 'rejected'
        description = description ? `${description} with ${statusText} status` : `Showing logs with ${statusText} status`
    }
    if (filters.tag) {
        description = description ? `${description}; Tag filtered` : 'Tag filtered'
    }
    return description
}
