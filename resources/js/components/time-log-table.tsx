import TimeLogDeleteAction from '@/components/time-log-delete-action'
import TimeLogDetailsSheet from '@/components/time-log-details-sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { formatTimeEntry } from '@/lib/utils'
import { Link } from '@inertiajs/react'
import { Edit, Glasses, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

export type TimeLogEntry = {
    id: number
    project_id?: number
    project_name: string | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    user_name?: string
    is_paid?: boolean
    note?: string
    hourly_rate?: number
    paid_amount?: number
    currency?: string
    status?: 'pending' | 'approved' | 'rejected'
    approved_by?: number
    approver_name?: string
    comment?: string
    user_non_monetary?: boolean
    non_billable?: boolean
    task_title?: string
    task_status?: string
    task_priority?: string
    task_due_date?: string | null
    task_description?: string | null
    tags?: Array<{ id: number; name: string; color: string }>
}

type TimeLogTableProps = {
    timeLogs: TimeLogEntry[]
    showTeamMember?: boolean
    showMember?: boolean
    showActions?: boolean
    showCheckboxes?: boolean
    showProject?: boolean
    showEditDelete?: boolean
    selectedLogs?: number[]
    onSelectLog?: (id: number, checked: boolean) => void
    onEdit?: (log: TimeLogEntry) => void
}

export default function TimeLogTable({
    timeLogs,
    showTeamMember = false,
    showMember = false,
    showActions = false,
    showCheckboxes = false,
    showProject = true,
    showEditDelete = true,
    selectedLogs = [],
    onSelectLog,
    onEdit,
}: TimeLogTableProps) {
    const [selectedTimeLog, setSelectedTimeLog] = useState<TimeLogEntry | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const showTeamMemberFinal = showTeamMember || showMember

    const handleViewDetails = (log: TimeLogEntry) => {
        setSelectedTimeLog(log)
        setIsDetailsOpen(true)
    }

    return (
        <>
            <Table className="w-full">
                <TableHeader>
                    <TableHeaderRow>
                        {showCheckboxes && (
                            <TableHead className="dark:bg-gray-750 w-[50px] bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                Select
                            </TableHead>
                        )}
                        {showTeamMemberFinal && (
                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                Team Member
                            </TableHead>
                        )}
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Entry</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Hours</TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Hourly Rate
                        </TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                            Paid Amount
                        </TableHead>
                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">Status</TableHead>
                        {showActions && (
                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                                Actions
                            </TableHead>
                        )}
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
                                        disabled={
                                            log.is_paid ||
                                            !log.start_timestamp ||
                                            !log.end_timestamp ||
                                            log.status !== 'approved' ||
                                            log.user_non_monetary ||
                                            log.non_billable
                                        }
                                        title={
                                            !log.start_timestamp || !log.end_timestamp
                                                ? 'Time logs without both start and end timestamps cannot be marked as paid'
                                                : log.status !== 'approved'
                                                  ? 'Time logs must be approved before they can be marked as paid'
                                                  : log.non_billable
                                                    ? 'Non-billable time logs cannot be marked as paid'
                                                    : ''
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                </TableCell>
                            )}
                            {showTeamMemberFinal && <TableCell className="font-medium text-gray-800 dark:text-gray-200">{log.user_name}</TableCell>}
                            <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                                {formatTimeEntry(log.start_timestamp, log.end_timestamp)}
                                <br />
                                <div className="flex flex-wrap items-center gap-1">
                                    {showProject && <small className="mr-1">{log.project_name || 'No Project'}</small>}
                                    {log.non_billable && (
                                        <Badge className="bg-purple-100 text-[10px] font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                                            Non-billable
                                        </Badge>
                                    )}
                                    {log.tags && log.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {log.tags.map((tag) => (
                                                <Badge key={tag.id} className="text-xs" style={{ backgroundColor: tag.color, color: '#fff' }}>
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                <span className="inline-flex items-center bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                    {log.duration}
                                </span>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                {log.hourly_rate !== undefined &&
                                log.hourly_rate !== null &&
                                typeof log.hourly_rate === 'number' &&
                                log.hourly_rate > 0 ? (
                                    <span className="inline-flex items-center bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                        {log.currency || 'USD'} {log.hourly_rate.toFixed(2)}
                                    </span>
                                ) : (
                                    <span className="text-gray-500">-</span>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`inline-flex items-center ${log.is_paid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'} px-2 py-0.5 text-xs font-medium`}
                                    >
                                        {log.currency || 'USD'}{' '}
                                        {log.paid_amount !== undefined &&
                                        log.paid_amount !== null &&
                                        typeof log.paid_amount === 'number' &&
                                        log.paid_amount > 0
                                            ? log.paid_amount.toFixed(2)
                                            : log.hourly_rate !== undefined &&
                                                log.hourly_rate !== null &&
                                                typeof log.hourly_rate === 'number' &&
                                                log.hourly_rate > 0 &&
                                                log.duration
                                              ? (log.hourly_rate * log.duration).toFixed(2)
                                              : '0.00'}
                                    </span>

                                    {log.hourly_rate !== undefined &&
                                        log.hourly_rate !== null &&
                                        typeof log.hourly_rate === 'number' &&
                                        log.hourly_rate > 0 &&
                                        (log.is_paid ? (
                                            <span className="inline-flex items-center bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                                Paid
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                                                Unpaid
                                            </span>
                                        ))}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                {log.status === 'approved' ? (
                                    <span className="inline-flex items-center bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
                                        Approved
                                    </span>
                                ) : log.status === 'rejected' ? (
                                    <span className="inline-flex items-center bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-100">
                                        Rejected
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                        Pending
                                    </span>
                                )}
                            </TableCell>
                            {showActions && (
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem className="group cursor-pointer" onSelect={() => handleViewDetails(log)}>
                                                <Glasses className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                <span>View</span>
                                            </DropdownMenuItem>

                                            {showEditDelete && (
                                                <>
                                                    {!log.is_paid ? (
                                                        onEdit ? (
                                                            <DropdownMenuItem className="group cursor-pointer" onSelect={() => onEdit(log)}>
                                                                <Edit className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                        ) : (
                                                            <Link href={route('time-log.edit', log.id)}>
                                                                <DropdownMenuItem className="group cursor-pointer">
                                                                    <Edit className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Edit</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                        )
                                                    ) : (
                                                        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
                                                            <Edit className="mr-2 h-4 w-4 text-gray-400" />
                                                            <span>Edit Log</span>
                                                        </DropdownMenuItem>
                                                    )}

                                                    {!log.is_paid ? (
                                                        <TimeLogDeleteAction timeLogId={log.id} />
                                                    ) : (
                                                        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
                                                            <Trash2 className="mr-2 h-4 w-4 text-gray-400" />
                                                            <span>Delete</span>
                                                        </DropdownMenuItem>
                                                    )}
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <TimeLogDetailsSheet timeLog={selectedTimeLog} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
        </>
    )
}
