import Background from '@/components/ui/background'
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
            if (teamStats.unpaidAmount < 0) {
                return null
            }

            return (
                <StatsCard
                    title="Unpaid Amount"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={`${teamStats.currency || 'USD'} ${roundToTwoDecimals(teamStats.unpaidAmount)}`}
                    trend={{
                        icon: <ClockIcon className="mr-1 h-3 w-3" />,
                        text: `${roundToTwoDecimals(teamStats.unpaidHours)} unpaid hours`,
                        color: 'text-amber-500',
                    }}
                    borderColor="green-500"
                />
            )
        }

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
            ))
    }

    const renderPaidAmountCards = () => {
        if (!teamStats.paidAmountsByCurrency || Object.keys(teamStats.paidAmountsByCurrency).length === 0) {
            if (teamStats.paidAmount < 0) {
                return null
            }

            return (
                <StatsCard
                    title="Paid Amount"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    value={`${teamStats.currency || 'USD'} ${roundToTwoDecimals(teamStats.paidAmount)}`}
                    trend={{
                        icon: <ClockIcon className="mr-1 h-3 w-3" />,
                        text: 'Paid earnings',
                        color: 'text-green-500',
                    }}
                    borderColor="green-500"
                />
            )
        }

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
                        text: 'Paid earnings',
                        color: 'text-green-500',
                    }}
                    borderColor="green-500"
                />
            ))
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="relative p-2">
            <Background showPunches={false} showMarginLine={false} />
            {/* Header */}
            <div className="mb-6 pb-3">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-foreground">Timesheet summary</h2>
                        <div className="mt-0.5 text-xs text-muted-foreground">FORM TS-001 · Rev. 07/2025</div>
                    </div>
                    <div className="text-right">
                        <div className="rounded-md border border-border/60 bg-card px-3 py-2 shadow-sm">
                            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Date prepared</div>
                            <div className="text-sm font-semibold text-foreground">{currentDate}</div>
                        </div>
                    </div>
                </div>
                <div className="mt-3 h-px w-full bg-[rgba(var(--color-primary),0.25)]" />
            </div>

            {/* Team Information Section */}
            {(teamStats.count >= 0 || teamStats.clientCount >= 0) && (
                <div className="mb-6 rounded-lg border border-border/60 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[rgba(var(--color-primary),0.08)] text-[11px] font-semibold text-foreground">A</div>
                            <h3 className="text-sm font-semibold text-foreground">Personnel & Clients</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div>Status:</div>
                            <div className="h-3 w-3 rounded-sm bg-[rgba(34,197,94,0.45)]" />
                            <div className="text-foreground/80">Active</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {teamStats.count >= 0 && (
                                <StatsCard
                                    title="Team Members"
                                    icon={<UsersIcon className="h-4 w-4" />}
                                    value={teamStats.count}
                                    description="Active personnel assigned"
                                    borderColor="purple-500"
                                />
                            )}

                            {teamStats.clientCount >= 0 && (
                                <StatsCard
                                    title="Active Clients"
                                    icon={<BriefcaseIcon className="h-4 w-4" />}
                                    value={teamStats.clientCount}
                                    description="Current service contracts"
                                    borderColor="purple-500"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Time Tracking Section */}
            {(teamStats.totalHours >= 0 ||
                teamStats.unpaidHours >= 0 ||
                teamStats.totalHours - teamStats.unpaidHours >= 0 ||
                teamStats.weeklyAverage >= 0) && (
                <div className="mb-6 rounded-lg border border-border/60 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[rgba(var(--color-primary),0.08)] text-[11px] font-semibold text-foreground">B</div>
                            <h3 className="text-sm font-semibold text-foreground">Hours & Attendance</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div>Period:</div>
                            <div className="rounded-sm bg-[rgba(var(--color-primary),0.08)] px-1.5 py-0.5 text-foreground/80">Current</div>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {teamStats.totalHours >= 0 && (
                                <StatsCard
                                    title="Total Hours"
                                    icon={<ClockIcon className="h-4 w-4" />}
                                    value={`${roundToTwoDecimals(teamStats.totalHours)} HRS`}
                                    trend={{
                                        icon: <TrendingUp className="mr-1 h-3 w-3" />,
                                        text: `+${roundToTwoDecimals(teamStats.weeklyAverage)} hrs weekly avg`,
                                        color: 'text-green-600 dark:text-green-400',
                                    }}
                                    borderColor="blue-500"
                                />
                            )}

                            {teamStats.unpaidHours >= 0 && (
                                <StatsCard
                                    title="Pending Payment"
                                    icon={<ClockIcon className="h-4 w-4" />}
                                    value={`${roundToTwoDecimals(teamStats.unpaidHours)} HRS`}
                                    description="Awaiting payroll processing"
                                    borderColor="amber-500"
                                />
                            )}

                            {teamStats.totalHours - teamStats.unpaidHours >= 0 && (
                                <StatsCard
                                    title="Paid Hours"
                                    icon={<ClockIcon className="h-4 w-4" />}
                                    value={`${roundToTwoDecimals(teamStats.totalHours - teamStats.unpaidHours)} HRS`}
                                    description="Processed & compensated"
                                    borderColor="green-500"
                                />
                            )}

                            {teamStats.weeklyAverage >= 0 && (
                                <StatsCard
                                    title="Weekly Average"
                                    icon={<BarChart3 className="h-4 w-4" />}
                                    value={`${roundToTwoDecimals(teamStats.weeklyAverage)} HRS`}
                                    description="Per team member basis"
                                    borderColor="blue-500"
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Financial Summary Section */}
            {(teamStats.paidAmount >= 0 ||
                (teamStats.paidAmountsByCurrency && Object.values(teamStats.paidAmountsByCurrency).some((amount) => amount >= 0)) ||
                teamStats.unpaidAmount >= 0 ||
                (teamStats.unpaidAmountsByCurrency && Object.values(teamStats.unpaidAmountsByCurrency).some((amount) => amount >= 0))) && (
                <div className="mb-6 rounded-lg border border-border/60 bg-card shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-[rgba(var(--color-primary),0.08)] text-[11px] font-semibold text-foreground">C</div>
                            <h3 className="text-sm font-semibold text-foreground">Compensation & Billing</h3>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {renderPaidAmountCards()}
                            {renderUnpaidAmountCards()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
