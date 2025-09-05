export type TeamTimeLog = {
    id: number
    user_name?: string
    project_id: number
    project_name: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    is_paid: boolean
    hourly_rate?: number
    paid_amount?: number
}

export type TeamTimeLogFilters = {
    'start-date': string
    'end-date': string
    user?: string
    project: string
    'is-paid': string
    status: string
    tag?: string
}

export type TeamMember = {
    id: number
    name: string
    email?: string
}

export type TeamProject = {
    id: number
    name: string
}

export type TeamTag = {
    id: number
    name: string
}

export type AllTeamTimeLogFilters = Omit<TeamTimeLogFilters, 'user' | 'tag'> & { user: string; tag: string }

export type AllTeamTimeLogsProps = {
    timeLogs: TeamTimeLog[]
    filters: AllTeamTimeLogFilters
    teamMembers: TeamMember[]
    projects: TeamProject[]
    tags: TeamTag[]
    totalDuration: number
    unpaidHours: number
    paidHours: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmountsByCurrency: Record<string, number>
    currency: string
    weeklyAverage: number
    unbillableHours: number
    links?: { url: string | null; label: string; active: boolean }[]
}

export type MemberTimeLogsProps = {
    timeLogs: TeamTimeLog[]
    filters: Omit<TeamTimeLogFilters, 'user' | 'tag'>
    projects: TeamProject[]
    user: {
        id: number
        name: string
        email: string
    }
    totalDuration: number
    unpaidHours: number
    paidHours?: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmountsByCurrency: Record<string, number>
    currency: string
    weeklyAverage: number
    unbillableHours: number
    links?: { url: string | null; label: string; active: boolean }[]
}
