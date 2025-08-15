import { Pagination } from '@/components/ui/pagination'
import AdminLayout from '@/layouts/admin-layout'
import { formatDateTime } from '@/lib/utils'
import { Head } from '@inertiajs/react'

interface Invoice {
    id: number
    invoice_number: string
    issue_date: string
    due_date: string
    total_amount: number
    paid_amount: number
    status: string
    created_at: string
    user: { id: number; name: string }
    client: { id: number; name: string } | null
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
    invoices: PaginatedData<Invoice>
}

export default function Index({ invoices }: Props) {
    const formatCurrency = (amount: number): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)

    const statusBadgeClass = (status: string): string => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            case 'sent':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'partially_paid':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'overdue':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
    }

    const statusLabel = (status: string): string => status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())

    return (
        <AdminLayout>
            <Head title="Admin - Invoice Management" />
            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Invoice Management</h1>
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
                                        Invoice #
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Owner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Issue Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Due Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Paid
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {invoices.data.map((invoice: Invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                            {invoice.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {invoice.invoice_number}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">{invoice.user?.name}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {invoice.client?.name ?? '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {invoice.issue_date ? formatDateTime(invoice.issue_date) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {invoice.due_date ? formatDateTime(invoice.due_date) : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatCurrency(invoice.total_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatCurrency(invoice.paid_amount)}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(invoice.status)}`}
                                            >
                                                {statusLabel(invoice.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-600 dark:text-gray-300">
                                            {formatDateTime(invoice.created_at)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <Pagination links={invoices.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
