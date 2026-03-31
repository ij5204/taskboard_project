'use client'
import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { BoardColumn } from '@/components/board/BoardColumn'
import { BoardHeader } from '@/components/board/BoardHeader'
import { Spinner } from '@/components/ui/Spinner'
import { TaskModalCreation } from '@/components/task/TaskModalCreation'
import { TaskDetailPanel } from '@/components/task/TaskDetailModal'
import { useTasks } from '@/lib/queries'
import { useDragDrop } from '@/hooks/useDragDrop'
import { COLUMNS } from '@/lib/types'
import type { Task } from '@/lib/types'

export function BoardView({ userId }: { userId: string }) {
  const { data: tasks, isLoading, isError } = useTasks()
  const { handleDragEnd } = useDragDrop()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [creating, setCreating] = useState(false)
  const [search, setSearch] = useState('')
  const [filterPriority, setFilterPriority] = useState<string>('')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  if (isLoading) return <Spinner />
  if (isError) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-red-400 text-sm">Failed to load board. Please refresh.</p>
    </div>
  )

  const filtered = (tasks ?? []).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchesPriority = filterPriority ? task.priority === filterPriority : true
    return matchesSearch && matchesPriority
  })

  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      <BoardHeader
        search={search}
        onSearch={setSearch}
        filterPriority={filterPriority}
        onFilterPriority={setFilterPriority}
        tasks={tasks ?? []}
        onCreateTask={() => setCreating(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Board area */}
        <div className={`flex-1 px-6 py-6 transition-all duration-300 ${selectedTask ? 'mr-[400px]' : ''}`}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full items-start w-full">
              {COLUMNS.map(col => (
                <BoardColumn
                  key={col.id}
                  id={col.id}
                  label={col.label}
                  tasks={filtered.filter(t => t.status === col.id)}
                  onCardClick={setSelectedTask}
                />
              ))}
            </div>
          </DndContext>
        </div>

        {/* Side panel */}
        {selectedTask && (
          <div
            className="fixed right-0 top-0 h-full w-[400px] flex flex-col overflow-hidden transition-all duration-300 z-40"
            style={{
              background: 'var(--bg-secondary)',
              borderLeft: '1px solid var(--border)',
            }}
          >
            <TaskDetailPanel
              task={selectedTask}
              userId={userId}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>

      {creating && (
        <TaskModalCreation
          userId={userId}
          onClose={() => setCreating(false)}
        />
      )}
    </div>
  )
}