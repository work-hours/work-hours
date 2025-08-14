export default function Background({ showPunches = true, showMarginLine = true }: {
    showPunches?: boolean;
    showMarginLine?: boolean
}) {
    return (
        <>
            {/* Subtle theme gradient overlay using primary color */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_10%_0%,rgba(var(--color-primary),0.06),transparent_60%),radial-gradient(800px_400px_at_90%_10%,rgba(var(--color-primary),0.04),transparent_60%)] animate-background-shine [background-size:200%_100%]"
                aria-hidden="true"
            ></div>

            {/* Horizontal grid lines tinted with theme primary */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(var(--color-primary),0.08)_1px,transparent_1px)] bg-[length:100%_2rem] dark:bg-[linear-gradient(0deg,rgba(var(--color-primary),0.12)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Vertical grid lines tinted with theme primary */}
            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--color-primary),0.06)_1px,transparent_1px)] bg-[length:2rem_100%] dark:bg-[linear-gradient(90deg,rgba(var(--color-primary),0.1)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {/* Decorative side dots (revamped punches) using primary color */}
            {
                showPunches && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-4 w-4 bg-[radial-gradient(circle,rgba(var(--color-primary),0.18)_3px,transparent_3px)] bg-[length:8px_24px] bg-[position:center] bg-repeat-y dark:bg-[radial-gradient(circle,rgba(var(--color-primary),0.25)_3px,transparent_3px)]"
                        aria-hidden="true"
                    ></div>
                )
            }

            {/* Theme margin line using primary color */}
            {
                showMarginLine && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-12 w-px bg-[rgba(var(--color-primary),0.25)] dark:bg-[rgba(var(--color-primary),0.2)]"
                        aria-hidden="true"
                    ></div>
                )
            }
        </>
    )
}
