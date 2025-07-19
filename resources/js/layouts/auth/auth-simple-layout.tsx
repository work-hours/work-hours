import AppLogoIcon from '@/components/app-logo-icon'
import { Link } from '@inertiajs/react'
import { type PropsWithChildren } from 'react'

interface AuthLayoutProps {
    name?: string
    title?: string
    description?: string
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-[#f8f6e9] p-6 font-['Courier_New',monospace] md:p-10">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-100"></div>

            {/* Horizontal lines like a timesheet */}
            <div
                className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem]"
                aria-hidden="true"
            ></div>

            {/* Vertical lines like a timesheet */}
            <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%]"
                aria-hidden="true"
            ></div>

            {/* Punch card holes */}
            <div
                className="absolute top-0 bottom-0 left-4 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y"
                aria-hidden="true"
            ></div>

            {/* Red margin line */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-400/30" aria-hidden="true"></div>

            <div className="relative z-10 w-full max-w-md">
                {/* Card container - styled like a paper form */}
                <div className="relative border-2 border-gray-300 bg-white p-8">
                    {/* Corner fold effect */}
                    <div className="absolute top-0 right-0 h-0 w-0 border-t-[20px] border-r-[20px] border-t-gray-400 border-r-transparent"></div>

                    {/* Timesheet header stamp */}
                    <div className="absolute -top-4 right-4 rotate-6 border-2 border-red-800/30 px-4 py-2 text-sm font-bold tracking-wider text-red-800/70 uppercase">
                        Form
                    </div>

                    {/* Form header */}
                    <div className="mb-6 border-b border-gray-400/40 pb-4">
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col items-center gap-4">
                                <Link href={route('home')} className="flex items-center gap-3">
                                    <div className="flex h-14 w-14 items-center justify-center border-2 border-gray-700 bg-white">
                                        <AppLogoIcon className="h-8 w-8 text-gray-700" />
                                    </div>
                                    <div>
                                        <span className="font-['Courier_New',monospace] text-xl font-bold tracking-wider text-gray-800 uppercase">
                                            Work Hours
                                        </span>
                                        <div className="mt-1 h-1 w-full bg-gray-300"></div>
                                    </div>
                                </Link>

                                <div className="mt-4 space-y-2 text-center">
                                    <h1 className="font-['Courier_New',monospace] text-2xl font-bold tracking-wide text-gray-800 uppercase">
                                        {title}
                                    </h1>
                                    <p className="text-center font-['Courier_New',monospace] text-sm text-gray-700">{description}</p>
                                </div>
                            </div>
                            {children}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - styled like the landing page footer */}
            <div className="mt-8 text-center text-sm">
                <div className="mb-2">
                    <a
                        href="https://github.com/sponsors/msamgan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b border-gray-400 pb-1 font-['Courier_New',monospace] text-gray-700 hover:border-gray-700 hover:text-gray-900"
                    >
                        Sponsor this project
                    </a>
                </div>
                <div className="inline-block border border-gray-300/40 bg-[#f8f6e9]/90 px-4 py-1">
                    <p className="font-['Courier_New',monospace] text-sm text-gray-700">
                        &copy; {new Date().getFullYear()} Work Hours. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    )
}
