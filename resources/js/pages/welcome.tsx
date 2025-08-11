import CookieConsent from '@/components/cookie-consent'
import AiSection from '@/components/landing/AiSection'
import CTA from '@/components/landing/CTA'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Navbar from '@/components/landing/Navbar'
import Background from '@/components/ui/background'
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
        <div className="relative min-h-screen overflow-hidden bg-[#f8f6e9] dark:bg-gray-900" style={{ scrollBehavior: 'smooth' }}>
            <Background />

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

            <Navbar />

            <div className="pt-28">
                <Hero />
                <div className="mx-auto w-9/12">
                    <div id="features">
                        <Features />
                    </div>
                    <div id="ai-section">
                        <AiSection />
                    </div>
                    <div id="how-it-works">
                        <HowItWorks />
                    </div>
                </div>
                <div id="cta">
                    <CTA />
                </div>
                <div className="relative z-10 mx-auto w-full">
                    <Footer />
                </div>
            </div>

            {/* Cookie Consent Banner */}
            <CookieConsent />
        </div>
    )
}
