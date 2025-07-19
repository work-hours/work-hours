import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section className="w-full bg-[#f8f6e9] border-y border-gray-300/20 py-16 md:py-24 relative">
            {/* Timesheet punch holes on the left side only (matching main page) */}
            <div className="absolute left-4 top-0 bottom-0 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.07)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y" aria-hidden="true"></div>

            {/* Typewriter-style form */}
            <div className="mx-auto w-9/12 max-w-3xl">
                <div className="relative border border-gray-300/60 bg-[#f8f6e9]/80 p-8 text-center">
                    {/* Corner fold effect - more subtle */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[20px] border-r-[20px] border-t-gray-300/70 border-r-transparent"></div>

                    {/* Form header */}
                    <div className="border-b border-gray-400/40 pb-4 mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 uppercase font-['Courier_New',monospace] tracking-wide md:text-4xl">
                            Ready to Optimize Your Time?
                        </h2>
                    </div>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-700 font-['Courier_New',monospace]">
                        Join thousands of professionals who have transformed how they track and manage their time.
                    </p>

                    {/* Signature line - more subtle */}
                    <div className="mb-8 mx-auto w-64 border-b border-gray-400/30"></div>

                    <Link
                        href={route('register')}
                        className="inline-flex items-center justify-center gap-2 bg-blue-900 px-8 py-3 text-base font-bold text-white border border-blue-900 hover:bg-blue-800 transition-colors"
                    >
                        Get started today
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>

                    {/* Rubber stamp effect - more subtle */}
                    <div className="mt-8 relative">
                        <div className="inline-block -rotate-3 border border-red-800/30 px-3 py-1">
                            <p className="text-sm font-bold text-red-800/50 uppercase tracking-wider">No credit card required</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
