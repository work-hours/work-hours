import { Head, router, useForm, usePage } from '@inertiajs/react'
import MasterLayout from '@/layouts/master-layout'
import BackButton from '@/components/back-button'
import SubmitButton from '@/components/submit-button'
import InputError from '@/components/input-error'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Save, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

const breadcrumbs = [
    { title: 'Expenses', href: '/expense' },
    { title: 'Edit', href: '/expense' },
]

type ExpensePayload = {
    id: number
    title: string
    description: string
    receipt_url: string | null
}

type PageProps = {
    expense: ExpensePayload
}

type ExpenseForm = {
    title: string
    description: string
    receipt: File | null
}

export default function EditExpense() {
    const { expense } = usePage<PageProps>().props
    const { data, setData, put, processing, errors, reset } = useForm<ExpenseForm>({
        title: expense.title,
        description: expense.description,
        receipt: null,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        if (data.receipt) formData.append('receipt', data.receipt)

        const url = route('expense.update', { expense: expense.id })

        put(url as string, {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Expense updated successfully')
                router.visit(route('expense.index') ?? '/expense')
            },
            onError: () => toast.error('Failed to update expense'),
            onFinish: () => reset('receipt'),
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Expense" />
            <div className="mx-auto flex flex-col gap-6 p-3">
                <section className="mb-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Expense</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Update expense details</p>
                    </div>
                    <div className="flex gap-3">
                        <BackButton disabled={processing} />
                    </div>
                </section>

                <form className="grid grid-cols-1 gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle className="text-lg">Expense Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required disabled={processing} />
                                <InputError message={errors.title} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} required disabled={processing} className="min-h-[120px]" />
                                <InputError message={errors.description} className="mt-1" />
                            </div>
                            <div>
                                <Label htmlFor="receipt">Receipt <span className="text-xs text-muted-foreground">(optional to replace)</span></Label>
                                <Input
                                    id="receipt"
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setData('receipt', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                    disabled={processing}
                                />
                                <InputError message={errors.receipt} className="mt-1" />
                                {expense.receipt_url && (
                                    <a href={expense.receipt_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-blue-600 hover:underline">
                                        View current receipt
                                    </a>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex flex-col justify-end">
                        <SubmitButton
                            disabled={processing}
                            loading={processing}
                            idleLabel="Save Changes"
                            loadingLabel="Saving..."
                            idleIcon={<Save className="h-4 w-4" />}
                            loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                        />
                    </div>
                </form>
            </div>
        </MasterLayout>
    )
}
