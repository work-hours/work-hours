export type TimeLog = {
    id: number
    user_id: number
    user_name: string
    project_id: number
    project_name: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    status: 'pending' | 'approved' | 'rejected'
}

export type Filters = {
    'start-date': string
    'end-date': string
    project: string
    user: string
}

export type Project = {
    id: number
    name: string
}

export type TeamMember = {
    id: number
    name: string
    email: string
}

export type ApprovalProps = {
    timeLogs: TimeLog[]
    filters: Filters
    projects: Project[]
    teamMembers: TeamMember[]
    totalDuration: number
}
