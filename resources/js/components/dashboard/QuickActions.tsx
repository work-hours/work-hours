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
                    className="inline-flex items-center gap-2 rounded-none border-2 border-blue-900 dark:border-blue-700 bg-blue-900 dark:bg-blue-700 px-3 py-2 font-['Courier_New',monospace] text-sm font-bold text-white transition-colors hover:bg-blue-800 dark:hover:bg-blue-600"
                >
                    {action.icon}
                    {action.name}
                </Link>
            ))}
        </div>
    )
}
