'use client'
import { useState } from 'react'
import { useUpdateTask, useDeleteTask, useCreateLabel, useAddTaskLabel, useRemoveTaskLabel } from '@/lib/mutations'
import { useLabels, useTasks } from '@/lib/queries'
import { CommentThread } from '@/components/task/CommentThread'
import { ActivityLog } from '@/components/task/ActivityLog'
import { PriorityBadge } from '@/components/ui/PriorityBadge'
import { DueDateIndicator } from '@/components/ui/DueDateIndicator'
import { LabelBadge } from '@/components/ui/LabelBadge'
import { formatDate } from '@/lib/utils'
import type { Task } from '@/lib/types'
import { useTeamMembers } from '@/lib/queries'
import { useCreateTeamMember, useAssignTask } from '@/lib/mutations'
import { Avatar } from '@/components/ui/Avatar'

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6', '#3b82f6',
]

function LabelSection({ taskId }: { taskId: string }) {
  const { data: allLabels } = useLabels()
  const { data: tasks } = useTasks()
  const { mutateAsync: createLabel } = useCreateLabel()
  const { mutateAsync: addLabel } = useAddTaskLabel()
  const { mutateAsync: removeLabel } = useRemoveTaskLabel()

  const task = tasks?.find(t => t.id === taskId)
  const assignedIds = task?.task_labels?.map(tl => tl.label.id) ?? []

  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(PRESET_COLORS[0])
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) return
    const label = await createLabel({ name: newName.trim(), color: newColor })
    await addLabel({ taskId, labelId: label.id })
    setNewName('')
    setCreating(false)
  }

  return (
    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--text-muted)' }}>Labels</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {task?.task_labels?.map(({ label }) => (
          <div key={label.id} className="flex items-center gap-1 group">
            <LabelBadge name={label.name} color={label.color} />
            <button
              onClick={() => removeLabel({ taskId, labelId: label.id })}
              className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: 'var(--text-muted)' }}
            >×</button>
          </div>
        ))}
        {(!task?.task_labels || task.task_labels.length === 0) && (
          <p className="text-xs" style={{ color: 'var(--text-faint)' }}>No labels</p>
        )}
      </div>

      {allLabels && allLabels.filter(l => !assignedIds.includes(l.id)).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {allLabels.filter(l => !assignedIds.includes(l.id)).map(label => (
            <button
              key={label.id}
              onClick={() => addLabel({ taskId, labelId: label.id })}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <LabelBadge name={label.name} color={label.color} />
            </button>
          ))}
        </div>
      )}

      {creating ? (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            placeholder="Label name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="text-xs rounded-lg px-3 py-1.5 focus:outline-none w-full"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-1.5 flex-wrap">
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className="w-5 h-5 rounded-full transition-transform"
                style={{
                  background: c,
                  transform: newColor === c ? 'scale(1.25)' : 'scale(1)',
                  outline: newColor === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCreating(false)}
              className="text-xs px-3 py-1 rounded-lg"
              style={{ color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <button onClick={handleCreate}
              className="text-xs font-medium px-3 py-1 rounded-lg"
              style={{ background: '#6d28d9', color: '#fff' }}>
              Create
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          + Add label
        </button>
      )}
    </div>
  )
}

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#22c55e', '#14b8a6', '#3b82f6',
]

