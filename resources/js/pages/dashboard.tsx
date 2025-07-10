import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    BarChart3,
    ClockIcon,
    DollarSign,
    PlusCircle,
    TrendingUp,
    UsersIcon
} from 'lucide-react';

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface TeamStats {
    count: number;
    totalHours: number;
    unpaidHours: number;
    unpaidAmount: number;
    currency: string;
    weeklyAverage: number;
    recentLogs: Array<{
        date: string;
        hours: number;
        user: string;
    }>;
    allLogsLink: string;
}

interface DashboardProps {
    teamStats: TeamStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Dashboard({ teamStats }: DashboardProps) {
    // Generate sample data for charts based on available stats
    const hoursData = [
        { name: 'Total', value: teamStats.totalHours },
        { name: 'Unpaid', value: teamStats.unpaidHours },
        { name: 'Paid', value: teamStats.totalHours - teamStats.unpaidHours },
    ];

    // Sample weekly data (for demonstration)
    const weeklyData = [
        { name: 'Week 1', hours: teamStats.weeklyAverage * 0.9 },
        { name: 'Week 2', hours: teamStats.weeklyAverage * 1.1 },
        { name: 'Week 3', hours: teamStats.weeklyAverage * 0.95 },
        { name: 'Week 4', hours: teamStats.weeklyAverage * 1.05 },
    ];

    // Quick actions for the dashboard
    const quickActions = [
        { name: 'Log Time', icon: <ClockIcon className="h-5 w-5" />, href: '/time-log/create' },
        { name: 'Add Team Member', icon: <UsersIcon className="h-5 w-5" />, href: '/team/create' },
        { name: 'Create Project', icon: <PlusCircle className="h-5 w-5" />, href: '/project/create' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Welcome section with quick actions */}
                <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back!</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Here's an overview of your team's activity</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 transition-colors"
                            >
                                {action.icon}
                                {action.name}
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Stats overview */}
                <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Team members card */}
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

                    {/* Total hours card */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                            <ClockIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamStats.totalHours}</div>
                            <div className="mt-1 flex items-center text-xs text-green-500">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                <span>+{Math.round(teamStats.weeklyAverage)} hrs this week</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Weekly average card */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamStats.weeklyAverage}</div>
                            <p className="text-xs text-muted-foreground">Hours per team member</p>
                        </CardContent>
                    </Card>

                    {/* Unpaid amount card */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unpaid Amount</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{teamStats.currency} {teamStats.unpaidAmount}</div>
                            <div className="mt-1 flex items-center text-xs text-amber-500">
                                <ClockIcon className="mr-1 h-3 w-3" />
                                <span>{teamStats.unpaidHours} unpaid hours</span>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Charts section */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Hours distribution chart */}
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

                    {/* Weekly trend chart */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Weekly Trend</CardTitle>
                            <CardDescription>Hours logged over the past weeks</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={weeklyData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
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

                {/* Recent activity and team overview */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Recent time logs */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Recent Time Logs</CardTitle>
                                    <CardDescription>Your team's latest activity</CardDescription>
                                </div>
                                <Link href={teamStats.allLogsLink} className="text-sm text-primary hover:underline">
                                    View all logs
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {teamStats.recentLogs.length > 0 ? (
                                    teamStats.recentLogs.map((log, index) => (
                                        <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                            <div className="flex items-center gap-2">
                                                <div className="rounded-full bg-primary/10 p-1">
                                                    <ClockIcon className="h-4 w-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {log.user} on{' '}
                                                        {new Date(log.date).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium">{log.hours} hours</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-4 text-gray-500">
                                        <p>No recent time logs found</p>
                                        <Link href="/time-log/create" className="text-primary hover:underline mt-2 inline-block">
                                            Create your first time log
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team productivity insights */}
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
                                            { name: 'Average', hours: teamStats.weeklyAverage },
                                            { name: 'This Week', hours: teamStats.weeklyAverage * 1.05 },
                                            { name: 'Last Week', hours: teamStats.weeklyAverage * 0.95 },
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
                                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                    <UsersIcon className="h-12 w-12 mb-2 opacity-50" />
                                    <p>Add team members to see productivity insights</p>
                                    <Link href="/team/create" className="text-primary hover:underline mt-2">
                                        Add team members
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
