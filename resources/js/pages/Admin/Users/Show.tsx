import AdminLayout from '@/layouts/admin-layout'
import { formatDateTime } from '@/lib/utils'
import { Head, Link } from '@inertiajs/react'

interface Project { id: number; name: string; status?: string | null; created_at: string }
interface Client { id: number; name: string; company?: string | null; created_at: string }
interface Task { id: number; title: string; status: string; priority: string; due_date?: string | null; created_at: string; project?: { id: number; name: string } | null }
interface TimeLog { id: number; started_at: string; ended_at: string | null; duration_minutes: number; created_at: string; project?: { id: number; name: string } | null; task?: { id: number; title: string } | null }
interface Invoice { id: number; number: string; status: string; total: number; currency: string; created_at: string }

interface UserDto {
    id: number
    name: string
    email: string
    email_verified_at: string | null
    profile_photo_url: string
    hourly_rate: number | null
    currency: string | null
    created_at: string
    clients_count: number
    projects_count: number
    time_logs_count: number
}

interface Props {
    user: UserDto
    recent: {
        projects: Project[]
        clients: Client[]
        assignedTasks: Task[]
        timeLogs: TimeLog[]
        invoices: Invoice[]
    }
}

export default function Show({ user, recent }: Props) {
    return (
        <AdminLayout>
            <Head title={`Admin - ${user.name}`} />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src={user.profile_photo_url} alt={user.name} className="h-14 w-14 rounded-full" />
                        <div>
                            <h1 className="text-2xl font-semibold">{user.name}</h1>
                            <div className="text-sm text-gray-500 dark:text-gray-400">User since {formatDateTime(user.created_at)}</div>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Personal Details</h2>
                        <dl className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex items-center justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Email</dt>
                                <dd className="text-gray-900 dark:text-gray-100">{user.email}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Verified</dt>
                                <dd className="text-gray-900 dark:text-gray-100">{user.email_verified_at ? formatDateTime(user.email_verified_at) : '—'}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Hourly Rate</dt>
                                <dd className="text-gray-900 dark:text-gray-100">{user.hourly_rate ?? '—'}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-gray-500 dark:text-gray-400">Currency</dt>
                                <dd className="text-gray-900 dark:text-gray-100">{user.currency ?? '—'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Overview</h2>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{user.projects_count}</div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Projects</div>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{user.clients_count}</div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Clients</div>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{user.time_logs_count}</div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">Time Logs</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Quick Links</h2>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <Link className="rounded border px-3 py-2 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700" href={route('admin.projects.index')}>Projects</Link>
                            <Link className="rounded border px-3 py-2 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700" href={route('admin.tasks.index')}>Tasks</Link>
                            <Link className="rounded border px-3 py-2 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700" href={route('admin.clients.index')}>Clients</Link>
                            <Link className="rounded border px-3 py-2 text-center hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700" href={route('admin.time-logs.index')}>Time Logs</Link>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <SectionCard title="Recent Projects">
                        {recent.projects.length === 0 ? (
                            <EmptyState label="No projects found" />
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.projects.map((p) => (
                                    <li key={p.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{p.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(p.created_at)}</div>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{p.status ?? '—'}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>

                    <SectionCard title="Recent Clients">
                        {recent.clients.length === 0 ? (
                            <EmptyState label="No clients found" />
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.clients.map((c) => (
                                    <li key={c.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{c.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{c.company ?? '—'}</div>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(c.created_at)}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>

                    <SectionCard title="Recent Assigned Tasks">
                        {recent.assignedTasks.length === 0 ? (
                            <EmptyState label="No tasks found" />
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.assignedTasks.map((t) => (
                                    <li key={t.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{t.title}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{t.project?.name ?? '—'}</div>
                                        </div>
                                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                            <div>{t.status}</div>
                                            <div className="mt-0.5">{t.due_date ? `Due ${formatDateTime(t.due_date)}` : 'No due date'}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>

                    <SectionCard title="Recent Time Logs">
                        {recent.timeLogs.length === 0 ? (
                            <EmptyState label="No time logs found" />
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.timeLogs.map((tl) => (
                                    <li key={tl.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">{tl.project?.name ?? '—'}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{tl.task?.title ?? '—'}</div>
                                        </div>
                                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                            <div>{tl.duration_minutes} min</div>
                                            <div className="mt-0.5">{formatDateTime(tl.created_at)}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>

                    <SectionCard title="Recent Invoices">
                        {recent.invoices.length === 0 ? (
                            <EmptyState label="No invoices found" />
                        ) : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {recent.invoices.map((inv) => (
                                    <li key={inv.id} className="flex items-center justify-between py-3">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">#{inv.number}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">{formatDateTime(inv.created_at)}</div>
                                        </div>
                                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                            <div>
                                                {inv.total} {inv.currency}
                                            </div>
                                            <div className="mt-0.5">{inv.status}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SectionCard>
                </div>
            </div>
        </AdminLayout>
    )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-4 text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">{title}</h2>
            {children}
        </div>
    )
}

function EmptyState({ label }: { label: string }) {
    return <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">{label}</div>
}
