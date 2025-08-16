import FeatureLayout from '@/components/features/FeatureLayout'
import { AlertCircle, CheckCircle, CheckSquare, Clock, FileText, Users } from 'lucide-react'

export default function ApprovalManagement() {
    return (
        <FeatureLayout title="Approval Management" icon={<CheckSquare className="h-8 w-8 text-blue-900 dark:text-blue-400" />}>
            <div className="space-y-8">
                <div className="inline-flex items-center rounded-md border border-red-800/40 px-3 py-1 text-sm font-bold text-red-800/70 uppercase dark:border-red-400/40 dark:text-red-400/90">
                    New Feature
                </div>

                <section className="space-y-4">
                    <p className="text-lg leading-relaxed">
                        Streamline your workflow with our robust approval management system. Ensure accountability and maintain quality control by
                        implementing approval processes for time logs, projects, and other important activities.
                    </p>
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <p className="text-blue-900 dark:text-blue-400">
                            <span className="font-semibold">Pro Tip:</span> Set up approval notification emails to keep managers informed when new
                            items require their review, ensuring nothing falls through the cracks.
                        </p>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Key Features
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <CheckSquare className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Approval Workflow</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Create customizable approval workflows with multiple levels of review for different types of submissions.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Clock className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Time Log Approvals</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Managers can review and approve time entries before they're finalized for billing or reporting.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <Users className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Role-Based Permissions</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Assign approval responsibilities based on roles, ensuring the right people review the right items.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center">
                                <div className="mr-3 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                    <AlertCircle className="h-5 w-5 text-blue-900 dark:text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Rejection Handling</h3>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">
                                Provide feedback on rejected items and track revisions until they meet approval requirements.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        What Can Be Approved
                    </h2>
                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <Clock className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Time Entries</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Review hours logged, project assignments, and notes before finalizing for billing.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <FileText className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Expense Reports</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Verify expense claims and supporting documentation before processing reimbursements.
                            </p>
                        </div>

                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex justify-center">
                                <CheckSquare className="h-12 w-12 text-blue-900 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">Project Milestones</h3>
                            <p className="text-center text-gray-700 dark:text-gray-300">
                                Confirm completion of project phases before moving to the next stage of work.
                            </p>
                        </div>
                    </div>
                </section>

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
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Configure Approval Settings</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Set up approval requirements for different types of submissions and assign approvers based on roles or
                                    departments.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                2
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Submit for Approval</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Users submit their time logs, expenses, or other items for review with a single click.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                3
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Review & Approve</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Approvers receive notifications and can review, approve, or reject submissions with optional comments.
                                </p>
                            </div>
                        </li>
                        <li className="flex">
                            <div className="mr-4 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-blue-900 bg-blue-100 text-lg font-bold text-blue-900 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                                4
                            </div>
                            <div>
                                <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-gray-200">Track & Report</h3>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Monitor approval status, track approval times, and generate reports on approval workflows and bottlenecks.
                                </p>
                            </div>
                        </li>
                    </ol>
                </section>

                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Benefits
                    </h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Increased accountability and transparency</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Improved accuracy in billing and reporting</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Better compliance with internal policies</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Streamlined workflow with clear approval paths</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Reduced errors and discrepancies in time tracking</p>
                        </div>
                        <div className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-500" />
                            <p className="text-gray-700 dark:text-gray-300">Enhanced project management and oversight</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="border-b border-gray-300 pb-2 text-2xl font-bold text-gray-800 dark:border-gray-700 dark:text-gray-200">
                        Common Use Cases
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Client Billing Verification</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Project managers review and approve all time entries before they're included in client invoices, ensuring accuracy and
                                preventing billing disputes.
                            </p>
                        </div>
                        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-200">Regulatory Compliance</h3>
                            <p className="text-gray-700 dark:text-gray-300">
                                Organizations in regulated industries use approval workflows to ensure all time tracking meets compliance requirements
                                and maintains proper documentation.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mt-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex flex-col items-center text-center md:flex-row md:text-left">
                        <div className="mb-4 md:mr-6 md:mb-0 md:w-2/3">
                            <h3 className="mb-2 text-xl font-bold text-blue-900 dark:text-blue-400">Ready to Streamline Your Approval Process?</h3>
                            <p className="text-blue-800 dark:text-blue-300">
                                Sign up for Work Hours today and implement efficient approval workflows for your team.
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
