import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatTimeEntry } from '@/lib/utils'
import { Clock, Info, CalendarDays, Tag, Briefcase, CheckCircle, User, DollarSign, FileText } from 'lucide-react'
import { TimeLogEntry } from './time-log-table'
import DOMPurify from 'dompurify'

type TimeLogDetailsSheetProps = {
    timeLog: TimeLogEntry | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function TimeLogDetailsSheet({ timeLog, open, onOpenChange }: TimeLogDetailsSheetProps) {
    if (!timeLog) return null

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="overflow-y-auto bg-white dark:bg-neutral-900 sm:max-w-md md:max-w-lg pl-4 pb-4">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-neutral-900 dark:text-white">
                        <Clock className="h-5 w-5 text-primary" />
                        Time Log Details
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        Viewing complete information for this time log entry
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            <Briefcase className="h-4 w-4 text-primary/80" />
                            Basic Information
                        </h3>
                        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                            <div className="grid gap-4">
                                <div>
                                    <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Project</p>
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">{timeLog.project_name || 'No Project'}</p>
                                </div>

                                {timeLog.user_name && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Team Member</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-neutral-400" />
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{timeLog.user_name}</p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Duration</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5 text-neutral-400" />
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{timeLog.duration} hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tags Information - Only shown if tags exist */}
                    {timeLog.tags && timeLog.tags.length > 0 && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                <Tag className="h-4 w-4 text-primary/80" />
                                Tags
                            </h3>
                            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                                <div className="flex flex-wrap gap-2">
                                    {timeLog.tags.map((tag) => (
                                        <Badge key={tag.id} className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: tag.color, color: '#fff' }}>
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Task Information */}
                    {timeLog.task_title && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                <FileText className="h-4 w-4 text-primary/80" />
                                Task Information
                            </h3>
                            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                                <div className="grid gap-4">
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Task Title</p>
                                        <p className="text-sm font-medium text-neutral-900 dark:text-white">{timeLog.task_title}</p>
                                    </div>

                                    {timeLog.task_status && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Task Status</p>
                                            <Badge
                                                variant={
                                                    timeLog.task_status.toLowerCase() === 'completed' ? 'success' :
                                                    timeLog.task_status.toLowerCase() === 'in_progress' ? 'warning' :
                                                    timeLog.task_status.toLowerCase() === 'blocked' ? 'destructive' :
                                                    timeLog.task_status.toLowerCase() === 'pending' ? 'secondary' :
                                                    'outline'
                                                }
                                            >
                                                {timeLog.task_status}
                                            </Badge>
                                        </div>
                                    )}

                                    {timeLog.task_priority && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Task Priority</p>
                                            <Badge
                                                variant={
                                                    timeLog.task_priority.toLowerCase() === 'high' ? 'destructive' :
                                                    timeLog.task_priority.toLowerCase() === 'medium' ? 'default' :
                                                    timeLog.task_priority.toLowerCase() === 'low' ? 'outline' :
                                                    'muted'
                                                }
                                            >
                                                {timeLog.task_priority}
                                            </Badge>
                                        </div>
                                    )}

                                    {timeLog.task_due_date && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Task Due Date</p>
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{timeLog.task_due_date}</p>
                                            </div>
                                        </div>
                                    )}

                                    {timeLog.task_description && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Task Description</p>
                                        <div
                                            className="prose prose-sm max-w-none rounded-md bg-neutral-50 p-3 text-sm dark:prose-invert dark:bg-neutral-800/70"
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

                    {/* Time Information */}
                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            <Clock className="h-4 w-4 text-primary/80" />
                            Time Information
                        </h3>
                        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                            <div>
                                <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Entry</p>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                        {formatTimeEntry(timeLog.start_timestamp, timeLog.end_timestamp)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information - Only shown for monetary users */}
                    {timeLog.hourly_rate !== undefined &&
                        timeLog.hourly_rate !== null &&
                        typeof timeLog.hourly_rate === 'number' &&
                        timeLog.hourly_rate > 0 && (
                            <div className="space-y-2.5">
                                <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                    <DollarSign className="h-4 w-4 text-primary/80" />
                                    Payment Information
                                </h3>
                                <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                                    <div className="grid gap-4">
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Hourly Rate</p>
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
                                                <p className="text-sm font-medium text-neutral-900 dark:text-white">{`${timeLog.currency || 'USD'} ${timeLog.hourly_rate.toFixed(2)}`}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                                                {timeLog.is_paid ? 'Paid Amount' : 'To Pay Amount'}
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${timeLog.is_paid ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}
                                            >
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
                                            </span>
                                        </div>

                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Payment Status</p>
                                            {timeLog.is_paid ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Paid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Unpaid
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Approval Information */}
                    <div className="space-y-2.5">
                        <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                            <CheckCircle className="h-4 w-4 text-primary/80" />
                            Approval Information
                        </h3>
                        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                            <div className="grid gap-4">
                                <div>
                                    <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Status</p>
                                    {timeLog.status === 'approved' ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            Approved
                                        </span>
                                    ) : timeLog.status === 'rejected' ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                                            <Info className="h-3.5 w-3.5" />
                                            Rejected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-neutral-50 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300">
                                            <Clock className="h-3.5 w-3.5" />
                                            Pending
                                        </span>
                                    )}
                                </div>

                                {timeLog.approver_name && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Approved By</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-3.5 w-3.5 text-neutral-400" />
                                            <p className="text-sm font-medium text-neutral-900 dark:text-white">{timeLog.approver_name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    {(timeLog.note || timeLog.comment) && (
                        <div className="space-y-2.5">
                            <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                <Info className="h-4 w-4 text-primary/80" />
                                Additional Information
                            </h3>
                            <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-800/50">
                                <div className="grid gap-4">
                                    {timeLog.note && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Note</p>
                                            <p className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-700 whitespace-pre-wrap dark:bg-neutral-800/70 dark:text-neutral-300">{timeLog.note}</p>
                                        </div>
                                    )}

                                    {timeLog.comment && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">Comment</p>
                                            <p className="rounded-md bg-neutral-50 p-3 text-sm text-neutral-700 whitespace-pre-wrap dark:bg-neutral-800/70 dark:text-neutral-300">{timeLog.comment}</p>
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
