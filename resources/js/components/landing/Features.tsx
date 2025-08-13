import JiraIcon from '@/components/icons/jira-icon'
import { type SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import { BarChart2, Briefcase, CheckSquare, Clock, DollarSign, ExternalLink, Github, Upload, Users } from 'lucide-react'

export default function Features() {
    const { auth } = usePage<SharedData>().props
    const isLoggedIn = auth && auth.user
    return (
        <>
            <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 md:py-24" aria-label="Product features">
                <div className="mb-16 text-center">
                    {/* Minimal section header */}
                    <div className="mb-6 inline-flex rounded-full bg-slate-100 px-4 py-1.5 dark:bg-slate-800">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Features</span>
                    </div>

                    <h2 className="mb-6 text-center text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl dark:text-slate-100">
                        Powerful Features
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                        Everything you need to track, analyze, and optimize your work hours.
                    </p>
                </div>

                {/* Modern features grid */}
                <div className="mb-16 grid gap-6 md:grid-cols-3">
                    {/* Feature: Time Tracking */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Time Tracking</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Clock className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Track time with a single click. Add notes and categorize your activities for better insights.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                One-click tracking
                            </div>
                        </div>
                    </div>

                    {/* Feature: Detailed Reports */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Detailed Reports</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <BarChart2 className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Generate comprehensive reports to analyze your productivity and identify improvement areas.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Export options
                            </div>
                        </div>
                    </div>

                    {/* Feature: Team Collaboration */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Team Collaboration</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Users className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Manage your team's time, assign projects, and track progress all in one place.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Real-time updates
                            </div>
                        </div>
                    </div>

                    {/* Feature: Client Management */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Client Management</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Briefcase className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Organize and manage your clients effortlessly. Track client projects and maintain detailed records.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Client records
                            </div>
                        </div>
                    </div>

                    {/* Feature: Bulk Upload */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Bulk Upload</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Upload className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Save time by importing multiple time logs at once. Download a template and upload your data.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Template download
                            </div>
                        </div>
                    </div>

                    {/* Feature: Approval Management */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Approval Management</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <CheckSquare className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-3">
                                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                    New
                                </span>
                            </div>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Streamline your workflow with our robust approval system. Managers can review and approve time logs.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Approval workflow
                            </div>
                        </div>
                    </div>

                    {/* Feature: Currency Management */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Currency Management</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <DollarSign className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Work with multiple currencies across projects and clients. Track earnings in various currencies.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Currency conversion
                            </div>
                        </div>
                    </div>

                    {/* Feature: Multi Currency Invoice */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Multi Currency Invoice</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <DollarSign className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-3">
                                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                    New
                                </span>
                            </div>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Create invoices in multiple currencies for international clients. Simplify billing across different regions.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Multiple currencies
                            </div>
                        </div>
                    </div>

                    {/* Feature: Task Management */}
                    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
                        <div className="border-b border-slate-100 p-5 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Task Management</h3>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <CheckSquare className="h-5 w-5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="mb-3">
                                <span className="inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-500">
                                    New
                                </span>
                            </div>
                            <p className="mb-4 text-slate-600 dark:text-slate-400">
                                Create, assign, and track tasks efficiently. Organize your work with priorities and due dates.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                <span className="mr-1.5">•</span>
                                Task tracking
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* GitHub Integration - Modern style */}
            <section id="featured-integration" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16" aria-label="Featured integration">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b border-slate-100 p-6 dark:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <Github className="h-6 w-6 text-slate-700 dark:text-slate-300" aria-label="GitHub logo" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100">
                                        GitHub Integration
                                    </h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect your repositories and track development time</p>
                                </div>
                            </div>
                            <div className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-700">
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    Featured Integration
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        {/* Left column - Feature description */}
                        <div>
                            <div className="mb-6 border-l-2 border-slate-200 pl-4 dark:border-slate-600">
                                <p className="text-slate-600 dark:text-slate-400">
                                    Seamlessly connect your GitHub account to import repositories as projects and track development time efficiently.
                                    Monitor your coding productivity, generate reports based on repositories, and streamline your workflow.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="mb-3 text-base font-medium text-slate-900 dark:text-slate-200">Key Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                        <span className="mr-1.5">•</span>
                                        Repository Sync
                                    </div>
                                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                        <span className="mr-1.5">•</span>
                                        Repository Import
                                    </div>
                                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                        <span className="mr-1.5">•</span>
                                        Productivity Metrics
                                    </div>
                                </div>
                            </div>

                            <div>
                                <a
                                    href="/integration"
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                                    aria-label={isLoggedIn ? 'Connect your account with GitHub' : 'Get started with Work Hours'}
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    {isLoggedIn ? 'Connect with GitHub' : 'Get Started'}
                                </a>
                            </div>
                        </div>

                        {/* Right column - Visual representation */}
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <div className="border-b border-slate-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-900/50">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-3 w-3 rounded-full bg-rose-500"></div>
                                        <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                        <div className="ml-4 text-xs text-slate-500 dark:text-slate-400">repository-list.txt</div>
                                    </div>
                                </div>
                                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="mb-2 font-mono">$ git status</div>
                                    <div className="mb-2 font-mono text-emerald-600 dark:text-emerald-400">On branch main</div>
                                    <div className="mb-2 font-mono text-emerald-600 dark:text-emerald-400">Your branch is up to date with 'origin/main'</div>
                                    <div className="mb-2 font-mono">$ git log --oneline</div>
                                    <div className="mb-1 font-mono text-sky-600 dark:text-sky-400">a1b2c3d Update README.md</div>
                                    <div className="mb-1 font-mono text-sky-600 dark:text-sky-400">e4f5g6h Fix login bug</div>
                                    <div className="mb-1 font-mono text-sky-600 dark:text-sky-400">i7j8k9l Initial commit</div>
                                    <div className="mb-2 font-mono">$ _</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Jira Integration - Modern style */}
            <section id="featured-integration-jira" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 md:py-16" aria-label="Jira integration">
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <div className="border-b border-slate-100 p-6 dark:border-slate-700">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center">
                                <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                                    <JiraIcon className="h-6 w-6 text-slate-700 dark:text-slate-300" aria-label="Jira logo" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-slate-900 dark:text-slate-100">Jira Integration</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Connect your Jira issues and track your project time</p>
                                </div>
                            </div>
                            <div className="rounded-full bg-sky-50 px-3 py-1 dark:bg-sky-900/20">
                                <span className="text-xs font-medium text-sky-700 dark:text-sky-400">
                                    New Integration
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        {/* Left column - Feature description */}
                        <div>
                            <div className="mb-6 border-l-2 border-slate-200 pl-4 dark:border-slate-600">
                                <p className="text-slate-600 dark:text-slate-400">
                                    Connect your Jira workspace to seamlessly import issues as tasks and track time spent on each issue. Synchronize
                                    your work logs, manage sprints, and improve team productivity with accurate time tracking.
                                </p>
                            </div>

                            <div className="mb-6">
                                <h3 className="mb-3 text-base font-medium text-slate-900 dark:text-slate-200">Key Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                        <span className="mr-1.5">•</span>
                                        Issue Import
                                    </div>
                                    <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                        <span className="mr-1.5">•</span>
                                        Time Logging
                                    </div>
                                </div>
                            </div>

                            <div>
                                <a
                                    href="/jira/connect"
                                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                                    aria-label={isLoggedIn ? 'Connect your account with Jira' : 'Get started with Work Hours'}
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    {isLoggedIn ? 'Connect with Jira' : 'Get Started'}
                                </a>
                            </div>
                        </div>

                        {/* Right column - Visual representation */}
                        <div className="flex items-center justify-center">
                            <div className="w-full max-w-md overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                <div className="border-b border-slate-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-900/50">
                                    <div className="flex items-center">
                                        <div className="mr-2 h-3 w-3 rounded-full bg-rose-500"></div>
                                        <div className="mr-2 h-3 w-3 rounded-full bg-amber-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                        <div className="ml-4 text-xs text-slate-500 dark:text-slate-400">jira-board.txt</div>
                                    </div>
                                </div>
                                <div className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="mb-2 font-medium">Current Sprint: Sprint 24</div>
                                    <div className="mb-2 text-sky-600 dark:text-sky-400">PROJ-123: Implement user authentication</div>
                                    <div className="mb-2 text-amber-600 dark:text-amber-400">PROJ-124: Fix dashboard layout issues</div>
                                    <div className="mb-2 text-emerald-600 dark:text-emerald-400">PROJ-125: Add export functionality</div>
                                    <div className="mb-2 text-slate-500 dark:text-slate-400">Time logged today: 6h 30m</div>
                                    <div className="mb-2 text-slate-500 dark:text-slate-400">Sprint progress: 65%</div>
                                    <div className="mb-2">_</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
