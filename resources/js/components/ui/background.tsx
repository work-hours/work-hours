export default function Background({ showPunches = true, showMarginLine = true }: {
    showPunches?: boolean;
    showMarginLine?: boolean
}) {
    return (
        <>
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(1600px_800px_at_15%_0%,rgba(var(--color-primary),0.03),transparent_70%),radial-gradient(1000px_500px_at_85%_20%,rgba(var(--color-primary),0.02),transparent_70%)] animate-background-shine [background-size:200%_100%]"
                aria-hidden="true"
            ></div>

            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(var(--color-primary),0.04)_1px,transparent_1px)] bg-[length:100%_3rem] dark:bg-[linear-gradient(0deg,rgba(var(--color-primary),0.06)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(var(--color-primary),0.03)_1px,transparent_1px)] bg-[length:3rem_100%] dark:bg-[linear-gradient(90deg,rgba(var(--color-primary),0.05)_1px,transparent_1px)]"
                aria-hidden="true"
            ></div>

            {
                showPunches && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-3 w-2 bg-[radial-gradient(circle,rgba(var(--color-primary),0.12)_2px,transparent_2px)] bg-[length:6px_32px] bg-[position:center] bg-repeat-y dark:bg-[radial-gradient(circle,rgba(var(--color-primary),0.16)_2px,transparent_2px)]"
                        aria-hidden="true"
                    ></div>
                )
            }

            {
                showMarginLine && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-10 w-px bg-[rgba(var(--color-primary),0.15)] dark:bg-[rgba(var(--color-primary),0.12)]"
                        aria-hidden="true"
                    ></div>
                )
            }
        </>
    )
}
