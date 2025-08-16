import { Link } from '@inertiajs/react'
import { ArrowRight, ChevronRight, Clock } from 'lucide-react'

export default function Hero() {
    return (
        <section className="w-full py-16 md:py-24" aria-label="Hero section">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <div className="mb-6 rounded-full bg-neutral-100 px-4 py-1.5 dark:bg-neutral-800/80">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Time Tracking & Insights</span>
                    </div>

                    <h1 className="mb-6 text-center text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-neutral-100">
                        Track Your Work Hours
                        <span className="block text-neutral-600 dark:text-neutral-300">Effortlessly</span>
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-neutral-600 md:text-xl dark:text-neutral-400">
                        A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain
                        valuable insights into how you spend your time.
                    </p>

                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-5 py-3 text-base font-medium text-white shadow-sm transition-all duration-200 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            aria-label="Start using Work Hours for free"
                        >
                            Start for free
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-5 py-3 text-base font-medium text-neutral-700 shadow-sm transition-all duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            aria-label="Learn more about Work Hours features"
                        >
                            Explore features
                            <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4" aria-label="Key statistics">
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-neutral-900 dark:text-neutral-200">10k+</span>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Active Users</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-neutral-900 dark:text-neutral-200">5M+</span>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Hours Tracked</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-neutral-900 dark:text-neutral-200">98%</span>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Customer Satisfaction</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-light text-neutral-900 dark:text-neutral-200">30%</span>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Productivity Boost</span>
                        </div>
                    </div>

                    <div className="mt-16 flex flex-wrap items-center justify-center gap-6" aria-label="Key benefits">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Clock className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Clock className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Free for all</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <Clock className="h-3.5 w-3.5 text-neutral-700 dark:text-neutral-300" aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
