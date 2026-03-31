'use client'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { TaskCard } from '@/components/board/BoardTaskCard'
import type { Task } from '@/lib/types'

const columnConfig: Record<string, {
  label: string
  dot: string
  pill: string
  pillText: string
  accent: string
}> = {
  todo:        { label: 'To Do',       dot: '#64748b', pill: '#1e2130', pillText: '#94a3b8', accent: '#334155' },
  in_progress: { label: 'In Progress', dot: '#3b82f6', pill: '#1e2a3a', pillText: '#60a5fa', accent: '#1d4ed8' },
  in_review:   { label: 'In Review',   dot: '#a78bfa', pill: '#261e3a', pillText: '#a78bfa', accent: '#7c3aed' },
  done:        { label: 'Done',        dot: '#34d399', pill: '#1a2e28', pillText: '#34d399', accent: '#059669' },
}

export function BoardColumn({
  id, label, tasks, onCardClick,
}: {
  id: string
  label: string
  tasks: Task[]
  onCardClick: (task: Task) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id })
  const config = columnConfig[id] ?? columnConfig.todo

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col flex-1 flex-shrink-0 transition-all duration-200"
      style={{
        background: isOver ? 'var(--bg-card)' : 'var(--bg-secondary)',
        border: `1px solid ${isOver ? '#6d28d9' : 'var(--border)'}`,
      borderRadius: '16px',
    }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: config.dot }} />
            {config.label}
          </span>
        </div>
        <span
        className="text-[11px] font-medium rounded-md px-2 py-0.5"
        style={{ background: 'var(--bg-input)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 p-3">
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={onCardClick} accent={config.accent} />
          ))}
          {tasks.length === 0 && (
            <div className="py-10 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--border)' }}>
                <div className="w-3 h-0.5 rounded-full" style={{ background: 'var(--text-faint)' }} />
                </div>
                <p className="text-[11px]" style={{ color: 'var(--text-faint)' }}>No tasks yet</p>
                </div>
              )}
        </div>
      </SortableContext>
    </div>
  )
}