import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-6 md:p-10">
            <div className="relative w-full max-w-md">
                {/* Background decorative elements */}
                <div className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-primary/5 blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-primary/10 blur-xl"></div>

                {/* Card container */}
                <div className="relative z-10 rounded-xl border border-border/40 bg-card/95 p-8 shadow-lg backdrop-blur-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium transition-transform hover:scale-105">
                                <div className="mb-1 flex h-9 w-28 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-28 fill-current text-primary dark:text-primary" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-sm">
                <div className="mb-2">
                    <a
                        href="https://github.com/sponsors/msamgan"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                    >
                        Sponsor this project
                    </a>
                </div>
                <div className="text-muted-foreground">
                    &copy; {new Date().getFullYear()} WorkHours. All rights reserved.
                </div>
            </div>
        </div>
    );
}
