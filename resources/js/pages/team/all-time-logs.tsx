import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatDateTime } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, CalendarIcon, CalendarRange, ClockIcon, Search, TimerReset } from 'lucide-react';
import { FormEventHandler, useMemo, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        get(route('team.all-time-logs'), {
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="All Team Time Logs" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <Link href={route('team.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to Team</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">All Team Time Logs</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Track and manage work hours across all team members</p>
                        </div>
                    </div>
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
                                        get(route('team.all-time-logs'));
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

                {/* Stats Cards */}
                {timeLogs.length > 0 && (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Total hours card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Team Hours</CardTitle>
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
                                            : 'Total hours logged by all team members'}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Weekly average card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Team Weekly Average</CardTitle>
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{weeklyAverage}</div>
                                <p className="text-xs text-muted-foreground">Hours per week across all team members</p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Time Logs Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Team Time Logs</CardTitle>
                        <CardDescription>
                            {timeLogs.length > 0
                                ? `Showing ${timeLogs.length} time ${timeLogs.length === 1 ? 'entry' : 'entries'} from all team members`
                                : 'No time logs found for the selected period'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {timeLogs.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead>Team Member</TableHead>
                                        <TableHead>Start Time</TableHead>
                                        <TableHead>End Time</TableHead>
                                        <TableHead>Duration</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {timeLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.user_name}</TableCell>
                                            <TableCell className="font-medium">{formatDateTime(log.start_timestamp)}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatDateTime(log.end_timestamp)}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {log.duration}
                                                </span>
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
                                    <p className="mb-4 text-muted-foreground">No team members have added any time logs yet.</p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
