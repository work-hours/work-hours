import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@inertiajs/react'
import { format, parseISO } from 'date-fns'
import { ExternalLink, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface LogDetailOffCanvasProps {
    timeLogId: number | null
    isOpen: boolean
    onClose: () => void
}

interface TimeLogDetail {
    id: number
    user: {
        name: string
    }
    project: {
        id: number
        name: string
        color: string
    }
    task: {
        id: number
        title: string
    } | null
    start_timestamp: string
    end_timestamp: string
    duration: number
    is_paid: boolean
    hourly_rate: number
    currency: string
    note: string
    status: string
}

export default function LogDetailOffCanvas({ timeLogId, isOpen, onClose }: LogDetailOffCanvasProps) {
    const [timeLogDetail, setTimeLogDetail] = useState<TimeLogDetail | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (timeLogId && isOpen) {
            setLoading(true)
            fetch(route('calendar.detail', timeLogId))
                .then((response) => response.json())
                .then((data) => {
                    setTimeLogDetail(data)
                    setLoading(false)
                })
                .catch((error) => {
                    console.error('Error fetching time log details:', error)
                    setLoading(false)
                })
        } else {
            setTimeLogDetail(null)
        }
    }, [timeLogId, isOpen])

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(amount)
    }

    const calculateAmount = () => {
        if (!timeLogDetail) return '0'
        return formatCurrency(timeLogDetail.hourly_rate * timeLogDetail.duration, timeLogDetail.currency)
    }

    return (
        <div
            className={`fixed inset-y-0 right-0 z-60 w-full transform bg-white shadow-xl transition-transform duration-300 sm:w-[400px] ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="flex h-full flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                    <h2 className="text-xl font-semibold">Time Log Details</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {loading && <div className="flex justify-center py-8">Loading...</div>}

                    {!loading && !timeLogDetail && <div className="py-8 text-center text-gray-500">Select a time log to view details</div>}

                    {!loading && timeLogDetail && (
                        <div className="space-y-6">
                            {/* Project info */}
                            <div>
                                <h3 className="mb-1 text-sm text-gray-500">Project</h3>
                                <div
                                    className="rounded-md p-3"
                                    style={{
                                        backgroundColor: timeLogDetail.project.color + '33',
                                    }}
                                >
                                    <div className="text-lg font-medium">{timeLogDetail.project.name}</div>
                                    <div className="text-sm text-gray-700">Tracked by {timeLogDetail.user.name}</div>
                                </div>
                            </div>

                            {/* Task info (if available) */}
                            {timeLogDetail.task && (
                                <div>
                                    <h3 className="mb-1 text-sm text-gray-500">Task</h3>
                                    <div className="rounded-md bg-gray-100 p-3">
                                        <div className="font-medium">{timeLogDetail.task.title}</div>
                                    </div>
                                </div>
                            )}

                            {/* Time info */}
                            <div>
                                <h3 className="mb-1 text-sm text-gray-500">Time Details</h3>
                                <div className="rounded-md bg-gray-100 p-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-sm text-gray-500">Start Time</div>
                                            <div>{format(parseISO(timeLogDetail.start_timestamp), 'MMM dd, yyyy HH:mm')}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">End Time</div>
                                            <div>{format(parseISO(timeLogDetail.end_timestamp), 'MMM dd, yyyy HH:mm')}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Duration</div>
                                            <div>{timeLogDetail.duration} hrs</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Status</div>
                                            <Badge
                                                className={`${
                                                    timeLogDetail.status === 'APPROVED'
                                                        ? 'bg-green-100 text-green-800'
                                                        : timeLogDetail.status === 'REJECTED'
                                                          ? 'bg-red-100 text-red-800'
                                                          : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                            >
                                                {timeLogDetail.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment info */}
                            <div>
                                <h3 className="mb-1 text-sm text-gray-500">Payment Details</h3>
                                <div className="rounded-md bg-gray-100 p-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <div className="text-sm text-gray-500">Hourly Rate</div>
                                            <div>{formatCurrency(timeLogDetail.hourly_rate, timeLogDetail.currency)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Amount</div>
                                            <div>{calculateAmount()}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-500">Payment Status</div>
                                            <Badge
                                                className={`${timeLogDetail.is_paid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                            >
                                                {timeLogDetail.is_paid ? 'Paid' : 'Not Paid'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {timeLogDetail.note && (
                                <div>
                                    <h3 className="mb-1 text-sm text-gray-500">Notes</h3>
                                    <div className="rounded-md bg-gray-100 p-3">
                                        <p>{timeLogDetail.note}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!loading && timeLogDetail && (
                    <div className="border-t p-4">
                        <Link href={route('time-log.edit', timeLogDetail.id)}>
                            <Button className="flex w-full items-center gap-2">
                                <ExternalLink className="h-4 w-4" />
                                View & Edit Time Log
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
