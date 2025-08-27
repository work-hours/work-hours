import TimeLogDetailsSheet from '@/components/time-log-details-sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, Glasses, X } from 'lucide-react'
import { useState } from 'react'
import type { TimeLogEntry } from './time-log-table'

type ApprovalTimeLogTableProps = {
    timeLogs: TimeLogEntry[]
    showCheckboxes?: boolean
    selectedLogs?: number[]
    onSelectLog?: (id: number, checked: boolean) => void
    onApprove: (id: number) => void
    onReject: (id: number) => void
}

export default function ApprovalTimeLogTable({
    timeLogs,
    showCheckboxes = true,
    selectedLogs = [],
    onSelectLog,
    onApprove,
    onReject,
}: ApprovalTimeLogTableProps) {
    const [selectedTimeLog, setSelectedTimeLog] = useState<TimeLogEntry | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    const handleViewDetails = (log: TimeLogEntry) => {
        setSelectedTimeLog(log)
        setIsDetailsOpen(true)
    }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableHeaderRow>
                        {showCheckboxes && (
                            <TableHead className="dark:bg-gray-750 w-[50px] bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                Select
                            </TableHead>
                        )}
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Team Member
                        </TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Project</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Start Time</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">End Time</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Duration</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Note</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                            Actions
                        </TableHead>
                    </TableHeaderRow>
                </TableHeader>
                <TableBody>
                    {timeLogs.map((log) => (
                        <TableRow key={log.id} className="dark:hover:bg-gray-750 border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700">
                            {showCheckboxes && (
                                <TableCell>
                                    <input
                                        type="checkbox"
                                        checked={selectedLogs.includes(log.id)}
                                        onChange={(e) => onSelectLog && onSelectLog(log.id, e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </TableCell>
                            )}
                            <TableCell className="font-medium text-gray-800 dark:text-gray-200">{log.user_name}</TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex flex-wrap items-center gap-1">
                                    <span>{log.project_name || 'No Project'}</span>
                                    {log.non_billable && (
                                        <Badge className="bg-purple-100 text-[10px] font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                            Non-billable
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">{formatDateTime(log.start_timestamp)}</TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">{formatDateTime(log.end_timestamp)}</TableCell>
                            <TableCell>
                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                    {log.duration}
                                </span>
                            </TableCell>
                            <TableCell className="max-w-xs text-sm break-words whitespace-normal text-gray-700 dark:text-gray-300" title={log.note}>
                                <div className="max-h-20 overflow-y-auto">{log.note}</div>
                            </TableCell>
                            <TableCell>
                                {log.status === 'approved' ? (
                                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                        Approved
                                    </span>
                                ) : log.status === 'rejected' ? (
                                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                                        Rejected
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        Pending
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                        onClick={() => handleViewDetails(log)}
                                    >
                                        <Glasses className="mr-1 h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                                        onClick={() => onApprove(log.id)}
                                    >
                                        <CheckCircle className="mr-1 h-3.5 w-3.5" />
                                        Approve
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                        onClick={() => onReject(log.id)}
                                    >
                                        <X className="mr-1 h-3.5 w-3.5" />
                                        Reject
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TimeLogDetailsSheet timeLog={selectedTimeLog} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
        </>
    )
}
