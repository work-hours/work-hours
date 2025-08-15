import AdminLayout from '@/layouts/admin-layout'
import { Head, Link } from '@inertiajs/react'

interface DashboardProps {
    userCount: number
    timeLogCount: number
    projectCount: number
    clientCount: number
}

export const statCard = ({ title, count, link }: { title: string; count: number; link: string | null }) => (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-medium">
            {title} ({count})
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Manage {title.toLowerCase()}</p>
        {link && (
            <Link href={link} className="text-blue-600 hover:underline dark:text-blue-400">
                View all {title.toLowerCase()} →
            </Link>
        )}
    </div>
)

export default function Dashboard({ userCount, timeLogCount, projectCount, clientCount }: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCard({ title: 'Users', count: userCount, link: '/administration/users' })}
                    {statCard({ title: 'Projects', count: projectCount, link: null })}
                    {statCard({ title: 'Clients', count: clientCount, link: null })}
                    {statCard({ title: 'Time Logs', count: timeLogCount, link: null })}
                </div>
            </div>
        </AdminLayout>
    )
}
