import { Link } from '@inertiajs/react'
import { BarChart3, ClockIcon, PlusCircle, UsersIcon } from 'lucide-react'

interface QuickAction {
    name: string
    icon: React.ReactNode
    href: string
}

export default function QuickActions() {
    const quickActions: QuickAction[] = [
        { name: 'Log Time', icon: <ClockIcon className="h-5 w-5" />, href: route('time-log.create') },
        { name: 'Add Team Member', icon: <UsersIcon className="h-5 w-5" />, href: route('team.create') },
        { name: 'Create Project', icon: <PlusCircle className="h-5 w-5" />, href: route('project.create') },
        { name: 'All Team Log', icon: <BarChart3 className="h-5 w-5" />, href: route('team.all-time-logs') },
    ]

    return (
        <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
                <Link
                    key={index}
                    href={action.href}
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
                >
                    {action.icon}
                    {action.name}
                </Link>
            ))}
        </div>
    )
}
