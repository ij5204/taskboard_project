import { isOverdue, isDueSoon, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function DueDateIndicator({ date }: { date: string | null }) {
  if (!date) return null
  const overdue = isOverdue(date)
  const soon = isDueSoon(date)

  return (
    <span className={cn(
      'text-[10px] font-medium px-2 py-0.5 rounded-full',
      overdue && 'bg-red-500/10 text-red-400',
      soon && !overdue && 'bg-amber-500/10 text-amber-400',
      !overdue && !soon && 'bg-white/5 text-white/30'
    )}>
      {formatDate(date)}
    </span>
  )
}