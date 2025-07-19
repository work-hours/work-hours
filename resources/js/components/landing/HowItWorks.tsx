import { Clock, FolderPlus, UserPlus, Users, Zap } from 'lucide-react'

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="relative container mx-auto mb-24 px-6 lg:px-8" aria-label="How to use Work Hours">
            {/* Timesheet section header */}
            <div className="mb-16 text-center">
                <div className="relative mx-auto w-fit mb-6">
                    <div className="border-b-2 border-gray-800/70 px-8 py-2">
                        <span className="font-['Courier_New',monospace] uppercase text-gray-800 font-bold tracking-widest">
                            Instructions
                        </span>
                    </div>
                    <div className="absolute -right-2 -top-2 h-8 w-8 border-2 border-blue-900/40 flex items-center justify-center bg-blue-100/20 rotate-12">
                        <span className="text-blue-900 text-xs font-bold">I</span>
                    </div>
                </div>

                <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-800 uppercase font-['Courier_New',monospace] md:text-5xl">
                    How It Works
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-700 font-['Courier_New',monospace]">
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
                                <span className="text-2xl font-bold font-['Courier_New',monospace]">1</span>
                                <UserPlus className="h-6 w-6 mt-1" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-800 uppercase font-['Courier_New',monospace]">Create Your Account</h3>
                        <p className="text-gray-700 font-['Courier_New',monospace] text-sm">
                            Sign up for free in less than a minute. No credit card required to get started with our basic plan.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold font-['Courier_New',monospace]">2</span>
                                <FolderPlus className="h-6 w-6 mt-1" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-800 uppercase font-['Courier_New',monospace]">Set Up Your Projects</h3>
                        <p className="text-gray-700 font-['Courier_New',monospace] text-sm">
                            Create or import projects and customize your workspace to match your workflow and business needs.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold font-['Courier_New',monospace]">3</span>
                                <Users className="h-6 w-6 mt-1" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-800 uppercase font-['Courier_New',monospace]">Build Your Team</h3>
                        <p className="text-gray-700 font-['Courier_New',monospace] text-sm">
                            Invite team members, assign them to projects, and set hourly rates for accurate time tracking.
                        </p>
                    </li>

                    <li className="group relative flex flex-col items-center text-center">
                        <div
                            className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-gray-700 bg-white text-gray-800"
                            aria-hidden="true"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold font-['Courier_New',monospace]">4</span>
                                <Clock className="h-6 w-6 mt-1" />
                            </div>
                        </div>
                        <h3 className="mb-3 text-xl font-bold text-gray-800 uppercase font-['Courier_New',monospace]">Start Tracking Time</h3>
                        <p className="text-gray-700 font-['Courier_New',monospace] text-sm">
                            Track time with a single click, generate reports, and optimize your productivity with data-driven insights.
                        </p>
                    </li>
                </ol>
            </div>

            <div className="mt-16 flex justify-center">
                <div
                    className="relative border-2 border-gray-400 bg-yellow-50/50 px-6 py-3 text-center"
                    role="note"
                >
                    {/* Rubber stamp effect */}
                    <div className="absolute -top-3 -right-3 rotate-12">
                        <div className="border-2 border-red-800/40 px-2 py-0.5 bg-white">
                            <span className="text-xs font-bold text-red-800/70 uppercase tracking-wider">Note</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-gray-700" aria-hidden="true" />
                        <span className="text-sm font-bold font-['Courier_New',monospace]">Most users are up and running in less than 10 minutes!</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
