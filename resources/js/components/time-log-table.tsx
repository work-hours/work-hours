import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table';
import { formatDateTime } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteTimeLog from '@/components/delete-time-log';

export type TimeLogEntry = {
    id: number;
    project_id?: number;
    project_name: string | null;
    start_timestamp: string;
    end_timestamp: string;
    duration: number;
    user_name?: string;
};

type TimeLogTableProps = {
    timeLogs: TimeLogEntry[];
    showTeamMember?: boolean;
    showActions?: boolean;
};

export default function TimeLogTable({ timeLogs, showTeamMember = false, showActions = false }: TimeLogTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableHeaderRow>
                    {showTeamMember && <TableHead>Team Member</TableHead>}
                    <TableHead>Project</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    {showActions && <TableHead className="text-right">Actions</TableHead>}
                </TableHeaderRow>
            </TableHeader>
            <TableBody>
                {timeLogs.map((log) => (
                    <TableRow key={log.id}>
                        {showTeamMember && <TableCell className="font-medium">{log.user_name}</TableCell>}
                        <TableCell className="font-medium">{log.project_name || 'No Project'}</TableCell>
                        <TableCell className="font-medium">{formatDateTime(log.start_timestamp)}</TableCell>
                        <TableCell className="font-medium">{formatDateTime(log.end_timestamp)}</TableCell>
                        <TableCell>
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                {log.duration}
                            </span>
                        </TableCell>
                        {showActions && (
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
                        )}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
