import { ExportButton } from '@/components/action-buttons'
import ClientDeleteAction from '@/components/client-delete-action'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { getClientFilterDescription } from '@/pages/client/components/ClientFilters'
import ClientFiltersOffCanvas from '@/pages/client/components/ClientFiltersOffCanvas'
import ClientOffCanvas from '@/pages/client/components/ClientOffCanvas'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, usePage } from '@inertiajs/react'
import { Edit, FileText, Filter, Folder, MoreVertical, Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Clients',
        href: '/client',
    },
]

import type { Client, ClientCurrency, ClientFilters } from '@/@types/client'

type Props = {
    clients: Client[]
    filters: ClientFilters
}

type PageProps = Props & { currencies: ClientCurrency[] }
export default function Clients() {
    const { clients, filters, currencies } = usePage<PageProps>().props

    const [offOpen, setOffOpen] = useState(false)
    const [mode, setMode] = useState<'create' | 'edit'>('create')
    const [editClient, setEditClient] = useState<Client | null>(null)
    const [filtersOpen, setFiltersOpen] = useState(false)
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search)
            if ((params.get('open') || '').toLowerCase() === 'true') {
                setMode('create')
                setEditClient(null)
                setOffOpen(true)
            }
        } catch {}
    }, [])

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
                                    You have {clients.length} clients
                                </CardDescription>

                                {(filters.search || filters['created-date-from'] || filters['created-date-to']) && (
                                    <CardDescription className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {getClientFilterDescription(filters)}
                                    </CardDescription>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={filters.search || filters['created-date-from'] || filters['created-date-to'] ? 'default' : 'outline'}
                                    className={`flex items-center gap-2 ${
                                        filters.search || filters['created-date-from'] || filters['created-date-to']
                                            ? 'border-primary/20 bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/20 dark:border-primary/30 dark:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/30'
                                            : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => setFiltersOpen(true)}
                                >
                                    <Filter
                                        className={`h-4 w-4 ${filters.search || filters['created-date-from'] || filters['created-date-to'] ? 'text-primary dark:text-primary-foreground' : ''}`}
                                    />
                                    <span>
                                        {filters.search || filters['created-date-from'] || filters['created-date-to'] ? 'Filters Applied' : 'Filters'}
                                    </span>
                                </Button>
                                <ExportButton href={route('client.export') + window.location.search} label="Export" />
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
                    </CardHeader>
                    <CardContent className="p-0">
                        {clients.length > 0 ? (
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
                                                            <ClientDeleteAction clientId={client.id} />
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
            <ClientFiltersOffCanvas open={filtersOpen} onOpenChange={setFiltersOpen} filters={filters} />
        </MasterLayout>
    )
}
