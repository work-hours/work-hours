import DeleteTimeLog from '@/components/delete-time-log';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, PlusCircle, Search, Clock, CalendarRange, TimerReset, Calendar } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
];

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

type Props = {
    timeLogs: TimeLog[];
    filters: Filters;
};

export default function TimeLog({ timeLogs, filters }: Props) {
    const { data, setData, get, processing } = useForm<Filters>({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get(route('time-log.index'), {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Log" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Time Logs</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage your work hours</p>
                </section>

                {/* Filter Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Filter Time Logs</CardTitle>
                                {(data.start_date || data.end_date) && (
                                    <CardDescription>
                                        {data.start_date && data.end_date
                                            ? `Showing logs from ${data.start_date} to ${data.end_date}`
                                            : data.start_date
                                              ? `Showing logs from ${data.start_date}`
                                              : `Showing logs until ${data.end_date}`}
                                    </CardDescription>
                                )}
                            </div>
                            <Link href={route('time-log.create')}>
                                <Button className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>Log Time</span>
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date" className="text-sm font-medium">Start Date</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="start_date"
                                        type="date"
                                        value={data.start_date}
                                        onChange={(e) => setData('start_date', e.target.value)}
                                        disabled={processing}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date" className="text-sm font-medium">End Date</Label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <Input
                                        id="end_date"
                                        type="date"
                                        value={data.end_date}
                                        onChange={(e) => setData('end_date', e.target.value)}
                                        disabled={processing}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
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
                                        get(route('time-log.index'));
                                    }}
                                    className="flex items-center gap-2"
                                >
                                    <TimerReset className="h-4 w-4" />
                                    <span>Clear</span>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Time Logs Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Your Time Logs</CardTitle>
                        <CardDescription>
                            {timeLogs.length > 0
                                ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'}`
                                : 'No time logs found for the selected period'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {timeLogs.length > 0 ? (
                            <div className="rounded-md border overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="px-4 py-3 text-left font-medium">Start Time</th>
                                            <th className="px-4 py-3 text-left font-medium">End Time</th>
                                            <th className="px-4 py-3 text-left font-medium">Duration</th>
                                            <th className="px-4 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeLogs.map((log) => (
                                            <tr key={log.id} className="border-b hover:bg-muted/20 transition-colors">
                                                <td className="px-4 py-3 font-medium">
                                                    {new Date(log.start_timestamp).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {log.end_timestamp ? new Date(log.end_timestamp).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                        {log.duration} minutes
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Link href={route('time-log.edit', log.id)}>
                                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                                <Edit className="h-3.5 w-3.5" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                        </Link>
                                                        <DeleteTimeLog timeLogId={log.id} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="rounded-md border p-6 bg-muted/5">
                                <div className="flex flex-col items-center justify-center text-center py-12">
                                    <Clock className="h-12 w-12 text-muted-foreground/50 mb-4" />
                                    <h3 className="text-lg font-medium mb-1">No Time Logs</h3>
                                    <p className="text-muted-foreground mb-4">You haven't added any time logs yet.</p>
                                    <Link href={route('time-log.create')}>
                                        <Button className="flex items-center gap-2">
                                            <PlusCircle className="h-4 w-4" />
                                            <span>Add Time Log</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
