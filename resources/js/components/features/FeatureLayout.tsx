import Footer from '@/components/landing/Footer'
import Navbar from '@/components/landing/Navbar'
import { Head, Link } from '@inertiajs/react'
import { ReactNode } from 'react'
import { Clock, BarChart2, Users, Briefcase, Upload, CheckSquare, DollarSign, Github } from 'lucide-react'

interface FeatureLayoutProps {
    title: string
    icon?: ReactNode
    children: ReactNode
}

export default function FeatureLayout({ title, icon, children }: FeatureLayoutProps) {
    const featurePages = [
        { name: 'Time Tracking', route: 'features.time-tracking', icon: <Clock className="h-4 w-4" /> },
        { name: 'Detailed Reports', route: 'features.detailed-reports', icon: <BarChart2 className="h-4 w-4" /> },
        { name: 'Team Collaboration', route: 'features.team-collaboration', icon: <Users className="h-4 w-4" /> },
        { name: 'Client Management', route: 'features.client-management', icon: <Briefcase className="h-4 w-4" /> },
        { name: 'Bulk Upload', route: 'features.bulk-upload', icon: <Upload className="h-4 w-4" /> },
        { name: 'Approval Management', route: 'features.approval-management', icon: <CheckSquare className="h-4 w-4" /> },
        { name: 'Currency Management', route: 'features.currency-management', icon: <DollarSign className="h-4 w-4" /> },
        { name: 'Multi Currency Invoice', route: 'features.multi-currency-invoice', icon: <DollarSign className="h-4 w-4" /> },
        { name: 'Task Management', route: 'features.task-management', icon: <CheckSquare className="h-4 w-4" /> },
        { name: 'GitHub Integration', route: 'features.github-integration', icon: <Github className="h-4 w-4" /> },
    ]

    return (
        <div className="min-h-screen bg-[#f8f6e9] dark:bg-gray-900">
            <Head title={`${title} - Work Hours`} />
            <Navbar />

            <div className="container mx-auto px-6 py-28 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1">
                        <div className="sticky top-28 rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Features</h3>
                            <nav className="space-y-2">
                                {featurePages.map((page) => (
                                    <Link
                                        key={page.route}
                                        href={route(page.route)}
                                        className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                                            route().current(page.route)
                                                ? 'bg-blue-100 font-medium text-blue-900 dark:bg-blue-900/20 dark:text-blue-400'
                                                : 'text-gray-700 hover:bg-gray-100 hover:text-blue-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-blue-400'
                                        }`}
                                    >
                                        <span className="mr-2">{page.icon}</span>
                                        {page.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="md:col-span-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-6 flex items-center">
                                {icon && <div className="mr-4">{icon}</div>}
                                <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 md:text-4xl">{title}</h1>
                            </div>
                            <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                                <div className="mt-6">{children}</div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </div>
    )
}
