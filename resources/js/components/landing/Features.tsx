import { type SharedData } from '@/types'
import { usePage } from '@inertiajs/react'
import { BarChart2, Briefcase, Clock, DollarSign, Github, Upload, Users } from 'lucide-react'

export default function Features() {
    const { auth } = usePage<SharedData>().props
    const isLoggedIn = auth && auth.user
    return (
        <>
            <section id="features" className="container mx-auto mb-24 px-6 lg:px-8" aria-label="Product features">
                <div className="mb-16 text-center">
                    {/* Timesheet section header */}
                    <div className="relative mx-auto mb-6 w-fit">
                        <div className="border-b-2 border-gray-800/70 px-8 py-2">
                            <span className="font-['Courier_New',monospace] font-bold tracking-widest text-gray-800 uppercase">Features</span>
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-8 w-8 rotate-12 items-center justify-center border-2 border-blue-900/40 bg-blue-100/20">
                            <span className="text-xs font-bold text-blue-900">F</span>
                        </div>
                    </div>

                    <h2 className="mt-4 mb-6 font-['Courier_New',monospace] text-3xl font-bold tracking-tight text-gray-800 uppercase md:text-5xl">
                        Powerful Features
                    </h2>
                    <p className="mx-auto max-w-2xl font-['Courier_New',monospace] text-lg text-gray-700">
                        Everything you need to track, analyze, and optimize your work hours.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* GitHub Integration - Timesheet style */}
                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Form-like header */}
                        <div className="mb-4 border-b border-gray-400 pb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Github className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="flex items-center font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">
                                    GitHub Integration
                                    <span className="ml-2 border border-red-800/40 px-1.5 py-0.5 text-xs font-bold text-red-800/70 uppercase">
                                        Popular
                                    </span>
                                </h3>
                            </div>
                        </div>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Connect GitHub to import repositories as projects and track development time efficiently.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Form-like header */}
                        <div className="mb-4 border-b border-gray-400 pb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Clock className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Time Tracking</h3>
                            </div>
                        </div>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Track time with a single click. Add notes and categorize your activities for better insights. Set timers, track breaks,
                            and monitor overtime automatically.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Form-like header */}
                        <div className="mb-4 border-b border-gray-400 pb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <BarChart2 className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Detailed Reports</h3>
                            </div>
                        </div>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Generate comprehensive reports to analyze your productivity and identify improvement areas. Export data in multiple
                            formats for seamless integration with other tools.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Form-like header */}
                        <div className="mb-4 border-b border-gray-400 pb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Users className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Team Collaboration</h3>
                            </div>
                        </div>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Manage your team's time, assign projects, and track progress all in one place. Real-time updates and notifications keep
                            everyone in sync.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Form-like header */}
                        <div className="mb-4 border-b border-gray-400 pb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Briefcase className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Client Management</h3>
                            </div>
                        </div>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Organize and manage your clients effortlessly. Track client projects, store contact information, and maintain detailed
                            records for better client relationships and billing accuracy.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Form-like header */}
                        <div className="mb-4 border-b border-gray-400 pb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Upload className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="font-['Courier_New',monospace] text-xl font-bold text-gray-800 uppercase">Bulk Upload</h3>
                            </div>
                        </div>
                        <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                            Save time by importing multiple time logs at once. Download a template, fill it with your data, and upload it to quickly
                            record all your work hours in one go.
                        </p>
                    </article>
                </div>
            </section>

            {/* GitHub Integration Section - Timesheet style */}
            <section id="integration" className="container mx-auto mb-16 px-6 lg:px-8" aria-label="GitHub integration">
                <div className="relative border-2 border-gray-300 bg-white p-6">
                    {/* Timesheet form header */}
                    <div className="mb-6 border-b-2 border-gray-400 pb-3">
                        <div className="flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center border-2 border-gray-500 bg-gray-100">
                                <Github className="h-7 w-7 text-gray-700" aria-label="GitHub logo" />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h2 className="font-['Courier_New',monospace] text-2xl font-bold tracking-wide text-gray-800 uppercase">
                                        GitHub Integration
                                    </h2>
                                    <div className="ml-3 -rotate-6 border-2 border-red-800/40 px-2 py-0.5">
                                        <span className="text-xs font-bold tracking-wider text-red-800/70 uppercase">Featured</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-8">
                        <div className="mb-6 md:mb-0 md:w-1/4">
                            {/* Vintage form illustration */}
                            <div className="flex h-full items-center justify-center border border-gray-400 bg-gray-50 p-3">
                                <div className="text-center">
                                    <div className="mb-2 text-4xl text-gray-700">
                                        <span className="font-['Courier_New',monospace]">&lt;/&gt;</span>
                                    </div>
                                    <div className="font-['Courier_New',monospace] text-xs text-gray-600 uppercase">GitHub Repos</div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-3/4">
                            <p className="mb-4 font-['Courier_New',monospace] text-sm text-gray-700">
                                Connect GitHub to import repositories as projects and track development time efficiently.
                            </p>
                            <div className="mb-5 flex flex-wrap gap-3">
                                <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-3 py-1">
                                    <span className="mr-1 font-bold text-gray-700">✓</span>
                                    <span className="font-['Courier_New',monospace] text-xs text-gray-700 uppercase">Repository sync</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-3 py-1">
                                    <span className="mr-1 font-bold text-gray-700">✓</span>
                                    <span className="font-['Courier_New',monospace] text-xs text-gray-700 uppercase">Repository Import</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-3 py-1">
                                    <span className="mr-1 font-bold text-gray-700">✓</span>
                                    <span className="font-['Courier_New',monospace] text-xs text-gray-700 uppercase">Productivity metrics</span>
                                </div>
                            </div>
                            <div>
                                <a
                                    href="/integration"
                                    className="inline-flex items-center border-2 border-blue-900 bg-blue-900 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                                    aria-label={isLoggedIn ? 'Connect your account with GitHub' : 'Get started with Work Hours'}
                                >
                                    <Github className="mr-2 h-4 w-4" />
                                    {isLoggedIn ? 'Connect with GitHub' : 'Get Started'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Currency Management Section - Timesheet style */}
            <section id="currency-management" className="container mx-auto mb-16 px-6 lg:px-8" aria-label="Multiple currency management">
                <div className="relative border-2 border-gray-300 bg-white p-6">
                    {/* Currency symbols as typewritten characters */}
                    <div className="absolute top-4 right-8 font-['Courier_New',monospace] text-4xl text-gray-300">$</div>
                    <div className="absolute bottom-4 left-8 font-['Courier_New',monospace] text-3xl text-gray-300">€</div>

                    {/* Timesheet form header */}
                    <div className="mb-6 border-b-2 border-gray-400 pb-3">
                        <div className="flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center border-2 border-gray-500 bg-gray-100">
                                <DollarSign className="h-7 w-7 text-gray-700" aria-label="Currency icon" />
                            </div>
                            <div>
                                <h2 className="font-['Courier_New',monospace] text-2xl font-bold tracking-wide text-gray-800 uppercase">
                                    Multiple Currency Management
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-8">
                        <div className="mb-6 md:mb-0 md:w-1/4">
                            {/* Vintage form illustration */}
                            <div className="flex h-full items-center justify-center border border-gray-400 bg-gray-50 p-3">
                                <div className="text-center">
                                    <div className="mb-2 flex justify-center space-x-1 text-4xl text-gray-700">
                                        <span className="font-['Courier_New',monospace]">$</span>
                                        <span className="font-['Courier_New',monospace]">€</span>
                                        <span className="font-['Courier_New',monospace]">£</span>
                                    </div>
                                    <div className="font-['Courier_New',monospace] text-xs text-gray-600 uppercase">Currency Options</div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-3/4">
                            <p className="mb-4 font-['Courier_New',monospace] text-sm text-gray-700">
                                Work with multiple currencies across projects and clients. Track earnings in various currencies and generate reports
                                with accurate conversions.
                            </p>
                            <div className="mb-5 flex flex-wrap gap-3">
                                <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-3 py-1">
                                    <span className="mr-1 font-bold text-gray-700">✓</span>
                                    <span className="font-['Courier_New',monospace] text-xs text-gray-700 uppercase">Multi-currency billing</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-3 py-1">
                                    <span className="mr-1 font-bold text-gray-700">✓</span>
                                    <span className="font-['Courier_New',monospace] text-xs text-gray-700 uppercase">Currency conversion</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 bg-gray-50 px-3 py-1">
                                    <span className="mr-1 font-bold text-gray-700">✓</span>
                                    <span className="font-['Courier_New',monospace] text-xs text-gray-700 uppercase">Global reporting</span>
                                </div>
                            </div>
                            <div>
                                <a
                                    href={isLoggedIn ? '/settings/currency' : '/register'}
                                    className="inline-flex items-center border-2 border-blue-900 bg-blue-900 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-800"
                                    aria-label={isLoggedIn ? 'Manage your currencies' : 'Get started with Work Hours'}
                                >
                                    {isLoggedIn ? 'Manage Currencies' : 'Get Started'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
