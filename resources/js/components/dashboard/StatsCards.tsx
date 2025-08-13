import { roundToTwoDecimals } from '@/lib/utils'
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
            if (teamStats.unpaidAmount < 0) return null
            return (
                <StatsCard
                    title="Unpaid Amount"
                    value={`${teamStats.currency || 'USD'} ${roundToTwoDecimals(teamStats.unpaidAmount)}`}
                />
            )
        }
        return Object.entries(teamStats.unpaidAmountsByCurrency)
            .filter(([, amount]) => amount >= 0)
            .map(([currencyCode, amount]) => (
                <StatsCard
                    key={currencyCode}
                    title={`Unpaid Amount (${currencyCode})`}
                    value={`${currencyCode} ${roundToTwoDecimals(amount)}`}
                />
            ))
    }

    const renderPaidAmountCards = () => {
        if (!teamStats.paidAmountsByCurrency || Object.keys(teamStats.paidAmountsByCurrency).length === 0) {
            if (teamStats.paidAmount < 0) return null
            return (
                <StatsCard
                    title="Paid Amount"
                    value={`${teamStats.currency || 'USD'} ${roundToTwoDecimals(teamStats.paidAmount)}`}
                />
            )
        }
        return Object.entries(teamStats.paidAmountsByCurrency)
            .filter(([, amount]) => amount >= 0)
            .map(([currencyCode, amount]) => (
                <StatsCard
                    key={currencyCode}
                    title={`Paid Amount (${currencyCode})`}
                    value={`${currencyCode} ${roundToTwoDecimals(amount)}`}
                />
            ))
    }

    return (
        <div className="p-2">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {teamStats.count >= 0 && <StatsCard title="Team Members" value={teamStats.count} />}
                {teamStats.clientCount >= 0 && <StatsCard title="Active Clients" value={teamStats.clientCount} />}

                {teamStats.totalHours >= 0 && (
                    <StatsCard title="Total Hours" value={`${roundToTwoDecimals(teamStats.totalHours)} HRS`} />
                )}
                {teamStats.unpaidHours >= 0 && (
                    <StatsCard title="Unpaid Hours" value={`${roundToTwoDecimals(teamStats.unpaidHours)} HRS`} />
                )}
                {teamStats.totalHours - teamStats.unpaidHours >= 0 && (
                    <StatsCard
                        title="Paid Hours"
                        value={`${roundToTwoDecimals(teamStats.totalHours - teamStats.unpaidHours)} HRS`}
                    />
                )}
                {teamStats.weeklyAverage >= 0 && (
                    <StatsCard title="Weekly Average" value={`${roundToTwoDecimals(teamStats.weeklyAverage)} HRS`} />
                )}

                {renderPaidAmountCards()}
                {renderUnpaidAmountCards()}
            </div>
        </div>
    )
}
