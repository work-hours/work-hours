import AddNewButton from '@/components/add-new-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { objectToQueryString, queryStringToObject } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { expenses as _expenses } from '@actions/ExpenseController'
import { Head, router, usePage } from '@inertiajs/react'
import { Calendar, FileText, Filter, Loader2, MoreVertical, Plus, ReceiptText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Expenses', href: '/expense' },
]

type Expense = {
  id: number
  title: string
  description: string
  amount: number
  currency: string
  receipt_url: string | null
  created_at: string
}

type ExpenseFilters = {
  search: string
  'created-date-from': string | Date | null
  'created-date-to': string | Date | null
}

type Props = {
  filters: ExpenseFilters
}

export default function ExpensesIndex() {
  const { filters: pageFilters } = usePage<Props>().props
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [filters, setFilters] = useState<ExpenseFilters>({
    search: pageFilters?.search || '',
    'created-date-from': pageFilters?.['created-date-from'] || null,
    'created-date-to': pageFilters?.['created-date-to'] || null,
  })

  const getExpenses = async (f?: ExpenseFilters) => {
    setLoading(true)
    setError(false)
    try {
      const params: Record<string, string> = {}
      const useF = f ?? filters
      if (useF.search) params.search = useF.search
      if (useF['created-date-from']) params['created-date-from'] = useF['created-date-from'] as string
      if (useF['created-date-to']) params['created-date-to'] = useF['created-date-to'] as string

      const data = await _expenses.data({ params })
      setExpenses(data)
    } catch (e) {
      console.error(e)
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const qsFilters = queryStringToObject(window.location.search)
    if (qsFilters && Object.keys(qsFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...qsFilters }))
      getExpenses(qsFilters as ExpenseFilters).then()
    } else {
      getExpenses().then()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyFilters = () => {
    const qs = objectToQueryString(filters)
    router.visit(`/expense?${qs}`)
  }

  return (
    <MasterLayout breadcrumbs={breadcrumbs}>
      <Head title="Expenses" />
      <div className="mx-auto flex flex-col gap-6 p-3">
        <section className="mb-2 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Expenses</h1>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Your recorded expenses</p>
          </div>
          <div className="flex gap-3">
            <AddNewButton href="/expense/create" label="New Expense" icon={<Plus className="h-4 w-4" />} />
          </div>
        </section>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg"><ReceiptText className="h-5 w-5" /> Expense List</CardTitle>
              <CardDescription>Search and manage your expenses</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Input
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  placeholder="Search by title or description"
                  className="w-64"
                />
              </div>
              <Button variant="outline" onClick={applyFilters} className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> Apply
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableHeaderRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Receipt</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> Loading expenses...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-red-600">Failed to load expenses</TableCell>
                    </TableRow>
                  ) : expenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No expenses found. Click "New Expense" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    expenses.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{expense.title}</TableCell>
                        <TableCell className="max-w-[420px] truncate text-muted-foreground">{expense.description}</TableCell>
                        <TableCell className="font-medium">{expense.currency} {Number(expense.amount).toFixed(2)}</TableCell>
                        <TableCell>
                          {expense.receipt_url ? (
                            <a className="text-blue-600 hover:underline" href={expense.receipt_url} target="_blank" rel="noreferrer">
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(expense.created_at).toISOString().split('T')[0]}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.visit(`/expense/${expense.id}/edit`)} className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              {expense.receipt_url && (
                                <DropdownMenuItem asChild>
                                  <a href={expense.receipt_url} target="_blank" rel="noreferrer" className="cursor-pointer">
                                    <ReceiptText className="mr-2 h-4 w-4" /> View receipt
                                  </a>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MasterLayout>
  )
}
