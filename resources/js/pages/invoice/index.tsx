import { ExportButton } from '@/components/action-buttons'
import AddNewButton from '@/components/add-new-button'
import InvoiceDeleteAction from '@/components/invoice-delete-action'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { objectToQueryString, queryStringToObject } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { invoices as _invoices } from '@actions/InvoiceController'
import { Head, router, usePage } from '@inertiajs/react'
import { Calendar, Download, FileText, Filter, Loader2, Mail, MoreVertical, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/invoice',
    },
]

type Client = {
    id: number
    name: string
}

type Invoice = {
    id: number
    invoice_number: string
    client: {
        id: number
        name: string
    }
    issue_date: string
    due_date: string
    total_amount: number
    paid_amount: number
    status: string
    discount_type: string | null
    discount_value: number
    discount_amount: number
    currency: string
    created_at: string
}

type InvoiceFilters = {
    search: string
    client: string
    status: string
    'created-date-from': string | Date | null
    'created-date-to': string | Date | null
}

type Props = {
    invoices: Invoice[]
    filters: InvoiceFilters
    clients: Client[]
}

import InvoiceFiltersOffCanvas from '@/pages/invoice/components/InvoiceFiltersOffCanvas'

export default function Invoices() {
    const { filters: pageFilters, clients } = usePage<Props>().props
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [processing, setProcessing] = useState(false)
    const [emailDialogOpen, setEmailDialogOpen] = useState(false)
    const [statusDialogOpen, setStatusDialogOpen] = useState(false)
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
    const [sendingEmail, setSendingEmail] = useState(false)
    const [updatingStatus, setUpdatingStatus] = useState(false)
    const [newStatus, setNewStatus] = useState<string>('')
    const [newPaidAmount, setNewPaidAmount] = useState<string>('')

    const [filtersOpen, setFiltersOpen] = useState(false)

    const [filters, setFilters] = useState<InvoiceFilters>({
        search: pageFilters?.search || '',
        client: pageFilters?.client || 'all',
        status: pageFilters?.status || 'all',
        'created-date-from': pageFilters?.['created-date-from'] || null,
        'created-date-to': pageFilters?.['created-date-to'] || null,
    })

    const getInvoices = async (filters?: InvoiceFilters): Promise<void> => {
        setLoading(true)
        setError(false)
        setProcessing(true)
        try {
            const apiFilters = filters ? { ...filters } : undefined

            if (apiFilters) {
                if (apiFilters.client === 'all') {
                    apiFilters.client = ''
                }

                if (apiFilters.status === 'all') {
                    apiFilters.status = ''
                }
            }

            setInvoices(
                await _invoices.data({
                    params: apiFilters,
                }),
            )
        } catch (error) {
            console.error('Error fetching invoices:', error)
            setError(true)
        } finally {
            setLoading(false)
            setProcessing(false)
        }
    }

    const formatDateValue = (dateValue: Date | string | null): string => {
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0]
        } else if (typeof dateValue === 'string' && dateValue) {
            return dateValue
        }
        return ''
    }

    useEffect(() => {
        const queryParams = queryStringToObject()

        const initialFilters: InvoiceFilters = {
            search: queryParams.search || '',
            client: queryParams.client || 'all',
            status: queryParams.status || 'all',
            'created-date-from': queryParams['created-date-from'] || null,
            'created-date-to': queryParams['created-date-to'] || null,
        }

        setFilters(initialFilters)
        getInvoices(initialFilters).then()
    }, [])

    const formatCurrency = (amount: number, currency: string = 'USD'): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            currencyDisplay: 'code',
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

    const handleEmailClick = (invoice: Invoice): void => {
        setSelectedInvoice(invoice)
        setEmailDialogOpen(true)
    }

    const handleStatusClick = (invoice: Invoice): void => {
        setSelectedInvoice(invoice)
        setNewStatus(invoice.status)
        setNewPaidAmount(invoice.paid_amount.toString())
        setStatusDialogOpen(true)
    }

    const handleSendEmail = async () => {
        if (!selectedInvoice) return

        setSendingEmail(true)
        try {
            await router.post(route('invoice.sendEmail', selectedInvoice.id))

            setInvoices(
                invoices.map((invoice) => {
                    if (invoice.id === selectedInvoice.id) {
                        return { ...invoice, status: 'sent' }
                    }
                    return invoice
                }),
            )

            setEmailDialogOpen(false)
            setSelectedInvoice(null)
        } catch (error) {
            console.error('Error sending invoice email:', error)
        } finally {
            setSendingEmail(false)
        }
    }

    const handleStatusUpdate = async () => {
        if (!selectedInvoice) return

        setUpdatingStatus(true)
        try {
            await router.post(route('invoice.updateStatus', selectedInvoice.id), {
                status: newStatus,
                paid_amount: newPaidAmount,
            })

            setInvoices(
                invoices.map((invoice) => {
                    if (invoice.id === selectedInvoice.id) {
                        return {
                            ...invoice,
                            status: newStatus,
                            paid_amount: parseFloat(newPaidAmount),
                        }
                    }
                    return invoice
                }),
            )

            toast.success(`Invoice status updated to ${formatStatusLabel(newStatus)}`)

            setStatusDialogOpen(false)
            setSelectedInvoice(null)
        } catch (error) {
            console.error('Error updating invoice status:', error)
            toast.error('Failed to update invoice status')
        } finally {
            setUpdatingStatus(false)
        }
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />
            <div className="mx-auto flex flex-col gap-6 p-3">
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Invoice Management</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your invoices</p>
                </section>

                <Card className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Invoices</CardTitle>
                                <CardDescription>
                                    {loading ? 'Loading invoices...' : error ? 'Failed to load invoices' : `You have ${invoices.length} invoices`}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={
                                        filters.search ||
                                        filters.client !== 'all' ||
                                        filters.status !== 'all' ||
                                        filters['created-date-from'] ||
                                        filters['created-date-to']
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className={`flex items-center gap-2 ${
                                        filters.search ||
                                        filters.client !== 'all' ||
                                        filters.status !== 'all' ||
                                        filters['created-date-from'] ||
                                        filters['created-date-to']
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter
                                        className={`h-4 w-4 ${
                                            filters.search ||
                                            filters.client !== 'all' ||
                                            filters.status !== 'all' ||
                                            filters['created-date-from'] ||
                                            filters['created-date-to']
                                                ? 'text-primary dark:text-primary-foreground'
                                                : ''
                                        }`}
                                    />
                                    <span>
                                        {filters.search ||
                                        filters.client !== 'all' ||
                                        filters.status !== 'all' ||
                                        filters['created-date-from'] ||
                                        filters['created-date-to']
                                            ? 'Filters Applied'
                                            : 'Filters'}
                                    </span>
                                </Button>
                                <ExportButton
                                    href={`${route('invoice.export')}?${objectToQueryString({
                                        search: filters.search || '',
                                        client: filters.client || '',
                                        status: filters.status || '',
                                        'created-date-from': formatDateValue(filters['created-date-from']),
                                        'created-date-to': formatDateValue(filters['created-date-to']),
                                    })}`}
                                    label="Export"
                                />
                                <AddNewButton href={route('invoice.create')}>
                                    <Plus className="h-4 w-4" />
                                    <span>Create Invoice</span>
                                </AddNewButton>
                            </div>
                        </div>

                        <div className={'mt-2 text-sm text-muted-foreground'}>
                            {(filters.search ||
                                filters.client !== 'all' ||
                                filters.status !== 'all' ||
                                filters['created-date-from'] ||
                                filters['created-date-to']) && (
                                <CardDescription>
                                    {(() => {
                                        let description = ''

                                        if (filters['created-date-from'] && filters['created-date-to']) {
                                            description = `Showing invoices from ${formatDateValue(filters['created-date-from'])} to ${formatDateValue(
                                                filters['created-date-to'],
                                            )}`
                                        } else if (filters['created-date-from']) {
                                            description = `Showing invoices from ${formatDateValue(filters['created-date-from'])}`
                                        } else if (filters['created-date-to']) {
                                            description = `Showing invoices until ${formatDateValue(filters['created-date-to'])}`
                                        }

                                        if (filters.status) {
                                            if (description) {
                                                description += ` with status "${formatStatusLabel(filters.status)}"`
                                            } else {
                                                description = `Showing invoices with status "${formatStatusLabel(filters.status)}"`
                                            }
                                        }

                                        if (filters.client) {
                                            if (description) {
                                                description += ` for selected client`
                                            } else {
                                                description = `Showing invoices for selected client`
                                            }
                                        }

                                        if (filters.search) {
                                            if (description) {
                                                description += ` matching "${filters.search}"`
                                            } else {
                                                description = `Showing invoices matching "${filters.search}"`
                                            }
                                        }

                                        return description
                                    })()}
                                </CardDescription>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Loader2 className="mb-4 h-12 w-12 animate-spin text-muted-foreground/50" />
                                <h3 className="mb-1 text-lg font-medium">Loading Invoices</h3>
                                <p className="mb-4 text-muted-foreground">Please wait while we fetch your invoices...</p>
                            </div>
                        ) : error ? (
                            <div className="rounded-md border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <FileText className="mb-4 h-12 w-12 text-red-500" />
                                    <h3 className="mb-1 text-lg font-medium text-red-700 dark:text-red-400">Failed to Load Invoices</h3>
                                    <p className="mb-4 text-red-600 dark:text-red-300">There was an error loading your invoices. Please try again.</p>
                                    <Button onClick={() => getInvoices()} className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4" />
                                        <span>Retry</span>
                                    </Button>
                                </div>
                            </div>
                        ) : invoices.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Invoice #
                                        </TableHead>
                                        <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                            Client
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
                                            <TableCell className="font-medium text-gray-800 dark:text-gray-200">{invoice.invoice_number}</TableCell>
                                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">{invoice.client.name}</TableCell>
                                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                {new Date(invoice.issue_date).toISOString().split('T')[0]}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                {new Date(invoice.due_date).toISOString().split('T')[0]}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                {formatCurrency(invoice.total_amount, invoice.currency)}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                                                        invoice.status,
                                                    )} cursor-pointer hover:opacity-80`}
                                                    onClick={() => handleStatusClick(invoice)}
                                                    title="Click to update status"
                                                >
                                                    {formatStatusLabel(invoice.status)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end">
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
                                                            <a
                                                                href={route('invoice.downloadPdf', invoice.id)}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <DropdownMenuItem className="group cursor-pointer">
                                                                    <Download className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Download PDF</span>
                                                                </DropdownMenuItem>
                                                            </a>
                                                            <DropdownMenuItem
                                                                className="group cursor-pointer"
                                                                onClick={() => handleEmailClick(invoice)}
                                                                disabled={invoice.status === 'sent' || invoice.status === 'paid'}
                                                            >
                                                                <Mail
                                                                    className={`mr-2 h-4 w-4 ${invoice.status === 'sent' || invoice.status === 'paid' ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'}`}
                                                                />
                                                                <span
                                                                    className={
                                                                        invoice.status === 'sent' || invoice.status === 'paid'
                                                                            ? 'text-gray-300 dark:text-gray-600'
                                                                            : ''
                                                                    }
                                                                >
                                                                    Send Email
                                                                </span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="group cursor-pointer"
                                                                onClick={() => handleStatusClick(invoice)}
                                                            >
                                                                <Calendar className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                <span>Update Status</span>
                                                            </DropdownMenuItem>
                                                            <InvoiceDeleteAction invoiceId={invoice.id} invoiceNumber={invoice.invoice_number} />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
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
                                    <p className="mb-4 text-muted-foreground">You haven't created any invoices yet.</p>
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

            <AlertDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Send Invoice Email</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedInvoice && (
                                <>
                                    This will send invoice #{selectedInvoice.invoice_number} to {selectedInvoice.client.name}.
                                    {selectedInvoice.status !== 'sent' && <div className="mt-2">The invoice status will be updated to "Sent".</div>}
                                </>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={sendingEmail}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSendEmail}
                            disabled={sendingEmail}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {sendingEmail ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Email'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Update Invoice Status</AlertDialogTitle>
                        <AlertDialogDescription>
                            {selectedInvoice && <>Update status for invoice #{selectedInvoice.invoice_number}</>}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="status" className="text-sm font-medium">
                                Status
                            </Label>
                            <div className="relative rounded-md border p-3">
                                <RadioGroup
                                    value={newStatus}
                                    onValueChange={(value) => {
                                        setNewStatus(value)

                                        if (value === 'paid' && selectedInvoice) {
                                            setNewPaidAmount(selectedInvoice.total_amount.toString())
                                        } else if (value === 'partially_paid') {
                                            setNewPaidAmount('0')
                                        }
                                    }}
                                    className="flex flex-col space-y-2"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="draft" id="status-draft" />
                                        <Label htmlFor="status-draft" className="cursor-pointer">
                                            Draft
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="sent" id="status-sent" />
                                        <Label htmlFor="status-sent" className="cursor-pointer">
                                            Sent
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="paid" id="status-paid" />
                                        <Label htmlFor="status-paid" className="cursor-pointer">
                                            Paid
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="partially_paid" id="status-partially-paid" />
                                        <Label htmlFor="status-partially-paid" className="cursor-pointer">
                                            Partially Paid
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="overdue" id="status-overdue" />
                                        <Label htmlFor="status-overdue" className="cursor-pointer">
                                            Overdue
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="cancelled" id="status-cancelled" />
                                        <Label htmlFor="status-cancelled" className="cursor-pointer">
                                            Cancelled
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {(newStatus === 'paid' || newStatus === 'partially_paid') && (
                            <div className="grid gap-2">
                                <Label htmlFor="paid_amount" className="text-sm font-medium">
                                    Paid Amount
                                </Label>
                                <Input
                                    id="paid_amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newPaidAmount}
                                    onChange={(e) => setNewPaidAmount(e.target.value)}
                                    placeholder="0.00"
                                />
                                {selectedInvoice && (
                                    <p className="text-xs text-muted-foreground">
                                        Total invoice amount: {formatCurrency(selectedInvoice.total_amount, selectedInvoice.currency)}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={updatingStatus}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleStatusUpdate}
                            disabled={updatingStatus}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {updatingStatus ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Status'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <InvoiceFiltersOffCanvas
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                filters={{
                    search: filters.search || '',
                    client: filters.client === 'all' ? '' : filters.client || '',
                    status: filters.status === 'all' ? '' : filters.status || '',
                    'created-date-from': filters['created-date-from'] ? String(filters['created-date-from']) : null,
                    'created-date-to': filters['created-date-to'] ? String(filters['created-date-to']) : null,
                }}
                clients={clients}
                onApply={(applied) => {
                    const normalized = {
                        search: applied.search || '',
                        client: applied.client || 'all',
                        status: applied.status || 'all',
                        'created-date-from': applied['created-date-from'] || null,
                        'created-date-to': applied['created-date-to'] || null,
                    } as InvoiceFilters

                    setFilters(normalized)

                    try {
                        const params = new URLSearchParams(window.location.search)
                        const setOrDelete = (key: string, value: string | null) => {
                            const v = value ?? ''
                            if (v) {
                                params.set(key, v)
                            } else {
                                params.delete(key)
                            }
                        }
                        setOrDelete('search', applied.search || '')
                        setOrDelete('client', applied.client || '')
                        setOrDelete('status', applied.status || '')
                        setOrDelete('created-date-from', applied['created-date-from'])
                        setOrDelete('created-date-to', applied['created-date-to'])
                        const newUrl = `${window.location.pathname}?${params.toString()}`
                        window.history.replaceState({}, '', newUrl)
                    } catch {
                        // ignore URL update errors
                    }
                    getInvoices({
                        search: applied.search || '',
                        client: applied.client || '',
                        status: applied.status || '',
                        'created-date-from': applied['created-date-from'] || null,
                        'created-date-to': applied['created-date-to'] || null,
                    }).then(() => {})
                }}
            />
        </MasterLayout>
    )
}
