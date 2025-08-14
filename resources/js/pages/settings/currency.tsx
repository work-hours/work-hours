import { type BreadcrumbItem } from '@/types'
import { Head, useForm } from '@inertiajs/react'
import { DollarSign, LoaderCircle, Plus } from 'lucide-react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'

import DeleteCurrency from '@/components/delete-currency'
import HeadingSmall from '@/components/heading-small'
import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import SettingsLayout from '@/layouts/settings/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Currency settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Currency management" description="Add and manage currencies for your application" />

                    <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Add Currency</CardTitle>
                            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                Add a new currency to use in your projects and invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
                            <form onSubmit={submit} className="space-y-4">
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

                                <div className="flex items-center gap-4 pt-2">
                                    <Button disabled={processing} className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600">
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" />
                                                <span>Add Currency</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="mt-6 overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                        <CardHeader className="border-b border-gray-100 p-4 dark:border-gray-700">
                            <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Available Currencies</CardTitle>
                            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                List of all currencies available in your system
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4">
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
                                                    <DeleteCurrency currencyId={currency.id} currencyCode={currency.code} />
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
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </MasterLayout>
    )
}
