import { useForm } from '@inertiajs/react'
import { Calendar, CalendarRange, Search, TimerReset } from 'lucide-react'
import type { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import type { ClientFilters } from '@/@types/client'

interface Props {
    filters: ClientFilters
}

export default function ClientFiltersComponent({ filters }: Props) {
    const { data, setData, get, processing } = useForm<ClientFilters>({
        search: filters.search || '',
        'created-date-from': filters['created-date-from'] || '',
        'created-date-to': filters['created-date-to'] || '',
    })

    const createdFrom = data['created-date-from'] ? new Date(data['created-date-from'] as string) : null
    const createdTo = data['created-date-to'] ? new Date(data['created-date-to'] as string) : null

    const handleFromChange = (date: Date | null) => {
        if (date) {
            setData('created-date-from', date.toISOString().split('T')[0])
        } else {
            setData('created-date-from', '')
        }
    }

    const handleToChange = (date: Date | null) => {
        if (date) {
            setData('created-date-to', date.toISOString().split('T')[0])
        } else {
            setData('created-date-to', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        get(route('client.index'), { preserveState: true })
    }

    const resetFilters = () => {
        setData({
            search: '',
            'created-date-from': '',
            'created-date-to': '',
        })
        get(route('client.index'), { preserveState: true })
    }

    const hasActive = !!(data.search || data['created-date-from'] || data['created-date-to'])

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
                        placeholder="Search clients..."
                        className="border-gray-200 bg-white pl-9 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                    />
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="created-date-from" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Created From
                </Label>
                <DatePicker
                    selected={createdFrom}
                    onChange={handleFromChange}
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
                    Created To
                </Label>
                <DatePicker
                    selected={createdTo}
                    onChange={handleToChange}
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

export const getClientFilterDescription = (filters: ClientFilters): string => {
    let description = ''

    if (filters['created-date-from'] && filters['created-date-to']) {
        description = `Showing clients from ${formatDateValue(filters['created-date-from'])} to ${formatDateValue(filters['created-date-to'])}`
    } else if (filters['created-date-from']) {
        description = `Showing clients from ${formatDateValue(filters['created-date-from'])}`
    } else if (filters['created-date-to']) {
        description = `Showing clients until ${formatDateValue(filters['created-date-to'])}`
    }

    if (filters.search) {
        if (description) {
            description += ` matching "${filters.search}"`
        } else {
            description = `Showing clients matching "${filters.search}"`
        }
    }

    return description
}

const formatDateValue = (date: Date | string | null): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    return date.toISOString().split('T')[0]
}
