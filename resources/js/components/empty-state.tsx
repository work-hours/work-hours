import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface EmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionRoute?: string;
}

export default function EmptyState({
    title,
    description,
    actionLabel,
    actionRoute
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-6">
                <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-muted-foreground"
                >
                    <path
                        d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 6H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 10H16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M8 14H12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            {description && <p className="mb-6 text-center text-muted-foreground">{description}</p>}
            {actionLabel && actionRoute && (
                <Button>
                    <Link href={route(actionRoute)} className="flex items-center gap-2">
                        {actionLabel}
                    </Link>
                </Button>
            )}
        </div>
    );
}
