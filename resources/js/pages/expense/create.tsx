import { Head, router, useForm } from '@inertiajs/react'
import MasterLayout from '@/layouts/master-layout'
import BackButton from '@/components/back-button'
import SubmitButton from '@/components/submit-button'
import InputError from '@/components/input-error'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { FilePlus2, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

const breadcrumbs = [
    { title: 'Expenses', href: '/expense' },
    { title: 'Create', href: '/expense/create' },
]

type ExpenseForm = {
    title: string
    description: string
    receipt: File | null
}

export default function CreateExpense() {
    const { data, setData, post, processing, errors, reset } = useForm<ExpenseForm>({
        title: '',
        description: '',
        receipt: null,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('description', data.description)
        if (data.receipt) formData.append('receipt', data.receipt)

        post(route('expense.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Expense created successfully')
                router.visit(route('expense.index') ?? '/expense')
            },
            onError: () => toast.error('Failed to create expense'),
            onFinish: () => reset('receipt'),
        })
    }

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Expense" />
            <div className="mx-auto flex flex-col gap-6 p-3">
                <section className="mb-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Create Expense</h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">Add a new expense with receipt</p>
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
                                <Label htmlFor="receipt">Receipt <span className="text-destructive">*</span></Label>
                                <Input
                                    id="receipt"
                                    type="file"
                                    accept=".pdf,image/*"
                                    onChange={(e) => setData('receipt', e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                                    required
                                    disabled={processing}
                                />
                                <InputError message={errors.receipt} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex flex-col justify-end">
                        <SubmitButton
                            disabled={processing}
                            loading={processing}
                            idleLabel="Create Expense"
                            loadingLabel="Creating..."
                            idleIcon={<FilePlus2 className="h-4 w-4" />}
                            loadingIcon={<LoaderCircle className="h-4 w-4 animate-spin" />}
                            className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                        />
                    </div>
                </form>
            </div>
        </MasterLayout>
    )
}
