import { Pagination } from '@/components/ui/pagination'
import AdminLayout from '@/layouts/admin-layout'
import { formatDateTime } from '@/lib/utils'
import { Head } from '@inertiajs/react'

interface Client {
    id: number
    name: string
    email: string | null
    contact_person: string | null
    phone: string | null
    created_at: string
    user: { id: number; name: string }
    projects_count: number
    invoices_count: number
}

interface PaginatedData<T> {
    data: T[]
    links: {
        url: string | null
        label: string
        active: boolean
    }[]
}

interface Props {
    clients: PaginatedData<Client>
}

export default function Index({ clients }: Props) {
    return (
        <AdminLayout>
            <Head title="Admin - Client Management" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Client Management</h1>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Owner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Contact Person
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Phone
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Projects
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Invoices
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {clients.data.map((client: Client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                            {client.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{client.name}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{client.user?.name}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {client.email ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {client.contact_person ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {client.phone ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {client.projects_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {client.invoices_count}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatDateTime(client.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <Pagination links={clients.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
