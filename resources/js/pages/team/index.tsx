import DeleteTeamMember from '@/components/delete-team-member';
import EmptyState from '@/components/empty-state';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Edit, PlusCircle } from 'lucide-react';

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
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Team Members</h2>
                    <div className="flex items-center gap-2">
                        <Link href={route('team.all-time-logs')}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <span>All Time Logs</span>
                            </Button>
                        </Link>
                        <Button className="flex items-center gap-2">
                            <Link href={route('team.create')} className="flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                <span>Create New</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {teamMembers.length > 0 ? (
                    <div className="rounded-md border">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/50">
                                    <th className="px-4 py-3 text-left font-medium">Name</th>
                                    <th className="px-4 py-3 text-left font-medium">Email</th>
                                    <th className="px-4 py-3 text-left font-medium">Role</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.map((member) => (
                                    <tr key={member.id} className="border-b">
                                        <td className="px-4 py-3">{member.name}</td>
                                        <td className="px-4 py-3">{member.email}</td>
                                        <td className="px-4 py-3">{member.role}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={route('team.time-logs', member.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Time Logs
                                                    </Button>
                                                </Link>
                                                <Link href={route('team.edit', member.id)}>
                                                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                                        <Edit className="h-4 w-4" />
                                                        <span className="sr-only">Edit</span>
                                                    </Button>
                                                </Link>
                                                <DeleteTeamMember userId={member.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded-md border p-6">
                        <EmptyState
                            title="No Team Members"
                            description="You haven't added any team members yet."
                            actionLabel="Add Team Member"
                            actionRoute="team.create"
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
