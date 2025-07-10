import { Head } from '@inertiajs/react'
import Navbar from '@/components/landing/Navbar'
import Footer from '@/components/landing/Footer'

export default function Security() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/90">
            <Head title="Security - Work Hours" />
            <Navbar />

            <main className="container mx-auto px-6 py-12 lg:px-8">
                <h1 className="mb-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Security</h1>

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p>Last updated: {new Date().toLocaleDateString()}</p>

                    <h2>Our Commitment to Security</h2>
                    <p>
                        At Work Hours, we take the security of your data very seriously. We employ industry-standard security measures to protect your personal information and ensure the integrity of our platform.
                    </p>

                    <h2>Data Protection Measures</h2>
                    <p>
                        We implement various security measures to maintain the safety of your personal information:
                    </p>
                    <ul>
                        <li>Encryption: All data transmitted between your browser and our servers is encrypted using TLS (Transport Layer Security).</li>
                        <li>Secure Data Storage: We store your data in secure, encrypted databases with restricted access.</li>
                        <li>Regular Security Audits: We conduct regular security audits and vulnerability assessments to identify and address potential security issues.</li>
                        <li>Access Controls: We implement strict access controls to ensure that only authorized personnel can access sensitive data.</li>
                        <li>Monitoring: We continuously monitor our systems for suspicious activities and potential security breaches.</li>
                    </ul>

                    <h2>Account Security</h2>
                    <p>
                        We recommend the following practices to help keep your account secure:
                    </p>
                    <ul>
                        <li>Use a strong, unique password for your Work Hours account.</li>
                        <li>Enable two-factor authentication if available.</li>
                        <li>Do not share your account credentials with others.</li>
                        <li>Log out of your account when using shared or public computers.</li>
                        <li>Regularly check your account activity for any unauthorized access.</li>
                    </ul>

                    <h2>Security Incident Response</h2>
                    <p>
                        In the event of a security incident that affects your data, we will:
                    </p>
                    <ul>
                        <li>Promptly investigate the incident to determine its scope and impact.</li>
                        <li>Take immediate steps to contain and mitigate the incident.</li>
                        <li>Notify affected users in accordance with applicable laws and regulations.</li>
                        <li>Work with law enforcement agencies if necessary.</li>
                        <li>Implement measures to prevent similar incidents in the future.</li>
                    </ul>

                    <h2>Third-Party Security</h2>
                    <p>
                        We carefully select third-party service providers and ensure they maintain appropriate security measures to protect your data. We regularly review their security practices and compliance with our security requirements.
                    </p>

                    <h2>Security Updates</h2>
                    <p>
                        We continuously update our security measures to address new threats and vulnerabilities. We may update this Security Policy from time to time to reflect changes in our security practices.
                    </p>

                    <h2>Reporting Security Issues</h2>
                    <p>
                        If you discover a security vulnerability or have concerns about the security of our platform, please contact us immediately at security@workhours.com. We appreciate your help in keeping Work Hours secure.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    )
}
