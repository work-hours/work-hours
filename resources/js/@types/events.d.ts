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

declare interface TeamMemberAddedEvent {
    member: {
        id: number
        name?: string
    }
    creator: {
        id: number
        name?: string
    }
}

declare interface TimeLogEntryCreatedEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
    }
    creator: {
        id?: number
        name?: string
    }
    teamLeader: {
        id?: number
        name?: string
    }
}

declare interface TimeLogApprovedEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
    }
    approver: {
        id?: number
        name?: string
    }
    timeLogOwner: {
        id?: number
        name?: string
    }
}

declare interface TimeLogRejectedEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
        comment?: string
    }
    approver: {
        id?: number
        name?: string
    }
    timeLogOwner: {
        id?: number
        name?: string
    }
}

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

declare interface TeamMemberAddedEvent {
    member: {
        id: number
        name?: string
    }
    creator: {
        id: number
        name?: string
    }
}

declare interface TimeLogEntryCreatedEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
    }
    creator: {
        id?: number
        name?: string
    }
    teamLeader: {
        id?: number
        name?: string
    }
}

declare interface TimeLogApprovedEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
    }
    approver: {
        id?: number
        name?: string
    }
    timeLogOwner: {
        id?: number
        name?: string
    }
}

declare interface TimeLogRejectedEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
        comment?: string
    }
    approver: {
        id?: number
        name?: string
    }
    timeLogOwner: {
        id?: number
        name?: string
    }
}

declare interface TaskCommentedEvent {
    task: {
        id: number
        title?: string
        project?: {
            name?: string
        }
    }
    comment: {
        id: number
        body?: string
    }
    commenter: {
        id?: number
        name?: string
    }
    recipient: {
        id?: number
        name?: string
    }
}


// Realtime event for time log paid
declare interface TimeLogPaidEvent {
    timeLog: {
        id: number
        duration?: number
        project?: {
            name?: string
        }
    }
    payer: {
        id?: number
        name?: string
    }
    recipient: {
        id?: number
        name?: string
    }
}
