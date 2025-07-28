import FeatureLayout from '@/components/features/FeatureLayout'
import { Users, MessageSquare, Calendar, Bell, Share2, Shield } from 'lucide-react'

export default function TeamCollaboration() {
    return (
        <FeatureLayout title="Team Collaboration" icon={<Users className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Enhance your team's productivity with our powerful collaboration tools. Work Hours makes it easy for teams of any size to
                        coordinate, communicate, and track progress on projects together.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Set up team dashboards to get a quick overview of everyone's current tasks
                            and progress at a glance.
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
                                    <Users className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Team Management</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Create teams, assign roles, and manage permissions to ensure everyone has access to what they need.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <MessageSquare className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Comments & Notes</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Leave comments on time entries and projects to provide context and updates to team members.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Calendar className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Shared Calendars</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                View team schedules, deadlines, and availability in a unified calendar interface.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Bell className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Real-time Notifications</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Stay informed with instant notifications about project updates, comments, and team activities.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Collaboration Tools Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Collaboration Tools
                    </h2>
                    <div className="rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                        <div className="grid gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Team Dashboard</h3>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Get a comprehensive view of your team's activities, including:
                                </p>
                                <ul className="space-y-2 pl-5">
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Current active tasks for each team member</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Weekly and monthly time summaries</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Project progress indicators</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Upcoming deadlines and milestones</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">Workload Management</h3>
                                <p className="mb-4 text-gray-700 dark:text-gray-300">
                                    Optimize your team's workload with tools designed to:
                                </p>
                                <ul className="space-y-2 pl-5">
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Visualize capacity and availability</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Balance tasks across team members</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Identify bottlenecks and overallocations</span>
                                    </li>
                                    <li className="flex items-start">
                                        <div className="mr-2 mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-900 dark:bg-blue-400"></div>
                                        <span className="text-gray-700 dark:text-gray-300">Plan resources for upcoming projects</span>
                                    </li>
                                </ul>
                            </div>
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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Create Your Team</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Set up your team structure and invite members via email. Assign roles and permissions based on responsibilities.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Assign Projects & Tasks</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Distribute work among team members. Set deadlines, priorities, and estimated hours for each task.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track Progress Together</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Monitor real-time updates as team members log their time. Add comments and notes to provide context and feedback.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Analyze & Optimize</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Generate team reports to identify trends, bottlenecks, and opportunities for improvement in your collaborative workflow.
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
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="flex">
                            <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20">
                                <Share2 className="h-6 w-6 text-blue-900 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Improved Communication</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Reduce misunderstandings and keep everyone on the same page with centralized project information.
                                </p>
                            </div>
                        </div>
                        <div className="flex">
                            <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20">
                                <Shield className="h-6 w-6 text-blue-900 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Accountability</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Create a culture of responsibility with transparent tracking of tasks, time, and contributions.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mb-0 md:mr-6 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Boost Team Productivity?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and transform how your team works together.
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
