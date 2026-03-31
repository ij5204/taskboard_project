'use client'
import { Task } from '@/lib/types'
import { useTheme } from '@/lib/theme'

export function BoardHeader({
  search, onSearch, filterPriority, onFilterPriority, tasks, onCreateTask,
}: {
  search: string
  onSearch: (v: string) => void
  filterPriority: string
  onFilterPriority: (v: string) => void
  tasks: Task[]
  onCreateTask: () => void
}) {
  const { theme, toggle } = useTheme()
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const overdue = tasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date(new Date().toDateString())
  }).length

  return (
    <div
      className="px-8 py-4 flex items-center justify-between gap-4 flex-wrap"
      style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Left side */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
          >
            NPT
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
            NP Taskboard
          </span>
        </div>

        <div
          className="flex items-center gap-4 px-4 py-1.5 rounded-full text-xs"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text-muted)' }}>{total} tasks</span>
          <span style={{ color: '#34d399' }} className="font-medium">{done} done</span>
          {overdue > 0 && (
            <span style={{ color: '#f87171' }} className="font-medium">{overdue} overdue</span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="bg-transparent text-xs focus:outline-none w-36"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>

        <select
          value={filterPriority}
          onChange={e => onFilterPriority(e.target.value)}
          className="text-xs rounded-lg px-3 py-1.5 focus:outline-none"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
        </select>

        <button
          onClick={toggle}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button
          onClick={onCreateTask}
          className="text-xs font-semibold text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
        >
          + New task
        </button>
      </div>
    </div>
  )
}