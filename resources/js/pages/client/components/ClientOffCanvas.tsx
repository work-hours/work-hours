import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@inertiajs/react'
import { Building, DollarSign, LoaderCircle, Mail, MapPin, Phone, Save, User, UserPlus } from 'lucide-react'
import { useEffect } from 'react'
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
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        {isEdit ? (
                            <>
                                <Building className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Edit Client
                            </>
                        ) : (
                            <>
                                <Building className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Add Client
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update the client details' : 'Create a new client'}
                    </SheetDescription>
                </SheetHeader>

                <div>
                    <form className="flex flex-col gap-8" onSubmit={submit}>
                        <div className="space-y-8">
                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Basic Information</h3>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.contact_person} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.phone} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5 pt-2">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Additional Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                                            <span>Address</span>
                                        </div>
                                    </Label>
                                    <Textarea
                                        id="address"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        disabled={processing}
                                        placeholder="Street, City, Country"
                                        className="min-h-20 border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                    />
                                    <InputError message={errors.address} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="notes" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        disabled={processing}
                                        placeholder="Additional information"
                                        className="min-h-20 border-neutral-200 bg-white ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                    />
                                    <InputError message={errors.notes} />
                                </div>
                            </div>

                            <div className="space-y-5 pt-2">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Billing Information</h3>

                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="hourly_rate" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Hourly Rate
                                        </Label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                <DollarSign className="h-4 w-4 text-gray-400 dark:text-gray-500" />
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.hourly_rate} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="currency" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Currency
                                        </Label>
                                        <Select
                                            value={data.currency}
                                            onValueChange={(value) => setData('currency', value)}
                                            disabled={processing || currencies.length === 0}
                                        >
                                            <SelectTrigger
                                                id="currency"
                                                className="border-neutral-200 bg-white ring-offset-white focus:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus:ring-neutral-600"
                                            >
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
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                                >
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
