import DeleteTeamMember from '@/components/delete-team-member';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Clock, Edit, UserPlus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
];

type TeamMember = {
    id: number;
    name: string;
    email: string;
    role: string;
};

type Props = {
    teamMembers: TeamMember[];
};

export default function Team({ teamMembers }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team" />
            <div className="flex flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Team Management</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your team members and their time logs</p>
                </section>

                {/* Actions card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Team Members</CardTitle>
                                <CardDescription>You have {teamMembers.length} team members</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={route('team.all-time-logs')}>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>All Time Logs</span>
                                    </Button>
                                </Link>
                                <Link href={route('team.create')}>
                                    <Button className="flex items-center gap-2">
                                        <UserPlus className="h-4 w-4" />
                                        <span>Add Member</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {teamMembers.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {teamMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">{member.name}</TableCell>
                                            <TableCell className="text-muted-foreground">{member.email}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                                                    {member.role}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('team.time-logs', member.id)}>
                                                        <Button variant="outline" size="sm" className="h-8">
                                                            <Clock className="mr-1 h-3.5 w-3.5" />
                                                            Time Logs
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('team.edit', member.id)}>
                                                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                            <Edit className="h-3.5 w-3.5" />
                                                            <span className="sr-only">Edit</span>
                                                        </Button>
                                                    </Link>
                                                    <DeleteTeamMember userId={member.id} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Team Members</h3>
                                    <p className="mb-4 text-muted-foreground">You haven't added any team members yet.</p>
                                    <Link href={route('team.create')}>
                                        <Button className="flex items-center gap-2">
                                            <UserPlus className="h-4 w-4" />
                                            <span>Add Team Member</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
