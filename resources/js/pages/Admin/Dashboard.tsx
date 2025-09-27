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
    timeLogTrend: TrendPoint[]
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

function TrendChart({ data, title, ariaLabel }: { data: TrendPoint[]; title: string; ariaLabel: string }) {
    const max = Math.max(1, ...data.map((d) => d.count))

    // SVG dimensions
    const width = 600
    const height = 220
    const padX = 24
    const padY = 18

    const n = data.length
    const innerW = width - padX * 2
    const innerH = height - padY * 2

    // Calculate xy points
    const xy = data.map((d, i) => {
        const x = n > 1 ? padX + (i * innerW) / (n - 1) : padX + innerW / 2
        const y = padY + (1 - d.count / max) * innerH
        return { x, y }
    })

    // Catmull–Rom to Bezier conversion for a smooth path
    function smoothPath(points: { x: number; y: number }[]): string {
        if (points.length === 0) {
            return ''
        }
        if (points.length === 1) {
            const p = points[0]
            return `M ${p.x} ${p.y}`
        }

        const path: string[] = []
        path.push(`M ${points[0].x} ${points[0].y}`)

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i - 1] ?? points[i]
            const p1 = points[i]
            const p2 = points[i + 1]
            const p3 = points[i + 2] ?? p2

            // Catmull-Rom to Bezier (alpha = 0.5, uniform)
            const cp1x = p1.x + (p2.x - p0.x) / 6
            const cp1y = p1.y + (p2.y - p0.y) / 6
            const cp2x = p2.x - (p3.x - p1.x) / 6
            const cp2y = p2.y - (p3.y - p1.y) / 6

            path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`)
        }

        return path.join(' ')
    }

    const lineD = smoothPath(xy)
    const baselineY = height - padY
    const areaD = `${lineD} L ${xy[xy.length - 1]?.x ?? padX} ${baselineY} L ${xy[0]?.x ?? padX} ${baselineY} Z`

    return (
        <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-medium">{title}</h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">Last 30 days</p>

            <div role="img" aria-label={ariaLabel} className="w-full">
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

                    {/* Area under curve (slight tint) */}
                    <path d={areaD} className="fill-blue-600/10 dark:fill-blue-400/10" />

                    {/* Smooth line curve */}
                    <path
                        d={lineD}
                        fill="none"
                        stroke="currentColor"
                        className="text-blue-600 dark:text-blue-400"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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

export default function Dashboard({ userCount, timeLogCount, projectCount, clientCount, invoiceCount, tasksCount, userRegistrationTrend, timeLogTrend }: DashboardProps) {
    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="container mx-auto py-6">
                <h1 className="mb-6 text-2xl font-semibold">Admin Dashboard</h1>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 mb-12">
                    <TrendChart
                        data={userRegistrationTrend}
                        title="User registrations (verified only)"
                        ariaLabel="User registration trend last 30 days, verified users only"
                    />
                    <TrendChart
                        data={timeLogTrend}
                        title="Time log entries"
                        ariaLabel="Time log entries trend last 30 days"
                    />
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
