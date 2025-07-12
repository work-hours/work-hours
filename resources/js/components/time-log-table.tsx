import DeleteTimeLog from '@/components/delete-time-log'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { formatDateTime } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { Edit, Trash2 } from 'lucide-react'

export type TimeLogEntry = {
    id: number
    project_id?: number
    project_name: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    user_name?: string
    is_paid?: boolean
}

type TimeLogTableProps = {
    timeLogs: TimeLogEntry[]
    showTeamMember?: boolean
    showActions?: boolean
    showCheckboxes?: boolean
    showProject?: boolean
    selectedLogs?: number[]
    onSelectLog?: (id: number, checked: boolean) => void
}

export default function TimeLogTable({
    timeLogs,
    showTeamMember = false,
    showActions = false,
    showCheckboxes = false,
    showProject = true,
    selectedLogs = [],
    onSelectLog,
}: TimeLogTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableHeaderRow>
                    {showCheckboxes && <TableHead className="w-[50px]">Select</TableHead>}
                    {showTeamMember && <TableHead>Team Member</TableHead>}
                    {showProject && <TableHead>Project</TableHead>}
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    {showActions && <TableHead className="text-right">Actions</TableHead>}
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
                                    disabled={log.is_paid}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </TableCell>
                        )}
                        {showTeamMember && <TableCell className="font-medium">{log.user_name}</TableCell>}
                        {showProject && <TableCell className="font-medium">{log.project_name || 'No Project'}</TableCell>}
                        <TableCell className="font-medium">{formatDateTime(log.start_timestamp)}</TableCell>
                        <TableCell className="font-medium">{formatDateTime(log.end_timestamp)}</TableCell>
                        <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {log.duration}
                            </span>
                        </TableCell>
                        <TableCell>
                            {log.is_paid ? (
                                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                    Paid
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                                    Unpaid
                                </span>
                            )}
                        </TableCell>
                        {showActions && (
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {!log.is_paid ? (
                                        <Link href={route('time-log.edit', log.id)}>
                                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                <Edit className="h-3.5 w-3.5" />
                                                <span className="sr-only">Edit</span>
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled title="Paid time logs cannot be edited">
                                            <Edit className="h-3.5 w-3.5" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                    )}
                                    {!log.is_paid ? (
                                        <DeleteTimeLog timeLogId={log.id} />
                                    ) : (
                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled title="Paid time logs cannot be deleted">
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
