declare interface TaskAssignedEvent {
    task: {
        id: number
        title: string
        project?: {
            name?: string
        }
    }
    assigner: {
        name?: string
    }
}

declare interface TaskCompletedEvent {
    task: {
        id: number
        title: string
        project?: {
            name?: string
        }
    }
    completer: {
        name?: string
        id?: number
    }
    projectOwner?: {
        id?: number
        name?: string
    }
}
