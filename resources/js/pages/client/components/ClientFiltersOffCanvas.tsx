import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import CustomInput from '@/components/ui/custom-input'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import FilterButton from '@/components/filter-button'
import { Calendar, CalendarRange, Search, TimerReset } from 'lucide-react'

import type { ClientFilters } from '@/@types/client'

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    filters: ClientFilters
    processing: boolean
    parseDate: (value: Date | string | null) => Date | null
    onChange: (key: keyof ClientFilters, value: string | Date | null) => void
    onClear: () => void
    onSubmit: (e: { preventDefault: () => void }) => void
}

export default function ClientFiltersOffCanvas({ open, onOpenChange, filters, processing, parseDate, onChange, onClear, onSubmit }: Props) {
    const hasActiveFilters = Boolean(filters.search || filters['created-date-from'] || filters['created-date-to'])

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pb-6 pl-4 pr-4 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-neutral-900 dark:text-white">Filters</SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Narrow down clients by date range or search.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={onSubmit} className="flex w-full flex-col gap-6">
                    <div className="flex w-full flex-col gap-2">
                        <Label htmlFor="search" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Search
                        </Label>
                        <div className="relative">
                            <Input
                                id="search"
                                type="text"
                                value={filters.search}
                                onChange={(e) => onChange('search', e.target.value)}
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
                            selected={parseDate(filters['created-date-from'])}
                            onChange={(date) => onChange('created-date-from', date)}
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
                            selected={parseDate(filters['created-date-to'])}
                            onChange={(date) => onChange('created-date-to', date)}
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
                            disabled={processing || !hasActiveFilters}
                            onClick={onClear}
                            title="Clear filters"
                            className="w-full justify-center"
                        >
                            <TimerReset className="mr-2 h-4 w-4" />
                            Clear Filters
                        </FilterButton>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
