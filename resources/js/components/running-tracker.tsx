import { Button } from '@/components/ui/button'
import { Pause, Play, Square } from 'lucide-react'
import { useMemo } from 'react'
import { useTimeTracker } from '@/contexts/time-tracker-context'

function formatHMS(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}

export default function RunningTracker() {
  const { running, paused, task, elapsedMs, pause, resume, stop } = useTimeTracker()

  const timeStr = useMemo(() => formatHMS(elapsedMs), [elapsedMs])

  if (!running || !task) return null

  return (
    <div className="mx-4 flex max-w-[560px] flex-1 items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className="flex min-w-0 flex-col">
          <div className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{task.project_name} • {task.title}</div>
          <div className="text-xs font-mono text-blue-600 dark:text-blue-400">{timeStr}</div>
        </div>
        <div className="flex items-center gap-2">
          {paused ? (
            <Button size="sm" variant="secondary" onClick={resume} title="Resume">
              <Play className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="sm" variant="secondary" onClick={pause} title="Pause">
              <Pause className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="destructive" onClick={stop} title="Stop">
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
