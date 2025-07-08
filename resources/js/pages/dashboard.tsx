import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ClockIcon, UsersIcon, CalendarIcon, TrendingUpIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface TeamStats {
    count: number;
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

export default function Dashboard({ teamStats }: DashboardProps) {
    // Mock data for demonstration - in a real app, this would come from the backend
    const timeStats = {
        totalHours: 128,
        weeklyAverage: 32,
        recentLogs: [
            { date: '2023-11-15', hours: 8 },
            { date: '2023-11-14', hours: 7.5 },
            { date: '2023-11-13', hours: 8 }
        ]
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-6">
                {/* Welcome section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back!</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Here's an overview of your team's activity</p>
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
                            <div className="text-2xl font-bold">{timeStats.totalHours}</div>
                            <p className="text-xs text-muted-foreground">Hours logged this month</p>
                        </CardContent>
                    </Card>

                    {/* Weekly average card */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{timeStats.weeklyAverage}</div>
                            <p className="text-xs text-muted-foreground">Hours per week</p>
                        </CardContent>
                    </Card>

                    {/* Productivity card */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
                            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">92%</div>
                            <p className="text-xs text-muted-foreground">Efficiency rate</p>
                        </CardContent>
                    </Card>
                </section>

                {/* Recent activity and team overview */}
                <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Recent time logs */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Recent Time Logs</CardTitle>
                            <CardDescription>Your team's latest activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {timeStats.recentLogs.map((log, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div className="flex items-center gap-2">
                                            <div className="rounded-full bg-primary/10 p-1">
                                                <ClockIcon className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium">{log.hours} hours</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Team overview */}
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle>Team Overview</CardTitle>
                            <CardDescription>Performance and activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Project completion</span>
                                        <span className="font-medium">78%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                                        <div className="h-full w-[78%] rounded-full bg-primary"></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Task allocation</span>
                                        <span className="font-medium">65%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                                        <div className="h-full w-[65%] rounded-full bg-primary"></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Resource utilization</span>
                                        <span className="font-medium">92%</span>
                                    </div>
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-primary/10">
                                        <div className="h-full w-[92%] rounded-full bg-primary"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
