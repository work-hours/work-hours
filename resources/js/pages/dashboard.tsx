import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';

interface TeamStats {
    count: number;
    totalHours: number;
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

export default function Dashboard({ teamStats }: DashboardProps) {
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
                            <div className="text-2xl font-bold">{teamStats.totalHours}</div>
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
                            <div className="text-2xl font-bold">{teamStats.weeklyAverage}</div>
                            <p className="text-xs text-muted-foreground">Hours per week</p>
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
                                {teamStats.recentLogs.map((log, index) => (
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
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </AppLayout>
    );
}
