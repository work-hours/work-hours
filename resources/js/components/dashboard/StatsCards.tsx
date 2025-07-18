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
    paidAmountsByCurrency: Record<string, number>
    currency: string
    weeklyAverage: number
    clientCount: number
}

interface StatsCardsProps {
    teamStats: TeamStats
}

export default function StatsCards({ teamStats }: StatsCardsProps) {
    const renderUnpaidAmountCards = () => {
        if (!teamStats.unpaidAmountsByCurrency || Object.keys(teamStats.unpaidAmountsByCurrency).length === 0) {
            // Fallback to the default card if no currency-specific amounts are available
            // Doesn't show the card if the unpaid amount is negative
            if (teamStats.unpaidAmount < 0) {
                return null;
            }

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

        // Create a card for each currency, filtering out negative amounts
        return Object.entries(teamStats.unpaidAmountsByCurrency)
            .filter(([, amount]) => amount >= 0) // Filter out negative amounts
            .map(([currencyCode, amount]) => (
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

    const renderPaidAmountCards = () => {
        if (!teamStats.paidAmountsByCurrency || Object.keys(teamStats.paidAmountsByCurrency).length === 0) {
            // Fallback to the default card if no currency-specific amounts are available
            // Doesn't show the card if the paid amount is negative
            if (teamStats.paidAmount < 0) {
                return null;
            }

            return (
                <StatsCard
                    title="Paid Amount"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={`${teamStats.currency} ${roundToTwoDecimals(teamStats.paidAmount)}`}
                    trend={{
                        icon: <ClockIcon className="mr-1 h-3 w-3" />,
                        text: "Paid earnings",
                        color: 'text-green-500',
                    }}
                    borderColor="green-500"
                />
            );
        }

        // Create a card for each currency, filtering out negative amounts
        return Object.entries(teamStats.paidAmountsByCurrency)
            .filter(([, amount]) => amount >= 0) // Filter out negative amounts
            .map(([currencyCode, amount]) => (
                <StatsCard
                    key={currencyCode}
                    title={`Paid Amount (${currencyCode})`}
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={`${currencyCode} ${roundToTwoDecimals(amount)}`}
                    trend={{
                        icon: <ClockIcon className="mr-1 h-3 w-3" />,
                        text: "Paid earnings",
                        color: 'text-green-500',
                    }}
                    borderColor="green-500"
                />
            ));
    };

    return (
        <div className="space-y-4">
            {/* Team Information Section */}
            {(teamStats.count >= 0 || teamStats.clientCount >= 0) && (
                <div>
                    <h4 className="mb-2 text-xs font-medium text-muted-foreground">Team Information</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                        {teamStats.count >= 0 && (
                            <StatsCard
                                title="Team Members"
                                icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
                                value={teamStats.count}
                                description="Active members in your team"
                                borderColor="purple-500"
                            />
                        )}

                        {teamStats.clientCount >= 0 && (
                            <StatsCard
                                title="Clients"
                                icon={<BriefcaseIcon className="h-4 w-4 text-muted-foreground" />}
                                value={teamStats.clientCount}
                                description="Total active clients"
                                borderColor="purple-500"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Time Stats Section */}
            {(teamStats.totalHours >= 0 || teamStats.unpaidHours >= 0 ||
              (teamStats.totalHours - teamStats.unpaidHours) >= 0 || teamStats.weeklyAverage >= 0) && (
                <div>
                    <h4 className="mb-2 text-xs font-medium text-muted-foreground">Time Metrics</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                        {teamStats.totalHours >= 0 && (
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
                        )}

                        {teamStats.unpaidHours >= 0 && (
                            <StatsCard
                                title="Unpaid Hours"
                                icon={<ClockIcon className="h-4 w-4 text-muted-foreground" />}
                                value={roundToTwoDecimals(teamStats.unpaidHours)}
                                description="Hours pending payment"
                                borderColor="amber-500"
                            />
                        )}

                        {(teamStats.totalHours - teamStats.unpaidHours) >= 0 && (
                            <StatsCard
                                title="Paid Hours"
                                icon={<ClockIcon className="h-4 w-4 text-muted-foreground" />}
                                value={roundToTwoDecimals(teamStats.totalHours - teamStats.unpaidHours)}
                                description="Hours already paid"
                                borderColor="green-500"
                            />
                        )}

                        {teamStats.weeklyAverage >= 0 && (
                            <StatsCard
                                title="Weekly Average"
                                icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
                                value={roundToTwoDecimals(teamStats.weeklyAverage)}
                                description="Hours per team member"
                                borderColor="blue-500"
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Financial Stats Section */}
            {/* Only show the section if there are cards to display */}
            {(teamStats.paidAmount >= 0 ||
              (teamStats.paidAmountsByCurrency && Object.values(teamStats.paidAmountsByCurrency).some(amount => amount >= 0)) ||
              teamStats.unpaidAmount >= 0 ||
              (teamStats.unpaidAmountsByCurrency && Object.values(teamStats.unpaidAmountsByCurrency).some(amount => amount >= 0))) && (
                <div>
                    <h4 className="mb-2 text-xs font-medium text-muted-foreground">Financial Summary</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                        {renderPaidAmountCards()}
                        {renderUnpaidAmountCards()}
                    </div>
                </div>
            )}
        </div>
    )
}
