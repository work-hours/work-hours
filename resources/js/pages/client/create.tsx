import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, Building, LoaderCircle, Mail, Phone, Plus, Text, User } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

export default function CreateClient() {
    const { data, setData, post, processing, errors, reset } = useForm<ClientForm>({
        name: '',
        email: '',
        contact_person: '',
        phone: '',
        address: '',
        notes: '',
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
            <div className="mx-auto flex w-10/12 flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add Client</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Create a new client</p>
                </section>

                <Card className="max-w-2xl overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Client Details</CardTitle>
                        <CardDescription>Enter the information for the new client</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Client Name
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Building className="h-4 w-4 text-muted-foreground" />
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
                                            placeholder="Client name"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="contact_person" className="text-sm font-medium">
                                        Contact Person <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="contact_person"
                                            type="text"
                                            tabIndex={2}
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            disabled={processing}
                                            placeholder="Contact person name"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.contact_person} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            tabIndex={3}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Email address"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">
                                        Phone <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="phone"
                                            type="text"
                                            tabIndex={4}
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={processing}
                                            placeholder="Phone number"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.phone} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="address" className="text-sm font-medium">
                                        Address <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 top-0 left-3 flex items-center pt-2">
                                            <Text className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Textarea
                                            id="address"
                                            tabIndex={5}
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            disabled={processing}
                                            placeholder="Client address"
                                            className="min-h-[80px] pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.address} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes" className="text-sm font-medium">
                                        Notes <span className="text-xs text-muted-foreground">(optional)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 top-0 left-3 flex items-center pt-2">
                                            <Text className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Textarea
                                            id="notes"
                                            tabIndex={6}
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            disabled={processing}
                                            placeholder="Additional notes"
                                            className="min-h-[80px] pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.notes} />
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        tabIndex={8}
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" tabIndex={7} disabled={processing} className="flex items-center gap-2">
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                        {processing ? 'Creating...' : 'Create Client'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
