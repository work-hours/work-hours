import CookieConsent from '@/components/cookie-consent'
import AiSection from '@/components/landing/AiSection'
import CTA from '@/components/landing/CTA'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Navbar from '@/components/landing/Navbar'
import { Head } from '@inertiajs/react'
import { useEffect } from 'react'

export default function Welcome() {
    useEffect(() => {
        const hash = window.location.hash

        if (hash) {
            const sectionId = hash.substring(1)
            const element = document.getElementById(sectionId)

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            }
        }
    }, [])

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900" style={{ scrollBehavior: 'smooth' }}>
            <Head>
                <title>Work Hours - Simple Time Tracking for Productive Teams</title>
                <meta
                    name="description"
                    content="A minimal, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain valuable insights into how you spend your time."
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

            <div className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800/80">
                <Navbar />
            </div>

            <main className="flex flex-col w-full gap-5">
                <section className="w-full pb-8 pt-24 md:pt-28">
                    <Hero />
                </section>

                <section className="w-full py-16 md:py-24 bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div id="features" className="py-10">
                                <Features />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div id="ai-section" className="py-10">
                                <AiSection />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="w-full bg-white dark:bg-gray-950">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="mx-auto max-w-5xl">
                            <div id="how-it-works" className="py-10">
                                <HowItWorks />
                            </div>
                        </div>
                    </div>
                </section>

                <section id="cta" className="w-full bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                        <div className="mx-auto">
                            <CTA />
                        </div>
                    </div>
                </section>

                <section className="relative w-full bg-gray-100 dark:bg-gray-950">
                    <Footer />
                </section>
            </main>

            {/* Cookie Consent Banner */}
            <CookieConsent />
        </div>
    )
}
