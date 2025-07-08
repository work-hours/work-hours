import { Button } from '@/components/ui/button';
import DeleteTimeLog from '@/components/delete-time-log';
import EmptyState from '@/components/empty-state';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, PlusCircle, Search } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Time Logs</h2>
                    <Button className="flex items-center gap-2">
                        <Link href={route('time-log.create')} className="flex items-center gap-2">
                            <PlusCircle className="h-4 w-4" />
                            <span>Create New</span>
                        </Link>
                    </Button>
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
                                get(route('time-log.index'));
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
                                    <th className="px-4 py-3 text-left font-medium">Start Time</th>
                                    <th className="px-4 py-3 text-left font-medium">End Time</th>
                                    <th className="px-4 py-3 text-left font-medium">Duration (min)</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeLogs.map((log) => (
                                    <tr key={log.id} className="border-b">
                                        <td className="px-4 py-3">{log.start_timestamp}</td>
                                        <td className="px-4 py-3">{log.end_timestamp}</td>
                                        <td className="px-4 py-3">{log.duration}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('time-log.edit', log.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
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
                    <div className="rounded-md border p-6">
                        <EmptyState
                            title="No Time Logs"
                            description="You haven't added any time logs yet."
                            actionLabel="Add Time Log"
                            actionRoute="time-log.create"
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
