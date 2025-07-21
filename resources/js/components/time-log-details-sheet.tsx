import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatDateTime } from '@/lib/utils'
import { Info } from 'lucide-react'
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
            <SheetContent side="right" className="overflow-y-auto sm:max-w-md md:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        Time Log Details
                    </SheetTitle>
                    <SheetDescription>Viewing complete information for this time log entry</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Project</p>
                                <p className="text-base">{timeLog.project_name || 'No Project'}</p>
                            </div>

                            {timeLog.user_name && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Team Member</p>
                                    <p className="text-base">{timeLog.user_name}</p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Duration</p>
                                <p className="text-base">{timeLog.duration} hours</p>
                            </div>
                        </div>
                    </div>

                    {/* Time Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Time Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Start Time</p>
                                <p className="text-base">{formatDateTime(timeLog.start_timestamp)}</p>
                            </div>

                            <div>
                                <p className="text-sm font-bold text-muted-foreground">End Time</p>
                                <p className="text-base">{formatDateTime(timeLog.end_timestamp)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Payment Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            {timeLog.hourly_rate !== undefined && timeLog.hourly_rate !== null && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Hourly Rate</p>
                                    <p className="text-base">
                                        {timeLog.currency || 'USD'}{' '}
                                        {typeof timeLog.hourly_rate === 'number' ? timeLog.hourly_rate.toFixed(2) : timeLog.hourly_rate}
                                    </p>
                                </div>
                            )}

                            {timeLog.paid_amount !== undefined && timeLog.paid_amount !== null && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Paid Amount</p>
                                    <p className="text-base">
                                        {timeLog.currency || 'USD'}{' '}
                                        {typeof timeLog.paid_amount === 'number' ? timeLog.paid_amount.toFixed(2) : timeLog.paid_amount}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Payment Status</p>
                                <p className="text-base">
                                    {timeLog.is_paid ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:bg-green-900 dark:text-green-100">
                                            Paid
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                                            Unpaid
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Approval Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Approval Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            <div>
                                <p className="text-sm font-bold text-muted-foreground">Status</p>
                                <p className="text-base">
                                    {timeLog.status === 'approved' ? (
                                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-800 dark:bg-green-900 dark:text-green-100">
                                            Approved
                                        </span>
                                    ) : timeLog.status === 'rejected' ? (
                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-800 dark:bg-red-900 dark:text-red-100">
                                            Rejected
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                            Pending
                                        </span>
                                    )}
                                </p>
                            </div>

                            {timeLog.approver_name && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Approved By</p>
                                    <p className="text-base">{timeLog.approver_name}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-2">
                        <h3 className="ml-4 text-lg font-semibold text-primary">Additional Information</h3>
                        <div className="grid grid-cols-1 gap-4 rounded-lg border p-4">
                            {timeLog.note && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Note</p>
                                    <p className="text-base whitespace-pre-wrap">{timeLog.note}</p>
                                </div>
                            )}

                            {timeLog.comment && (
                                <div>
                                    <p className="text-sm font-bold text-muted-foreground">Comment</p>
                                    <p className="text-base whitespace-pre-wrap">{timeLog.comment}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
