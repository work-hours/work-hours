import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, Clock, LoaderCircle, Save, Timer } from 'lucide-react'
import { FormEventHandler, forwardRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

type Project = {
    id: number
    name: string
}

type TimeLogForm = {
    project_id: number
    start_timestamp: string
    end_timestamp: string
}

// Custom input component for DatePicker with icon
interface CustomInputProps {
    value?: string
    onClick?: () => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    icon: React.ReactNode
    placeholder?: string
    disabled?: boolean
    required?: boolean
    autoFocus?: boolean
    tabIndex?: number
    id: string
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
)

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Time Log',
        href: '/time-log',
    },
    {
        title: 'Create',
        href: '/time-log/create',
    },
]

type Props = {
    projects: Project[]
}

export default function CreateTimeLog({ projects }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<TimeLogForm>>({
        project_id: 0,
        start_timestamp: new Date().toISOString(), // Default to now, using full ISO string
        end_timestamp: '',
    })

    // Convert string timestamps to Date objects for DatePicker
    const startDate = data.start_timestamp ? new Date(data.start_timestamp) : new Date()
    const endDate = data.end_timestamp ? new Date(data.end_timestamp) : null

    // Handle date changes
    const handleStartDateChange = (date: Date | null) => {
        if (date) {
            // Store the exact selected date/time without timezone conversion
            const localDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes()
            )
            setData('start_timestamp', localDate.toISOString())
        }
    }

    const handleEndDateChange = (date: Date | null) => {
        if (date) {
            // Store the exact selected date/time without timezone conversion
            const localDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                date.getHours(),
                date.getMinutes()
            )
            setData('end_timestamp', localDate.toISOString())
        } else {
            setData('end_timestamp', '')
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('time-log.store'), {
            onFinish: () => reset(),
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Time Log" />
            <div className="mx-auto flex w-9/12 flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Log Your Time</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Record your work hours by entering start and end times</p>
                </section>

                <Card className="max-w-2xl overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Time Entry Details</CardTitle>
                        <CardDescription>Enter the start and end times for your work session</CardDescription>
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
                                        timeFormat="hh:mm a"
                                        timeIntervals={15}
                                        dateFormat="yyyy-MM-dd hh:mm a"
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
                                        timeFormat="hh:mm a"
                                        timeIntervals={15}
                                        dateFormat="yyyy-MM-dd hh:mm a"
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
                                        {processing ? 'Saving...' : 'Save Time Log'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
