import FeatureLayout from '@/components/features/FeatureLayout'
import { BarChart2, Briefcase, CheckCircle, DollarSign, FileText, Users } from 'lucide-react'

export default function ClientManagement() {
    return (
        <FeatureLayout title="Client Management" icon={<Briefcase className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                {/* Introduction Section */}
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Organize and manage your clients effortlessly with our comprehensive client management system. Keep track of client
                        information, projects, and billing details all in one place for a more streamlined workflow.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2"><Briefcase className="h-5 w-5" /></span>
                            <span><span className="font-medium">Pro Tip:</span> Use client tags to categorize your clients by industry, size, or priority
                            for easier filtering and reporting.</span>
                        </p>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Client Records</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Maintain detailed client profiles with contact information, billing details, and project history.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Contact Management</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Store multiple contacts per client with roles, communication preferences, and interaction history.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Project Tracking</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Link projects to clients and track progress, time spent, and budget utilization in real-time.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Client Reporting</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Generate custom reports for each client with detailed time tracking, project status, and financial summaries.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Client Dashboard Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Client Dashboard
                    </h2>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2 border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Client Overview</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Get a quick snapshot of your client's activity, active projects, and outstanding invoices from a single dashboard.
                                </p>
                            </div>
                            <div className="space-y-2 border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pb-0 md:px-6 dark:border-gray-700">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Financial Summary</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    View total billable hours, invoiced amounts, and payment status for each client at a glance.
                                </p>
                            </div>
                            <div className="space-y-2 md:pl-6">
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Communication Log</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Keep track of all client communications, shared documents, and important notes in a chronological timeline.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        How It Works
                    </h2>
                    <ol className="space-y-6">
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                1
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Add a New Client</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Create a detailed client profile with contact information, billing preferences, and custom fields for your specific needs.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Link Projects</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Associate the client with one or more projects, establishing billing rates and payment terms for each.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track Time & Activities</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Record time entries and activities associated with the client's projects for accurate billing and reporting.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Generate Invoices</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Create professional invoices based on tracked time and project milestones, customized to client specifications.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                {/* Benefits Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Centralized client information for better organization</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved client communication and relationship management</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">More accurate project tracking and budget management</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Streamlined invoicing process with client-specific customization</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Detailed client-specific reports for better decision making</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Enhanced professional image with organized client interactions</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Organize Your Client Work?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Start using our client management system today and streamline your client relationships.
                            </p>
                        </div>
                        <div className="md:w-1/3">
                            <a
                                href={route('register')}
                                className="inline-flex items-center justify-center border-2 border-blue-900 bg-blue-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </FeatureLayout>
    )
}
