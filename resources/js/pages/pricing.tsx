import FeatureLayout from '@/components/features/FeatureLayout'
import { BadgeDollarSign } from 'lucide-react'

export default function Pricing() {
    return (
        <FeatureLayout title="Pricing" icon={<BadgeDollarSign className="h-7 w-7 text-blue-600 dark:text-blue-400" />}>
            <div className="space-y-6">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Work Hours is currently in <span className="font-semibold">beta</span>.
                </p>
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/10">
                    <p className="text-gray-800 dark:text-gray-200">
                        There is <span className="font-semibold">no paywall</span> on any of the available features right now. You can use everything
                        for free during the beta period.
                    </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                    In the future, this may change and limits might be added to the free tier. We’ll communicate upcoming changes well in advance and
                    ensure a smooth transition.
                </p>

                <p className="text-gray-700 dark:text-gray-300">
                    We are committed to keeping Work Hours accessible and affordable. Our goal is to provide a valuable tool for teams of all sizes,
                    under no circumstances will we charge you without prior notice. We value transparency and will always keep you informed about any
                    changes to our pricing model.
                </p>
            </div>
        </FeatureLayout>
    )
}
