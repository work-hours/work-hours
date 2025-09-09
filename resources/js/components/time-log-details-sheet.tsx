import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatTimeEntry } from '@/lib/utils'
import DOMPurify from 'dompurify'
import { Briefcase, CalendarDays, CheckCircle, Clock, DollarSign, FileText, Info, Tag, User } from 'lucide-react'
import { TimeLogEntry } from './time-log-table'

type TimeLogDetailsSheetProps = {
    timeLog: TimeLogEntry | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function TimeLogDetailsSheet({ timeLog, open, onOpenChange }: TimeLogDetailsSheetProps) {
    if (!timeLog) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-gray-900">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                        <Clock className="h-5 w-5 text-primary" />
                        Time Log Details
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500 dark:text-gray-400">
                        Viewing complete information for this time log entry
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Basic Information
                        </h3>
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="grid gap-4">
                                <div>
                                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Project</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{timeLog.project_name || 'No Project'}</p>
                                </div>

                                {timeLog.user_name && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Team Member</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-gray-400" />
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{timeLog.user_name}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Duration</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{timeLog.duration} hours</p>
                                    </div>
                                </div>

                                {timeLog.non_billable && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Billing</p>
                                        <Badge variant="secondary" className="capitalize">
                                            Non-billable
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {timeLog.tags && timeLog.tags.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                <Tag className="h-4 w-4 text-primary" />
                                Tags
                            </h3>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="flex flex-wrap gap-2">
                                    {timeLog.tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            className="rounded-md px-2 py-0.5 text-xs font-medium"
                                            style={{ backgroundColor: tag.color, color: '#fff' }}
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {timeLog.task_title && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                <FileText className="h-4 w-4 text-primary" />
                                Task Information
                            </h3>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="grid gap-4">
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Task Title</p>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{timeLog.task_title}</p>
                                    </div>

                                    {timeLog.task_status && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Task Status</p>
                                            <Badge
                                                variant={
                                                    timeLog.task_status.toLowerCase() === 'completed'
                                                        ? 'success'
                                                        : timeLog.task_status.toLowerCase() === 'in_progress'
                                                          ? 'warning'
                                                          : timeLog.task_status.toLowerCase() === 'blocked'
                                                            ? 'destructive'
                                                            : timeLog.task_status.toLowerCase() === 'pending'
                                                              ? 'secondary'
                                                              : 'outline'
                                                }
                                                className="capitalize"
                                            >
                                                {timeLog.task_status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    )}

                                    {timeLog.task_priority && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Task Priority</p>
                                            <Badge
                                                variant={
                                                    timeLog.task_priority.toLowerCase() === 'high'
                                                        ? 'destructive'
                                                        : timeLog.task_priority.toLowerCase() === 'medium'
                                                          ? 'default'
                                                          : timeLog.task_priority.toLowerCase() === 'low'
                                                            ? 'outline'
                                                            : 'muted'
                                                }
                                                className="capitalize"
                                            >
                                                {timeLog.task_priority}
                                            </Badge>
                                        </div>
                                    )}

                                    {timeLog.task_due_date && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Task Due Date</p>
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{timeLog.task_due_date}</p>
                                            </div>
                                        </div>
                                    )}

                                    {timeLog.task_description && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Task Description</p>
                                            <div
                                                className="prose prose-sm dark:prose-invert max-w-none rounded-md bg-gray-50 p-3 text-sm dark:bg-gray-800"
                                                dangerouslySetInnerHTML={{
                                                    __html:
                                                        typeof window !== 'undefined'
                                                            ? DOMPurify.sanitize(timeLog.task_description || '')
                                                            : timeLog.task_description || '',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                            <Clock className="h-4 w-4 text-primary" />
                            Time Information
                        </h3>
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div>
                                <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Entry</p>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-3.5 w-3.5 text-gray-400" />
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {formatTimeEntry(timeLog.start_timestamp, timeLog.end_timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {timeLog.hourly_rate !== undefined &&
                        timeLog.hourly_rate !== null &&
                        typeof timeLog.hourly_rate === 'number' &&
                        timeLog.hourly_rate > 0 && (
                            <div className="space-y-2.5">
                                <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    Payment Information
                                </h3>
                                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                    <div className="grid gap-4">
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Hourly Rate</p>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{`${timeLog.currency || 'USD'} ${timeLog.hourly_rate.toFixed(2)}`}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                {timeLog.is_paid ? 'Paid Amount' : 'To Pay Amount'}
                                            </p>
                                            <Badge variant={timeLog.is_paid ? 'success' : 'warning'} className="capitalize">
                                                {timeLog.currency || 'USD'}{' '}
                                                {timeLog.paid_amount !== undefined &&
                                                timeLog.paid_amount !== null &&
                                                typeof timeLog.paid_amount === 'number' &&
                                                timeLog.paid_amount > 0
                                                    ? timeLog.paid_amount.toFixed(2)
                                                    : timeLog.hourly_rate !== undefined &&
                                                        timeLog.hourly_rate !== null &&
                                                        typeof timeLog.hourly_rate === 'number' &&
                                                        timeLog.hourly_rate > 0 &&
                                                        timeLog.duration
                                                      ? (timeLog.hourly_rate * timeLog.duration).toFixed(2)
                                                      : '0.00'}
                                            </Badge>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Payment Status</p>
                                            <Badge variant={timeLog.is_paid ? 'success' : 'warning'} className="inline-flex items-center gap-1.5">
                                                {timeLog.is_paid ? (
                                                    <>
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Paid
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-3.5 w-3.5" />
                                                        Unpaid
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            Approval Information
                        </h3>
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="grid gap-4">
                                <div>
                                    <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Status</p>
                                    <Badge
                                        variant={
                                            timeLog.status === 'approved' ? 'success' : timeLog.status === 'rejected' ? 'destructive' : 'secondary'
                                        }
                                        className="inline-flex items-center gap-1.5"
                                    >
                                        {timeLog.status === 'approved' ? (
                                            <>
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                Approved
                                            </>
                                        ) : timeLog.status === 'rejected' ? (
                                            <>
                                                <Info className="h-3.5 w-3.5" />
                                                Rejected
                                            </>
                                        ) : (
                                            <>
                                                <Clock className="h-3.5 w-3.5" />
                                                Pending
                                            </>
                                        )}
                                    </Badge>
                                </div>

                                {timeLog.approver_name && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Approved By</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-gray-400" />
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{timeLog.approver_name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {(timeLog.note || timeLog.comment) && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                <Info className="h-4 w-4 text-primary" />
                                Additional Information
                            </h3>
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="grid gap-4">
                                    {timeLog.note && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Note</p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm whitespace-pre-wrap text-gray-700 dark:bg-gray-800/70 dark:text-gray-300">
                                                {timeLog.note}
                                            </p>
                                        </div>
                                    )}

                                    {timeLog.comment && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Comment</p>
                                            <p className="rounded-md bg-gray-50 p-3 text-sm whitespace-pre-wrap text-gray-700 dark:bg-gray-800/70 dark:text-gray-300">
                                                {timeLog.comment}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    )
}
