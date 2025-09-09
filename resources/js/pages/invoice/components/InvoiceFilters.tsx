import { useForm } from '@inertiajs/react'
import { Briefcase, Calendar, CalendarRange, Search, TimerReset } from 'lucide-react'
import type { FormEventHandler } from 'react'

import FilterButton from '@/components/filter-button'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'

export type InvoiceFilters = {
    search: string
    client: string
    status: string
    'created-date-from': string | null
    'created-date-to': string | null
}

export type InvoiceFiltersProps = {
    filters: InvoiceFilters
    clients: { id: number; name: string }[]
    onApply: (filters: InvoiceFilters) => void
}

export default function InvoiceFiltersComponent({ filters, clients, onApply }: InvoiceFiltersProps) {
    const { data, setData, processing } = useForm<InvoiceFilters>({
        search: filters.search || '',
        client: filters.client || '',
        status: filters.status || '',
        'created-date-from': filters['created-date-from'] || null,
        'created-date-to': filters['created-date-to'] || null,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        onApply({
            search: data.search || '',
            client: data.client || '',
            status: data.status || '',
            'created-date-from': data['created-date-from'] || null,
            'created-date-to': data['created-date-to'] || null,
        })
    }

    const resetFilters = () => {
        const cleared: InvoiceFilters = {
            search: '',
            client: '',
            status: '',
            'created-date-from': null,
            'created-date-to': null,
        }
        setData(cleared)
        onApply(cleared)
    }

    const hasActive = !!(data.search || data.client || data.status || data['created-date-from'] || data['created-date-to'])

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
                        placeholder="Search invoice #"
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
                <Label htmlFor="status" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Status
                </Label>
                <SearchableSelect
                    id="status"
                    value={data.status}
                    onChange={(value) => setData('status', String(value))}
                    options={[
                        { id: '', name: 'All Statuses' },
                        { id: 'draft', name: 'Draft' },
                        { id: 'sent', name: 'Sent' },
                        { id: 'paid', name: 'Paid' },
                        { id: 'partially_paid', name: 'Partially Paid' },
                        { id: 'overdue', name: 'Overdue' },
                        { id: 'cancelled', name: 'Cancelled' },
                    ]}
                    placeholder="All Statuses"
                    disabled={processing}
                />
            </div>

            <div className="flex w-full flex-col gap-2">
                <Label htmlFor="created-date-from" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Date From
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
                    Date To
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
