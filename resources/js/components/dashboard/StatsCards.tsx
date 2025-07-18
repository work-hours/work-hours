import { roundToTwoDecimals } from '@/lib/utils'
import { BarChart3, BriefcaseIcon, ClockIcon, DollarSign, TrendingUp, UsersIcon } from 'lucide-react'
import StatsCard from './StatsCard'

interface TeamStats {
    count: number
    totalHours: number
    unpaidHours: number
    unpaidAmount: number
    paidAmount: number
    currency: string
    weeklyAverage: number
    clientCount: number
}

interface StatsCardsProps {
    teamStats: TeamStats
}

export default function StatsCards({ teamStats }: StatsCardsProps) {
    return (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <StatsCard
                title="Team Members"
                icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
                value={teamStats.count}
                description="Active members in your team"
            />

            <StatsCard
                title="Clients"
                icon={<BriefcaseIcon className="h-4 w-4 text-muted-foreground" />}
                value={teamStats.clientCount}
                description="Total active clients"
            />

            <StatsCard
                title="Total Hours"
                icon={<ClockIcon className="h-4 w-4 text-muted-foreground" />}
                value={roundToTwoDecimals(teamStats.totalHours)}
                trend={{
                    icon: <TrendingUp className="mr-1 h-3 w-3" />,
                    text: `+${roundToTwoDecimals(teamStats.weeklyAverage)} hrs this week`,
                    color: 'text-green-500',
                }}
            />

            <StatsCard
                title="Weekly Average"
                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                value={roundToTwoDecimals(teamStats.weeklyAverage)}
                description="Hours per team member"
            />

            <StatsCard
                title="Paid Amount"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                value={`${teamStats.currency} ${roundToTwoDecimals(teamStats.paidAmount)}`}
                trend={{
                    icon: <ClockIcon className="mr-1 h-3 w-3" />,
                    text: `Paid earnings`,
                    color: 'text-green-500',
                }}
            />

            <StatsCard
                title="Unpaid Amount"
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                value={`${teamStats.currency} ${roundToTwoDecimals(teamStats.unpaidAmount)}`}
                trend={{
                    icon: <ClockIcon className="mr-1 h-3 w-3" />,
                    text: `${roundToTwoDecimals(teamStats.unpaidHours)} unpaid hours`,
                    color: 'text-amber-500',
                }}
            />
        </section>
    )
}
