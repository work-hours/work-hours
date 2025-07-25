import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import AiChat from '@/components/ai-chat'
import { BrainCircuit } from 'lucide-react'

type FloatingAiChatProps = {
    projects?: Array<{ id: number; name: string }>
    timeLogs?: Array<{
        id: number
        project_name: string
        duration: number
        note: string
    }>
}

export default function FloatingAiChat({ projects = [] }: FloatingAiChatProps) {
    return (
        <Sheet>
            <div className="fixed right-4 bottom-24 z-50 animate-in fade-in slide-in-from-right-5 duration-300">
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-16 w-16 rounded-xl bg-background border border-primary/20 shadow-md hover:bg-primary/5 hover:border-primary/30 transition-all duration-200"
                    >
                        <div className="relative flex flex-col items-center justify-center gap-1">
                            <BrainCircuit className="h-7 w-7 text-primary" />
                            <span className="text-xs font-semibold text-primary">Ask AI</span>
                        </div>
                    </Button>
                </SheetTrigger>
            </div>
            <SheetContent className="p-0 overflow-hidden">
                <AiChat projects={projects} />
            </SheetContent>
        </Sheet>
    )
}
