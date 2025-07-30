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
            // Fallback to the default card if no currency-specific amounts are available
            // Doesn't show the card if the unpaid amount is negative
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
            ))
    }

    const renderPaidAmountCards = () => {
        if (!teamStats.paidAmountsByCurrency || Object.keys(teamStats.paidAmountsByCurrency).length === 0) {
            // Fallback to the default card if no currency-specific amounts are available
            // Doesn't show the card if the paid amount is negative
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
                        text: 'Paid earnings',
                        color: 'text-green-500',
                    }}
                    borderColor="green-500"
                />
            ))
    }

    // Get current date for form header
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="p-2">
            <Background showPunches={false} showMarginLine={false} />
            {/* Timesheet Form Header */}
            <div className="mb-6 border-b-2 border-gray-400 pb-4 dark:border-gray-600">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">EMPLOYEE TIMESHEET SUMMARY</h2>
                        <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">FORM TS-001 | REV. 07/2025</div>
                    </div>
                    <div className="text-right">
                        <div className="border-2 border-gray-400 bg-white p-2 dark:border-gray-600 dark:bg-gray-800">
                            <div className="text-xs text-gray-500 uppercase dark:text-gray-400">DATE PREPARED</div>
                            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{currentDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Information Section */}
            {(teamStats.count >= 0 || teamStats.clientCount >= 0) && (
                <div className="mb-6 border-2 border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800">
                    {/* Section header with form styling */}
                    <div className="border-b-2 border-gray-400 bg-gray-200 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center border-2 border-gray-500 bg-white dark:border-gray-400 dark:bg-gray-600">
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">A</span>
                                </div>
                                <h3 className="text-sm font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">
                                    PERSONNEL & CLIENT DATA
                                </h3>
                            </div>
                            <div className="flex gap-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400">STATUS:</div>
                                <div className="h-4 w-4 border border-gray-400 bg-green-200 dark:border-gray-500 dark:bg-green-700"></div>
                                <div className="text-xs text-gray-600 dark:text-gray-300">ACTIVE</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-25 dark:bg-gray-850 p-4">
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
                <div className="mb-6 border-2 border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800">
                    <div className="border-b-2 border-gray-400 bg-gray-200 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center border-2 border-gray-500 bg-white dark:border-gray-400 dark:bg-gray-600">
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">B</span>
                                </div>
                                <h3 className="text-sm font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">
                                    HOURS WORKED & ATTENDANCE
                                </h3>
                            </div>
                            <div className="flex gap-2">
                                <div className="text-xs text-gray-500 dark:text-gray-400">PERIOD:</div>
                                <div className="border-b border-dotted border-gray-400 text-xs text-gray-600 dark:text-gray-300">CURRENT</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-25 dark:bg-gray-850 p-4">
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
                <div className="mb-6 border-2 border-gray-400 bg-white dark:border-gray-600 dark:bg-gray-800">
                    <div className="border-b-2 border-gray-400 bg-gray-200 px-4 py-3 dark:border-gray-600 dark:bg-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-6 w-6 items-center justify-center border-2 border-gray-500 bg-white dark:border-gray-400 dark:bg-gray-600">
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">C</span>
                                </div>
                                <h3 className="text-sm font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">
                                    COMPENSATION & BILLING
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-amber-25 dark:bg-gray-850 p-4">
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
