import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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
                data: { id: chatId }
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
                    className="h-6 w-6 hover:bg-background/80 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation() // Prevent triggering the click on the parent element
                        setIsOpen(true)
                    }}
                >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogTitle>Delete Chat History</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this chat history? This action cannot be undone.
                </DialogDescription>
                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button variant="destructive" disabled={processing} onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
