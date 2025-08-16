import { Clock, FolderPlus, UserPlus, Users, Zap } from 'lucide-react'

export default function HowItWorks() {
    return (
        <section className="relative w-full" aria-label="How to use Work Hours">
            <div className="mb-14 text-center">
                <span className="mb-3 inline-block text-sm font-medium text-gray-500 dark:text-gray-400">HOW IT WORKS</span>
                <h2 className="mb-4 text-3xl font-medium text-gray-900 md:text-4xl dark:text-gray-100">Four steps to improved productivity</h2>
                <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">Get started quickly and see results right away</p>
            </div>

            <div className="relative">
                <div
                    className="absolute top-12 left-1/2 hidden h-[calc(100%-80px)] w-0 -translate-x-1/2 border-l border-gray-200 lg:block dark:border-gray-800"
                    aria-hidden="true"
                ></div>

                <ol className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-900 dark:bg-gray-800/80 dark:text-gray-200"
                            aria-hidden="true"
                        >
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <span className="mb-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white dark:bg-gray-700">
                            1
                        </span>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-200">Create Your Account</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sign up for free in less than a minute. No credit card required.</p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-900 dark:bg-gray-800/80 dark:text-gray-200"
                            aria-hidden="true"
                        >
                            <FolderPlus className="h-6 w-6" />
                        </div>
                        <span className="mb-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white dark:bg-gray-700">
                            2
                        </span>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-200">Set Up Projects</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Create projects and customize your workspace to match your workflow.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-900 dark:bg-gray-800/80 dark:text-gray-200"
                            aria-hidden="true"
                        >
                            <Users className="h-6 w-6" />
                        </div>
                        <span className="mb-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white dark:bg-gray-700">
                            3
                        </span>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-200">Build Your Team</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Invite team members and assign them to projects for collaboration.</p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-900 dark:bg-gray-800/80 dark:text-gray-200"
                            aria-hidden="true"
                        >
                            <Clock className="h-6 w-6" />
                        </div>
                        <span className="mb-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-medium text-white dark:bg-gray-700">
                            4
                        </span>
                        <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-200">Track Time</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Track time effortlessly and gain insights to optimize your productivity.
                        </p>
                    </li>
                </ol>
            </div>

            <div className="mt-16 flex justify-center">
                <div className="inline-flex items-center gap-2 rounded-md bg-gray-50 px-4 py-3 dark:bg-gray-800/50" role="note">
                    <Zap className="h-5 w-5 text-gray-500 dark:text-gray-400" aria-hidden="true" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Most users are up and running in less than 10 minutes
                    </span>
                </div>
            </div>
        </section>
    )
}
