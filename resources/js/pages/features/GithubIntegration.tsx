import FeatureLayout from '@/components/features/FeatureLayout'
import { BarChart2, CheckCircle, Clock, Code, GitBranch, Github } from 'lucide-react'

export default function GithubIntegration() {
    return (
        <FeatureLayout title="GitHub Integration" icon={<Github className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Seamlessly connect your GitHub account to import repositories as projects and track development time efficiently. Monitor your
                        coding productivity, generate reports based on repositories, and streamline your workflow with our powerful GitHub
                        integration.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2">
                                <Github className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="font-medium">Pro Tip:</span> Link your time entries to specific GitHub issues or pull requests to
                                provide detailed context for your work and improve project transparency.
                            </span>
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Github className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Repository Sync</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Automatically sync your GitHub repositories with Work Hours to keep your projects up-to-date.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Code className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Repository Import</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Import repositories as projects with all issues and pull requests for comprehensive time tracking.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <BarChart2 className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Productivity Metrics</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track time spent on different repositories, branches, and issues to analyze your development productivity.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <GitBranch className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Issue & PR Integration</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Link time entries directly to GitHub issues and pull requests for detailed work context.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Integration Capabilities
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <Github className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">OAuth Authentication</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Secure connection to your GitHub account with OAuth for safe and seamless integration.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <Clock className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Automated Time Tracking</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Start time tracking directly from GitHub issues or pull requests with our browser extension.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex justify-center">
                                <Code className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Commit Tracking</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Associate time entries with specific commits to track development progress in detail.
                            </p>
                        </div>
                    </div>
                </section>

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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Connect Your GitHub Account</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Link your GitHub account through our secure OAuth integration. We only request the permissions needed to access
                                    your repositories.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Select Repositories</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Choose which repositories you want to track time for. You can import all repositories or select specific ones.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track Time</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Start tracking time with the ability to link entries to specific issues, pull requests, or branches.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">View Insights</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Generate reports showing time spent on different repositories, issues, and pull requests to gain insights into
                                    your development workflow.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Perfect For
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Freelance Developers</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Track billable hours for client projects with detailed GitHub activity for transparent invoicing.
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Development Teams</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Monitor team productivity across repositories and coordinate resources more effectively.
                            </p>
                        </div>
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Open Source Contributors</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Keep track of time contributed to various open source projects for personal records.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Simplified project management with GitHub synchronization</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Accurate time tracking for development tasks</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Detailed insights into coding productivity and patterns</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Transparent reporting for clients and stakeholders</p>
                        </div>
                    </div>
                </section>

                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Connect with GitHub?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Integrate your GitHub workflow with Work Hours and start tracking your development time more efficiently.
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
