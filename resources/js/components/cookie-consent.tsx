import { Link } from '@inertiajs/react'
import { useEffect, useState } from 'react'

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

    useEffect(() => {
        if (consent && consent.timestamp > 0) {
            localStorage.setItem('cookie_consent', JSON.stringify(consent))
        }
    }, [consent])

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

    const handleAcceptEssential = () => {
        setConsent({
            ...defaultConsent,
            timestamp: Date.now(),
        })
        setShowBanner(false)
    }

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

    const handleToggleCategory = (category: CookieCategory) => {
        if (consent && category !== 'essential') {
            setConsent({
                ...consent,
                [category]: !consent[category],
            })
        }
    }

    if (!consent || !showBanner) {
        return null
    }

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 bg-white p-4 shadow-md sm:p-6 dark:bg-neutral-900">
            <div className="mx-auto max-w-7xl">
                {!showCustomize ? (
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">We value your privacy</h2>
                            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By
                                clicking "Accept All", you consent to our use of cookies. Read our{' '}
                                <Link href={route('cookie-policy')} className="font-medium text-neutral-700 transition-colors duration-200 hover:text-neutral-900 hover:underline dark:text-neutral-300 dark:hover:text-neutral-100">
                                    Cookie Policy
                                </Link>{' '}
                                to learn more.
                            </p>
                        </div>
                        <div className="flex flex-shrink-0 flex-wrap gap-2">
                            <button
                                onClick={() => setShowCustomize(true)}
                                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Customize
                            </button>
                            <button
                                onClick={handleAcceptEssential}
                                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={handleAcceptAll}
                                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                            >
                                Accept All
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Cookie Preferences</h2>
                            <button
                                onClick={() => setShowCustomize(false)}
                                className="text-sm font-medium text-neutral-600 transition-colors duration-200 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                            >
                                Back
                            </button>
                        </div>
                        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                            Customize your cookie preferences. Essential cookies are always enabled as they are necessary for the website to function
                            properly.
                        </p>

                        <div className="mt-4 space-y-3">
                            {/* Essential Cookies - Always enabled */}
                            <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800/50">
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Essential Cookies</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Necessary for the website to function properly. Cannot be disabled.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.essential}
                                        disabled
                                        className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 dark:border-neutral-600 dark:bg-neutral-700"
                                    />
                                </div>
                            </div>

                            {/* Preferences Cookies */}
                            <div className="flex items-center justify-between rounded-md border border-neutral-200 p-3 transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50">
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Preferences Cookies</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Remember information that changes the way the website behaves or looks.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.preferences}
                                        onChange={() => handleToggleCategory('preferences')}
                                        className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 dark:border-neutral-600"
                                    />
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="flex items-center justify-between rounded-md border border-neutral-200 p-3 transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50">
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Analytics Cookies</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Help us understand how visitors interact with the website.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.analytics}
                                        onChange={() => handleToggleCategory('analytics')}
                                        className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 dark:border-neutral-600"
                                    />
                                </div>
                            </div>

                            {/* Advertising Cookies */}
                            <div className="flex items-center justify-between rounded-md border border-neutral-200 p-3 transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800/50">
                                <div>
                                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">Advertising Cookies</h3>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Used to show you relevant advertising on and off the website.
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={consent.advertising}
                                        onChange={() => handleToggleCategory('advertising')}
                                        className="h-4 w-4 rounded border-neutral-300 text-neutral-600 focus:ring-neutral-500 dark:border-neutral-600"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={handleAcceptEssential}
                                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors duration-200 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                            >
                                Essential Only
                            </button>
                            <button
                                onClick={handleSavePreferences}
                                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors duration-200 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600"
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
