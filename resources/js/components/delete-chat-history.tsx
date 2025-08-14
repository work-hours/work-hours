import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { deleteChatHistory } from '@actions/AiChatController'

interface DeleteChatHistoryProps {
    chatId: number
    onDelete: () => void
}

export default function DeleteChatHistory({ chatId, onDelete }: DeleteChatHistoryProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [processing, setProcessing] = useState(false)

    const handleDelete = async () => {
        try {
            setProcessing(true)
            const response = await deleteChatHistory.call({
                data: { id: chatId },
            })

            if (response && response.ok) {
                const data = await response.json()
                if (data.success) {
                    onDelete()
                    setIsOpen(false)
                }
            }
        } catch (error) {
            console.error('Error deleting chat history:', error)
        } finally {
            setProcessing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-neutral-500 transition-colors duration-200 hover:bg-neutral-100 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-red-400"
                    onClick={(e) => {
                        e.stopPropagation() // Prevent triggering the click on the parent element
                        setIsOpen(true)
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
                <DialogTitle className="text-lg font-medium text-neutral-900 dark:text-neutral-100">Delete Chat History</DialogTitle>
                <DialogDescription className="text-neutral-600 dark:text-neutral-400">
                    Are you sure you want to delete this chat history? This action cannot be undone.
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button
                            variant="secondary"
                            className="border-neutral-200 bg-white text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button
                        variant="destructive"
                        disabled={processing}
                        onClick={handleDelete}
                        className="bg-red-600 text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-700/80 dark:hover:bg-red-700"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
