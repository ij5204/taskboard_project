import { cn } from '@/lib/utils'
import type { Priority } from '@/lib/types'

const styles: Record<Priority, { bg: string; color: string }> = {
  low:    { bg: 'var(--bg-input)',  color: 'var(--text-muted)' },
  normal: { bg: '#dbeafe', color: '#1d4ed8' },
  high:   { bg: '#fee2e2', color: '#dc2626' },
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const s = styles[priority]
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize"
      style={{ background: s.bg, color: s.color }}
    >
      {priority}
    </span>
  )
}