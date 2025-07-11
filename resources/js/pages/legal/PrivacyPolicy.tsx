import LegalLayout from '@/components/legal/LegalLayout'

export default function PrivacyPolicy() {
    return (
        <LegalLayout title="Privacy Policy">
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Introduction</h2>
                    <p className="leading-relaxed">
                        At <span className="font-semibold text-primary">Work Hours</span>, we respect your privacy and are committed to protecting
                        your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                {/* Data Collection Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">The Data We Collect About You</h2>
                    <p className="leading-relaxed">
                        Personal data, or personal information, means any information about an individual from which that person can be identified. We
                        may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Identity Data</span> includes first name, last name, username or similar
                            identifier.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Contact Data</span> includes email address and telephone numbers.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Technical Data</span> includes internet protocol (IP) address, your login
                            data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and
                            platform, and other technology on the devices you use to access this website.
                        </li>
                        <li className="leading-relaxed">
                            <span className="font-medium text-foreground">Usage Data</span> includes information about how you use our website,
                            products and services.
                        </li>
                    </ul>
                </section>

                {/* Data Usage Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">How We Use Your Personal Data</h2>
                    <p className="leading-relaxed">
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following
                        circumstances:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                        <li className="leading-relaxed">
                            Where we need to <span className="font-medium text-foreground">perform the contract</span> we are about to enter into or
                            have entered into with you.
                        </li>
                        <li className="leading-relaxed">
                            Where it is necessary for our <span className="font-medium text-foreground">legitimate interests</span> (or those of a
                            third party) and your interests and fundamental rights do not override those interests.
                        </li>
                        <li className="leading-relaxed">
                            Where we need to <span className="font-medium text-foreground">comply with a legal obligation</span>.
                        </li>
                    </ul>
                </section>

                {/* Data Security Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Data Security</h2>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                        <p className="leading-relaxed">
                            We have put in place <span className="font-medium text-foreground">appropriate security measures</span> to prevent your
                            personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we
                            limit access to your personal data to those employees, agents, contractors and other third parties who have a business
                            need to know.
                        </p>
                    </div>
                </section>

                {/* Data Retention Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Data Retention</h2>
                    <p className="leading-relaxed">
                        We will only retain your personal data for as long as reasonably necessary to fulfill the purposes we collected it for,
                        including for the purposes of satisfying any legal, regulatory, tax, accounting or reporting requirements.
                    </p>
                </section>

                {/* Legal Rights Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Your Legal Rights</h2>
                    <p className="leading-relaxed">
                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
                    </p>
                    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Access</h3>
                            <p className="text-sm">Request a copy of your personal data</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Rectification</h3>
                            <p className="text-sm">Request correction of inaccurate data</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Erasure</h3>
                            <p className="text-sm">Request deletion of your personal data</p>
                        </div>
                        <div className="rounded-md border border-border/40 bg-card p-3 shadow-sm">
                            <h3 className="mb-1 font-medium text-foreground">Right to Restrict Processing</h3>
                            <p className="text-sm">Request restriction of processing your data</p>
                        </div>
                    </div>
                </section>

                {/* Changes Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Changes to This Privacy Policy</h2>
                    <p className="leading-relaxed">
                        We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on
                        this page.
                    </p>
                </section>

                {/* Contact Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-border/40 pb-2 text-2xl font-bold text-foreground">Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about this privacy policy or our privacy practices, please contact us at{' '}
                        <a href="mailto:privacy@workhours.com" className="font-medium text-primary hover:underline">
                            privacy@workhours.com
                        </a>
                        .
                    </p>
                </section>
            </div>
        </LegalLayout>
    )
}
