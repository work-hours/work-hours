import AdminLayout from '@/layouts/admin-layout'
import { Head, Link } from '@inertiajs/react'

interface TrendPoint {
    date: string
    count: number
}

interface DashboardProps {
    userCount: number
    timeLogCount: number
    projectCount: number
    clientCount: number
    invoiceCount: number
    tasksCount: number
    userRegistrationTrend: TrendPoint[]
}

export const statCard = ({ title, count, link }: { title: string; count: number; link: string | null }) => (
    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-medium">
            {title} ({count})
        </h2>
        <p className="mb-4 text-gray-600 dark:text-gray-300">Manage {title.toLowerCase()}</p>
        {link && (
            <Link href={link} className="text-blue-600 hover:underline dark:text-blue-400">
                View all {title.toLowerCase()} →
            </Link>
        )}
    </div>
)

function TrendChart({ data }: { data: TrendPoint[] }) {
    const max = Math.max(1, ...data.map((d) => d.count))

    // SVG dimensions
    const width = 600
    const height = 220
    const padX = 24
    const padY = 18

    const n = data.length
    const innerW = width - padX * 2
    const innerH = height - padY * 2

    const points = data.map((d, i) => {
        const x = n > 1 ? padX + (i * innerW) / (n - 1) : padX + innerW / 2
        const y = padY + (1 - d.count / max) * innerH
        return `${x},${y}`
    })

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-medium">User registrations (verified only)</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Last 30 days</p>

            <div role="img" aria-label="User registration trend last 30 days, verified users only" className="w-full">
                <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
                    {/* Background grid (light) */}
                    <g opacity="0.08" className="stroke-gray-800 dark:stroke-white">
                        {[0, 1, 2, 3, 4].map((i) => {
                            const y = padY + (i * innerH) / 4
                            return <line key={i} x1={padX} y1={y} x2={width - padX} y2={y} strokeWidth="1" />
                        })}
                    </g>
                    {/* Y-axis labels */}
                    <g className="fill-gray-600 text-xs dark:fill-gray-300">
                        {[0, 1, 2, 3, 4].map((i) => {
                            const y = padY + (i * innerH) / 4
                            const val = Math.round(((4 - i) * max) / 4)
                            return (
                                <text key={`label-${i}`} x={padX - 8} y={y + 4} textAnchor="end">
                                    {val}
                                </text>
                            )
                        })}
                    </g>

                    {/* Line */}
                    <polyline
                        fill="none"
                        stroke="currentColor"
                        className="text-blue-600 dark:text-blue-400"
                        strokeWidth="2.5"
                        points={points.join(' ')}
                    />

                    {/* Area under line (slight tint) */}
                    <polyline
                        fill="currentColor"
                        className="text-blue-600/10 dark:text-blue-400/10"
                        points={`${padX},${height - padY} ${points.join(' ')} ${width - padX},${height - padY}`}
                    />

                    {/* Points with native tooltip */}
                    {data.map((d, i) => {
                        const x = n > 1 ? padX + (i * innerW) / (n - 1) : padX + innerW / 2
                        const y = padY + (1 - d.count / max) * innerH
                        return (
                            <g key={d.date + i}>
                                <circle cx={x} cy={y} r={3.5} className="fill-blue-600 dark:fill-blue-400" />
                                {d.count > 0 && (
                                    <text x={x} y={y - 8} textAnchor="middle" className="text-xs fill-gray-700 dark:fill-gray-200">
                                        {d.count}
                                    </text>
                                )}
                                <title>{`${d.date}: ${d.count}`}</title>
                            </g>
                        )
                    })}
                </svg>
            </div>

            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{data[0]?.date}</span>
                <span>{data[data.length - 1]?.date}</span>
            </div>
        </div>
    )
}

export default function Dashboard({ userCount, timeLogCount, projectCount, clientCount, invoiceCount, tasksCount, userRegistrationTrend }: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12">
                    <TrendChart data={userRegistrationTrend} />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCard({ title: 'Users', count: userCount, link: '/administration/users' })}
                    {statCard({ title: 'Projects', count: projectCount, link: '/administration/projects' })}
                    {statCard({ title: 'Clients', count: clientCount, link: '/administration/clients' })}
                    {statCard({ title: 'Tasks', count: tasksCount, link: '/administration/tasks' })}
                    {statCard({ title: 'Invoices', count: invoiceCount, link: '/administration/invoices' })}
                    {statCard({ title: 'Time Logs', count: timeLogCount, link: '/administration/time-logs' })}
                </div>


            </div>
        </AdminLayout>
    )
}
