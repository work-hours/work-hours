import { router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'

/**
 * GlobalLoader renders a full-screen overlay with the public/loader.svg
 * whenever an Inertia navigation or form submission is in-flight.
 *
 * It uses a small delay to avoid flicker on ultra-fast navigations.
 */
export default function GlobalLoader() {
    const [visible, setVisible] = useState(false)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        const showWithDelay = () => {
            timerRef.current = setTimeout(() => setVisible(true), 150)
        }

        const hideNow = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
            setVisible(false)
        }

        const onStart = () => showWithDelay()
        const onFinish = () => hideNow()
        const onProgress = () => {}
        router.on('start', onStart)
        router.on('finish', onFinish)
        router.on('progress', onProgress)
        const winStart = () => showWithDelay()
        const winFinish = () => hideNow()
        const winProgress = () => {}
        window.addEventListener('inertia:start', winStart)
        window.addEventListener('inertia:finish', winFinish)
        window.addEventListener('inertia:progress', winProgress)

        return () => {
            router.off('start', onStart)
            router.off('finish', onFinish)
            router.off('progress', onProgress)
            window.removeEventListener('inertia:start', winStart)
            window.removeEventListener('inertia:finish', winFinish)
            window.removeEventListener('inertia:progress', winProgress)
            if (timerRef.current) {
                clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
    }, [])

    if (!visible) {
        return null
    }

    return (
        <div
            role="status"
            aria-live="polite"
            aria-busy={visible}
            className="fixed inset-0 z-[9999] grid place-items-center bg-white/60 backdrop-blur-[2px] dark:bg-neutral-900/60"
        >
            <img src="/loader.svg" alt="Loading" className="h-16 w-16" />
        </div>
    )
}
