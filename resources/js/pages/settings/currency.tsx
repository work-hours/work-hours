import { type BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { DollarSign, LoaderCircle, Trash2 } from 'lucide-react'
import { FormEventHandler, useState } from 'react'
import { toast } from 'sonner'

import HeadingSmall from '@/components/heading-small'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import AppLayout from '@/layouts/app-layout'
import SettingsLayout from '@/layouts/settings/layout'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Currency settings',
        href: '/settings/currency',
    },
]

type CurrencyForm = {
    code: string
}

type Currency = {
    id: number
    code: string
}

export default function Currency({ currencies }: { currencies: Currency[] }) {
    const [isDeleting, setIsDeleting] = useState<number | null>(null)

    const { data, setData, post, errors, processing, reset } = useForm<CurrencyForm>({
        code: '',
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()

        post(route('currency.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('code')
                toast.success('Currency added successfully')
            },
            onError: () => {
                toast.error('Failed to add currency')
            },
        })
    }

    const deleteCurrency = (id: number) => {
        setIsDeleting(id)

        window.axios
            .delete(route('currency.destroy', { currency: id }))
            .then(() => {
                toast.success('Currency deleted successfully')
            })
            .catch(() => {
                toast.error('Failed to delete currency')
            })
            .finally(() => {
                setIsDeleting(null)
            })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Currency settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Currency management" description="Add and manage currencies for your application" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="code" className="text-sm font-medium">
                                Currency Code
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <Input
                                    id="code"
                                    className="pl-10"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    required
                                    placeholder="USD, EUR, GBP, etc."
                                />
                            </div>
                            <InputError className="mt-1" message={errors.code} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing} className="flex items-center gap-2">
                                {processing ? (
                                    <>
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <span>Add Currency</span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8">
                        <HeadingSmall title="Currencies" description="List of all currencies" />

                        {currencies.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Currency Code</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currencies.map((currency) => (
                                        <TableRow key={currency.id}>
                                            <TableCell>{currency.code}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => deleteCurrency(currency.id)}
                                                    disabled={isDeleting === currency.id}
                                                >
                                                    {isDeleting === currency.id ? (
                                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    )}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md bg-muted p-4 text-center">
                                <p className="text-sm text-muted-foreground">No currencies found. Add one above.</p>
                            </div>
                        )}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    )
}
