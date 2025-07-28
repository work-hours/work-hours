import FeatureLayout from '@/components/features/FeatureLayout'
import { BarChart2, Briefcase, CheckCircle, DollarSign, FileText, Users } from 'lucide-react'

export default function ClientManagement() {
    return (
        <FeatureLayout title="Client Management" icon={<Briefcase className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Organize and manage your clients effortlessly with our comprehensive client management system. Keep track of client
                        information, projects, and billing details all in one place for a more streamlined workflow.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Use client tags to categorize your clients by industry, size, or priority
                            for easier filtering and reporting.
                        </p>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Briefcase className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Client Records</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Maintain detailed client profiles with contact information, billing details, and project history.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Users className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Contact Management</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Store multiple contacts per client with roles, communication preferences, and interaction history.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <FileText className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Project Tracking</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Link projects to clients and track progress, time spent, and budget utilization in real-time.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <BarChart2 className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Client Reporting</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Generate client-specific reports on time spent, project status, and billing information.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
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
                                    Create a new client profile with essential information such as company name, address, and primary contact details.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Set Up Billing Information</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Configure billing rates, payment terms, and preferred currency for accurate invoicing and financial tracking.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Create Client Projects</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Add projects for the client, defining scope, budget, and team members assigned to each project.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track & Report</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Monitor project progress, track time spent, and generate detailed reports for client review and billing purposes.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                {/* Benefits Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Centralized client information for easy access</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved client communication and relationship management</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">More accurate billing and financial tracking</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Better project organization and resource allocation</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Enhanced reporting capabilities for client reviews</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Streamlined invoicing process with client history</p>
                        </div>
                    </div>
                </section>

                {/* Integration Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Integrations
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        Our client management system integrates seamlessly with other Work Hours features:
                    </p>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-2 flex items-center">
                                <DollarSign className="mr-2 h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Invoicing</h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Generate invoices directly from client projects and time logs.</p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-2 flex items-center">
                                <BarChart2 className="mr-2 h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Reporting</h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Create detailed client-specific reports for analysis and sharing.
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-2 flex items-center">
                                <Users className="mr-2 h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Team Access</h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Control which team members have access to specific client information.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Streamline Client Management?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and start organizing your clients more efficiently.
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
