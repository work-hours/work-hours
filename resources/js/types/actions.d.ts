import { Task, TaskFilters } from '../pages/task/types'

/**
 * Generic interface for all action imports
 */
interface Action<T, P = Record<string, unknown>> {
    data: (params: P) => Promise<T>
}

/**
 * TaskController action types
 */
declare module '@actions/TaskController' {
    export const tasks: Action<Task[], { params?: Partial<TaskFilters> }>
    export const potentialAssignees: Action<{ id: number; name: string }[]>
}
