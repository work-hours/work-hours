import { Button } from '@/components/ui/button'
import AiChat from '@/components/ai-chat'
import { BrainCircuit } from 'lucide-react'
import { useState } from 'react'

type FloatingAiChatProps = {
    projects?: Array<{ id: number; name: string }>
    timeLogs?: Array<{
        id: number
        project_name: string
        duration: number
        note: string
    }>
}

export default function FloatingAiChat({ projects = [], timeLogs = [] }: FloatingAiChatProps) {
    const [isAiChatVisible, setIsAiChatVisible] = useState(false)

    return (
        <>
            {isAiChatVisible && (
                <AiChat
                    onClose={() => setIsAiChatVisible(false)}
                    projects={projects}
                    timeLogs={timeLogs}
                />
            )}
            <div className="fixed right-4 bottom-24 z-50">
                <Button
                    onClick={() => setIsAiChatVisible(true)}
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full bg-white shadow-lg hover:bg-gray-100"
                >
                    <div className="flex flex-col items-center justify-center">
                        <BrainCircuit className="h-6 w-6 text-primary" />
                        <span className="text-xs font-bold text-primary">Ask AI</span>
                    </div>
                </Button>
            </div>
        </>
    )
}
