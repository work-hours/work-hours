import { type SharedData } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import { ArrowLeft, Calendar, FileText, LoaderCircle, Plus, Save, Trash2, User, Hash, Receipt } from 'lucide-react'
import { FormEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { clients as _clients } from '@actions/ClientController'
import { invoices as _invoices } from '@actions/InvoiceController'
import CustomInput from '@/components/ui/custom-input'
import { Separator } from '@/components/ui/separator'

type InvoiceForm = {
    client_id: string
    invoice_number: string
    issue_date: Date | null
    due_date: Date | null
    status: string
    paid_amount: string
    notes: string
    discount_type: string | null
    discount_value: string
    tax_type: string | null
    tax_rate: string
    currency: string | null
    items: InvoiceItemForm[]
}

type InvoiceItemForm = {
    id?: number
    time_log_id: string | null
    description: string
    quantity: string
    unit_price: string
    amount: string
}

type Client = {
    id: number
    name: string
}

type TimeLog = {
    id: number
    project: {
        name: string
    }
    start_timestamp: string
    end_timestamp: string
    duration: number
    hourly_rate: number
}

type ProjectTimeLogGroup = {
    project_id: number
    project_name: string
    total_hours: number
    hourly_rate: number
    currency: string
    time_logs: TimeLog[]
}

type Invoice = {
    id: number
    client_id: number
    invoice_number: string
    issue_date: string
    due_date: string
    total_amount: number
    paid_amount: number
    status: string
    notes: string | null
    discount_type: string | null
    discount_value: number
    discount_amount: number
    currency: string | null
    items: {
        id: number
        time_log_id: number | null
        description: string
        quantity: number
        unit_price: number
        amount: number
    }[]
}

type Props = {
    invoice: Invoice
}

export default function EditInvoice({ invoice }: Props) {
    const { auth } = usePage<SharedData>().props
    const [clients, setClients] = useState<Client[]>([])
    const [timeLogs, setTimeLogs] = useState<ProjectTimeLogGroup[]>([])
    const [loadingClients, setLoadingClients] = useState(true)

    // Create breadcrumbs with invoice number
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Invoices',
            href: '/invoice',
        },
        {
            title: `Edit ${invoice.invoice_number}`,
            href: `/invoice/${invoice.id}/edit`,
        },
    ]

    // Format dates from string to Date objects
    const formatStringToDate = (dateString: string): Date => {
        return new Date(dateString)
    }

    // Format invoice items for the form
    const formatInvoiceItems = (items: Invoice['items']): InvoiceItemForm[] => {
        return items.map((item) => ({
            id: item.id,
            time_log_id: item.time_log_id ? item.time_log_id.toString() : null,
            description: item.description,
            quantity: item.quantity.toString(),
            unit_price: item.unit_price.toString(),
            amount: item.amount.toString(),
        }))
    }

    const { data, setData, put, processing, errors } = useForm<InvoiceForm>({
        client_id: invoice.client_id.toString(),
        invoice_number: invoice.invoice_number,
        issue_date: formatStringToDate(invoice.issue_date),
        due_date: formatStringToDate(invoice.due_date),
        status: invoice.status,
        paid_amount: invoice.paid_amount.toString(),
        notes: invoice.notes || '',
        discount_type: invoice.discount_type,
        discount_value: invoice.discount_value ? invoice.discount_value.toString() : '0',
        tax_type: invoice.tax_type,
        tax_rate: invoice.tax_rate ? invoice.tax_rate.toString() : '0',
        currency: invoice.currency,
        items: formatInvoiceItems(invoice.items),
    })

    // Load clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                setLoadingClients(true)
                const clientsData = await _clients.data({})
                setClients(clientsData)
            } catch (error) {
                console.error('Error fetching clients:', error)
                toast.error('Failed to load clients')
            } finally {
                setLoadingClients(false)
            }
        }

        fetchClients()
    }, [])

    // Load time logs when client is selected
    useEffect(() => {
        const fetchTimeLogs = async () => {
            if (!data.client_id) return

            try {
                const timeLogsData = await _invoices.data({
                    action: 'getUnpaidTimeLogs',
                    params: { client_id: data.client_id },
                })
                setTimeLogs(timeLogsData)

                // Update currency based on client currency or user currency
                if (timeLogsData.length > 0) {
                    const clientCurrency = timeLogsData[0]?.currency
                    if (clientCurrency) {
                        setData('currency', clientCurrency)
                    } else if (auth.user.currency) {
                        setData('currency', auth.user.currency ? auth.user.currency.toString() : 'USD')
                    } else {
                        setData('currency', 'USD')
                    }
                }
            } catch (error) {
                console.error('Error fetching time logs:', error)
                toast.error('Failed to load time logs')
            }
        }

        fetchTimeLogs()
    }, [data.client_id])

    // Calculate subtotal (sum of all item amounts)
    const calculateSubtotal = (): number => {
        return data.items.reduce((total, item) => {
            return total + parseFloat(item.amount || '0')
        }, 0)
    }

    // Calculate discount amount based on type and value
    const calculateDiscount = (): number => {
        const subtotal = calculateSubtotal()

        if (!data.discount_type || parseFloat(data.discount_value) <= 0) {
            return 0
        }

        if (data.discount_type === 'percentage') {
            // Calculate percentage discount
            return (subtotal * parseFloat(data.discount_value)) / 100
        } else if (data.discount_type === 'fixed') {
            // Apply fixed discount
            const discountAmount = parseFloat(data.discount_value)

            // Ensure discount doesn't exceed subtotal
            return discountAmount > subtotal ? subtotal : discountAmount
        }

        return 0
    }

    // Calculate tax amount based on type and rate
    const calculateTax = (): number => {
        const subtotal = calculateSubtotal()

        if (!data.tax_type || parseFloat(data.tax_rate) <= 0) {
            return 0
        }

        if (data.tax_type === 'percentage') {
            // Calculate percentage tax
            return (subtotal * parseFloat(data.tax_rate)) / 100
        } else if (data.tax_type === 'fixed') {
            // Apply fixed tax amount
            const taxAmount = parseFloat(data.tax_rate)

            // Ensure tax doesn't exceed subtotal
            return taxAmount > subtotal ? subtotal : taxAmount
        }

        return 0
    }

    // Calculate total amount after discount and tax
    const calculateTotal = (): number => {
        const subtotal = calculateSubtotal()
        const discount = calculateDiscount()
        const tax = calculateTax()

        return subtotal - discount + tax
    }

    // Add new item
    const addItem = (): void => {
        setData('items', [
            ...data.items,
            {
                time_log_id: null,
                description: '',
                quantity: '1',
                unit_price: '0',
                amount: '0',
            },
        ])
    }

    // Remove item
    const removeItem = (index: number): void => {
        const updatedItems = [...data.items]
        updatedItems.splice(index, 1)
        setData('items', updatedItems)
    }

    // Update item
    const updateItem = (index: number, field: keyof InvoiceItemForm, value: string): void => {
        const updatedItems = [...data.items]
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        }

        // Calculate amount if quantity or unit_price changes
        if (field === 'quantity' || field === 'unit_price') {
            const quantity = parseFloat(field === 'quantity' ? value : updatedItems[index].quantity || '0')
            const unitPrice = parseFloat(field === 'unit_price' ? value : updatedItems[index].unit_price || '0')
            updatedItems[index].amount = (quantity * unitPrice).toFixed(2)
        }

        setData('items', updatedItems)
    }

    // Handle time log selection
    const handleTimeLogSelection = (index: number, value: string): void => {
        const updatedItems = [...data.items]

        if (value === 'none') {
            // Update all fields at once for 'none' selection
            updatedItems[index] = {
                ...updatedItems[index],
                time_log_id: null as unknown as string,
                description: '',
                quantity: '1',
                unit_price: '0',
                amount: '0',
            }

            setData('items', updatedItems)
            return
        }

        // Check if it's a project selection (format: "project-{projectId}")
        if (value.startsWith('project-')) {
            const projectId = parseInt(value.replace('project-', ''))
            const projectGroup = timeLogs.find((group) => group.project_id === projectId)

            if (projectGroup) {
                // Update all fields at once for project selection
                const amount = ((projectGroup.total_hours || 0) * (projectGroup.hourly_rate || 0)).toFixed(2)

                updatedItems[index] = {
                    ...updatedItems[index],
                    time_log_id: null as unknown as string,
                    description: `Time logged for ${projectGroup.project_name}`,
                    quantity: projectGroup.total_hours.toString(),
                    unit_price: projectGroup.hourly_rate.toString(),
                    amount: amount,
                }

                setData('items', updatedItems)
            }
            return
        }

        // It's an individual time log selection
        const timeLogId = value

        // Find the project group that contains this time log
        for (const projectGroup of timeLogs) {
            const timeLog = projectGroup.time_logs.find((log) => log.id.toString() === timeLogId)
            if (timeLog) {
                // Update all fields at once for individual time log selection
                const amount = ((timeLog.duration || 0) * (projectGroup.hourly_rate || 0)).toFixed(2)

                updatedItems[index] = {
                    ...updatedItems[index],
                    time_log_id: timeLogId,
                    description: `Time logged for ${projectGroup.project_name}`,
                    quantity: timeLog.duration.toString(),
                    unit_price: projectGroup.hourly_rate.toString(),
                    amount: amount,
                }

                setData('items', updatedItems)
                break
            }
        }
    }

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('invoice.update', invoice.id), {
            onSuccess: () => {
                toast.success('Invoice updated successfully')
            },
            onError: () => {
                toast.error('Failed to update invoice')
            },
        })
    }

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: data.currency || 'USD',
            currencyDisplay: 'code',
        }).format(amount)
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Invoice - ${invoice.invoice_number}`} />
            <div className="mx-auto flex flex-col gap-6 p-3">
                {/* Header section */}
                <section className="mb-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Invoice</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Update invoice {invoice.invoice_number}</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.history.back()}
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                    </div>
                </section>

                <form className="flex flex-col gap-6" onSubmit={submit}>
                    {/* Invoice Details Section */}
                    <h2 className="text-xl font-semibold flex items-center gap-2 mt-2 border-b pb-2">
                        <FileText className="h-5 w-5" />
                        Invoice Details
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Basic Info Card */}
                        <Card className="transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    Basic Information
                                </CardTitle>
                                <CardDescription>Update the core details for this invoice</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="client_id" className="text-sm font-medium flex items-center gap-1">
                                                Client <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Select
                                                    value={data.client_id}
                                                    onValueChange={(value) => setData('client_id', value)}
                                                    disabled={processing || loadingClients}
                                                >
                                                    <SelectTrigger id="client_id" className="w-full">
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-muted-foreground" />
                                                            <SelectValue placeholder={loadingClients ? 'Loading clients...' : 'Select a client'} />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {clients.map((client) => (
                                                            <SelectItem key={client.id} value={client.id.toString()}>
                                                                {client.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <InputError message={errors.client_id} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="invoice_number" className="text-sm font-medium flex items-center gap-1">
                                                Invoice Number <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                    <Hash className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                <Input
                                                    id="invoice_number"
                                                    type="text"
                                                    required
                                                    value={data.invoice_number}
                                                    onChange={(e) => setData('invoice_number', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="Invoice number"
                                                    className="pl-10"
                                                />
                                            </div>
                                            <InputError message={errors.invoice_number} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="issue_date" className="text-sm font-medium flex items-center gap-1">
                                                Issue Date <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <DatePicker
                                                    selected={data.issue_date}
                                                    onChange={(date) => setData('issue_date', date)}
                                                    dateFormat="yyyy-MM-dd"
                                                    disabled={processing}
                                                    customInput={
                                                        <CustomInput
                                                            id="issue_date"
                                                            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                                                            placeholder="Select issue date"
                                                            value={data.issue_date ? data.issue_date.toISOString().split('T')[0] : ''}
                                                            disabled={processing}
                                                        />
                                                    }
                                                />
                                            </div>
                                            <InputError message={errors.issue_date as string} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="due_date" className="text-sm font-medium flex items-center gap-1">
                                                Due Date <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <DatePicker
                                                    selected={data.due_date}
                                                    onChange={(date) => setData('due_date', date)}
                                                    dateFormat="yyyy-MM-dd"
                                                    disabled={processing}
                                                    customInput={
                                                        <CustomInput
                                                            id="due_date"
                                                            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                                                            placeholder="Select due date"
                                                            value={data.due_date ? data.due_date.toISOString().split('T')[0] : ''}
                                                            disabled={processing}
                                                        />
                                                    }
                                                />
                                            </div>
                                            <InputError message={errors.due_date as string} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="status" className="text-sm font-medium">
                                                Status <span className="text-destructive">*</span>
                                            </Label>
                                            <div className="relative">
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(value) => {
                                                        setData('status', value)
                                                        // If status is changed to 'paid', set paid_amount to full invoice amount
                                                        if (value === 'paid') {
                                                            setData('paid_amount', calculateTotal().toFixed(2))
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger id="status" className="w-full">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="sent">Sent</SelectItem>
                                                        <SelectItem value="paid">Paid</SelectItem>
                                                        <SelectItem value="partially_paid">Partially Paid</SelectItem>
                                                        <SelectItem value="overdue">Overdue</SelectItem>
                                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <InputError message={errors.status} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="paid_amount" className="text-sm font-medium flex items-center gap-1">
                                                Paid Amount
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="paid_amount"
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={data.paid_amount}
                                                    onChange={(e) => setData('paid_amount', e.target.value)}
                                                    disabled={processing || data.status !== 'partially_paid' && data.status !== 'paid'}
                                                    placeholder="Enter amount paid"
                                                />
                                            </div>
                                            <InputError message={errors.paid_amount} className="mt-1" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info Card */}
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    Additional Information
                                </CardTitle>
                                <CardDescription>Add notes for this invoice</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div>
                                    <Label htmlFor="notes" className="text-sm font-medium">
                                        Notes <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        disabled={processing}
                                        placeholder="Additional notes for the client"
                                        className="min-h-[120px] resize-y"
                                    />
                                    <InputError message={errors.notes} className="mt-1" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg">Invoice Items</CardTitle>
                                <CardDescription>Add or update the products or services you're invoicing for</CardDescription>
                            </div>
                            <Button
                                type="button"
                                onClick={addItem}
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Item
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/50">
                                        <TableHeaderRow>
                                            <TableHead>Time Log</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Quantity (hrs)</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="w-[50px]" children={undefined}></TableHead>
                                        </TableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items.map((item, index) => (
                                            <TableRow key={index} className="hover:bg-muted/30">
                                                <TableCell>
                                                    <Select
                                                        value={item.time_log_id || 'none'}
                                                        onValueChange={(value) => handleTimeLogSelection(index, value)}
                                                        disabled={processing}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select time log (optional)" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">None</SelectItem>

                                                            {/* Project Groups */}
                                                            {timeLogs.length > 0 && (
                                                                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                                    Project Totals
                                                                </div>
                                                            )}

                                                            {timeLogs.map((projectGroup, idx) => (
                                                                <SelectItem
                                                                    key={`project-${projectGroup.project_id || `unnamed-${idx}`}`}
                                                                    value={`project-${projectGroup.project_id}`}
                                                                    className="font-medium"
                                                                >
                                                                    {projectGroup.project_name} - {(projectGroup.total_hours || 0).toFixed(2)} hours (
                                                                    {projectGroup.currency || 'USD'} {projectGroup.hourly_rate || 0}/hr)
                                                                </SelectItem>
                                                            ))}

                                                            {/* Individual Time Logs */}
                                                            {timeLogs.length > 0 && (
                                                                <div className="mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                                                    Individual Time Logs
                                                                </div>
                                                            )}

                                                            {timeLogs.map((projectGroup, idx) => (
                                                                <div key={`logs-${projectGroup.project_id || `unnamed-${idx}`}`}>
                                                                    {projectGroup.time_logs && projectGroup.time_logs.length > 0 && (
                                                                        <div className="px-2 py-1 text-xs font-medium">
                                                                            {projectGroup.project_name}
                                                                        </div>
                                                                    )}

                                                                    {projectGroup.time_logs &&
                                                                        projectGroup.time_logs.map((timeLog) => (
                                                                            <SelectItem key={timeLog.id} value={timeLog.id.toString()} className="pl-4">
                                                                                {new Date(timeLog.start_timestamp).toISOString().split('T')[0]} -{' '}
                                                                                {(timeLog.duration || 0).toFixed(2)} hours
                                                                            </SelectItem>
                                                                        ))}
                                                                </div>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <InputError message={(errors as never)[`items.${index}.time_log_id`]} className="mt-1" />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                        disabled={processing}
                                                        placeholder="Item description"
                                                        required
                                                    />
                                                    <InputError message={(errors as never)[`items.${index}.description`]} className="mt-1" />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="0.01"
                                                        step="0.01"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                        disabled={processing}
                                                        required
                                                    />
                                                    <InputError message={(errors as never)[`items.${index}.quantity`]} className="mt-1" />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                        disabled={processing}
                                                        required
                                                    />
                                                    <InputError message={(errors as never)[`items.${index}.unit_price`]} className="mt-1" />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.amount}
                                                        onChange={(e) => updateItem(index, 'amount', e.target.value)}
                                                        disabled={true}
                                                        required
                                                        className="bg-muted/40"
                                                    />
                                                    <InputError message={(errors as never)[`items.${index}.amount`]} className="mt-1" />
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={processing || data.items.length <= 1}
                                                        onClick={() => removeItem(index)}
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100/50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tax, Discount and Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    Discount & Taxes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Discount */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="discount_type" className="text-sm font-medium">
                                                Discount Type
                                            </Label>
                                            <Select
                                                value={data.discount_type || 'none'}
                                                onValueChange={(value) => setData('discount_type', value === 'none' ? null : value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger id="discount_type" className="w-full">
                                                    <SelectValue placeholder="No Discount" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No Discount</SelectItem>
                                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.discount_type} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="discount_value" className="text-sm font-medium">
                                                {data.discount_type === 'percentage' ? 'Discount (%)' : 'Discount Amount'}
                                            </Label>
                                            <Input
                                                id="discount_value"
                                                type="number"
                                                min="0"
                                                step={data.discount_type === 'percentage' ? '1' : '0.01'}
                                                value={data.discount_value}
                                                onChange={(e) => setData('discount_value', e.target.value)}
                                                disabled={processing || !data.discount_type}
                                                placeholder={data.discount_type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                            />
                                            <InputError message={errors.discount_value} className="mt-1" />
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Tax */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="tax_type" className="text-sm font-medium">
                                                Tax Type
                                            </Label>
                                            <Select
                                                value={data.tax_type || 'none'}
                                                onValueChange={(value) => setData('tax_type', value === 'none' ? null : value)}
                                                disabled={processing}
                                            >
                                                <SelectTrigger id="tax_type" className="w-full">
                                                    <SelectValue placeholder="No Tax" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">No Tax</SelectItem>
                                                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.tax_type} className="mt-1" />
                                        </div>
                                        <div>
                                            <Label htmlFor="tax_rate" className="text-sm font-medium">
                                                {data.tax_type === 'percentage' ? 'Tax (%)' : 'Tax Amount'}
                                            </Label>
                                            <Input
                                                id="tax_rate"
                                                type="number"
                                                min="0"
                                                step={data.tax_type === 'percentage' ? '1' : '0.01'}
                                                value={data.tax_rate}
                                                onChange={(e) => setData('tax_rate', e.target.value)}
                                                disabled={processing || !data.tax_type}
                                                placeholder={data.tax_type === 'percentage' ? 'Enter percentage' : 'Enter amount'}
                                            />
                                            <InputError message={errors.tax_rate} className="mt-1" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">Invoice Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border p-4 bg-muted/20">
                                    <div className="flex items-center justify-between text-sm">
                                        <span>Subtotal:</span>
                                        <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                                    </div>
                                    {data.discount_type && parseFloat(data.discount_value) > 0 && (
                                        <div className="mt-2 flex items-center justify-between text-sm text-red-600 dark:text-red-400">
                                            <span>Discount {data.discount_type === 'percentage' ? `(${data.discount_value}%)` : ''}:</span>
                                            <span>-{formatCurrency(calculateDiscount())}</span>
                                        </div>
                                    )}
                                    {data.tax_type && parseFloat(data.tax_rate) > 0 && (
                                        <div className="mt-2 flex items-center justify-between text-sm text-green-600 dark:text-green-400">
                                            <span>Tax {data.tax_type === 'percentage' ? `(${data.tax_rate}%)` : ''}:</span>
                                            <span>+{formatCurrency(calculateTax())}</span>
                                        </div>
                                    )}
                                    <Separator className="my-3" />
                                    <div className="flex items-center justify-between font-medium">
                                        <span className="text-base">Total:</span>
                                        <span className="text-base">{formatCurrency(calculateTotal())}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end border-t p-4">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2"
                                >
                                    {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {processing ? 'Updating...' : 'Update Invoice'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </form>
            </div>
        </MasterLayout>
    )
}
