import { Link } from '@inertiajs/react'
import { ArrowRight, Clock, ChevronRight } from 'lucide-react'

export default function Hero() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Hero section">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    {/* Subtle tag line */}
                    <div className="mb-6 rounded-full bg-slate-100 px-4 py-1.5 dark:bg-slate-800">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Time Tracking & Insights
                        </span>
                    </div>

                    {/* Main heading with minimalist style */}
                    <h1 className="mb-6 text-center text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-slate-100">
                        Track Your Work Hours
                        <span className="block text-slate-600 dark:text-slate-300">Effortlessly</span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-slate-600 md:text-xl dark:text-slate-400">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain
                        valuable insights into how you spend your time.
                    </p>

                    {/* Clean, minimal CTAs */}
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600"
                            aria-label="Start using Work Hours for free"
                        >
                            Start for free
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-base font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            aria-label="Learn more about Work Hours features"
                        >
                            Explore features
                            <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Simplified statistics section */}
                    <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4" aria-label="Key statistics">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-slate-900 dark:text-slate-200">10k+</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Active Users</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-slate-900 dark:text-slate-200">5M+</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Hours Tracked</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-slate-900 dark:text-slate-200">98%</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Customer Satisfaction</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-slate-900 dark:text-slate-200">30%</span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">Productivity Boost</span>
                        </div>
                    </div>

                    {/* Simplified benefits section */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-6" aria-label="Key benefits">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <Clock className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <Clock className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Free for all</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                <Clock className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
