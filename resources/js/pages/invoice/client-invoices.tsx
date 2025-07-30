import { ActionButton, ActionButtonGroup, ExportButton } from '@/components/action-buttons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Edit, FileText, Plus } from 'lucide-react'

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

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    // Get status badge class
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

    // Format status label
    const formatStatusLabel = (status: string): string => {
        return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    }

    // Calculate total invoiced amount
    const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.total_amount, 0)

    // Calculate total paid amount
    const totalPaid = invoices.reduce((sum, invoice) => sum + invoice.paid_amount, 0)

    // Calculate total outstanding amount
    const totalOutstanding = totalInvoiced - totalPaid

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} - Invoices`} />
            <div className="mx-auto flex flex-col gap-2 p-3">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <Link href={route('client.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to Clients</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{client.name} - Invoices</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage invoices for this client</p>
                        </div>
                    </div>
                </section>

                {/* Info and Summary side by side */}
                <div className="flex flex-col md:flex-row gap-2">
                    {/* Client Info Card */}
                    <Card className="flex-1 overflow-hidden transition-all hover:shadow-md" >
                        <CardHeader className="py-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                    <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                Client Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-2 min-w-[120px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">👤</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Contact Person</h3>
                                        <p className="text-xs leading-tight">{client.contact_person || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 min-w-[120px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">✉️</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Email</h3>
                                        <p className="text-xs leading-tight">{client.email || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 min-w-[100px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">📞</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Phone</h3>
                                        <p className="text-xs leading-tight">{client.phone || 'Not specified'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 min-w-[120px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">🏠</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Address</h3>
                                        <p className="text-xs leading-tight">{client.address || 'Not specified'}</p>
                                    </div>
                                </div>
                                {client.notes && (
                                    <div className="flex items-center gap-2 min-w-[180px]">
                                        <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">📝</span>
                                        </span>
                                        <div>
                                            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Notes</h3>
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
                            <CardTitle className="text-lg flex items-center gap-2">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">💰</span>
                                </span>
                                Invoice Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm flex items-center gap-2 min-w-[160px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">📄</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Total Invoiced</h3>
                                        <p className="text-lg font-bold leading-tight">{formatCurrency(totalInvoiced)}</p>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm flex items-center gap-2 min-w-[160px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">✅</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Total Paid</h3>
                                        <p className="text-lg font-bold leading-tight">{formatCurrency(totalPaid)}</p>
                                    </div>
                                </div>
                                <div className="rounded-lg border bg-card p-3 text-card-foreground shadow-sm flex items-center gap-2 min-w-[160px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">⏳</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Outstanding</h3>
                                        <p className="text-lg font-bold leading-tight">{formatCurrency(totalOutstanding)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700" />

                {/* Invoices Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
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
                                <Link href={route('invoice.create')}>
                                    <Button className="flex items-center gap-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Create Invoice</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {invoices.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Issue Date</TableHead>
                                        <TableHead>Due Date</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Paid</TableHead>
                                        <TableHead>Balance</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((invoice) => (
                                        <TableRow key={invoice.id}>
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
                                                            variant="amber"
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
                                    <Link href={route('invoice.create')}>
                                        <Button className="flex items-center gap-2">
                                            <Plus className="h-4 w-4" />
                                            <span>Create Invoice</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
