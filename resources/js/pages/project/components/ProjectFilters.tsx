import { useForm } from '@inertiajs/react'
import { Briefcase, Calendar, CalendarRange, Search, TimerReset, User } from 'lucide-react'
import { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'

export type ProjectFilters = {
    client: string
    'team-member': string
    'created-date-from': string | null
    'created-date-to': string | null
    search: string
}

export type ProjectFiltersProps = {
    filters: ProjectFilters
    clients: { id: number; name: string }[]
    teamMembers: { id: number; name: string }[]
}

export default function ProjectFiltersComponent({ filters, clients, teamMembers }: ProjectFiltersProps) {
    const { data, setData, get, processing } = useForm<ProjectFilters>({
        client: filters.client || '',
        'team-member': filters['team-member'] || '',
        'created-date-from': filters['created-date-from'] || null,
        'created-date-to': filters['created-date-to'] || null,
        search: filters.search || '',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        get(route('project.index'), {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const resetFilters = () => {
        setData({
            client: '',
            'team-member': '',
            'created-date-from': null,
            'created-date-to': null,
            search: '',
        })
        get(route('project.index'), {
            preserveState: true,
            preserveScroll: true,
        })
    }

    const hasActive = !!(
        data.client ||
        data['team-member'] ||
        data['created-date-from'] ||
        data['created-date-to'] ||
        data.search
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
                        placeholder="Search project"
                        className="border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="client" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Client
                </Label>
                <SearchableSelect
                    id="client"
                    value={data.client}
                    onChange={(value) => setData('client', String(value))}
                    options={[{ id: '', name: 'Clients' }, ...clients.map((c) => ({ id: c.id.toString(), name: c.name }))]}
                    placeholder="Clients"
                    disabled={processing}
                    icon={<Briefcase className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="team-member" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Team Member
                </Label>
                <SearchableSelect
                    id="team-member"
                    value={data['team-member']}
                    onChange={(value) => setData('team-member', String(value))}
                    options={[{ id: '', name: 'Team Members' }, ...teamMembers.map((m) => ({ id: m.id.toString(), name: m.name }))]}
                    placeholder="Team Members"
                    disabled={processing}
                    icon={<User className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="created-date-from" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Created Date From
                </Label>
                <DatePicker
                    selected={data['created-date-from'] ? new Date(data['created-date-from']) : null}
                    onChange={(date) => setData('created-date-from', date ? (date as Date).toISOString().split('T')[0] : null)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    disabled={processing}
                    customInput={
                        <CustomInput
                            id="created-date-from"
                            icon={<Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            disabled={processing}
                            placeholder="Select start date"
                            className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    }
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="created-date-to" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Created Date To
                </Label>
                <DatePicker
                    selected={data['created-date-to'] ? new Date(data['created-date-to']) : null}
                    onChange={(date) => setData('created-date-to', date ? (date as Date).toISOString().split('T')[0] : null)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    disabled={processing}
                    customInput={
                        <CustomInput
                            id="created-date-to"
                            icon={<CalendarRange className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            disabled={processing}
                            placeholder="Select end date"
                            className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    }
                />
            </div>

            <div className="mt-2 flex w-full flex-col gap-3">
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
