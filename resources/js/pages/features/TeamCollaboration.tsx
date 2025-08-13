import FeatureLayout from '@/components/features/FeatureLayout'
import { Bell, Calendar, CheckCircle, MessageSquare, Users } from 'lucide-react'

export default function TeamCollaboration() {
    return (
        <FeatureLayout title="Team Collaboration" icon={<Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-10">
                {/* Introduction Section */}
                <section className="space-y-5">
                    <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                        Enhance your team's productivity with our powerful collaboration tools. Work Hours makes it easy for teams of any size to
                        coordinate, communicate, and track progress on projects together.
                    </p>
                    <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 dark:border-blue-900/30 dark:bg-blue-900/10">
                        <p className="flex items-center text-blue-700 dark:text-blue-300">
                            <span className="mr-2"><Users className="h-5 w-5" /></span>
                            <span><span className="font-medium">Pro Tip:</span> Set up team dashboards to get a quick overview of everyone's current tasks
                            and progress at a glance.</span>
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
                                    <Users className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Team Management</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Create teams, assign roles, and manage permissions to ensure everyone has access to what they need.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Comments & Notes</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Leave comments on time entries and projects to provide context and updates to team members.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Shared Calendars</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                View team schedules, deadlines, and availability in a unified calendar interface.
                            </p>
                        </div>

                        <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-900">
                            <div className="mb-4 flex items-center">
                                <div className="mr-4 rounded-full bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                                    <Bell className="h-5 w-5" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">Real-time Notifications</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Stay informed with instant notifications about team activities, comments, and updates.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        How Team Collaboration Works
                    </h2>
                    <ol className="space-y-6">
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                1
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Create Your Team</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Set up your team by inviting members via email. Assign roles and permissions based on their responsibilities.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Assign Projects</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Distribute projects and tasks among team members, setting deadlines and priorities.
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
                                    Monitor real-time updates as team members track their time and complete tasks.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Collaborate & Communicate</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Use comments, notes, and notifications to maintain clear communication throughout the project lifecycle.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                {/* Benefits Section */}
                <section className="space-y-6">
                    <h2 className="border-b border-gray-200 pb-3 text-2xl font-semibold text-gray-800 dark:border-gray-700 dark:text-gray-100">
                        Benefits of Team Collaboration
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved coordination across team members</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Enhanced accountability with transparent tracking</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduced miscommunication and project delays</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Easier resource allocation and workload balancing</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">More accurate project estimations and planning</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Centralized information accessible to all team members</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border-2 border-blue-900 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Boost Team Productivity?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Start using our team collaboration tools today and see how much more your team can accomplish.
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
