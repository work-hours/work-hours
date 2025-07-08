import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Search } from 'lucide-react';
import { FormEventHandler } from 'react';

type TimeLog = {
    id: number;
    user_name: string;
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

export default function AllTeamTimeLogs({ timeLogs, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Team',
            href: '/team',
        },
        {
            title: 'All Time Logs',
            href: '/team/all-time-logs',
        },
    ];

    const { data, setData, get, processing } = useForm<Filters>({
        start_date: filters.start_date || '',
        end_date: filters.end_date || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        get(route('team.all-time-logs'), {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Team Time Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('team.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to Team</span>
                            </Button>
                        </Link>
                        <h2 className="text-xl font-semibold">All Team Time Logs</h2>
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
                                get(route('team.all-time-logs'));
                            }}
                        >
                            Clear Filters
                        </Button>
                    </form>
                </div>

                {timeLogs.length > 0 ? (
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium">Team Member</th>
                                    <th className="px-4 py-3 text-left font-medium">Start Time</th>
                                    <th className="px-4 py-3 text-left font-medium">End Time</th>
                                    <th className="px-4 py-3 text-left font-medium">Duration (min)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeLogs.map((log) => (
                                    <tr key={log.id} className="border-b">
                                        <td className="px-4 py-3">{log.user_name}</td>
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
                        <EmptyState title="No Time Logs" description="No team members have added any time logs yet." />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
