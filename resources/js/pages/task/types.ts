/**
 * Type definitions for Task-related components
 */

export type User = {
    id: number
    name: string
    email: string
}

export type Project = {
    id: number
    name: string
    user_id: number
}

export type Task = {
    id: number
    project_id: number
    title: string
    description: string | null
    status: 'pending' | 'in_progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    due_date: string | null
    project: Project
    assignees: User[]
}

/**
 * Task filter interface
 */
export interface TaskFilters {
    status: string
    priority: string
    project_id: string
    due_date_from: Date | string | ''
    due_date_to: Date | string | ''
    search: string
}
