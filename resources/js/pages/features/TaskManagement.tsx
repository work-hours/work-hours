import FeatureLayout from '@/components/features/FeatureLayout'
import { Calendar, CheckCircle, CheckSquare, List, Users } from 'lucide-react'

export default function TaskManagement() {
    return (
        <FeatureLayout title="Task Management" icon={<CheckSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                {/* New Feature Badge */}
                <div className="inline-flex items-center rounded-md border border-rose-600/30 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-700 uppercase dark:border-rose-500/30 dark:bg-rose-900/20 dark:text-rose-400">
                    New Feature
                </div>

                {/* Introduction Section */}
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Create, assign, and track tasks efficiently with our comprehensive task management system. Organize your work with priorities,
                        due dates, and detailed descriptions to keep your team aligned and projects on schedule.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2">
                                <CheckSquare className="h-5 w-5" />
                            </span>
                            <span>
                                <span className="font-medium">Pro Tip:</span> Use task templates for recurring work to save time and ensure
                                consistency in your task creation process.
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
                                    <CheckSquare className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Task Tracking</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Monitor task progress with customizable statuses and completion tracking for better project oversight.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Task Assignment</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Assign tasks to team members with clear responsibilities, deadlines, and priority levels.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Due Dates & Reminders</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Set deadlines with automated reminders to ensure tasks are completed on time.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <List className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Task Organization</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Group tasks by project, category, or priority with drag-and-drop functionality for easy management.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Task Views Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Task Views
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">List View</h3>
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <List className="h-8 w-8" />
                                </div>
                            </div>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Traditional list format showing all task details in a compact, scannable layout.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Kanban Board</h3>
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <CheckSquare className="h-8 w-8" />
                                </div>
                            </div>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Visual board with columns representing task statuses for drag-and-drop workflow management.
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Calendar View</h3>
                            <div className="mb-4 flex justify-center">
                                <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Calendar className="h-8 w-8" />
                                </div>
                            </div>
                            <p className="text-center text-gray-600 dark:text-gray-400">
                                Schedule-based view showing tasks by due dates in a monthly, weekly, or daily calendar format.
                            </p>
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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Create Tasks</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Create detailed tasks with titles, descriptions, priorities, and estimated completion time.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Assign & Organize</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Assign tasks to team members and organize them by project, category, or priority level.
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
                                    Monitor task status, track time spent, and update progress as work is completed.
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
                                    Generate reports on task completion, time spent, and team productivity for better project insights.
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
                            <p className="text-gray-700 dark:text-gray-300">Better task organization and project visibility</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduced missed deadlines and improved accountability</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Clear task ownership and responsibility assignment</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Streamlined workflow with prioritized task management</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Enhanced team collaboration and communication</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Accurate time tracking linked directly to specific tasks</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Streamline Your Tasks?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Start using our task management system today and bring clarity to your project workflow.
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
