import { type BreadcrumbItem } from '@/types'
import type { Client, ClientFilters } from '@/@types/client'

export type { Client, ClientFilters }

export type ClientPageProps = {
    clients: Client[]
    filters: ClientFilters
}

export const clientBreadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/client',
    },
]

export const getFilterDescription = (filters: ClientFilters): string => {
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
