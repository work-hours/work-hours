import { Head, useForm } from '@inertiajs/react'
import { ArrowLeft, LoaderCircle, Lock, Mail, User, UserPlus } from 'lucide-react'
import React, { FormEventHandler } from 'react'
import { toast } from 'sonner'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'

type TeamMemberForm = {
    name: string
    email: string
    password: string
    hourly_rate: number | string
    currency: string
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Team',
        href: '/team',
    },
    {
        title: 'Create',
        href: '/team/create',
    },
]

export default function CreateTeamMember() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<TeamMemberForm>>({
        name: '',
        email: '',
        password: '',
        hourly_rate: 0,
        currency: 'USD', // Fixed to USD and non-changeable
    })

    // Ensure currency is always USD
    React.useEffect(() => {
        if (data.currency !== 'USD') {
            setData('currency', 'USD')
        }
    }, [data.currency])

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        post(route('team.store'), {
            onSuccess: () => {
                toast.success('Team member created successfully')
                reset()
            },
            onError: () => {
                toast.error('Failed to create team member')
            },
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Team Member" />
            <div className="mx-auto flex w-9/12 flex-col gap-6 p-6">
                {/* Header section */}
                <section className="mb-2">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add Team Member</h1>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Create a new member for your team</p>
                </section>

                <Card className="max-w-2xl overflow-hidden transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-xl">Team Member Details</CardTitle>
                        <CardDescription>Enter the information for the new team member</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="flex flex-col gap-6" onSubmit={submit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <User className="h-4 w-4 text-muted-foreground" />
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
                                            placeholder="John Doe"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.name} className="mt-1" />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
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
                                            placeholder="john@example.com"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <Lock className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="••••••••"
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="hourly_rate" className="text-sm font-medium">
                                        Hourly Rate
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <span className="h-4 w-4 text-muted-foreground">$</span>
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
                                            className="pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.hourly_rate} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="currency" className="text-sm font-medium">
                                        Currency
                                    </Label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                            <span className="h-4 w-4 text-muted-foreground">¤</span>
                                        </div>
                                        <Input
                                            id="currency"
                                            type="text"
                                            value="USD"
                                            disabled={true}
                                            className="pl-10 bg-gray-100 dark:bg-gray-800"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Currency is fixed to USD</p>
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        tabIndex={7}
                                        disabled={processing}
                                        className="flex items-center gap-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" tabIndex={6} disabled={processing} className="flex items-center gap-2">
                                        {processing ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                                        {processing ? 'Creating...' : 'Create Team Member'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}
