import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section className="relative w-full py-20 md:py-28 bg-gray-50 dark:bg-gray-900/50">
            <div className="mx-auto w-11/12 max-w-3xl">
                <div className="relative overflow-hidden rounded-lg border border-gray-200/70 bg-white p-10 shadow-sm dark:border-gray-800/70 dark:bg-gray-800/90">
                    <div className="mb-8 text-left">
                        <h2 className="text-2xl font-medium text-gray-900 md:text-3xl dark:text-gray-100">
                            Focus on what matters.
                            <span className="block mt-1 text-gray-500 dark:text-gray-400">Let us handle the time tracking.</span>
                        </h2>
                    </div>

                    <p className="mb-10 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                        Join professionals who have simplified their workflow and increased productivity with our minimalist time tracking solution.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                        >
                            Start for free
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></div>
                            No credit card required
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
