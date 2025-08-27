import { roundToTwoDecimals } from '@/lib/utils'
import { BarChart3, Building2, Clock, CreditCard, DollarSign, PiggyBank, TimerReset, Users, Wallet } from 'lucide-react'
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
    unbillableHours?: number
}

interface StatsCardsProps {
    teamStats: TeamStats
}

export default function StatsCards({ teamStats }: StatsCardsProps) {
    const renderUnpaidAmountCards = () => {
        if (!teamStats.unpaidAmountsByCurrency || Object.keys(teamStats.unpaidAmountsByCurrency).length === 0) {
            if (teamStats.unpaidAmount <= 0 || teamStats.unpaidAmount === undefined) return null

            return (
                <StatsCard
                    title="Unpaid Amount"
                    value={`${teamStats.currency || 'USD'} ${roundToTwoDecimals(teamStats.unpaidAmount)}`}
                    icon={<Wallet className="stroke-amber-600" />}
                    color="amber"
                />
            )
        }

        return Object.entries(teamStats.unpaidAmountsByCurrency)
            .filter(([, amount]) => amount > 0)
            .map(([currencyCode, amount]) => (
                <StatsCard
                    key={currencyCode}
                    title={`Unpaid Amount (${currencyCode})`}
                    value={`${currencyCode} ${roundToTwoDecimals(amount)}`}
                    icon={<Wallet className="stroke-amber-600" />}
                    color="amber"
                />
            ))
    }

    const renderPaidAmountCards = () => {
        if (!teamStats.paidAmountsByCurrency || Object.keys(teamStats.paidAmountsByCurrency).length === 0) {
            if (teamStats.paidAmount <= 0) return null
            return (
                <StatsCard
                    title="Paid Amount"
                    value={`${teamStats.currency || 'USD'} ${roundToTwoDecimals(teamStats.paidAmount)}`}
                    icon={<DollarSign className="stroke-emerald-600" />}
                    color="emerald"
                />
            )
        }
        return Object.entries(teamStats.paidAmountsByCurrency)
            .filter(([, amount]) => amount > 0)
            .map(([currencyCode, amount]) => (
                <StatsCard
                    key={currencyCode}
                    title={`Paid Amount (${currencyCode})`}
                    value={`${currencyCode} ${roundToTwoDecimals(amount)}`}
                    icon={<DollarSign className="stroke-emerald-600" />}
                    color="emerald"
                />
            ))
    }

    return (
        <section className="relative mb-2 overflow-hidden rounded-md bg-gray-50/80 p-4 backdrop-blur-sm dark:bg-gray-900/50">
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {teamStats.count > 0 && (
                    <StatsCard title="Team Members" value={teamStats.count} icon={<Users className="stroke-blue-600" />} color="blue" />
                )}

                {teamStats.clientCount > 0 && (
                    <StatsCard
                        title="Active Clients"
                        value={teamStats.clientCount}
                        icon={<Building2 className="stroke-indigo-600" />}
                        color="indigo"
                    />
                )}

                {teamStats.totalHours > 0 && (
                    <StatsCard
                        title="Total Hours"
                        value={`${roundToTwoDecimals(teamStats.totalHours)} hrs`}
                        icon={<Clock className="stroke-violet-600" />}
                        color="violet"
                    />
                )}

                {teamStats.unpaidHours > 0 && (
                    <StatsCard
                        title="Unpaid Hours"
                        value={`${roundToTwoDecimals(teamStats.unpaidHours)} hrs`}
                        icon={<CreditCard className="stroke-pink-600" />}
                        color="pink"
                    />
                )}

                {teamStats.totalHours - teamStats.unpaidHours > 0 && (
                    <StatsCard
                        title="Paid Hours"
                        value={`${roundToTwoDecimals(teamStats.totalHours - teamStats.unpaidHours)} hrs`}
                        icon={<PiggyBank className="stroke-teal-600" />}
                        color="teal"
                    />
                )}

                {teamStats.unbillableHours !== undefined && teamStats.unbillableHours > 0 && (
                    <StatsCard
                        title="Unbillable Hours"
                        value={`${roundToTwoDecimals(teamStats.unbillableHours)} hrs`}
                        icon={<TimerReset className="stroke-purple-600" />}
                        color="purple"
                    />
                )}

                {teamStats.weeklyAverage > 0 && (
                    <StatsCard
                        title="Weekly Average"
                        value={`${roundToTwoDecimals(teamStats.weeklyAverage)} hrs`}
                        icon={<BarChart3 className="stroke-cyan-600" />}
                        color="cyan"
                    />
                )}

                {renderPaidAmountCards()}
                {renderUnpaidAmountCards()}
            </div>
        </section>
    )
}
