import FeatureLayout from '@/components/features/FeatureLayout'
import { BarChart2, CheckCircle, Download, FileText, Filter, LineChart, PieChart } from 'lucide-react'

export default function DetailedReports() {
    return (
        <FeatureLayout title="Detailed Reports" icon={<BarChart2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                {/* Introduction Section */}
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Gain valuable insights into your work patterns with our comprehensive reporting tools. Our detailed reports help you analyze
                        productivity, track billable hours, and make data-driven decisions to optimize your workflow.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2">
                                <FileText className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="font-medium">Pro Tip:</span> Schedule automated reports to be sent to your email weekly or monthly to
                                stay on top of your productivity metrics.
                            </span>
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
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Visual Analytics</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                View your data through intuitive charts and graphs that make it easy to spot trends and patterns.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Customizable Reports</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create custom reports with the exact metrics and timeframes you need for your specific requirements.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Download className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Export Options</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Export your reports in multiple formats including PDF, CSV, and Excel for easy sharing and analysis.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Filter className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Advanced Filtering</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Filter your data by project, client, team member, date range, and more to get precisely the insights you need.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Report Types Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Available Report Types
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <BarChart2 className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Time Summary</h3>
                            <p className="text-gray-600 dark:text-gray-400">Overview of total hours worked, broken down by day, week, or month.</p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <PieChart className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Project Distribution</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                See how your time is distributed across different projects and clients.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <LineChart className="h-8 w-8" />
                                </div>
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-800 dark:text-gray-200">Productivity Trends</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track your productivity trends over time to identify patterns and optimize your workflow.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Benefits of Detailed Reporting
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Identify which projects consume most of your time</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improve estimation accuracy for future projects</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Transparent client billing with detailed breakdowns</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Identify productivity peaks and optimize your schedule</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Evaluate team performance with objective metrics</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Make data-driven decisions about resource allocation</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Gain Valuable Insights?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Start using our detailed reporting tools today to optimize your workflow and productivity.
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
