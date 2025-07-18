import { roundToTwoDecimals } from '@/lib/utils'
import { BarChart3, BriefcaseIcon, ClockIcon, DollarSign, TrendingUp, UsersIcon } from 'lucide-react'
import StatsCard from './StatsCard'

interface TeamStats {
    count: number
    totalHours: number
    unpaidHours: number
    unpaidAmount: number
    unpaidAmountsByCurrency: Record<string, number>
    paidAmount: number
    currency: string
    weeklyAverage: number
    clientCount: number
}

interface StatsCardsProps {
    teamStats: TeamStats
}

export default function StatsCards({ teamStats }: StatsCardsProps) {
    // Generate unpaid amount cards for each currency
    const renderUnpaidAmountCards = () => {
        if (!teamStats.unpaidAmountsByCurrency || Object.keys(teamStats.unpaidAmountsByCurrency).length === 0) {
            // Fallback to the default card if no currency-specific amounts are available
            return (
                <StatsCard
                    title="Unpaid Amount"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={`${teamStats.currency} ${roundToTwoDecimals(teamStats.unpaidAmount)}`}
                    trend={{
                        icon: <ClockIcon className="mr-1 h-3 w-3" />,
                        text: `${roundToTwoDecimals(teamStats.unpaidHours)} unpaid hours`,
                        color: 'text-amber-500',
                    }}
                    borderColor="green-500"
                />
            );
        }

        // Create a card for each currency
        return Object.entries(teamStats.unpaidAmountsByCurrency).map(([currencyCode, amount]) => (
            <StatsCard
                key={currencyCode}
                title={`Unpaid Amount (${currencyCode})`}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                value={`${currencyCode} ${roundToTwoDecimals(amount)}`}
                trend={{
                    icon: <ClockIcon className="mr-1 h-3 w-3" />,
                    text: `${roundToTwoDecimals(teamStats.unpaidHours)} unpaid hours`,
                    color: 'text-amber-500',
                }}
                borderColor="green-500"
            />
        ));
    };

    return (
        <div className="space-y-4">
            {/* Team Stats Section */}
            <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">Team Information</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <StatsCard
                        title="Team Members"
                        icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
                        value={teamStats.count}
                        description="Active members in your team"
                        borderColor="purple-500"
                    />

                    <StatsCard
                        title="Clients"
                        icon={<BriefcaseIcon className="h-4 w-4 text-muted-foreground" />}
                        value={teamStats.clientCount}
                        description="Total active clients"
                        borderColor="purple-500"
                    />
                </div>
            </div>

            {/* Time Stats Section */}
            <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">Time Metrics</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <StatsCard
                        title="Total Hours"
                        icon={<ClockIcon className="h-4 w-4 text-muted-foreground" />}
                        value={roundToTwoDecimals(teamStats.totalHours)}
                        trend={{
                            icon: <TrendingUp className="mr-1 h-3 w-3" />,
                            text: `+${roundToTwoDecimals(teamStats.weeklyAverage)} hrs this week`,
                            color: 'text-green-500',
                        }}
                        borderColor="blue-500"
                    />

                    <StatsCard
                        title="Weekly Average"
                        icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                        value={roundToTwoDecimals(teamStats.weeklyAverage)}
                        description="Hours per team member"
                        borderColor="blue-500"
                    />
                </div>
            </div>

            {/* Financial Stats Section */}
            <div>
                <h4 className="mb-2 text-xs font-medium text-muted-foreground">Financial Summary</h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                    <StatsCard
                        title="Paid Amount"
                        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                        value={`${teamStats.currency} ${roundToTwoDecimals(teamStats.paidAmount)}`}
                        trend={{
                            icon: <ClockIcon className="mr-1 h-3 w-3" />,
                            text: `Paid earnings`,
                            color: 'text-green-500',
                        }}
                        borderColor="green-500"
                    />

                    {renderUnpaidAmountCards()}
                </div>
            </div>
        </div>
    )
}