function TeamSection({ task }: { task: Task }) {
  const { data: members } = useTeamMembers()
  const { mutateAsync: createMember } = useCreateTeamMember()
  const { mutateAsync: assignTask } = useAssignTask()

  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(AVATAR_COLORS[0])
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) return
    const member = await createMember({ name: newName.trim(), avatar_color: newColor })
    await assignTask({ taskId: task.id, assigneeId: member.id })
    setNewName('')
    setCreating(false)
  }

  async function handleAssign(memberId: string) {
    if (task.assignee_id === memberId) {
      await assignTask({ taskId: task.id, assigneeId: null })
    } else {
      await assignTask({ taskId: task.id, assigneeId: memberId })
    }
  }

  return (
    <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--text-muted)' }}>Assignee</p>

      {task.assignee ? (
        <div className="flex items-center gap-2 mb-3">
          <Avatar name={task.assignee.name} color={task.assignee.avatar_color} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {task.assignee.name}
          </span>
          <button
            onClick={() => assignTask({ taskId: task.id, assigneeId: null })}
            className="text-xs ml-auto transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            Remove
          </button>
        </div>
      ) : (
        <p className="text-xs mb-3" style={{ color: 'var(--text-faint)' }}>No assignee</p>
      )}

      {members && members.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {members.map(member => (
            <button
              key={member.id}
              onClick={() => handleAssign(member.id)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all"
              style={{
                background: task.assignee_id === member.id ? 'var(--bg-card)' : 'var(--bg-input)',
                border: `1px solid ${task.assignee_id === member.id ? '#6d28d9' : 'var(--border)'}`,
              }}
            >
              <Avatar name={member.name} color={member.avatar_color} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {member.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {creating ? (
        <div className="flex flex-col gap-2">
          <input
            autoFocus
            placeholder="Member name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="text-xs rounded-lg px-3 py-1.5 focus:outline-none w-full"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
          <div className="flex gap-1.5 flex-wrap">
            {AVATAR_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setNewColor(c)}
                className="w-5 h-5 rounded-full transition-transform"
                style={{
                  background: c,
                  transform: newColor === c ? 'scale(1.25)' : 'scale(1)',
                  outline: newColor === c ? `2px solid ${c}` : 'none',
                  outlineOffset: '2px',
                }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCreating(false)}
              className="text-xs px-3 py-1 rounded-lg"
              style={{ color: 'var(--text-muted)' }}>
              Cancel
            </button>
            <button onClick={handleCreate}
              className="text-xs font-medium px-3 py-1 rounded-lg"
              style={{ background: '#6d28d9', color: '#fff' }}>
              Add & assign
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="text-xs transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          + Add member
        </button>
      )}
    </div>
  )
}

export function TaskDetailPanel({
  task,
  userId,
  onClose,
}: {
  task: Task
  userId: string
  onClose: () => void
}) {
  const [tab, setTab] = useState<'comments' | 'activity'>('comments')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const { mutateAsync: updateTask } = useUpdateTask()
  const { mutateAsync: deleteTask } = useDeleteTask()

  async function handleSave() {
    await updateTask({ id: task.id, title, description })
    setEditing(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this task?')) return
    await deleteTask(task.id)
    onClose()
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg-secondary)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid var(--border)' }}>
        <span className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}>
          Task detail
        </span>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-lg transition-colors"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-input)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ×
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Title */}
        <div className="px-5 pt-5 pb-2">
          {editing ? (
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full text-base font-semibold rounded-lg px-3 py-2 focus:outline-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          ) : (
            <h2
              className="text-base font-semibold cursor-pointer leading-snug"
              style={{ color: 'var(--text-primary)' }}
              onClick={() => setEditing(true)}
            >
              {task.title}
            </h2>
          )}
        </div>

        {/* Meta */}
        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <DueDateIndicator date={task.due_date} />
          <span className="text-xs ml-auto" style={{ color: 'var(--text-faint)' }}>
            {formatDate(task.created_at)}
          </span>
        </div>

        {/* Description */}
        <div className="px-5 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
          {editing ? (
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Add a description..."
              className="w-full text-sm rounded-lg px-3 py-2 focus:outline-none resize-none"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            />
          ) : (
            <p
              className="text-sm cursor-pointer leading-relaxed"
              style={{ color: task.description ? 'var(--text-secondary)' : 'var(--text-faint)' }}
              onClick={() => setEditing(true)}
            >
              {task.description || 'Add a description...'}
            </p>
          )}
          {editing && (
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => setEditing(false)}
                className="text-xs px-3 py-1.5 rounded-lg"
                style={{ color: 'var(--text-muted)' }}>
                Cancel
              </button>
              <button onClick={handleSave}
                className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ background: '#6d28d9', color: '#fff' }}>
                Save
              </button>
            </div>
          )}
        </div>

        {/* Labels */}
        <LabelSection taskId={task.id} />

        {/* Team */}
        <TeamSection task={task} />

        {/* Tabs */}
        <div className="flex px-5" style={{ borderBottom: '1px solid var(--border)' }}>
          {(['comments', 'activity'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-xs font-medium py-3 mr-5 border-b-2 transition-colors capitalize"
              style={{
                borderColor: tab === t ? '#6d28d9' : 'transparent',
                color: tab === t ? '#a78bfa' : 'var(--text-muted)',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'comments'
          ? <CommentThread taskId={task.id} userId={userId} />
          : <ActivityLog taskId={task.id} />
        }
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex justify-between items-center"
        style={{ borderTop: '1px solid var(--border)' }}>
        <button onClick={handleDelete}
          className="text-xs transition-colors"
          style={{ color: '#ef4444' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fca5a5'}
          onMouseLeave={e => e.currentTarget.style.color = '#ef4444'}>
          Delete task
        </button>
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
          Click title to edit
        </span>
      </div>
    </div>
  )
}