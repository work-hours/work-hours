import { ExportButton } from '@/components/action-buttons'
import AddNewButton from '@/components/add-new-button'
import BackButton from '@/components/back-button'
import InvoiceDeleteAction from '@/components/invoice-delete-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { DollarSign, Edit, FileText, Mail, MoreVertical, Phone, Plus, User } from 'lucide-react'

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
                <section className="mb-2">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">{client.name}</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage invoices for this client</p>
                        </div>
                        <BackButton />
                    </div>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="flex items-center gap-2 text-base font-medium text-gray-800 dark:text-gray-100">
                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 p-1.5 dark:bg-gray-700">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </span>
                            Client Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Contact Person</h3>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.contact_person || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Email</h3>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.email || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Phone</h3>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{client.phone || 'Not specified'}</p>
                                </div>
                            </div>
                            {client.hourly_rate && (
                                <div className="flex items-center gap-3">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                        <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Hourly Rate</h3>
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {client.hourly_rate} {client.currency || 'USD'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Invoice Summary</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    {invoices.length > 0
                                        ? `${client.name} has ${invoices.length} ${invoices.length === 1 ? 'invoice' : 'invoices'}`
                                        : 'No invoices found for this client'}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <ExportButton href={route('invoice.export')} label="Export" />
                                <AddNewButton href={route('invoice.create', { client_id: client.id })}>
                                    <Plus className="h-4 w-4" />
                                    <span>New Invoice</span>
                                </AddNewButton>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Invoiced</h3>
                                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{formatCurrency(totalInvoiced)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <DollarSign className="h-5 w-5 text-green-500 dark:text-green-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Paid</h3>
                                    <p className="text-lg font-medium text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                    <DollarSign className="h-5 w-5 text-red-500 dark:text-red-400" />
                                </span>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Outstanding</h3>
                                    <p className="text-lg font-medium text-red-600 dark:text-red-400">{formatCurrency(totalOutstanding)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rest of the existing invoice table */}
                        {invoices.length > 0 ? (
                            <div className="overflow-x-auto">
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
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <Link href={route('invoice.edit', invoice.id)}>
                                                                <DropdownMenuItem className="group cursor-pointer">
                                                                    <Edit className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Edit</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <InvoiceDeleteAction invoiceId={invoice.id} invoiceNumber={invoice.invoice_number} />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <FileText className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mb-1 text-lg font-medium text-gray-800 dark:text-gray-200">No Invoices</h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">You haven't created any invoices for this client yet.</p>
                                <Button
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => window.location.href = route('invoice.create', { client_id: client.id })}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Create Invoice</span>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
