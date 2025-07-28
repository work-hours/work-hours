import FeatureLayout from '@/components/features/FeatureLayout'
import { Github, BarChart2, Clock, CheckCircle, Code, GitBranch } from 'lucide-react'

export default function GithubIntegration() {
    return (
        <FeatureLayout title="GitHub Integration" icon={<Github className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Seamlessly connect your GitHub account to import repositories as projects and track development time efficiently.
                        Monitor your coding productivity, generate reports based on repositories, and streamline your workflow with our
                        powerful GitHub integration.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Link your time entries to specific GitHub issues or pull requests
                            to provide detailed context for your work and improve project transparency.
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
                                    <Github className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Repository Sync</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Automatically sync your GitHub repositories with Work Hours to keep your projects up-to-date.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Code className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Repository Import</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Import repositories as projects with all issues and pull requests for comprehensive time tracking.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <BarChart2 className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Productivity Metrics</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Track time spent on different repositories, branches, and issues to analyze your development productivity.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <GitBranch className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Issue & PR Integration</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Link time entries directly to GitHub issues and pull requests for detailed work context.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Integration Capabilities Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Integration Capabilities
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <Github className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">OAuth Authentication</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Secure connection to your GitHub account with OAuth for safe and seamless integration.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <Clock className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Automated Time Tracking</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Start time tracking directly from GitHub issues or pull requests with our browser extension.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <Code className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Commit Tracking</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Associate time entries with specific commits to track development progress in detail.
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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Connect Your GitHub Account</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Authorize Work Hours to access your GitHub repositories through our secure OAuth integration.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Import Repositories</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Select which repositories you want to track time for, and we'll import them as projects in Work Hours.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track Development Time</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Log time against specific repositories, issues, or pull requests as you work on your code.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Analyze & Report</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Generate detailed reports on your development time, productivity metrics, and project progress.
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
                            <p className="text-gray-700 dark:text-gray-300">Streamlined workflow between coding and time tracking</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Accurate billing for client development projects</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Better estimation for future development tasks</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Detailed context for time entries with GitHub references</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved development team productivity tracking</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduced context switching between tools</p>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Common Use Cases
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Development Agencies</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Software development agencies can track time spent on client repositories for accurate billing and provide
                                detailed reports on development progress.
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Open Source Contributors</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Track time spent on open source contributions across different repositories to document your work and
                                measure your impact on the community.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Code Example Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Integration Example
                    </h2>
                    <div className="rounded-lg border-2 border-gray-400 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                        <div className="mb-4 border-b border-gray-400 pb-2 dark:border-gray-600">
                            <div className="flex items-center">
                                <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                                <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                <div className="ml-4 text-xs text-gray-600 dark:text-gray-400">repository-activity.txt</div>
                            </div>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            <div className="mb-2">$ git status</div>
                            <div className="mb-2 text-green-600 dark:text-green-400">On branch feature/new-dashboard</div>
                            <div className="mb-2 text-green-600 dark:text-green-400">Your branch is up to date with 'origin/feature/new-dashboard'</div>
                            <div className="mb-2">$ git log --oneline</div>
                            <div className="mb-1 text-blue-600 dark:text-blue-400">a1b2c3d Implement responsive layout for dashboard</div>
                            <div className="mb-1 text-blue-600 dark:text-blue-400">e4f5g6h Add chart components to dashboard</div>
                            <div className="mb-1 text-blue-600 dark:text-blue-400">i7j8k9l Create dashboard structure</div>
                            <div className="mb-2">$ _</div>
                        </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                        With GitHub integration, you can track time spent on specific branches like "feature/new-dashboard" and link your time
                        entries to commits like "Implement responsive layout for dashboard" for detailed work context.
                    </p>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mb-0 md:mr-6 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Connect Your GitHub Account?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and streamline your development time tracking with GitHub integration.
                            </p>
                        </div>
                        <div className="md:w-1/3">
                            <a
                                href={route('register')}
                                className="inline-flex items-center justify-center border-2 border-blue-900 bg-blue-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-800 dark:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                <Github className="mr-2 h-4 w-4" />
                                Get Started
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </FeatureLayout>
    )
}
