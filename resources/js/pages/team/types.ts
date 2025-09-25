import { type BreadcrumbItem } from '@/types'

export type TeamMember = {
    id: number
    name: string
    email: string
    hourly_rate: number
    currency: string
    non_monetary: boolean
    is_employee: boolean
    permissions?: number[]
    totalHours: number
    weeklyAverage: number
    unpaidHours: number
    unpaidAmount: number
}

export type TeamFilters = {
    'start-date': string
    'end-date': string
    search: string
}

export type Currency = {
    id: number
    user_id: number
    code: string
    created_at: string
    updated_at: string
}

export type PermissionItem = { id: number; name: string; description?: string | null }
export type PermissionsByModule = Record<string, PermissionItem[]>

export type TeamPageProps = {
    teamMembers: TeamMember[]
    filters: TeamFilters
    currencies: Currency[]
    genericEmails: string[]
    permissionsByModule: PermissionsByModule
}

export const teamBreadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
]
