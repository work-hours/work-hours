import CTA from '@/components/landing/CTA'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Navbar from '@/components/landing/Navbar'
import { Head } from '@inertiajs/react'

export default function Welcome() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f8f6e9] dark:bg-gray-900">
            {/* Paper texture overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgogIDxmaWx0ZXIgaWQ9Im5vaXNlIj4KICAgIDxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIwLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+CiAgICA8ZmVCbGVuZCBtb2RlPSJtdWx0aXBseSIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2UiLz4KICA8L2ZpbHRlcj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbm9pc2UpIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-100 dark:opacity-30"></div>

            {/* Horizontal lines like a timesheet */}
            <div
                className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:100%_2rem] dark:bg-[linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Vertical lines like a timesheet */}
            <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[length:2rem_100%] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Punch card holes */}
            <div
                className="absolute top-0 bottom-0 left-4 w-4 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y dark:bg-[radial-gradient(circle,rgba(255,255,255,0.1)_3px,transparent_3px)]"
                aria-hidden="true"
            ></div>

            {/* Red margin line */}
            <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-red-400/30 dark:bg-red-500/20" aria-hidden="true"></div>

            <Head>
                <title>Work Hours - Track Your Time Effortlessly | Time Tracking Software</title>
                <meta
                    name="description"
                    content="A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain valuable insights into how you spend your time."
                />
                <meta
                    name="keywords"
                    content="time tracking, work hours, productivity, team collaboration, project management, time management, GitHub integration"
                />
                <meta name="author" content="Work Hours | Mohammed Samgan Khan (msamgan)" />
                <meta property="og:title" content="Work Hours - Track Your Time Effortlessly" />
                <meta
                    property="og:description"
                    content="A simple, intuitive time tracking solution for teams and individuals. Boost productivity and gain valuable insights."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://workhours.us" />
                <meta property="og:image" content="/logo.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Work Hours - Track Your Time Effortlessly" />
                <meta name="twitter:description" content="A simple, intuitive time tracking solution for teams and individuals." />
                <meta name="twitter:image" content="/logo.png" />
                <link rel="canonical" href="https://workhours.us" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'SoftwareApplication',
                        name: 'Work Hours',
                        applicationCategory: 'BusinessApplication',
                        operatingSystem: 'Web',
                        offers: {
                            '@type': 'Offer',
                            price: '0',
                            priceCurrency: 'USD',
                        },
                        aggregateRating: {
                            '@type': 'AggregateRating',
                            ratingValue: '4.9',
                            ratingCount: '10000',
                        },
                        description:
                            'A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain valuable insights into how you spend your time.',
                    })}
                </script>
            </Head>
            <div className="mx-auto w-9/12">
                <Navbar />
            </div>
            <Hero />
            <div className="mx-auto w-9/12">
                <Features />
                <HowItWorks />
            </div>
            <CTA />
            <div className="relative z-10 mx-auto w-9/12">
                <Footer />
            </div>
        </div>
    )
}
