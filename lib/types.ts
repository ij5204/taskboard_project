export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'
export type Priority = 'low' | 'normal' | 'high'

export interface Task {
  id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  user_id: string
  assignee_id: string | null
  created_at: string
  assignee?: TeamMember | null
  task_labels?: { label: Label }[]
}

export interface Label {
  id: string
  name: string
  color: string
  user_id: string
}

export interface TeamMember {
  id: string
  name: string
  avatar_color: string
  user_id: string
}

export interface Comment {
  id: string
  task_id: string
  user_id: string
  body: string
  created_at: string
}

export interface ActivityLog {
  id: string
  task_id: string
  user_id: string
  event_type: string
  payload: {
    from?: string
    to?: string
    [key: string]: any
  } | null
  created_at: string
}

export const COLUMNS: { id: Status; label: string }[] = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review',   label: 'In Review' },
  { id: 'done',        label: 'Done' },
]