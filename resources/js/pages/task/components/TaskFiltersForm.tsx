import { useForm } from '@inertiajs/react'
import { AlertCircle, Briefcase, Calendar, CalendarRange, Flag, Search, Tag, TimerReset } from 'lucide-react'
import type { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import { Checkbox } from '@/components/ui/checkbox'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'

import type { TaskFilters } from '@/pages/task/types'

interface Props {
    filters: TaskFilters
    projects: { id: number; name: string }[]
    tags: { id: number; name: string; color: string }[]
}

export default function TaskFiltersForm({ filters, projects, tags }: Props) {
    const { data, setData, get, processing } = useForm<TaskFilters>({
        status: filters.status ?? 'all',
        priority: filters.priority ?? 'all',
        project: (filters.project as TaskFilters['project']) ?? 'all',
        tag: (filters.tag as TaskFilters['tag']) ?? 'all',
        'due-date-from': filters['due-date-from'] || '',
        'due-date-to': filters['due-date-to'] || '',
        'due-today': Boolean(filters['due-today']),
        search: filters.search || '',
    })

    const dueFrom = data['due-date-from'] ? new Date(data['due-date-from'] as string) : null
    const dueTo = data['due-date-to'] ? new Date(data['due-date-to'] as string) : null

    const handleFromChange = (date: Date | null) => {
        setData('due-date-from', date ? date.toISOString().split('T')[0] : '')
    }
    const handleToChange = (date: Date | null) => {
        setData('due-date-to', date ? date.toISOString().split('T')[0] : '')
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        console.log(data)
        get(route('task.index'), { preserveState: true })
    }

    const resetFilters = () => {
        setData({
            status: 'all',
            priority: 'all',
            project: 'all',
            tag: 'all',
            'due-date-from': '',
            'due-date-to': '',
            'due-today': false,
            search: '',
        })

        get(route('task.index'), { preserveState: true })
    }

    const hasActive = Boolean(
        data.search ||
            (data.status && data.status !== 'incomplete' && data.status !== 'all') ||
            (data.priority && data.priority !== 'all') ||
            (data.project && data.project !== 'all') ||
            (data.tag && data.tag !== 'all') ||
            data['due-date-from'] ||
            data['due-date-to'] ||
            data['due-today'],
    )

    return (
        <form onSubmit={submit} className="flex w-full flex-col gap-6">
            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="search" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Search
                </Label>
                <div className="relative">
                    <Input
                        id="search"
                        type="text"
                        value={data.search}
                        onChange={(e) => setData('search', e.target.value)}
                        placeholder="Search tasks..."
                        className="border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="status" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Status
                </Label>
                <SearchableSelect
                    id="status"
                    value={data.status}
                    onChange={(value) => setData('status', value as TaskFilters['status'])}
                    options={[
                        { id: 'all', name: 'Statuses' },
                        { id: 'incomplete', name: 'Incomplete' },
                        { id: 'pending', name: 'Pending' },
                        { id: 'in_progress', name: 'In Progress' },
                        { id: 'completed', name: 'Completed' },
                    ]}
                    placeholder="Statuses"
                    disabled={processing}
                    icon={<AlertCircle className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="priority" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Priority
                </Label>
                <SearchableSelect
                    id="priority"
                    value={data.priority}
                    onChange={(value) => setData('priority', value as TaskFilters['priority'])}
                    options={[
                        { id: 'all', name: 'Priorities' },
                        { id: 'low', name: 'Low' },
                        { id: 'medium', name: 'Medium' },
                        { id: 'high', name: 'High' },
                    ]}
                    placeholder="Priorities"
                    disabled={processing}
                    icon={<Flag className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="project" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Project
                </Label>
                <SearchableSelect
                    id="project"
                    value={String(data.project)}
                    onChange={(value) => setData('project', value)}
                    options={[{ id: 'all', name: 'Projects' }, ...projects]}
                    placeholder="Projects"
                    disabled={processing}
                    icon={<Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="tag" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Tag
                </Label>
                <SearchableSelect
                    id="tag"
                    value={String(data.tag)}
                    onChange={(value) => setData('tag', value)}
                    options={[{ id: 'all', name: 'Tags' }, ...tags]}
                    placeholder="Tags"
                    disabled={processing}
                    icon={<Tag className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="due-date-from" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Due From
                </Label>
                <DatePicker
                    selected={dueFrom}
                    onChange={handleFromChange}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    disabled={processing}
                    customInput={
                        <CustomInput
                            id="due-date-from"
                            icon={<Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            disabled={processing}
                            placeholder="Select start date"
                            className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    }
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="due-date-to" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Due To
                </Label>
                <DatePicker
                    selected={dueTo}
                    onChange={handleToChange}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    disabled={processing}
                    customInput={
                        <CustomInput
                            id="due-date-to"
                            icon={<CalendarRange className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            disabled={processing}
                            placeholder="Select end date"
                            className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    }
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="due-today"
                        checked={Boolean(data['due-today'])}
                        onCheckedChange={(checked) => setData('due-today', checked === true)}
                    />
                    <Label htmlFor="due-today" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Due Today
                    </Label>
                </div>
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

export const getTaskFilterDescription = (filters: TaskFilters): string => {
    let description = ''

    const from = formatDateValue(filters['due-date-from'])
    const to = formatDateValue(filters['due-date-to'])

    if (from && to) {
        description = `Due ${from} to ${to}`
    } else if (from) {
        description = `Due from ${from}`
    } else if (to) {
        description = `Due until ${to}`
    }

    if (filters['due-today']) {
        description = description ? `${description}; Due Today` : 'Due Today'
    }

    if (filters.project && filters.project !== 'all') {
        description = description ? `${description}; Project filtered` : 'Project filtered'
    }
    if (filters.tag && filters.tag !== 'all') {
        description = description ? `${description}; Tag filtered` : 'Tag filtered'
    }
    if (filters.priority && filters.priority !== 'all') {
        description = description ? `${description}; Priority ${filters.priority}` : `Priority ${filters.priority}`
    }
    if (filters.status && filters.status !== 'all') {
        description = description ? `${description}; Status ${filters.status.replace('_', ' ')}` : `Status ${filters.status.replace('_', ' ')}`
    }
    if (filters.search) {
        description = description ? `${description}; search "${filters.search}"` : `Search "${filters.search}"`
    }

    return description
}

const formatDateValue = (date: Date | string | null | ''): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    return date.toISOString().split('T')[0]
}
