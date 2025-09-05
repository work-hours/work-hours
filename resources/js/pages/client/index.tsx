import { ExportButton } from '@/components/action-buttons'
import ClientDeleteAction from '@/components/client-delete-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { formatDateValue, objectToQueryString, queryStringToObject } from '@/lib/utils'
import { type BreadcrumbItem } from '@/types'
import { clients as _clients } from '@actions/ClientController'
import ClientOffCanvas from '@/pages/client/components/ClientOffCanvas'
import ClientFiltersOffCanvas from '@/pages/client/components/ClientFiltersOffCanvas'
import { Head, Link, usePage } from '@inertiajs/react'
import { Edit, FileText, Filter, Folder, Loader2, MoreVertical, Plus, Search, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/client',
    },
]

import type { Client, ClientFilters } from '@/@types/client'

 type Props = {
    clients: Client[]
    filters: ClientFilters
}

 type PageProps = Props & { currencies: { id: number; code: string }[] }
export default function Clients() {
    const { filters: pageFilters, currencies } = usePage<PageProps>().props
    const [clients, setClients] = useState<Client[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<boolean>(false)
    const [processing, setProcessing] = useState(false)

    const [offOpen, setOffOpen] = useState(false)
    const [mode, setMode] = useState<'create' | 'edit'>('create')
    const [editClient, setEditClient] = useState<Client | null>(null)
    const [filtersOpen, setFiltersOpen] = useState(false)

    const parseDate = (dateValue: Date | string | null): Date | null => {
        if (dateValue === null) return null
        if (typeof dateValue === 'string') return new Date(dateValue)
        return dateValue
    }

    const [filters, setFilters] = useState<ClientFilters>({
        search: pageFilters?.search || '',
        'created-date-from': pageFilters?.['created-date-from'] || null,
        'created-date-to': pageFilters?.['created-date-to'] || null,
    })

    const handleFilterChange = (key: keyof ClientFilters, value: string | Date | null): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const clearFilters = (): void => {
        setFilters({
            search: '',
            'created-date-from': null,
            'created-date-to': null,
        })
    }

    const getClients = async (filters?: ClientFilters): Promise<void> => {
        setLoading(true)
        setError(false)
        setProcessing(true)
        try {
            setClients(
                await _clients.data({
                    params: filters,
                }),
            )
        } catch (error) {
            console.error('Error fetching clients:', error)
            setError(true)
        } finally {
            setLoading(false)
            setProcessing(false)
        }
    }

    const handleSubmit = (e: { preventDefault: () => void }): void => {
        e.preventDefault()
        const formattedFilters = { ...filters }

        if (formattedFilters['created-date-from'] instanceof Date) {
            const year = formattedFilters['created-date-from'].getFullYear()
            const month = String(formattedFilters['created-date-from'].getMonth() + 1).padStart(2, '0')
            const day = String(formattedFilters['created-date-from'].getDate()).padStart(2, '0')
            formattedFilters['created-date-from'] = `${year}-${month}-${day}`
        }

        if (formattedFilters['created-date-to'] instanceof Date) {
            const year = formattedFilters['created-date-to'].getFullYear()
            const month = String(formattedFilters['created-date-to'].getMonth() + 1).padStart(2, '0')
            const day = String(formattedFilters['created-date-to'].getDate()).padStart(2, '0')
            formattedFilters['created-date-to'] = `${year}-${month}-${day}`
        }

        const filtersString = objectToQueryString(formattedFilters)

        getClients(formattedFilters).then(() => {
            window.history.pushState({}, '', `?${filtersString}`)
        })
    }

    useEffect(() => {
        const queryParams = queryStringToObject()

        const initialFilters: ClientFilters = {
            search: queryParams.search || '',
            'created-date-from': queryParams['created-date-from'] || null,
            'created-date-to': queryParams['created-date-to'] || null,
        }

        setFilters(initialFilters)
        getClients(initialFilters).then()
    }, [])

    // Auto-open create sheet when ?open=true
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            if ((params.get('open') || '').toLowerCase() === 'true') {
                setMode('create')
                setEditClient(null)
                setOffOpen(true)
            }
        } catch {
            // ignore URL parsing errors
        }
    }, [])

    // Refresh clients when offcanvas operations succeed
    useEffect(() => {
        const handler = () => getClients(filters)
        window.addEventListener('refresh-clients', handler)
        return () => window.removeEventListener('refresh-clients', handler)
    }, [filters])

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title="Clients" />
            <div className="mx-auto flex flex-col gap-4 p-4">
                <section className="mb-2">
                    <div className="mb-2 flex items-center justify-between">
                        <h1 className="text-2xl font-medium tracking-tight text-gray-800 dark:text-gray-100">Client Management</h1>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your clients and their associated projects</p>
                </section>

                <Card className="overflow-hidden bg-white shadow-sm transition-all dark:bg-gray-800">
                    <CardHeader className="p-4 dark:border-gray-700">
                        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle className="text-lg font-medium text-gray-800 dark:text-gray-100">Client List</CardTitle>
                                <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                                    {loading ? 'Loading clients...' : error ? 'Failed to load clients' : `You have ${clients.length} clients`}
                                </CardDescription>

                                {(filters.search || filters['created-date-from'] || filters['created-date-to']) && (
                                    <CardDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {(() => {
                                            let description = ''

                                            if (filters['created-date-from'] && filters['created-date-to']) {
                                                description = `Showing clients from ${formatDateValue(filters['created-date-from'])} to ${formatDateValue(filters['created-date-to'])}`
                                            } else if (filters['created-date-from']) {
                                                description = `Showing clients from ${formatDateValue(filters['created-date-from'])}`
                                            } else if (filters['created-date-to']) {
                                                description = `Showing clients until ${formatDateValue(filters['created-date-to'])}`
                                            }

                                            if (filters.search) {
                                                if (description) {
                                                    description += ` matching "${filters.search}"`
                                                } else {
                                                    description = `Showing clients matching "${filters.search}"`
                                                }
                                            }

                                            return description
                                        })()}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Filter button */}
                                <Button
                                    variant={filters.search || filters['created-date-from'] || filters['created-date-to'] ? 'default' : 'outline'}
                                    className={`flex items-center gap-2 ${
                                        filters.search || filters['created-date-from'] || filters['created-date-to']
                                            ? 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 hover:border-primary/30 dark:bg-primary/20 dark:border-primary/30 dark:hover:bg-primary/30 dark:text-primary-foreground'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter className={`h-4 w-4 ${filters.search || filters['created-date-from'] || filters['created-date-to'] ? 'text-primary dark:text-primary-foreground' : ''}`} />
                                    <span>
                                        {(() => {
                                            const count = Number(Boolean(filters.search)) + Number(Boolean(filters['created-date-from'])) + Number(Boolean(filters['created-date-to']))
                                            return count > 0 ? `Filters (${count})` : 'Filters'
                                        })()}
                                    </span>
                                </Button>
                                <ExportButton
                                    href={`${route('client.export')}?${objectToQueryString({
                                        search: filters.search || '',
                                        'created-date-from': formatDateValue(filters['created-date-from']),
                                        'created-date-to': formatDateValue(filters['created-date-to']),
                                    })}`}
                                    label="Export"
                                />
                                <Button
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setMode('create')
                                        setEditClient(null)
                                        setOffOpen(true)
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Client</span>
                                </Button>
                            </div>
                        </div>

                        {/* Filters moved to offcanvas; header now has a Filter button */}
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <Loader2 className="mb-4 h-10 w-10 animate-spin text-gray-300 dark:text-gray-600" />
                                <h3 className="mb-1 text-base font-medium text-gray-700 dark:text-gray-300">Loading Clients</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we fetch your clients...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="mb-4 h-10 w-10 text-gray-400 dark:text-gray-500" />
                                <h3 className="mb-1 text-base font-medium text-gray-700 dark:text-gray-300">Failed to Load Clients</h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                    There was an error loading your clients. Please try again.
                                </p>
                                <Button
                                    onClick={() => getClients()}
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    <Loader2 className="h-4 w-4" />
                                    <span>Retry</span>
                                </Button>
                            </div>
                        ) : clients.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableHeaderRow>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Name
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Contact Person
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Email
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Phone
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Currency
                                            </TableHead>
                                            <TableHead className="dark:bg-gray-750 bg-gray-50 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Actions
                                            </TableHead>
                                        </TableHeaderRow>
                                    </TableHeader>
                                    <TableBody>
                                        {clients.map((client) => (
                                            <TableRow
                                                key={client.id}
                                                className="dark:hover:bg-gray-750 border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700"
                                            >
                                                <TableCell className="py-3">
                                                    <div className="font-medium text-gray-800 dark:text-gray-200">{client.name}</div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {client.contact_person || (
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">Not specified</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {client.email || <span className="text-xs text-gray-400 dark:text-gray-500">Not specified</span>}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                                                    {client.phone || <span className="text-xs text-gray-400 dark:text-gray-500">Not specified</span>}
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{client.currency || 'USD'}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                                                            >
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <Link href={route('client.projects', client.id)}>
                                                                <DropdownMenuItem className="group cursor-pointer">
                                                                    <Folder className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Projects</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <Link href={route('client.invoices', client.id)}>
                                                                <DropdownMenuItem className="group cursor-pointer">
                                                                    <FileText className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                    <span>Invoices</span>
                                                                </DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuItem
                                                                className="group cursor-pointer"
                                                                onClick={() => {
                                                                    setMode('edit')
                                                                    setEditClient(client)
                                                                    setOffOpen(true)
                                                                }}
                                                            >
                                                                <Edit className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                            <ClientDeleteAction clientId={client.id} onDeleteSuccess={getClients} />
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
                                <h3 className="mb-1 text-lg font-medium text-gray-800 dark:text-gray-200">No Clients</h3>
                                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">You haven't added any clients yet.</p>
                                <Button
                                    className="flex items-center gap-2 bg-gray-900 text-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    onClick={() => {
                                        setMode('create')
                                        setEditClient(null)
                                        setOffOpen(true)
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Client</span>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <ClientOffCanvas open={offOpen} mode={mode} onClose={() => setOffOpen(false)} currencies={currencies} client={editClient ?? undefined} />
            <ClientFiltersOffCanvas
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                filters={filters}
                processing={processing}
                parseDate={parseDate}
                onChange={handleFilterChange}
                onClear={clearFilters}
                onSubmit={handleSubmit}
            />
        </MasterLayout>
    )
}
