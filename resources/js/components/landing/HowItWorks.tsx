import { Clock, FolderPlus, UserPlus, Users, Zap } from 'lucide-react'

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative container mx-auto mb-24 px-6 lg:px-8" aria-label="How to use Work Hours">
            {/* Timesheet section header */}
            <div className="mb-16 text-center">
                <div className="relative mx-auto mb-6 w-fit">
                    <div className="border-b-2 border-gray-800/70 px-8 py-2">
                        <span className="font-['Courier_New',monospace] font-bold tracking-widest text-gray-800 uppercase">Instructions</span>
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 rotate-12 items-center justify-center border-2 border-blue-900/40 bg-blue-100/20">
                        <span className="text-xs font-bold text-blue-900">I</span>
                    </div>
                </div>

                <h2 className="mb-4 font-['Courier_New',monospace] text-3xl font-bold tracking-tight text-gray-800 uppercase md:text-5xl">
                    How It Works
                </h2>
                <p className="mx-auto max-w-2xl font-['Courier_New',monospace] text-lg text-gray-700">
                    Get started with Work Hours in four simple steps
                </p>
            </div>

            {/* Process steps with connecting lines - timesheet style */}
            <div className="relative">
                {/* Connecting line for desktop - dotted line like a form */}
                <div
                    className="absolute top-24 left-1/2 hidden h-[calc(100%-120px)] w-0 -translate-x-1/2 border-l-2 border-dashed border-gray-400/50 lg:block"
                    aria-hidden="true"
                ></div>

                {/* Connecting lines for tablet - dotted line like a form */}
                <div
                    className="absolute top-24 left-1/2 hidden h-[calc(100%-120px)] w-0 -translate-x-1/2 border-l-2 border-dashed border-gray-400/50 md:block lg:hidden"
                    aria-hidden="true"
                ></div>

                <ol className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-['Courier_New',monospace] text-2xl font-bold">1</span>
                                <UserPlus className="mt-1 h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="mb-3 font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Create Your Account</h3>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Sign up for free in less than a minute. No credit card required to get started with our basic plan.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-['Courier_New',monospace] text-2xl font-bold">2</span>
                                <FolderPlus className="mt-1 h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="mb-3 font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Set Up Your Projects</h3>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Create or import projects and customize your workspace to match your workflow and business needs.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-['Courier_New',monospace] text-2xl font-bold">3</span>
                                <Users className="mt-1 h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="mb-3 font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Build Your Team</h3>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Invite team members, assign them to projects, and set hourly rates for accurate time tracking.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="font-['Courier_New',monospace] text-2xl font-bold">4</span>
                                <Clock className="mt-1 h-6 w-6" />
                            </div>
                        </div>
                        <h3 className="mb-3 font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Start Tracking Time</h3>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Track time with a single click, generate reports, and optimize your productivity with data-driven insights.
                        </p>
                    </li>
                </ol>
            </div>

            <div className="mt-16 flex justify-center">
                <div className="relative border-2 border-gray-400 bg-yellow-50/50 px-6 py-3 text-center" role="note">
                    {/* Rubber stamp effect */}
                    <div className="absolute -top-3 -right-3 rotate-12">
                        <div className="border-2 border-red-800/40 bg-white px-2 py-0.5">
                            <span className="text-xs font-bold tracking-wider text-red-800/70 uppercase">Note</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-gray-700" aria-hidden="true" />
                        <span className="font-['Courier_New',monospace] text-sm font-bold">
                            Most users are up and running in less than 10 minutes!
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
