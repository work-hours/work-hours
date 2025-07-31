import { type SharedData } from '@/types'
import { Head, useForm, usePage } from '@inertiajs/react'
import { ArrowLeft, Calendar, FileText, LoaderCircle, Plus, Save, Trash2, User } from 'lucide-react'
import { FormEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DatePicker from '@/components/ui/date-picker'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { clients as _clients } from '@actions/ClientController'
import { getUnpaidTimeLogs } from '@actions/InvoiceController'

type InvoiceForm = {
    client_id: string
    invoice_number: string
    issue_date: Date | null
    due_date: Date | null
    status: string
    notes: string
    discount_type: string | null
    discount_value: string
    currency: string
    items: InvoiceItemForm[]
}

type InvoiceItemForm = {
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Invoices',
        href: '/invoice',
    },
    {
        title: 'Create',
        href: '/invoice/create',
    },
]

export default function CreateInvoice() {
    const { auth } = usePage<SharedData>().props
    const [clients, setClients] = useState<Client[]>([])
    const [timeLogs, setTimeLogs] = useState<ProjectTimeLogGroup[]>([])
    const [loadingClients, setLoadingClients] = useState(true)

    const generateInvoiceNumber = (): string => {
        return `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
    }

    const { data, setData, post, processing, errors, reset } = useForm<InvoiceForm>({
        client_id: '',
        invoice_number: generateInvoiceNumber(),
        issue_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 30)),
        status: 'draft',
        notes: '',
        discount_type: null,
        discount_value: '0',
        currency: auth.user.currency ? auth.user.currency.toString() : 'USD',
        items: [
            {
                time_log_id: null,
                description: '',
                quantity: '1',
                unit_price: '0',
                amount: '0',
            },
        ],
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

        fetchClients().then()
    }, [])

    // Load time logs when a client is selected
    useEffect(() => {
        const fetchTimeLogs = async () => {
            if (!data.client_id) return

            try {
                const timeLogsData = await getUnpaidTimeLogs.data({
                    params: {
                        client_id: data.client_id,
                    },
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

        fetchTimeLogs().then()
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

    // Calculate total amount after discount
    const calculateTotal = (): number => {
        const subtotal = calculateSubtotal()
        const discount = calculateDiscount()

        return subtotal - discount
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
    const updateItem = (index: number, field: keyof InvoiceItemForm, value: string | number): void => {
        const updatedItems = [...data.items]

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value.toString(), // Convert value to string to match InvoiceItemForm type
        }

        // Calculate the amount if quantity or unit_price changes
        if (field === 'quantity' || field === 'unit_price') {
            const quantity = parseFloat(field === 'quantity' ? value.toString() : updatedItems[index].quantity || '0')
            const unitPrice = parseFloat(field === 'unit_price' ? value.toString() : updatedItems[index].unit_price || '0')
            updatedItems[index].amount = (quantity * unitPrice).toFixed(2)
        }

        setData('items', updatedItems)
    }

    // Handle time log selection
    const handleTimeLogSelection = (index: number, value: string | object): void => {
        const updatedItems = [...data.items]

        // Check if value is an empty object and convert it to 'none'
        const stringValue = typeof value === 'object' && Object.keys(value).length === 0
            ? 'none'
            : value as string;

        if (stringValue === 'none') {
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
        if (stringValue.startsWith('project-')) {
            const projectId = parseInt(stringValue.replace('project-', ''))
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
                    time_log_id: timeLogId ? timeLogId.toString() : null,
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
        post(route('invoice.store'), {
            onSuccess: () => {
                toast.success('Invoice created successfully')
                reset()
            },
            onError: () => {
                toast.error('Failed to create invoice')
            },
        })
    }

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: data.currency,
            currencyDisplay: 'code',
        }).format(amount)
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />
            <div className="mx-auto flex flex-col gap-6 p-3">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create Invoice</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Create a new invoice for a client</p>
                </section>

                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Invoice Details</CardTitle>
                        <CardDescription>Enter the information for the new invoice</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="client_id" className="text-sm font-medium">
                                        Client
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
                                <div className="grid gap-2">
                                    <Label htmlFor="invoice_number" className="text-sm font-medium">
                                        Invoice Number
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
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
                                <div className="grid gap-2">
                                    <Label htmlFor="issue_date" className="text-sm font-medium">
                                        Issue Date
                                    </Label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={data.issue_date}
                                            onChange={(date) => setData('issue_date', date)}
                                            dateFormat="yyyy-MM-dd"
                                            disabled={processing}
                                            customInput={
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <Input
                                                        id="issue_date"
                                                        placeholder="Select issue date"
                                                        className="pl-10"
                                                        value={data.issue_date ? data.issue_date.toISOString().split('T')[0] : ''}
                                                        readOnly
                                                    />
                                                </div>
                                            }
                                        />
                                    </div>
                                    <InputError message={errors.issue_date as string} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="due_date" className="text-sm font-medium">
                                        Due Date
                                    </Label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={data.due_date}
                                            onChange={(date) => setData('due_date', date)}
                                            dateFormat="yyyy-MM-dd"
                                            disabled={processing}
                                            customInput={
                                                <div className="relative">
                                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                    </div>
                                                    <Input
                                                        id="due_date"
                                                        placeholder="Select due date"
                                                        className="pl-10"
                                                        value={data.due_date ? data.due_date.toISOString().split('T')[0] : ''}
                                                        readOnly
                                                    />
                                                </div>
                                            }
                                        />
                                    </div>
                                    <InputError message={errors.due_date as string} className="mt-1" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="status" className="text-sm font-medium">
                                        Status
                                    </Label>
                                    <div className="relative">
                                        <Select value={data.status} onValueChange={(value) => setData('status', value)} disabled={true}>
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
                            </div>
                            {/* Notes in a separate row */}
                            <div className="grid grid-cols-1 gap-6">
                                {/* Notes */}
                                <div className="grid gap-2">
                                    <Label htmlFor="notes" className="text-sm font-medium">
                                        Notes <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        disabled={processing}
                                        placeholder="Additional notes for the client"
                                        className="min-h-[80px]"
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>
                            {/* Invoice Items */}
                            <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium">Invoice Items</h3>
                                    <Button
                                        type="button"
                                        onClick={addItem}
                                        disabled={processing}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Item
                                    </Button>
                                </div>

                                <Table>
                                    <TableHeader>
                                        <TableHeaderRow>
                                            <TableHead>Time Log</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Quantity (hours)</TableHead>
                                            <TableHead>Unit Price</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="w-[50px]" children={undefined}></TableHead>
                                        </TableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items.map((item, index) => (
                                            <TableRow key={index}>
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

                                                            {timeLogs.map((projectGroup, index) => (
                                                                <SelectItem
                                                                    key={`project-${projectGroup.project_id || `unnamed-${index}`}`}
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

                                                            {timeLogs.map((projectGroup, index) => (
                                                                <div key={`logs-${projectGroup.project_id || `unnamed-${index}`}`}>
                                                                    {projectGroup.time_logs && projectGroup.time_logs.length > 0 && (
                                                                        <div className="px-2 py-1 text-xs font-medium">
                                                                            {projectGroup.project_name}
                                                                        </div>
                                                                    )}

                                                                    {projectGroup.time_logs &&
                                                                        projectGroup.time_logs.map((timeLog) => (
                                                                            <SelectItem
                                                                                key={timeLog.id}
                                                                                value={timeLog.id.toString()}
                                                                                className="pl-4"
                                                                            >
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
                                                        disabled={processing}
                                                        required
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
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Discount */}
                                <div className="flex justify-end">
                                    <div className="grid w-1/3 grid-cols-2 gap-4">
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
                                </div>

                                {/* Total */}
                                <div className="flex justify-end">
                                    <div className="w-1/3 rounded-md border p-4">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>Subtotal:</span>
                                            <span>{formatCurrency(calculateSubtotal())}</span>
                                        </div>
                                        {data.discount_type && parseFloat(data.discount_value) > 0 && (
                                            <div className="mt-2 flex items-center justify-between text-sm text-red-600 dark:text-red-400">
                                                <span>Discount {data.discount_type === 'percentage' ? `(${data.discount_value}%)` : ''}:</span>
                                                <span>-{formatCurrency(calculateDiscount())}</span>
                                            </div>
                                        )}
                                        <div className="mt-2 flex items-center justify-between font-medium">
                                            <span>Total:</span>
                                            <span>{formatCurrency(calculateTotal())}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
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
                                <Button type="submit" disabled={processing} className="flex items-center gap-2">
                                    {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {processing ? 'Creating...' : 'Create Invoice'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
