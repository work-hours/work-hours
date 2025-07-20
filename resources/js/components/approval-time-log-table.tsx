import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'
import { CheckCircle, X } from 'lucide-react'

export type TimeLogEntry = {
    id: number
    user_id: number
    user_name: string
    project_id?: number
    project_name: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    note?: string
    status?: 'pending' | 'approved' | 'rejected'
}

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
    return (
        <Table>
            <TableHeader>
                <TableHeaderRow>
                    {showCheckboxes && <TableHead className="w-[50px]">Select</TableHead>}
                    <TableHead>Team Member</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Note</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableHeaderRow>
            </TableHeader>
            <TableBody>
                {timeLogs.map((log) => (
                    <TableRow key={log.id}>
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
                        <TableCell className="font-medium">{log.user_name}</TableCell>
                        <TableCell className="font-medium">{log.project_name || 'No Project'}</TableCell>
                        <TableCell className="font-medium">{formatDateTime(log.start_timestamp)}</TableCell>
                        <TableCell className="font-medium">{formatDateTime(log.end_timestamp)}</TableCell>
                        <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {log.duration}
                            </span>
                        </TableCell>
                        <TableCell className="max-w-xs break-words whitespace-normal" title={log.note}>
                            <div className="max-h-20 overflow-y-auto">{log.note}</div>
                        </TableCell>
                        <TableCell>
                            {/* Approval Status */}
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
                                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                    onClick={() => onApprove(log.id)}
                                >
                                    <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                    Approve
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                                    onClick={() => onReject(log.id)}
                                >
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Reject
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
