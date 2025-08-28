export type TeamMember = {
    id: number
    name: string
    email: string
    hourly_rate?: number
    currency?: string
    non_monetary?: boolean
}

export type Client = {
    id: number
    name: string
}

export type Currency = { id: number; user_id: number; code: string }

export type ProjectForm = {
    name: string
    description: string
    client_id: string
    team_members: number[]
    approvers: number[]
    team_member_rates: Record<number, { hourly_rate: string; currency: string }>
}

export type CreateProjectProps = {
    teamMembers: TeamMember[]
    clients: Client[]
    currencies: Currency[]
}

export type EditProjectProps = {
    project: {
        id: number
        name: string
        description: string | null
        client_id: number | null
        source?: string
        is_imported?: boolean
    }
    teamMembers: TeamMember[]
    assignedTeamMembers: number[]
    assignedApprovers: number[]
    teamMemberRates?: Record<number, { hourly_rate: number | null; currency: string | null }>
    clients: Client[]
    currencies: Currency[]
}
