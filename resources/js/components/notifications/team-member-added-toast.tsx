export default function TeamMemberAddedToast({ e }: { e: TeamMemberAddedEvent }) {
    const creatorName = e?.creator?.name

    const messageParts: string[] = []
    messageParts.push('You have been added to ')
    if (creatorName) {
        messageParts.push(`${creatorName}`)
    }
    messageParts.push("'s team")

    return (
        <div className="flex items-start gap-3">
            <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">You have been added to a team</div>
                <div className="mt-0.5 text-sm text-gray-600 dark:text-gray-300">{messageParts.join(' ')}</div>
            </div>
        </div>
    )
}
