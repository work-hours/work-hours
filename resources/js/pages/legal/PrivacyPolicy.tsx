import { Head } from '@inertiajs/react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <Head title="Privacy Policy - Work Hours" />
            <Navbar />

            <main className="container mx-auto px-6 py-12 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2>Introduction</h2>
                    <p>
                        At Work Hours, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                    </p>

                    <h2>The Data We Collect About You</h2>
                    <p>
                        Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul>
                        <li>Identity Data includes first name, last name, username or similar identifier.</li>
                        <li>Contact Data includes email address and telephone numbers.</li>
                        <li>Technical Data includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                        <li>Usage Data includes information about how you use our website, products and services.</li>
                    </ul>

                    <h2>How We Use Your Personal Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul>
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal obligation.</li>
                    </ul>

                    <h2>Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                    </p>

                    <h2>Data Retention</h2>
                    <p>
                        We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
                    </p>

                    <h2>Your Legal Rights</h2>
                    <p>
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
                    </p>

                    <h2>Changes to This Privacy Policy</h2>
                    <p>
                        We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at privacy@workhours.com.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
