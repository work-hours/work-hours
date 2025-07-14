import CTA from '@/components/landing/CTA'
import Features from '@/components/landing/Features'
import Footer from '@/components/landing/Footer'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Navbar from '@/components/landing/Navbar'
import { Head } from '@inertiajs/react'

export default function Welcome() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-background to-background/90">
            {/* Decorative background elements */}
            <div className="animate-float absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true"></div>
            <div className="animate-float absolute bottom-1/3 left-1/3 h-48 w-48 rounded-full bg-primary/5 blur-3xl [animation-delay:2s]" aria-hidden="true"></div>
            <div className="animate-float absolute top-2/3 right-1/3 h-56 w-56 rounded-full bg-primary/5 blur-3xl [animation-delay:4s]" aria-hidden="true"></div>

            <Head>
                <title>Work Hours - Track Your Time Effortlessly | Time Tracking Software</title>
                <meta name="description" content="A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain valuable insights into how you spend your time." />
                <meta name="keywords" content="time tracking, work hours, productivity, team collaboration, project management, time management, GitHub integration" />
                <meta name="author" content="Work Hours | Mohammed Samgan Khan (msamgan)" />
                <meta property="og:title" content="Work Hours - Track Your Time Effortlessly" />
                <meta property="og:description" content="A simple, intuitive time tracking solution for teams and individuals. Boost productivity and gain valuable insights." />
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
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Work Hours",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "ratingCount": "10000"
                        },
                        "description": "A simple, intuitive time tracking solution for teams and individuals. Boost productivity, improve billing accuracy, and gain valuable insights into how you spend your time."
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
            <div className="mx-auto w-9/12">
                <Footer />
            </div>
        </div>
    )
}
