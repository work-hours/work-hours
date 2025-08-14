import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section className="relative w-full bg-gray-50 dark:bg-gray-900/50">
            <div className="mx-auto">
                <div className="relative overflow-hidden rounded-lg border border-gray-200/70 bg-white p-10 shadow-sm dark:border-gray-800/70 dark:bg-gray-800/90">
                    <div className="mb-8 text-left">
                        <h2 className="text-2xl font-medium text-gray-900 md:text-3xl dark:text-gray-100">
                            Focus on what matters.
                            <span className="mt-1 block text-gray-500 dark:text-gray-400">Let us handle the time tracking.</span>
                        </h2>
                    </div>

                    <p className="mb-10 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                        Join professionals who have simplified their workflow and increased productivity with our minimalist time tracking solution.
                    </p>

                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900"
                        >
                            Start for free
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            <div className="mr-2 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                            No credit card required
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
