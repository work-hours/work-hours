import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { router, useForm } from '@inertiajs/react'
import { LoaderCircle, Lock, Mail, Save, User, UserPlus } from 'lucide-react'
import { useEffect } from 'react'
import { toast } from 'sonner'

import type { Currency } from '@/pages/team/types'

export type TeamMemberOffCanvasProps = {
    open: boolean
    mode: 'create' | 'edit'
    onClose: () => void
    currencies: Currency[]
    user?: {
        id: number
        name: string
        email: string
        hourly_rate: number
        currency: string
        non_monetary: boolean
    }
}

type TeamMemberForm = {
    name: string
    email: string
    password?: string
    hourly_rate: number | string
    currency: string
    non_monetary: boolean
}

export default function TeamMemberOffCanvas({ open, mode, onClose, currencies, user }: TeamMemberOffCanvasProps) {
    const isEdit = mode === 'edit'

    const { data, setData, post, put, processing, errors, reset } = useForm<TeamMemberForm>({
        name: isEdit && user ? user.name : '',
        email: isEdit && user ? user.email : '',
        password: isEdit ? '' : '',
        hourly_rate: isEdit && user ? user.hourly_rate : 0,
        currency: isEdit && user ? user.currency : currencies[0]?.code ?? 'USD',
        non_monetary: isEdit && user ? user.non_monetary : false,
    })

    useEffect(() => {
        // reset form when offcanvas closes or switches mode/user
        if (!open) {
            reset()
        } else {
            // initialize with fresh values on open
            setData({
                name: isEdit && user ? user.name : '',
                email: isEdit && user ? user.email : '',
                password: isEdit ? '' : '',
                hourly_rate: isEdit && user ? user.hourly_rate : 0,
                currency: isEdit && user ? user.currency : currencies[0]?.code ?? 'USD',
                non_monetary: isEdit && user ? user.non_monetary : false,
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, mode, user])

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isEdit && user) {
            put(route('team.update', user.id), {
                onSuccess: () => {
                    toast.success('Team member updated successfully')
                    router.reload({ only: ['teamMembers'] })
                    onClose()
                },
                onError: () => toast.error('Failed to update team member'),
                preserveScroll: true,
            })
        } else {
            post(route('team.store'), {
                onSuccess: () => {
                    toast.success('Team member created successfully')
                    router.reload({ only: ['teamMembers'] })
                    onClose()
                    reset()
                },
                onError: () => toast.error('Failed to create team member'),
                preserveScroll: true,
            })
        }
    }

    return (
        <Sheet open={open} onOpenChange={(val) => !val && onClose()}>
            <SheetContent side="right" className="overflow-y-auto bg-white pb-4 pl-4 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="mb-2">
                    <SheetTitle className="flex items-center gap-2 text-neutral-900 dark:text-white">
                        {isEdit ? 'Edit Team Member' : 'Add Team Member'}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update the team member details' : 'Create a new team member'}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-1">
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
                                            placeholder="John Doe"
                                            className="border-gray-200 bg-white pl-10"
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
                                            placeholder="john@example.com"
                                            className="border-gray-200 bg-white pl-10"
                                        />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                    {isEdit ? (
                                        <>Password <span className="text-xs text-gray-500">(leave empty to keep current password)</span></>
                                    ) : (
                                        'Password'
                                    )}
                                </Label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                        <Lock className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        tabIndex={3}
                                        autoComplete={isEdit ? 'new-password' : 'new-password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        required={!isEdit}
                                        placeholder="••••••••"
                                        className="border-gray-200 bg-white pl-10"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="non_monetary"
                                    checked={Boolean(data.non_monetary)}
                                    onChange={(e) => setData('non_monetary', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
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
                                                <span className="text-gray-400">$</span>
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
                                                className="border-gray-200 bg-white pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.hourly_rate} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="currency" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            Currency
                                        </Label>
                                        <Select value={data.currency} onValueChange={(value) => setData('currency', value)} disabled={processing || currencies.length === 0}>
                                            <SelectTrigger id="currency" className="border-gray-200 bg-white">
                                                <SelectValue placeholder="Select a currency" />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-200 bg-white">
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
                            )}

                            <div className="mt-2 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                                    Cancel
                                </Button>
                                <SubmitButton
                                    loading={processing}
                                    idleLabel={isEdit ? 'Update Member' : 'Create Team Member'}
                                    loadingLabel={isEdit ? 'Updating...' : 'Creating...'}
                                    idleIcon={isEdit ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                    loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                                    className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    )
}
