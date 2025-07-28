import FeatureLayout from '@/components/features/FeatureLayout'
import { BarChart2, Download, FileText, Filter, LineChart, PieChart } from 'lucide-react'

export default function DetailedReports() {
    return (
        <FeatureLayout title="Detailed Reports" icon={<BarChart2 className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Gain valuable insights into your work patterns with our comprehensive reporting tools. Our detailed reports help you analyze
                        productivity, track billable hours, and make data-driven decisions to optimize your workflow.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Schedule automated reports to be sent to your email weekly or monthly to
                            stay on top of your productivity metrics.
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
                                    <BarChart2 className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Visual Analytics</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                View your data through intuitive charts and graphs that make it easy to spot trends and patterns.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <FileText className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Customizable Reports</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Create custom reports with the exact metrics and timeframes you need for your specific requirements.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Download className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Export Options</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Export your reports in multiple formats including PDF, CSV, and Excel for easy sharing and analysis.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Filter className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Advanced Filtering</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Filter your data by project, client, team member, date range, and more to get precisely the insights you need.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Report Types Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Available Report Types
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <BarChart2 className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Time Summary</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Overview of total hours worked, broken down by day, week, or month.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <PieChart className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Project Distribution</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                See how your time is distributed across different projects and clients.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <LineChart className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Productivity Trends</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Track your productivity over time to identify patterns and improvement areas.
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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Select Report Type</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Choose from various report types including time summaries, project distribution, and productivity trends.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Set Parameters</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Define the date range, projects, clients, or team members you want to include in your report.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Generate Report</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Click "Generate" to create your report. The system will process your data and display the results instantly.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Analyze and Export</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Review your report with interactive charts and tables. Export or share the report in your preferred format.
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
                            <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Make data-driven decisions about resource allocation</p>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Identify your most profitable projects and clients</p>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Track team performance and productivity</p>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Improve project estimates and budgeting</p>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Provide transparent reporting to clients</p>
                        </div>
                        <div className="flex items-start">
                            <div className="mr-2 h-5 w-5 flex-shrink-0 rounded-full bg-green-100 p-1 dark:bg-green-900/20">
                                <div className="h-3 w-3 rounded-full bg-green-600 dark:bg-green-500"></div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Optimize your workflow and eliminate inefficiencies</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Gain Valuable Insights?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and start making data-driven decisions with our detailed reports.
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
