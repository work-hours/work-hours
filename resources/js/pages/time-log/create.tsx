import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type TimeLogForm = {
    start_timestamp: string;
    end_timestamp: string;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
    {
        title: 'Create',
        href: '/time-log/create',
    },
];

export default function CreateTimeLog() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<TimeLogForm>>({
        start_timestamp: new Date().toISOString().slice(0, 16), // Default to now, format: YYYY-MM-DDTHH:MM
        end_timestamp: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('time-log.store'), {
            onFinish: () => reset(),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Time Log" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Create Time Log</h2>
                </div>

                <div className="max-w-2xl rounded-md border p-6">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="start_timestamp">Start Time</Label>
                                <Input
                                    id="start_timestamp"
                                    type="datetime-local"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    value={data.start_timestamp}
                                    onChange={(e) => setData('start_timestamp', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.start_timestamp} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_timestamp">End Time</Label>
                                <Input
                                    id="end_timestamp"
                                    type="datetime-local"
                                    tabIndex={2}
                                    value={data.end_timestamp}
                                    onChange={(e) => setData('end_timestamp', e.target.value)}
                                    disabled={processing}
                                />
                                <InputError message={errors.end_timestamp} />
                            </div>

                            <div className="mt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => window.history.back()} tabIndex={6} disabled={processing}>
                                    Cancel
                                </Button>
                                <Button type="submit" tabIndex={5} disabled={processing}>
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Time Log
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
