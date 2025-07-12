import RecentTimeLogs from '@/components/dashboard/RecentTimeLogs'
import QuickActions from '@/components/dashboard/QuickActions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import AppLayout from '@/layouts/app-layout'
import { roundToTwoDecimals } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { BarChart3, ClockIcon, DollarSign, TrendingUp, UsersIcon } from 'lucide-react'

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface TeamStats {
    count: number
    totalHours: number
    unpaidHours: number
    unpaidAmount: number
    currency: string
    weeklyAverage: number
}

interface DashboardProps {
    teamStats: TeamStats
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default function Dashboard({ teamStats }: DashboardProps) {
    const hoursData = [
        { name: 'Unpaid', value: roundToTwoDecimals(teamStats.unpaidHours) },
        { name: 'Paid', value: roundToTwoDecimals(teamStats.totalHours - teamStats.unpaidHours) },
    ]

    const weeklyData = [
        { name: 'Week 1', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.9) },
        { name: 'Week 2', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.1) },
        { name: 'Week 3', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.95) },
        { name: 'Week 4', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.05) },
    ]


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-9/12 flex-col gap-6 p-6">
                <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back!</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Here's an overview of your team's activity</p>
                    </div>
                    <QuickActions />
                </section>

                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamStats.count}</div>
                            <p className="text-xs text-muted-foreground">Active members in your team</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roundToTwoDecimals(teamStats.totalHours)}</div>
                            <div className="mt-1 flex items-center text-xs text-green-500">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                <span>+{roundToTwoDecimals(teamStats.weeklyAverage)} hrs this week</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{roundToTwoDecimals(teamStats.weeklyAverage)}</div>
                            <p className="text-xs text-muted-foreground">Hours per team member</p>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {teamStats.currency} {roundToTwoDecimals(teamStats.unpaidAmount)}
                            </div>
                            <div className="mt-1 flex items-center text-xs text-amber-500">
                                <ClockIcon className="mr-1 h-3 w-3" />
                                <span>{roundToTwoDecimals(teamStats.unpaidHours)} unpaid hours</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Hours Distribution</CardTitle>
                            <CardDescription>Breakdown of total vs. unpaid hours</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={hoursData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {hoursData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} hours`, '']} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Weekly Trend</CardTitle>
                            <CardDescription>Hours logged over the past weeks</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                                    <Area type="monotone" dataKey="hours" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </section>

                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <RecentTimeLogs />

                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Team Productivity</CardTitle>
                            <CardDescription>Hours logged by team members</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {teamStats.count > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={[
                                            { name: 'Average', hours: roundToTwoDecimals(teamStats.weeklyAverage) },
                                            { name: 'This Week', hours: roundToTwoDecimals(teamStats.weeklyAverage * 1.05) },
                                            { name: 'Last Week', hours: roundToTwoDecimals(teamStats.weeklyAverage * 0.95) },
                                        ]}
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => [`${value} hours`, 'Hours']} />
                                        <Bar dataKey="hours" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center text-gray-500">
                                    <UsersIcon className="mb-2 h-12 w-12 opacity-50" />
                                    <p>Add team members to see productivity insights</p>
                                    <Link href="/team/create" className="mt-2 text-primary hover:underline">
                                        Add team members
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    )
}
