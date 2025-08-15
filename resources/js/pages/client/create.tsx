import { Head, useForm } from '@inertiajs/react'
import { Building, LoaderCircle, Mail, Phone, Plus, User } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import BackButton from '@/components/back-button'
import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

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

type Currency = {
    id: number
    user_id: number
    code: string
    created_at: string
    updated_at: string
}

type Props = {
    currencies: Currency[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/client',
    },
    {
        title: 'Create',
        href: '/client/create',
    },
]

export default function CreateClient({ currencies }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<ClientForm>({
        name: '',
        email: '',
        contact_person: '',
        phone: '',
        address: '',
        notes: '',
        hourly_rate: '',
        currency: 'USD',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('client.store'), {
            onSuccess: () => {
                toast.success('Client created successfully')
                reset()
            },
            onError: () => {
                toast.error('Failed to create client')
            },
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Client" />
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Add Client</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Create a new client in your system</p>
                        </div>
                    </div>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Client Details</CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                            Fill out the information for the new client
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
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
                                                placeholder="Acme Corporation"
                                                className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                <Mail className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <Input
                                                id="email"
                                                type="email"
                                                tabIndex={2}
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                disabled={processing}
                                                placeholder="info@example.com"
                                                className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <InputError message={errors.email} className="mt-1" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
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
                                                tabIndex={3}
                                                value={data.contact_person}
                                                onChange={(e) => setData('contact_person', e.target.value)}
                                                disabled={processing}
                                                placeholder="John Doe"
                                                className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <InputError message={errors.contact_person} className="mt-1" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="phone" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Phone Number
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
                                                placeholder="+1 (123) 456-7890"
                                                className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <InputError message={errors.phone} className="mt-1" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="address" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Address
                                    </Label>
                                    <Textarea
                                        id="address"
                                        tabIndex={5}
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        disabled={processing}
                                        placeholder="123 Main St, Anytown, CA 12345"
                                        className="min-h-[80px] border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                    />
                                    <InputError message={errors.address} className="mt-1" />
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="hourly_rate" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Hourly Rate
                                        </Label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                <span className="text-gray-400 dark:text-gray-500">$</span>
                                            </div>
                                            <Input
                                                id="hourly_rate"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                tabIndex={6}
                                                value={data.hourly_rate}
                                                onChange={(e) => setData('hourly_rate', e.target.value)}
                                                disabled={processing}
                                                placeholder="0.00"
                                                className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <InputError message={errors.hourly_rate} className="mt-1" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="currency" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Currency
                                        </Label>
                                        <Select value={data.currency} onValueChange={(value) => setData('currency', value)} disabled={processing}>
                                            <SelectTrigger
                                                id="currency"
                                                tabIndex={7}
                                                className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                            >
                                                <SelectValue placeholder="Select currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((currency) => (
                                                    <SelectItem key={currency.id} value={currency.code}>
                                                        {currency.code}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.currency} className="mt-1" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="notes" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Notes
                                    </Label>
                                    <Textarea
                                        id="notes"
                                        tabIndex={8}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        disabled={processing}
                                        placeholder="Additional information about this client..."
                                        className="min-h-[120px] border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                    />
                                    <InputError message={errors.notes} className="mt-1" />
                                </div>
                            </div>

                            <div className="mt-2 flex items-center justify-end gap-4">
                                <BackButton tabIndex={7} disabled={processing} />
                                <SubmitButton
                                    tabIndex={10}
                                    loading={processing}
                                    idleLabel="Create Client"
                                    loadingLabel="Creating..."
                                    idleIcon={<Plus className="h-4 w-4" />}
                                    loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                    className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
