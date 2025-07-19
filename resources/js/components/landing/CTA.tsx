import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section className="relative w-full border-y border-gray-300/20 dark:border-gray-700/20 bg-[#f8f6e9] dark:bg-gray-900 py-16 md:py-24">
            {/* Timesheet punch holes on the left side only (matching main page) */}
            <div
                className="absolute top-0 bottom-0 left-4 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.07)_3px,transparent_3px)] dark:bg-[radial-gradient(circle,rgba(255,255,255,0.07)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y"
                aria-hidden="true"
            ></div>

            {/* Typewriter-style form */}
            <div className="mx-auto w-9/12 max-w-3xl">
                <div className="relative border border-gray-300/60 dark:border-gray-700/60 bg-[#f8f6e9]/80 dark:bg-gray-800/80 p-8 text-center">
                    {/* Corner fold effect - more subtle */}
                    <div className="absolute top-0 right-0 h-0 w-0 border-t-[20px] border-r-[20px] border-t-gray-300/70 dark:border-t-gray-600/70 border-r-transparent"></div>

                    {/* Form header */}
                    <div className="mb-6 border-b border-gray-400/40 dark:border-gray-600/40 pb-4">
                        <h2 className="font-['Courier_New',monospace] text-3xl font-bold tracking-wide text-gray-800 dark:text-gray-200 uppercase md:text-4xl">
                            Ready to Optimize Your Time?
                        </h2>
                    </div>

                    <p className="mx-auto mb-10 max-w-2xl font-['Courier_New',monospace] text-lg text-gray-700 dark:text-gray-300">
                        Join thousands of professionals who have transformed how they track and manage their time.
                    </p>

                    {/* Signature line - more subtle */}
                    <div className="mx-auto mb-8 w-64 border-b border-gray-400/30 dark:border-gray-600/30"></div>

                    <Link
                        href={route('register')}
                        className="inline-flex items-center justify-center gap-2 border border-blue-900 dark:border-blue-700 bg-blue-900 dark:bg-blue-700 px-8 py-3 text-base font-bold text-white transition-colors hover:bg-blue-800 dark:hover:bg-blue-600"
                    >
                        Get started today
                        <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>

                    {/* Rubber stamp effect - more subtle */}
                    <div className="relative mt-8">
                        <div className="inline-block -rotate-3 border border-red-800/30 dark:border-red-400/30 px-3 py-1">
                            <p className="text-sm font-bold tracking-wider text-red-800/50 dark:text-red-400/70 uppercase">No credit card required</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
