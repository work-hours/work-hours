import { FormEventHandler } from 'react'
import { Calendar, CalendarRange, Search, TimerReset } from 'lucide-react'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'

import { ClientFilters } from '@/pages/client/types'

interface ClientFiltersProps {
    filters: ClientFilters
    processing: boolean
    handleFilterChange: (key: keyof ClientFilters, value: string | Date | null) => void
    clearFilters: () => void
    handleSubmit: FormEventHandler
    parseDate: (dateValue: Date | string | null) => Date | null
}

export default function ClientFiltersComponent({
    filters,
    processing,
    handleFilterChange,
    clearFilters,
    handleSubmit,
    parseDate
}: ClientFiltersProps) {
    const hasActiveFilters = !!(filters.search || filters['created-date-from'] || filters['created-date-to'])

    return (
        <form onSubmit={handleSubmit} className="flex w-full flex-row gap-4">
            <div className="flex w-full flex-col gap-1">
                <Label htmlFor="search" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Search
                </Label>
                <div className="relative">
                    <Input
                        id="search"
                        placeholder="Search clients..."
                        className="h-10 border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col gap-1">
                <Label htmlFor="created-date-from" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Created From
                </Label>
                <DatePicker
                    selected={parseDate(filters['created-date-from'])}
                    onChange={(date) => handleFilterChange('created-date-from', date)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    disabled={processing}
                    customInput={
                        <CustomInput
                            id="created-date-from"
                            icon={<Calendar className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            disabled={processing}
                            placeholder="Select start date"
                            className="h-10 border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        />
                    }
                />
            </div>

            <div className="flex w-full flex-col gap-1">
                <Label htmlFor="created-date-to" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Created To
                </Label>
                <DatePicker
                    selected={parseDate(filters['created-date-to'])}
                    onChange={(date) => handleFilterChange('created-date-to', date)}
                    dateFormat="yyyy-MM-dd"
                    isClearable
                    disabled={processing}
                    customInput={
                        <CustomInput
                            id="created-date-to"
                            icon={<CalendarRange className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
                            disabled={processing}
                            placeholder="Select end date"
                            className="h-10 border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
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
                    disabled={processing || !hasActiveFilters}
                    onClick={clearFilters}
                    title="Clear filters"
                >
                    <TimerReset className="h-4 w-4" />
                </FilterButton>
            </div>
        </form>
    )
}
