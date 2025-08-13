import { Head, Link, useForm } from '@inertiajs/react'
import { ArrowLeft, LoaderCircle, Lock, Mail, Save, User } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'

type TeamMemberForm = {
    name: string
    email: string
    password?: string // Password is optional for editing
    hourly_rate: number | string
    currency: string
    non_monetary: boolean
}

type Currency = {
    id: number
    user_id: number
    code: string
    created_at: string
    updated_at: string
}

type Props = {
    user: {
        id: number
        name: string
        email: string
        hourly_rate: number
        currency: string
        non_monetary: boolean
    }
    currencies: Currency[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
    {
        title: 'Edit',
        href: '/team/edit',
    },
]

export default function EditTeamMember({ user, currencies }: Props) {
    const { data, setData, put, processing, errors } = useForm<TeamMemberForm>({
        name: user.name,
        email: user.email,
        password: '', // Empty by default since it's optional
        hourly_rate: user.hourly_rate,
        currency: user.currency, // Use the user's current currency
        non_monetary: user.non_monetary,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        put(route('team.update', user.id), {
            onSuccess: () => {
                toast.success('Team member updated successfully')
            },
            onError: () => {
                toast.error('Failed to update team member')
            },
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Team Member" />
            <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Edit Team Member</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Update information for {user.name}</p>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                        <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Member Information</CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Update the team member's details</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                                <User className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                disabled={processing}
                                                placeholder="Full name"
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
                                                required
                                                tabIndex={2}
                                                autoComplete="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                disabled={processing}
                                                placeholder="email@example.com"
                                                className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        Password <span className="text-xs text-gray-500 dark:text-gray-400">(leave empty to keep current password)</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="••••••••"
                                            className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="non_monetary"
                                        checked={data.non_monetary}
                                        onChange={(e) => setData('non_monetary', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:focus:ring-gray-400"
                                    />
                                    <Label htmlFor="non_monetary" className="text-sm text-gray-700 dark:text-gray-300">
                                        Non-monetary (no hourly rate)
                                    </Label>
                                </div>

                                {!data.non_monetary && (
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
                                                    tabIndex={4}
                                                    value={data.hourly_rate}
                                                    onChange={(e) => setData('hourly_rate', e.target.value)}
                                                    disabled={processing}
                                                    placeholder="0.00"
                                                    className="border-gray-200 bg-white pl-10 text-gray-800 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder:text-gray-500"
                                                />
                                            </div>
                                            <InputError message={errors.hourly_rate} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="currency" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                Currency{' '}
                                                <Link href={route('currency.edit')} className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                                                    (create new currency)
                                                </Link>
                                            </Label>
                                            <Select
                                                value={data.currency}
                                                onValueChange={(value) => setData('currency', value)}
                                                disabled={processing || currencies.length === 0}
                                            >
                                                <SelectTrigger id="currency" className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                                    <SelectValue placeholder="Select a currency" />
                                                </SelectTrigger>
                                                <SelectContent className="border-gray-200 bg-white text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                                    {currencies.map((currency) => (
                                                        <SelectItem key={currency.id} value={currency.code}>
                                                            {currency.code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {currencies.length === 0 && (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    No currencies available. Please add currencies in the settings.
                                                </p>
                                            )}
                                            <InputError message={errors.currency} />
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        tabIndex={7}
                                        disabled={processing}
                                        className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        tabIndex={6}
                                        disabled={processing}
                                        className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    >
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                        {processing ? 'Updating...' : 'Update Member'}
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
