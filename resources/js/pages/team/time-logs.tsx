import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ClockIcon, CalendarIcon, Search } from 'lucide-react';
import { FormEventHandler, useMemo } from 'react';

type TimeLog = {
    id: number;
    start_timestamp: string;
    end_timestamp: string;
    duration: number;
};

type Filters = {
    start_date: string;
    end_date: string;
};

type User = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    timeLogs: TimeLog[];
    filters: Filters;
    user: User;
};

export default function TeamMemberTimeLogs({ timeLogs, filters, user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Team',
            href: '/team',
        },
        {
            title: user.name,
            href: `/team/${user.id}/time-logs`,
        },
    ];

    // Calculate total hours and weekly average
    const { totalHours, weeklyAverage } = useMemo(() => {
        // Convert minutes to hours and sum them up
        const totalMinutes = timeLogs.reduce((sum, log) => sum + log.duration, 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal place

        // Calculate weekly average based on the date range
        let weeklyAverage = 0;

        if (filters.start_date && filters.end_date) {
            const startDate = new Date(filters.start_date);
            const endDate = new Date(filters.end_date);
            const daysDifference = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
            const weeksDifference = Math.max(1, daysDifference / 7);
            weeklyAverage = Math.round((totalHours / weeksDifference) * 10) / 10; // Round to 1 decimal place
        } else {
            // If no date range, use 4 weeks as default period
            weeklyAverage = Math.round((totalHours / 4) * 10) / 10;
        }

        return { totalHours, weeklyAverage };
    }, [timeLogs, filters]);

    const { data, setData, get, processing } = useForm<Filters>({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get(route('team.time-logs', user.id), {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${user.name}'s Time Logs`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('team.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to Team</span>
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold">{user.name}'s Time Logs</h2>
                    </div>
                </div>

                <div className="mb-4 rounded-md border p-4">
                    <h3 className="mb-2 font-medium">Filter Time Logs</h3>
                    {(data.start_date || data.end_date) && (
                        <p className="mb-2 text-sm text-muted-foreground">
                            {data.start_date && data.end_date
                                ? `Showing logs from ${data.start_date} to ${data.end_date}`
                                : data.start_date
                                  ? `Showing logs from ${data.start_date}`
                                  : `Showing logs until ${data.end_date}`}
                        </p>
                    )}
                    <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="start_date">Start Date</Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                disabled={processing}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="end_date">End Date</Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                disabled={processing}
                            />
                        </div>

                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            <span>Filter</span>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={processing || (!data.start_date && !data.end_date)}
                            onClick={() => {
                                setData({
                                    start_date: '',
                                    end_date: '',
                                });
                                get(route('team.time-logs', user.id));
                            }}
                        >
                            Clear Filters
                        </Button>
                    </form>
                </div>

                {timeLogs.length > 0 && (
                    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Total hours card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
                                <ClockIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalHours}</div>
                                <p className="text-xs text-muted-foreground">
                                    {filters.start_date && filters.end_date
                                        ? `Hours logged from ${filters.start_date} to ${filters.end_date}`
                                        : filters.start_date
                                          ? `Hours logged from ${filters.start_date}`
                                          : filters.end_date
                                            ? `Hours logged until ${filters.end_date}`
                                            : 'Total hours logged'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Weekly average card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weeklyAverage}</div>
                                <p className="text-xs text-muted-foreground">Hours per week</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {timeLogs.length > 0 ? (
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium">Start Time</th>
                                    <th className="px-4 py-3 text-left font-medium">End Time</th>
                                    <th className="px-4 py-3 text-left font-medium">Duration (min)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeLogs.map((log) => (
                                    <tr key={log.id} className="border-b">
                                        <td className="px-4 py-3">{log.start_timestamp}</td>
                                        <td className="px-4 py-3">{log.end_timestamp}</td>
                                        <td className="px-4 py-3">{log.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-md border p-6">
                        <EmptyState title="No Time Logs" description={`${user.name} hasn't added any time logs yet.`} />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
