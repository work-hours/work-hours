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
