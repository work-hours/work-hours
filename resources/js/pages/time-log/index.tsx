import DeleteTimeLog from '@/components/delete-time-log';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Calendar, CalendarRange, ClockIcon, Edit, PlusCircle, Search, TimerReset } from 'lucide-react';
import { FormEventHandler, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    // Convert string dates to Date objects for DatePicker
    const startDate = data.start_date ? new Date(data.start_date) : null;
    const endDate = data.end_date ? new Date(data.end_date) : null;

    // Handle date changes
    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            setData('start_date', date.toISOString().split('T')[0]);
        } else {
            setData('start_date', '');
        }
    };

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            setData('end_date', date.toISOString().split('T')[0]);
        } else {
            setData('end_date', '');
        }
    };

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
                                    <ClockIcon className="h-4 w-4" />
                                    <span>Log Time</span>
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-wrap items-end gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="start_date" className="text-sm font-medium">
                                    Start Date
                                </Label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    disabled={processing}
                                    customInput={
                                        <CustomInput
                                            id="start_date"
                                            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                                            disabled={processing}
                                            placeholder="Select start date"
                                        />
                                    }
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="end_date" className="text-sm font-medium">
                                    End Date
                                </Label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    disabled={processing}
                                    customInput={
                                        <CustomInput
                                            id="end_date"
                                            icon={<CalendarRange className="h-4 w-4 text-muted-foreground" />}
                                            disabled={processing}
                                            placeholder="Select end date"
                                        />
                                    }
                                />
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
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {timeLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{formatDateTime(log.start_timestamp)}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatDateTime(log.end_timestamp)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {log.duration}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('time-log.edit', log.id)}>
                                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                            <Edit className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </Link>
                                                    <DeleteTimeLog timeLogId={log.id} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <ClockIcon className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Time Logs</h3>
                                    <p className="mb-4 text-muted-foreground">You haven't added any time logs yet.</p>
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
