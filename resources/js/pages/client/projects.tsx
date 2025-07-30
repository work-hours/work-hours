import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeaderRow, TableRow } from '@/components/ui/table'
import MasterLayout from '@/layouts/master-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { ArrowLeft, Clock, Edit, FileText, FolderPlus, Users } from 'lucide-react'
import { ActionButton, ActionButtonGroup } from '@/components/action-buttons'

type Project = {
    id: number
    name: string
    description: string | null
    user: {
        id: number
        name: string
        email: string
    }
    team_members: {
        id: number
        name: string
        email: string
    }[]
}

type Client = {
    id: number
    name: string
    email: string | null
    contact_person: string | null
    phone: string | null
    address: string | null
    notes: string | null
    hourly_rate: number | null
    currency: string | null
}

type Props = {
    client: Client
    projects: Project[]
}

export default function ClientProjects({ client, projects }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Clients',
            href: '/client',
        },
        {
            title: client.name,
            href: `/client/${client.id}/projects`,
        },
    ]

    return (
        <MasterLayout breadcrumbs={breadcrumbs}>
            <Head title={`${client.name} - Projects`} />
            <div className="mx-auto flex flex-col gap-2 p-3">
                {/* Header section */}
                <section className="mb-2">
                    <div className="flex items-center gap-4">
                        <Link href={route('client.index')}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <ArrowLeft className="h-4 w-4" />
                                <span className="sr-only">Back to Clients</span>
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{client.name} - Projects</h1>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Manage projects for this client</p>
                        </div>
                    </div>
                </section>

                {/* Client Info Card */}
                <Card className="flex-1 overflow-hidden transition-all hover:shadow-md" >
                    <CardHeader className="py-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </span>
                            Client Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                        <div className="flex flex-wrap gap-4 items-center">
                            <div className="flex items-center gap-2 min-w-[120px]">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">👤</span>
                                </span>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Contact Person</h3>
                                    <p className="text-xs leading-tight">{client.contact_person || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 min-w-[120px]">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">✉️</span>
                                </span>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Email</h3>
                                    <p className="text-xs leading-tight">{client.email || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 min-w-[100px]">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">📞</span>
                                </span>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Phone</h3>
                                    <p className="text-xs leading-tight">{client.phone || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 min-w-[120px]">
                                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                    <span className="text-gray-500 dark:text-gray-400 text-xs">🏠</span>
                                </span>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Address</h3>
                                    <p className="text-xs leading-tight">{client.address || 'Not specified'}</p>
                                </div>
                            </div>
                            {client.notes && (
                                <div className="flex items-center gap-2 min-w-[180px]">
                                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 p-1.5">
                                        <span className="text-gray-500 dark:text-gray-400 text-xs">📝</span>
                                    </span>
                                    <div>
                                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide leading-tight">Notes</h3>
                                        <p className="text-xs leading-tight">{client.notes}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Projects Card */}
                <Card className="overflow-hidden transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl">Projects</CardTitle>
                                <CardDescription>
                                    {projects.length > 0
                                        ? `${client.name} has ${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`
                                        : 'No projects found for this client'}
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={route('project.create')}>
                                    <Button className="flex items-center gap-2">
                                        <FolderPlus className="h-4 w-4" />
                                        <span>Add Project</span>
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {projects.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableHeaderRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Owner</TableHead>
                                        <TableHead>Team Members</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableHeaderRow>
                                </TableHeader>
                                <TableBody>
                                    {projects.map((project) => (
                                        <TableRow key={project.id}>
                                            <TableCell className="font-medium">{project.name}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {project.description ? (
                                                    project.description.length > 50 ? (
                                                        project.description.substring(0, 50) + '...'
                                                    ) : (
                                                        project.description
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground/50">No description</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium">{project.user.name}</TableCell>
                                            <TableCell>
                                                {project.team_members && project.team_members.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {project.team_members.map((member) => (
                                                            <span
                                                                key={member.id}
                                                                className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
                                                                title={member.email}
                                                            >
                                                                {member.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/50">No team members</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <ActionButtonGroup>
                                                        <ActionButton
                                                            href={route('project.time-logs', project.id)}
                                                            title="View Time Logs"
                                                            icon={Clock}
                                                            label="Logs"
                                                            variant="blue"
                                                        />
                                                        <ActionButton
                                                            href={route('project.edit', project.id)}
                                                            title="Edit Project"
                                                            icon={Edit}
                                                            variant="amber"
                                                            size="icon"
                                                        />
                                                    </ActionButtonGroup>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="rounded-md border bg-muted/5 p-6">
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Users className="mb-4 h-12 w-12 text-muted-foreground/50" />
                                    <h3 className="mb-1 text-lg font-medium">No Projects</h3>
                                    <p className="mb-4 text-muted-foreground">This client doesn't have any projects yet.</p>
                                    <Link href={route('project.create')}>
                                        <Button className="flex items-center gap-2">
                                            <FolderPlus className="h-4 w-4" />
                                            <span>Add Project</span>
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MasterLayout>
    )
}
