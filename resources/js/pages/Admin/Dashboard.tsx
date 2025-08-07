import AdminLayout from '@/layouts/admin-layout'
import { Head, Link } from '@inertiajs/react'

export default function Dashboard() {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-medium">Users</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">Manage user accounts and permissions</p>
                        <Link href="/administration/users" className="text-blue-600 hover:underline dark:text-blue-400">
                            View all users →
                        </Link>
                    </div>

                    {/* You can add more admin modules here in the future */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-medium">System Status</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">View system health and performance metrics</p>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset dark:bg-green-900/30 dark:text-green-400 dark:ring-green-500/30">
                            System Operational
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

Dashboard.layout = (page) => <AdminLayout children={page} />
