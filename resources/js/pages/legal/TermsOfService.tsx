import LegalLayout from '@/components/legal/LegalLayout'

export default function TermsOfService() {
    return (
        <LegalLayout title="Terms of Service">
            <div className="space-y-8">
                {/* Introduction Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Introduction</h2>
                    <p className="leading-relaxed">
                        These terms and conditions outline the rules and regulations for the use of <span className="font-semibold text-primary">Work Hours</span>' website and services.
                    </p>
                    <p className="leading-relaxed">
                        By accessing this website, we assume you accept these terms and conditions. Do not continue to use Work Hours if you do not agree to take all of the terms and conditions stated on this page.
                    </p>
                </section>

                {/* License Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">License</h2>
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <p className="leading-relaxed">
                            Unless otherwise stated, <span className="font-semibold text-primary">Work Hours</span> and/or its licensors own the intellectual property rights for all material on Work Hours. All intellectual property rights are reserved. You may access this from Work Hours for your own personal use subjected to restrictions set in these terms and conditions.
                        </p>
                    </div>
                </section>

                {/* Restrictions Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Restrictions</h2>
                    <p className="leading-relaxed font-medium text-foreground">You must not:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li className="leading-relaxed">Republish material from <span className="font-semibold text-primary">Work Hours</span></li>
                        <li className="leading-relaxed">Sell, rent or sub-license material from <span className="font-semibold text-primary">Work Hours</span></li>
                        <li className="leading-relaxed">Reproduce, duplicate or copy material from <span className="font-semibold text-primary">Work Hours</span></li>
                        <li className="leading-relaxed">Redistribute content from <span className="font-semibold text-primary">Work Hours</span></li>
                    </ul>
                </section>

                {/* User Account Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">User Account</h2>
                    <p className="leading-relaxed">
                        If you create an account with us, you are <span className="font-medium text-foreground">responsible for maintaining the security of your account</span>, and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
                    </p>
                </section>

                {/* Service Availability Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Service Availability</h2>
                    <p className="leading-relaxed">
                        We may, from time to time, release new tools and resources. Such new features shall also be subject to these Terms of Service.
                    </p>
                </section>

                {/* Third-Party Services Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Third-Party Services</h2>
                    <p className="leading-relaxed">
                        We may allow you to access third-party websites or services through our Service. We are not responsible for the availability of such external sites or resources, and do not endorse and are not responsible or liable for any content, advertising, products, or other materials on or available from such sites or resources.
                    </p>
                </section>

                {/* Limitation of Liability Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Limitation of Liability</h2>
                    <div className="bg-card p-4 rounded-lg border border-border/40 shadow-sm">
                        <p className="leading-relaxed">
                            In no event shall <span className="font-semibold text-primary">Work Hours</span>, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                        </p>
                    </div>
                </section>

                {/* Governing Law Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Governing Law</h2>
                    <p className="leading-relaxed">
                        These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
                    </p>
                </section>

                {/* Changes to Terms Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Changes to Terms</h2>
                    <p className="leading-relaxed">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect.
                    </p>
                </section>

                {/* Contact Section */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground border-b border-border/40 pb-2">Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about these Terms, please contact us at <a href="mailto:terms@workhours.com" className="text-primary hover:underline font-medium">terms@workhours.com</a>.
                    </p>
                </section>
            </div>
        </LegalLayout>
    )
}
