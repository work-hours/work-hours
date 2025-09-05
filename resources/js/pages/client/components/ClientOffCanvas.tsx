import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useForm } from '@inertiajs/react'
import { Building, LoaderCircle, Mail, Phone, Save, User, UserPlus } from 'lucide-react'
import { useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export type Currency = {
    id: number
    user_id: number
    code: string
    created_at: string
    updated_at: string
}

export type ClientOffCanvasProps = {
    open: boolean
    mode: 'create' | 'edit'
    onClose: () => void
    currencies: Currency[]
    client?: {
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
}

type ClientForm = {
    name: string
    email: string
    contact_person: string
    phone: string
    address: string
    notes: string
    hourly_rate: string
    currency: string
}

export default function ClientOffCanvas({ open, mode, onClose, currencies, client }: ClientOffCanvasProps) {
    const isEdit = mode === 'edit'

    const { data, setData, post, put, processing, errors, reset } = useForm<ClientForm>({
        name: isEdit && client ? client.name : '',
        email: isEdit && client ? client.email || '' : '',
        contact_person: isEdit && client ? client.contact_person || '' : '',
        phone: isEdit && client ? client.phone || '' : '',
        address: isEdit && client ? client.address || '' : '',
        notes: isEdit && client ? client.notes || '' : '',
        hourly_rate: isEdit && client && client.hourly_rate !== null ? String(client.hourly_rate) : '',
        currency: isEdit && client && client.currency ? client.currency : (currencies[0]?.code ?? 'USD'),
    })

    useEffect(() => {
        if (!open) {
            reset()
            return
        }
        setData({
            name: isEdit && client ? client.name : '',
            email: isEdit && client ? client.email || '' : '',
            contact_person: isEdit && client ? client.contact_person || '' : '',
            phone: isEdit && client ? client.phone || '' : '',
            address: isEdit && client ? client.address || '' : '',
            notes: isEdit && client ? client.notes || '' : '',
            hourly_rate: isEdit && client && client.hourly_rate !== null ? String(client.hourly_rate) : '',
            currency: isEdit && client && client.currency ? client.currency : (currencies[0]?.code ?? 'USD'),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, client])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit && client) {
            put(route('client.update', client.id), {
                onSuccess: () => {
                    toast.success('Client updated successfully')
                    window.dispatchEvent(new Event('refresh-clients'))
                    onClose()
                },
                onError: () => toast.error('Failed to update client'),
                preserveScroll: true,
            })
        } else {
            post(route('client.store'), {
                onSuccess: () => {
                    toast.success('Client created successfully')
                    window.dispatchEvent(new Event('refresh-clients'))
                    onClose()
                    reset()
                },
                onError: () => toast.error('Failed to create client'),
                preserveScroll: true,
            })
        }
    }

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent side="right" className="overflow-y-auto bg-white pb-6 pl-4 pr-4 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-2 text-neutral-900 dark:text-white">
                        {isEdit ? 'Edit Client' : 'Add Client'}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update the client details' : 'Create a new client'}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    <form className="flex flex-col gap-6" onSubmit={submit}>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Client Name
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Building className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Acme Inc."
                                            className="border-neutral-200 bg-white pl-10 dark:border-neutral-800 dark:bg-neutral-800/50"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact_person" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Contact Person
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            id="contact_person"
                                            type="text"
                                            tabIndex={2}
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            disabled={processing}
                                            placeholder="John Doe"
                                            className="border-neutral-200 bg-white pl-10 dark:border-neutral-800 dark:bg-neutral-800/50"
                                        />
                                    </div>
                                    <InputError message={errors.contact_person} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            tabIndex={3}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="client@example.com"
                                            className="border-neutral-200 bg-white pl-10 dark:border-neutral-800 dark:bg-neutral-800/50"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Phone
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Phone className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            id="phone"
                                            type="text"
                                            tabIndex={4}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={processing}
                                            placeholder="+1 555 555 5555"
                                            className="border-neutral-200 bg-white pl-10 dark:border-neutral-800 dark:bg-neutral-800/50"
                                        />
                                    </div>
                                    <InputError message={errors.phone} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="address" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Address
                                </Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    disabled={processing}
                                    placeholder="Street, City, Country"
                                    className="min-h-20 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800/50"
                                />
                                <InputError message={errors.address} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    Notes
                                </Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    disabled={processing}
                                    placeholder="Additional information"
                                    className="min-h-20 border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800/50"
                                />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="hourly_rate" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Hourly Rate
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <span className="text-gray-400">$</span>
                                        </div>
                                        <Input
                                            id="hourly_rate"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            tabIndex={5}
                                            value={data.hourly_rate}
                                            onChange={(e) => setData('hourly_rate', e.target.value)}
                                            disabled={processing}
                                            placeholder="0.00"
                                            className="border-neutral-200 bg-white pl-10 dark:border-neutral-800 dark:bg-neutral-800/50"
                                        />
                                    </div>
                                    <InputError message={errors.hourly_rate} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Currency
                                    </Label>
                                    <Select value={data.currency} onValueChange={(value) => setData('currency', value)} disabled={processing || currencies.length === 0}>
                                        <SelectTrigger id="currency" className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800/50">
                                            <SelectValue placeholder="Select a currency" />
                                        </SelectTrigger>
                                        <SelectContent className="border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-800/50">
                                            {currencies.map((currency) => (
                                                <SelectItem key={currency.id} value={currency.code}>
                                                    {currency.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.currency} />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                                <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                                    Cancel
                                </Button>
                                <SubmitButton
                                    loading={processing}
                                    idleLabel={isEdit ? 'Update Client' : 'Create Client'}
                                    loadingLabel={isEdit ? 'Updating...' : 'Creating...'}
                                    idleIcon={isEdit ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                    loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
