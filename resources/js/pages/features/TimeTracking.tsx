import FeatureLayout from '@/components/features/FeatureLayout'
import { AlertCircle, BarChart2, CheckCircle, Clock, FileText, Users } from 'lucide-react'

export default function TimeTracking() {
    return (
        <FeatureLayout title="Time Tracking" icon={<Clock className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Track your work hours effortlessly with our intuitive time tracking feature. Whether you're a freelancer, a team member, or a
                        manager, our time tracking tool helps you maintain accurate records of your work time.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Use keyboard shortcuts (Ctrl+Shift+T) to quickly start or stop the timer
                            without interrupting your workflow.
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
                                    <Clock className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">One-Click Tracking</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Start and stop your timer with a single click. No complicated setup required.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <CheckCircle className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Detailed Notes</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">Add notes to your time entries to keep track of what you worked on.</p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <AlertCircle className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Idle Detection</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Our system detects when you're idle and asks if you want to keep or discard the idle time.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Clock className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Manual Time Entry</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Forgot to start the timer? No problem. Add time entries manually with our easy-to-use form.
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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Select a Project</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Choose the project you're working on from the dropdown menu. You can also create a new project if needed.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Start the Timer</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Click the "Start" button to begin tracking your time. The timer will run in the background while you work.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Add Notes</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    While the timer is running, you can add notes about what you're working on. This helps with detailed reporting
                                    later.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Stop the Timer</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    When you're done, click "Stop" to end the time entry. Your time will be automatically saved to your account.
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
                            <p className="text-gray-700 dark:text-gray-300">Accurate billing for clients</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved productivity tracking</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Better project management</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Transparent reporting for teams</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Identify time-consuming tasks</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduce administrative overhead</p>
                        </div>
                    </div>
                </section>

                {/* Integration Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Integrations
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">Our time tracking system integrates seamlessly with other Work Hours features:</p>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-2 flex items-center">
                                <FileText className="mr-2 h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Project Management</h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">Link time entries directly to specific projects and tasks.</p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-2 flex items-center">
                                <BarChart2 className="mr-2 h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Reporting</h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Generate detailed time reports for analysis and client billing.
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-2 flex items-center">
                                <Users className="mr-2 h-5 w-5 text-blue-900 dark:text-blue-400" />
                                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Team Collaboration</h3>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                Share time tracking data with team members for better coordination.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Track Your Time?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and start tracking your time more efficiently.
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
