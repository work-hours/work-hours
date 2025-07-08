import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface TeamStats {
    count: number;
}

interface DashboardProps {
    teamStats: TeamStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ teamStats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="rounded-lg bg-white p-6 shadow">
                    <h2 className="mb-4 text-xl font-semibold">Team Statistics</h2>
                    <div className="mb-4">
                        <p className="text-gray-700">
                            Total Team Members: <span className="font-bold">{teamStats.count}</span>
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
