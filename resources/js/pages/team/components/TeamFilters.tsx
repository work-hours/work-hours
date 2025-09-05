import { useForm } from '@inertiajs/react'
import { Calendar, CalendarRange, Search, TimerReset } from 'lucide-react'
import { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { TeamFilters } from '@/pages/team/types'

interface TeamFiltersProps {
    filters: TeamFilters
}

export default function TeamFiltersComponent({ filters }: TeamFiltersProps) {
    const { data, setData, get, processing } = useForm<TeamFilters>({
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

    const resetFilters = () => {
        setData({
            'start-date': '',
            'end-date': '',
            search: '',
        })
        get(route('team.index'), {
            preserveState: true,
        })
    }

    const hasActiveFilters = !!(data['start-date'] || data['end-date'] || data.search)

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
                        placeholder="Search by name or email"
                        className="border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

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

            <div className="mt-2 flex w-full flex-col gap-3">
                <FilterButton
                    title="Apply filters"
                    disabled={processing}
                    className="w-full justify-center"
                >
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

export const getFilterDescription = (filters: TeamFilters): string => {
    let description = ''

    if (filters['start-date'] && filters['end-date']) {
        description = `Showing team data from ${filters['start-date']} to ${filters['end-date']}`
    } else if (filters['start-date']) {
        description = `Showing team data from ${filters['start-date']}`
    } else if (filters['end-date']) {
        description = `Showing team data until ${filters['end-date']}`
    }

    if (filters.search) {
        if (description) {
            description += ` matching "${filters.search}"`
        } else {
            description = `Showing team data matching "${filters.search}"`
        }
    }

    return description
}
