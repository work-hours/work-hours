import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types'
import { Link } from '@inertiajs/react'
import { Fragment } from 'react'

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList className="text-gray-700 font-['Courier_New',monospace]">
                        {breadcrumbs.map((item, index) => {
                            const isLast = index === breadcrumbs.length - 1
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="text-gray-900 font-bold">{item.title}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild className="text-gray-700 hover:text-gray-900">
                                                <Link href={item.href}>{item.title}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="text-gray-700" />}
                                </Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    )
}
