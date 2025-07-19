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
                    <div className="relative mx-auto w-fit mb-6">
                        <div className="border-b-2 border-gray-800/70 px-8 py-2">
                            <span className="font-['Courier_New',monospace] uppercase text-gray-800 font-bold tracking-widest">
                                Features
                            </span>
                        </div>
                        <div className="absolute -right-2 -top-2 h-8 w-8 border-2 border-blue-900/40 flex items-center justify-center bg-blue-100/20 rotate-12">
                            <span className="text-blue-900 text-xs font-bold">F</span>
                        </div>
                    </div>

                    <h2 className="mt-4 mb-6 text-3xl font-bold tracking-tight text-gray-800 uppercase font-['Courier_New',monospace] md:text-5xl">
                        Powerful Features
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-700 font-['Courier_New',monospace]">
                        Everything you need to track, analyze, and optimize your work hours.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* GitHub Integration - Timesheet style */}
                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                        {/* Form-like header */}
                        <div className="border-b border-gray-400 pb-4 mb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Github className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase flex items-center">
                                    GitHub Integration
                                    <span className="ml-2 border border-red-800/40 px-1.5 py-0.5 text-xs font-bold text-red-800/70 uppercase">
                                        Popular
                                    </span>
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            Connect GitHub to import repositories as projects and track development time efficiently.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                        {/* Form-like header */}
                        <div className="border-b border-gray-400 pb-4 mb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Clock className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                    Time Tracking
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            Track time with a single click. Add notes and categorize your activities for better insights. Set timers, track breaks,
                            and monitor overtime automatically.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                        {/* Form-like header */}
                        <div className="border-b border-gray-400 pb-4 mb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <BarChart2 className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                    Detailed Reports
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            Generate comprehensive reports to analyze your productivity and identify improvement areas. Export data in multiple
                            formats for seamless integration with other tools.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                        {/* Form-like header */}
                        <div className="border-b border-gray-400 pb-4 mb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Users className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                    Team Collaboration
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            Manage your team's time, assign projects, and track progress all in one place. Real-time updates and notifications keep
                            everyone in sync.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                        {/* Form-like header */}
                        <div className="border-b border-gray-400 pb-4 mb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Briefcase className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                    Client Management
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            Organize and manage your clients effortlessly. Track client projects, store contact information, and maintain detailed
                            records for better client relationships and billing accuracy.
                        </p>
                    </article>

                    <article className="group relative border-2 border-gray-300 bg-white p-6 transition-all">
                        {/* Corner fold effect */}
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                        {/* Form-like header */}
                        <div className="border-b border-gray-400 pb-4 mb-4">
                            <div className="flex items-center">
                                <div className="mr-3 flex h-10 w-10 items-center justify-center border border-gray-400 bg-gray-100">
                                    <Upload className="h-6 w-6 text-gray-700" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase">
                                    Bulk Upload
                                </h3>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 font-['Courier_New',monospace]">
                            Save time by importing multiple time logs at once. Download a template, fill it with your data, and upload it to quickly
                            record all your work hours in one go.
                        </p>
                    </article>
                </div>
            </section>

            {/* GitHub Integration Section - Timesheet style */}
            <section id="integration" className="container mx-auto mb-16 px-6 lg:px-8" aria-label="GitHub integration">
                <div className="relative border-2 border-gray-300 bg-white p-6">
                    {/* Corner fold effect */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-gray-400 border-r-transparent"></div>

                    {/* Timesheet form header */}
                    <div className="border-b-2 border-gray-400 pb-3 mb-6">
                        <div className="flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center border-2 border-gray-500 bg-gray-100">
                                <Github className="h-7 w-7 text-gray-700" aria-label="GitHub logo" />
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h2 className="text-2xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase tracking-wide">
                                        GitHub Integration
                                    </h2>
                                    <div className="ml-3 -rotate-6 border-2 border-red-800/40 px-2 py-0.5">
                                        <span className="text-xs font-bold text-red-800/70 uppercase tracking-wider">Featured</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-8">
                        <div className="md:w-1/4 mb-6 md:mb-0">
                            {/* Vintage form illustration */}
                            <div className="border border-gray-400 p-3 bg-gray-50 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2 text-gray-700">
                                        <span className="font-['Courier_New',monospace]">&lt;/&gt;</span>
                                    </div>
                                    <div className="text-xs text-gray-600 font-['Courier_New',monospace] uppercase">
                                        GitHub Repos
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-3/4">
                            <p className="text-sm text-gray-700 font-['Courier_New',monospace] mb-4">
                                Connect GitHub to import repositories as projects and track development time efficiently.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-5">
                                <div className="inline-flex items-center border border-gray-400 px-3 py-1 bg-gray-50">
                                    <span className="mr-1 text-gray-700 font-bold">✓</span>
                                    <span className="text-xs text-gray-700 font-['Courier_New',monospace] uppercase">Repository sync</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 px-3 py-1 bg-gray-50">
                                    <span className="mr-1 text-gray-700 font-bold">✓</span>
                                    <span className="text-xs text-gray-700 font-['Courier_New',monospace] uppercase">Repository Import</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 px-3 py-1 bg-gray-50">
                                    <span className="mr-1 text-gray-700 font-bold">✓</span>
                                    <span className="text-xs text-gray-700 font-['Courier_New',monospace] uppercase">Productivity metrics</span>
                                </div>
                            </div>
                            <div>
                                <a
                                    href="/integration"
                                    className="inline-flex items-center bg-blue-900 px-6 py-2 text-sm font-bold text-white border-2 border-blue-900 hover:bg-blue-800 transition-colors"
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
                    {/* Corner fold effect */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-gray-400 border-r-transparent"></div>

                    {/* Currency symbols as typewritten characters */}
                    <div className="absolute top-4 right-8 text-gray-300 text-4xl font-['Courier_New',monospace]">$</div>
                    <div className="absolute bottom-4 left-8 text-gray-300 text-3xl font-['Courier_New',monospace]">€</div>

                    {/* Timesheet form header */}
                    <div className="border-b-2 border-gray-400 pb-3 mb-6">
                        <div className="flex items-center">
                            <div className="mr-4 flex h-12 w-12 items-center justify-center border-2 border-gray-500 bg-gray-100">
                                <DollarSign className="h-7 w-7 text-gray-700" aria-label="Currency icon" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 font-['Courier_New',monospace] uppercase tracking-wide">
                                    Multiple Currency Management
                                </h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:gap-8">
                        <div className="md:w-1/4 mb-6 md:mb-0">
                            {/* Vintage form illustration */}
                            <div className="border border-gray-400 p-3 bg-gray-50 h-full flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2 text-gray-700 flex justify-center space-x-1">
                                        <span className="font-['Courier_New',monospace]">$</span>
                                        <span className="font-['Courier_New',monospace]">€</span>
                                        <span className="font-['Courier_New',monospace]">£</span>
                                    </div>
                                    <div className="text-xs text-gray-600 font-['Courier_New',monospace] uppercase">
                                        Currency Options
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-3/4">
                            <p className="text-sm text-gray-700 font-['Courier_New',monospace] mb-4">
                                Work with multiple currencies across projects and clients. Track earnings in various currencies and generate reports with accurate conversions.
                            </p>
                            <div className="flex flex-wrap gap-3 mb-5">
                                <div className="inline-flex items-center border border-gray-400 px-3 py-1 bg-gray-50">
                                    <span className="mr-1 text-gray-700 font-bold">✓</span>
                                    <span className="text-xs text-gray-700 font-['Courier_New',monospace] uppercase">Multi-currency billing</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 px-3 py-1 bg-gray-50">
                                    <span className="mr-1 text-gray-700 font-bold">✓</span>
                                    <span className="text-xs text-gray-700 font-['Courier_New',monospace] uppercase">Currency conversion</span>
                                </div>
                                <div className="inline-flex items-center border border-gray-400 px-3 py-1 bg-gray-50">
                                    <span className="mr-1 text-gray-700 font-bold">✓</span>
                                    <span className="text-xs text-gray-700 font-['Courier_New',monospace] uppercase">Global reporting</span>
                                </div>
                            </div>
                            <div>
                                <a
                                    href={isLoggedIn ? "/settings/currency" : "/register"}
                                    className="inline-flex items-center bg-blue-900 px-6 py-2 text-sm font-bold text-white border-2 border-blue-900 hover:bg-blue-800 transition-colors"
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
