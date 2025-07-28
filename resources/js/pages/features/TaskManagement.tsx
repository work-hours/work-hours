import FeatureLayout from '@/components/features/FeatureLayout'
import { Calendar, CheckCircle, CheckSquare, Clock, List, Users } from 'lucide-react'

export default function TaskManagement() {
    return (
        <FeatureLayout title="Task Management" icon={<CheckSquare className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* New Feature Badge */}
                <div className="inline-flex items-center rounded-none border border-red-800/40 px-3 py-1 text-sm font-bold text-red-800/70 uppercase dark:border-red-400/40 dark:text-red-400/90">
                    New Feature
                </div>

                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Create, assign, and track tasks efficiently with our comprehensive task management system. Organize your work with priorities,
                        due dates, and detailed descriptions to keep your team aligned and projects on schedule.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Use task templates for recurring work to save time and ensure consistency
                            in your task creation process.
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
                                    <CheckSquare className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Task Tracking</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Monitor task progress with customizable statuses and completion tracking for better project oversight.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Users className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Task Assignment</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Assign tasks to team members with clear responsibilities, deadlines, and priority levels.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Calendar className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Due Dates & Reminders</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Set deadlines with automated reminders to ensure tasks are completed on time.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Clock className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Time Tracking Integration</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Track time spent on tasks directly, providing accurate data for billing and productivity analysis.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Task Management Features Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Task Organization
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <List className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Custom Task Lists</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Create multiple task lists organized by project, department, or any custom category you need.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <CheckSquare className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Task Dependencies</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Set up task dependencies to ensure work is completed in the correct sequence for complex projects.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <Users className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Collaborative Tasks</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Enable team collaboration with comments, file attachments, and shared task visibility.
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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Create Tasks</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Create new tasks with titles, descriptions, priorities, and estimated completion times.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Assign & Schedule</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Assign tasks to team members and set due dates to establish clear responsibilities and timelines.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track Progress</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Monitor task status as team members update their progress, with real-time notifications for status changes.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Review & Report</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Generate reports on task completion rates, time spent, and team productivity to optimize your workflow.
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
                            <p className="text-gray-700 dark:text-gray-300">Improved team coordination and accountability</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduced time spent on project management</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Better deadline management and on-time delivery</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Clear visibility into project progress and bottlenecks</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Seamless integration with time tracking for billing</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Enhanced team collaboration and communication</p>
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
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Project Management</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Break down complex projects into manageable tasks, assign them to team members, and track progress to ensure timely
                                completion and clear accountability.
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Client Deliverables</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Create tasks for client deliverables with clear deadlines, track time spent for accurate billing, and ensure nothing
                                falls through the cracks in your client work.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Streamline Your Task Management?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and start organizing your work more efficiently.
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
