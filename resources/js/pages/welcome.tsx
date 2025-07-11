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
            <div className="animate-float absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="animate-float absolute bottom-1/3 left-1/3 h-48 w-48 rounded-full bg-primary/5 blur-3xl [animation-delay:2s]"></div>
            <div className="animate-float absolute top-2/3 right-1/3 h-56 w-56 rounded-full bg-primary/5 blur-3xl [animation-delay:4s]"></div>

            <Head title="Work Hours - Track Your Time Effortlessly" />
            <div className="w-9/12 mx-auto">
                <Navbar />
            </div>
            <Hero />
            <div className="w-9/12 mx-auto">
                <Features />
                <HowItWorks />
            </div>
            <CTA />
            <div className="w-9/12 mx-auto">
                <Footer />
            </div>
        </div>
    )
}
