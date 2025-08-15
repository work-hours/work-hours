import { ActionButton, ActionButtonGroup, ExportButton } from '@/components/action-buttons'
import AddNewButton from '@/components/add-new-button'
import BackButton from '@/components/back-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { Edit, FileText, Plus } from 'lucide-react'

type Invoice = {
    id: number
    invoice_number: string
    issue_date: string
    due_date: string
    total_amount: number
    paid_amount: number
    status: string
    created_at: string
}

type Client = {
    id: number
    name: string
    email: string | null
    contact_person: string | null
    phone: string | null
    address: string | null
    notes: string | null
    hourly_rate: number | null
    currency: string | null
}

type Props = {
    client: Client
    invoices: Invoice[]
}

export default function ClientInvoices({ client, invoices }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clients',
            href: '/client',
        },
        {
            title: client.name,
            href: `/client/${client.id}/invoices`,
        },
    ]

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const getStatusBadgeClass = (status: string): string => {
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

    const formatStatusLabel = (status: string): string => {
        return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }

    const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)

    const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.paid_amount, 0)

    const totalOutstanding = totalInvoiced - totalPaid

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} - Invoices`} />
            <div className="mx-auto flex flex-col gap-4 p-4">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{client.name} - Invoices</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage invoices for this client</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                {/* Info and Summary side by side */}
                <div className="flex flex-col gap-2 md:flex-row">
                    {/* Client Info Card */}
                    <Card className="flex-1 overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="py-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex min-w-[120px] items-center gap-2">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">👤</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Contact Person
                                        </h3>
                                        <p className="text-xs leading-tight">{client.contact_person || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex min-w-[120px] items-center gap-2">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">✉️</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Email
                                        </h3>
                                        <p className="text-xs leading-tight">{client.email || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex min-w-[100px] items-center gap-2">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">📞</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Phone
                                        </h3>
                                        <p className="text-xs leading-tight">{client.phone || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex min-w-[120px] items-center gap-2">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">🏠</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Address
                                        </h3>
                                        <p className="text-xs leading-tight">{client.address || 'Not specified'}</p>
                                    </div>
                                </div>
                                {client.notes && (
                                    <div className="flex min-w-[180px] items-center gap-2">
                                        <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">📝</span>
                                        </span>
                                        <div>
                                            <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                Notes
                                            </h3>
                                            <p className="text-xs leading-tight">{client.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Summary Card */}
                    <Card className="flex-1 overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="py-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">💰</span>
                                </span>
                                Invoice Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex flex-row items-center gap-4">
                                <div className="flex min-w-[160px] items-center gap-2 rounded-lg bg-card p-3 text-card-foreground shadow-sm">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">📄</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Total
                                        </h3>
                                        <p className="text-lg leading-tight font-bold">{formatCurrency(totalInvoiced)}</p>
                                    </div>
                                </div>
                                <div className="flex min-w-[160px] items-center gap-2 rounded-lg bg-card p-3 text-card-foreground shadow-sm">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">✅</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Paid
                                        </h3>
                                        <p className="text-lg leading-tight font-bold">{formatCurrency(totalPaid)}</p>
                                    </div>
                                </div>
                                <div className="flex min-w-[160px] items-center gap-2 rounded-lg bg-card p-3 text-card-foreground shadow-sm">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-800">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">⏳</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs leading-tight font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Outstanding
                                        </h3>
                                        <p className="text-lg leading-tight font-bold">{formatCurrency(totalOutstanding)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Invoices Card */}
                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Invoices</CardTitle>
                                <CardDescription>
                                    {invoices.length > 0
                                        ? `${client.name} has ${invoices.length} ${invoices.length === 1 ? 'invoice' : 'invoices'}`
                                        : 'No invoices found for this client'}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <ExportButton href={`${route('invoice.export')}?client_id=${client.id}`} label="Export" />
                                <AddNewButton href={route('invoice.create')}>
                                    <Plus className="h-4 w-4" />
                                    <span>Create Invoice</span>
                                </AddNewButton>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {invoices.length > 0 ? (
                            <Table className="w-full">
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Invoice #
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Issue Date
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Due Date
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Amount
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Paid
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Balance
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Status
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Actions
                                        </TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow
                                            key={invoice.id}
                                            className="dark:hover:bg-gray-750 border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700"
                                        >
                                            <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                                            <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                                            <TableCell>{formatCurrency(invoice.paid_amount)}</TableCell>
                                            <TableCell>{formatCurrency(invoice.total_amount - invoice.paid_amount)}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                                        invoice.status,
                                                    )}`}
                                                >
                                                    {formatStatusLabel(invoice.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <ActionButtonGroup>
                                                        <ActionButton
                                                            href={route('invoice.edit', invoice.id)}
                                                            title="Edit Invoice"
                                                            icon={Edit}
                                                            variant="warning"
                                                            size="icon"
                                                        />
                                                    </ActionButtonGroup>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Invoices</h3>
                                    <p className="mb-4 text-muted-foreground">This client doesn't have any invoices yet.</p>
                                    <AddNewButton href={route('invoice.create')}>
                                        <Plus className="h-4 w-4" />
                                        <span>Create Invoice</span>
                                    </AddNewButton>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
