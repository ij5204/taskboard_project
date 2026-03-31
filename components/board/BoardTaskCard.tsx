'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { LabelBadge } from '@/components/ui/LabelBadge'
import { DueDateIndicator } from '@/components/ui/DueDateIndicator'
import { Avatar } from '@/components/ui/Avatar'
import type { Task } from '@/lib/types'

export function TaskCard({
  task, onClick, accent,
}: {
  task: Task
  onClick: (task: Task) => void
  accent: string
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: task.id })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.2 : 1,
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${accent}`,
      borderRadius: '10px',
    }}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className="p-3.5 cursor-pointer transition-all duration-150"
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--bg-input)'
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.borderLeftColor = accent
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.borderLeftColor = accent
      }}
    >
      <p className="text-sm font-medium leading-snug mb-2.5" style={{ color: 'var(--text-primary)' }}>
        {task.title}
      </p>

      {task.description && (
        <p className="text-xs mb-2.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {task.description}
          </p>
      )}

      {task.task_labels && task.task_labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.task_labels.map(({ label }) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2.5"
        style={{ borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <DueDateIndicator date={task.due_date} />
        </div>
        {task.assignee && (
          <Avatar name={task.assignee.name} color={task.assignee.avatar_color} />
        )}
      </div>
    </div>
  )
}