import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, LoaderCircle, Save, Timer } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type TimeLogForm = {
    start_timestamp: string;
    end_timestamp: string;
};

type Props = {
    timeLog: {
        id: number;
        start_timestamp: string;
        end_timestamp: string;
        duration: number;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
    {
        title: 'Edit',
        href: '/time-log/edit',
    },
];

export default function EditTimeLog({ timeLog }: Props) {
    const { data, setData, put, processing, errors } = useForm<TimeLogForm>({
        start_timestamp: new Date(timeLog.start_timestamp).toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
        end_timestamp: timeLog.end_timestamp ? new Date(timeLog.end_timestamp).toISOString().slice(0, 16) : '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('time-log.update', timeLog.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Time Log" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Time Entry</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Update the details of your time log</p>
                </section>

                <Card className="max-w-2xl overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Time Entry Details</CardTitle>
                        <CardDescription>Current duration: {timeLog.duration} minutes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="start_timestamp" className="text-sm font-medium">
                                        Start Time
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="start_timestamp"
                                            type="datetime-local"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.start_timestamp}
                                            onChange={(e) => setData('start_timestamp', e.target.value)}
                                            disabled={processing}
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.start_timestamp} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_timestamp" className="text-sm font-medium">
                                        End Time
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Timer className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="end_timestamp"
                                            type="datetime-local"
                                            tabIndex={2}
                                            value={data.end_timestamp}
                                            onChange={(e) => setData('end_timestamp', e.target.value)}
                                            disabled={processing}
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.end_timestamp} />
                                    <p className="text-xs text-muted-foreground">Leave end time empty if you're still working</p>
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        tabIndex={4}
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" tabIndex={3} disabled={processing} className="flex items-center gap-2">
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {processing ? 'Updating...' : 'Update Time Log'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
