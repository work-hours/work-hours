import FeatureLayout from '@/components/features/FeatureLayout'
import { CheckCircle, DollarSign, FileText, Globe, Printer, Settings } from 'lucide-react'

export default function MultiCurrencyInvoice() {
    return (
        <FeatureLayout title="Multi Currency Invoice" icon={<DollarSign className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                {/* New Feature Badge */}
                <div className="inline-flex items-center rounded-md border border-red-800/40 px-3 py-1 text-sm font-bold text-red-800/70 uppercase dark:border-red-400/40 dark:text-red-400/90">
                    New Feature
                </div>

                {/* Introduction Section */}
                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Create professional invoices in multiple currencies for your international clients. Our multi-currency invoice system
                        simplifies billing across different regions while maintaining accurate financial records in your base currency.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Save invoice templates for each currency to streamline your billing
                            process and ensure consistent formatting for all your international clients.
                        </p>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <DollarSign className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Multiple Currencies</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Create invoices in any of the 170+ supported currencies with proper formatting and exchange rate information.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <FileText className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Customizable Templates</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Design invoice templates for different currencies with appropriate language, formatting, and payment instructions.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Globe className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Exchange Rate Display</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Show the exchange rate used for conversion on invoices for transparency and record-keeping.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Settings className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Client Currency Preferences</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Automatically use each client's preferred currency when generating invoices based on their profile settings.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Invoice Features Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Invoice Capabilities
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <FileText className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">PDF Generation</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Generate professional PDF invoices with proper currency formatting and symbols for any supported currency.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <Printer className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Print & Email</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Send invoices directly to clients via email or print them with proper formatting for physical delivery.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <DollarSign className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Payment Tracking</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Track payments in original invoice currencies while maintaining consolidated financial records.
                            </p>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        How It Works
                    </h2>
                    <ol className="space-y-6">
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                1
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Set Client Currency</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Specify the preferred billing currency for each client in their profile settings or during invoice creation.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Create Invoice</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Generate an invoice with time entries and other billable items, which will automatically use the client's
                                    currency.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Review & Customize</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Review the invoice with proper currency formatting and make any necessary adjustments before finalizing.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Send & Track</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Send the invoice to your client and track payments in the original currency, with automatic conversion for your
                                    records.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                {/* Benefits Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved client experience with localized billing</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Faster payments with clear, properly formatted invoices</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Simplified international billing processes</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Accurate financial tracking across multiple currencies</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduced currency conversion confusion for clients</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Professional appearance for international business</p>
                        </div>
                    </div>
                </section>

                {/* Use Cases Section */}
                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Common Use Cases
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Global Freelancers</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Freelancers working with clients around the world can create professional invoices in each client's local currency,
                                making it easier for clients to understand costs and process payments.
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">International Agencies</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Marketing and development agencies with clients in multiple countries can maintain consistent billing practices while
                                accommodating each client's currency preferences.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Simplify International Billing?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and start creating professional invoices in any currency.
                            </p>
                        </div>
                        <div className="md:w-1/3">
                            <a
                                href={route('register')}
                                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-[#1d4ed8]"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </FeatureLayout>
    )
}
