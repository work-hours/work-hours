import InputError from '@/components/input-error'
import SubmitButton from '@/components/submit-button'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { router, useForm } from '@inertiajs/react'
import { DollarSign, LoaderCircle, Lock, Mail, Save, User, UserPlus } from 'lucide-react'
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
        currency: isEdit && user ? user.currency : (currencies[0]?.code ?? 'USD'),
        non_monetary: isEdit && user ? user.non_monetary : false,
    })

    useEffect(() => {
        if (!open) {
            reset()
        } else {
            setData({
                name: isEdit && user ? user.name : '',
                email: isEdit && user ? user.email : '',
                password: isEdit ? '' : '',
                hourly_rate: isEdit && user ? user.hourly_rate : 0,
                currency: isEdit && user ? user.currency : (currencies[0]?.code ?? 'USD'),
                non_monetary: isEdit && user ? user.non_monetary : false,
            })
        }
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
            <SheetContent side="right" className="overflow-y-auto bg-white pr-6 pb-8 pl-6 sm:max-w-md md:max-w-lg dark:bg-neutral-900">
                <SheetHeader className="">
                    <SheetTitle className="flex items-center gap-2 text-xl text-neutral-900 dark:text-white">
                        {isEdit ? (
                            <>
                                <User className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Edit Team Member
                            </>
                        ) : (
                            <>
                                <UserPlus className="h-5 w-5 text-neutral-700 dark:text-neutral-300" /> Add Team Member
                            </>
                        )}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-neutral-500 dark:text-neutral-400">
                        {isEdit ? 'Update the team member details' : 'Create a new team member'}
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>
                                    <div className="space-y-2">
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
                                                className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {isEdit ? (
                                            <>
                                                Password <span className="text-xs text-gray-500">(leave empty to keep current password)</span>
                                            </>
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
                                            className="border-neutral-200 bg-white pl-10 ring-offset-white focus-visible:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-800/50 dark:ring-offset-neutral-900 dark:focus-visible:ring-neutral-600"
                                        />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>
                            </div>

                            <div className="space-y-5 pt-2">
                                <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Payment Information</h3>

                                <div className="flex items-center gap-3 rounded-md border border-neutral-100 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-800/30">
                                    <div className="flex h-5 items-center">
                                        <Checkbox
                                            id="non_monetary"
                                            checked={Boolean(data.non_monetary)}
                                            onCheckedChange={(checked) => setData('non_monetary', Boolean(checked))}
                                            className="border-neutral-300 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800"
                                        />
                                    </div>
                                    <div className="space-y-1 leading-none">
                                        <Label htmlFor="non_monetary" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Non-monetary member
                                        </Label>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">This team member doesn't have an hourly rate</p>
                                    </div>
                                </div>

                                {!data.non_monetary && (
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
                                                    tabIndex={4}
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
                                )}
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
                                    idleLabel={isEdit ? 'Update Member' : 'Create Team Member'}
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
