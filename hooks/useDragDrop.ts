import { DragEndEvent } from '@dnd-kit/core'
import { useUpdateTaskStatus } from '@/lib/mutations'
import type { Status } from '@/lib/types'

const VALID_STATUSES: Status[] = ['todo', 'in_progress', 'in_review', 'done']

export function useDragDrop() {
  const { mutate: updateStatus } = useUpdateTaskStatus()

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (!over) return
    if (active.id === over.id) return

    const newStatus = over.id as string

    if (!VALID_STATUSES.includes(newStatus as Status)) return

    updateStatus({
      id: active.id as string,
      status: newStatus as Status,
    })
  }

  return { handleDragEnd }
}