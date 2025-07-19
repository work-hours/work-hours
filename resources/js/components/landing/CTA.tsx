import { Link } from '@inertiajs/react'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
    return (
        <section className="w-full bg-[#f5f2e8] border-y-2 border-gray-400/30 py-16 md:py-24 relative">
            {/* Timesheet punch holes on the sides */}
            <div className="absolute left-4 top-0 bottom-0 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y" aria-hidden="true"></div>
            <div className="absolute right-4 top-0 bottom-0 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y" aria-hidden="true"></div>

            {/* Typewriter-style form */}
            <div className="mx-auto w-9/12 max-w-3xl">
                <div className="relative border-2 border-gray-400 bg-white p-8 text-center">
                    {/* Corner fold effect */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-t-[30px] border-r-[30px] border-t-gray-400 border-r-transparent"></div>

                    {/* Form header */}
                    <div className="border-b-2 border-gray-400 pb-4 mb-6">
                        <h2 className="text-3xl font-bold text-gray-800 uppercase font-['Courier_New',monospace] tracking-wide md:text-4xl">
                            Ready to Optimize Your Time?
                        </h2>
                    </div>

                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-700 font-['Courier_New',monospace]">
                        Join thousands of professionals who have transformed how they track and manage their time.
                    </p>

                    {/* Signature line */}
                    <div className="mb-8 mx-auto w-64 border-b border-gray-400"></div>

                    <Link
                        href={route('register')}
                        className="inline-flex items-center justify-center gap-2 bg-blue-900 px-8 py-3 text-base font-bold text-white border-2 border-blue-900 hover:bg-blue-800 transition-colors"
                    >
                        Get started today
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>

                    {/* Rubber stamp effect */}
                    <div className="mt-8 relative">
                        <div className="inline-block -rotate-6 border-2 border-red-800/40 px-3 py-1">
                            <p className="text-sm font-bold text-red-800/70 uppercase tracking-wider">No credit card required</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
