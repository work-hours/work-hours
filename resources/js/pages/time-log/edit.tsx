import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Clock, LoaderCircle, Save, Timer } from 'lucide-react';
import { FormEventHandler, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/ui/searchable-select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type Project = {
    id: number;
    name: string;
};

type TimeLogForm = {
    project_id: number;
    start_timestamp: string;
    end_timestamp: string;
};

type Props = {
    timeLog: {
        id: number;
        project_id: number;
        start_timestamp: string;
        end_timestamp: string;
        duration: number;
    };
    projects: Project[];
};

// Custom input component for DatePicker with icon
interface CustomInputProps {
    value?: string;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    tabIndex?: number;
    id: string;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value, onClick, onChange, icon, placeholder, disabled, required, autoFocus, tabIndex, id }, ref) => (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{icon}</div>
            <Input
                id={id}
                ref={ref}
                value={value}
                onClick={onClick}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                autoFocus={autoFocus}
                tabIndex={tabIndex}
                className="pl-10"
                readOnly={!onChange}
            />
        </div>
    ),
);

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

export default function EditTimeLog({ timeLog, projects }: Props) {
    const { data, setData, put, processing, errors } = useForm<TimeLogForm>({
        project_id: timeLog.project_id,
        start_timestamp: new Date(timeLog.start_timestamp).toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
        end_timestamp: timeLog.end_timestamp ? new Date(timeLog.end_timestamp).toISOString().slice(0, 16) : '',
    });

    // Convert string timestamps to Date objects for DatePicker
    const startDate = data.start_timestamp ? new Date(data.start_timestamp) : new Date();
    const endDate = data.end_timestamp ? new Date(data.end_timestamp) : null;

    // Handle date changes
    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setData('start_timestamp', date.toISOString().slice(0, 16));
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setData('end_timestamp', date.toISOString().slice(0, 16));
        } else {
            setData('end_timestamp', '');
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('time-log.update', timeLog.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Time Log" />
            <div className="flex flex-col gap-6 p-6 w-2/3 mx-auto">
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
                                    <Label htmlFor="project_id" className="text-sm font-medium">
                                        Project
                                    </Label>
                                    <SearchableSelect
                                        id="project_id"
                                        value={data.project_id ? data.project_id.toString() : ''}
                                        onChange={(value) => setData('project_id', parseInt(value))}
                                        options={projects}
                                        placeholder="Select a project"
                                        disabled={processing}
                                    />
                                    <InputError message={errors.project_id} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="start_timestamp" className="text-sm font-medium">
                                        Start Time
                                    </Label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleStartDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        required
                                        disabled={processing}
                                        customInput={
                                            <CustomInput
                                                id="start_timestamp"
                                                icon={<Clock className="h-4 w-4 text-muted-foreground" />}
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                disabled={processing}
                                            />
                                        }
                                    />
                                    <InputError message={errors.start_timestamp} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="end_timestamp" className="text-sm font-medium">
                                        End Time
                                    </Label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleEndDateChange}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        dateFormat="yyyy-MM-dd HH:mm"
                                        disabled={processing}
                                        isClearable
                                        placeholderText="Select end time (optional)"
                                        customInput={
                                            <CustomInput
                                                id="end_timestamp"
                                                icon={<Timer className="h-4 w-4 text-muted-foreground" />}
                                                tabIndex={2}
                                                disabled={processing}
                                            />
                                        }
                                    />
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
