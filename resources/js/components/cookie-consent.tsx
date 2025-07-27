import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'

// Define the cookie categories based on the cookie policy
type CookieCategory = 'essential' | 'preferences' | 'analytics' | 'advertising'

interface CookieConsent {
    essential: boolean // Essential cookies are always true
    preferences: boolean
    analytics: boolean
    advertising: boolean
    timestamp: number
}

const defaultConsent: CookieConsent = {
    essential: true, // Essential cookies are always required
    preferences: false,
    analytics: false,
    advertising: false,
    timestamp: 0,
}

export default function CookieConsent() {
    const [consent, setConsent] = useState<CookieConsent | null>(null)
    const [showBanner, setShowBanner] = useState(false)
    const [showCustomize, setShowCustomize] = useState(false)

    // Load consent from localStorage on component mount
    useEffect(() => {
        const storedConsent = localStorage.getItem('cookie_consent')
        if (storedConsent) {
            try {
                setConsent(JSON.parse(storedConsent))
                setShowBanner(false)
            } catch (e) {
                console.error('Failed to parse stored cookie consent', e)
                setConsent(defaultConsent)
                setShowBanner(true)
            }
        } else {
            setConsent(defaultConsent)
            setShowBanner(true)
        }
    }, [])

    // Save consent to localStorage whenever it changes
    useEffect(() => {
        if (consent && consent.timestamp > 0) {
            localStorage.setItem('cookie_consent', JSON.stringify(consent))
        }
    }, [consent])

    // Handle accepting all cookies
    const handleAcceptAll = () => {
        setConsent({
            essential: true,
            preferences: true,
            analytics: true,
            advertising: true,
            timestamp: Date.now(),
        })
        setShowBanner(false)
    }

    // Handle accepting only essential cookies
    const handleAcceptEssential = () => {
        setConsent({
            ...defaultConsent,
            timestamp: Date.now(),
        })
        setShowBanner(false)
    }

    // Handle saving custom preferences
    const handleSavePreferences = () => {
        if (consent) {
            setConsent({
                ...consent,
                timestamp: Date.now(),
            })
            setShowBanner(false)
            setShowCustomize(false)
        }
    }

    // Handle toggling a specific cookie category
    const handleToggleCategory = (category: CookieCategory) => {
        if (consent && category !== 'essential') {
            // Don't allow toggling essential cookies
            setConsent({
                ...consent,
                [category]: !consent[category],
            })
        }
    }

    // If consent is null (still loading) or banner shouldn't be shown, don't render anything
    if (!consent || !showBanner) {
        return null
    }

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 bg-white p-4 shadow-lg sm:p-6 dark:bg-gray-800">
            <div className="mx-auto max-w-7xl">
                {!showCustomize ? (
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">We value your privacy</h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By
                                clicking "Accept All", you consent to our use of cookies. Read our{' '}
                                <Link href={route('cookie-policy')} className="font-medium text-primary hover:underline">
                                    Cookie Policy
                                </Link>{' '}
                                to learn more.
                            </p>
                        </div>
                        <div className="flex flex-shrink-0 flex-wrap gap-2">
                            <button
                                onClick={() => setShowCustomize(true)}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Customize
                            </button>
                            <button
                                onClick={handleAcceptEssential}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cookie Preferences</h2>
                            <button
                                onClick={() => setShowCustomize(false)}
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                            >
                                Back
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                            Customize your cookie preferences. Essential cookies are always enabled as they are necessary for the website to function
                            properly.
                        </p>

                        <div className="mt-4 space-y-3">
                            {/* Essential Cookies - Always enabled */}
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Essential Cookies</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Necessary for the website to function properly. Cannot be disabled.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.essential}
                                        disabled
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Preferences Cookies */}
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Preferences Cookies</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Remember information that changes the way the website behaves or looks.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.preferences}
                                        onChange={() => handleToggleCategory('preferences')}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Analytics Cookies</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Help us understand how visitors interact with the website.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.analytics}
                                        onChange={() => handleToggleCategory('analytics')}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                                    />
                                </div>
                            </div>

                            {/* Advertising Cookies */}
                            <div className="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-700">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">Advertising Cookies</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Used to show you relevant advertising on and off the website.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.advertising}
                                        onChange={() => handleToggleCategory('advertising')}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={handleAcceptEssential}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
