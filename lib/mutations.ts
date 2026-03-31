import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import { keys } from './queries'
import type { Task, Status } from './types'

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
  title: string
  description?: string
  priority?: string
  due_date?: string
  assignee_id?: string
  user_id: string
}) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert(input)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
},
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id)
      if (error) throw error
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: keys.tasks })
      const prev = qc.getQueryData<Task[]>(keys.tasks)
      qc.setQueryData<Task[]>(keys.tasks, old =>
        old?.map(t => t.id === id ? { ...t, status } : t) ?? []
      )
      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) qc.setQueryData(keys.tasks, context.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('tasks').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}

export function useAddComment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, body, userId }: { taskId: string; body: string; userId: string }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('comments')
        .insert({ task_id: taskId, body, user_id: userId })
      if (error) throw new Error(error.message)
    },
    onSuccess: (_data, { taskId }) =>
      qc.invalidateQueries({ queryKey: keys.comments(taskId) }),
  })
}

export function useCreateLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data, error } = await supabase
        .from('labels')
        .insert({ name, color, user_id: user?.id ?? 'guest' })
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.labels }),
  })
}

export function useAddTaskLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, labelId }: { taskId: string; labelId: string }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('task_labels')
        .insert({ task_id: taskId, label_id: labelId })
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}

export function useRemoveTaskLabel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, labelId }: { taskId: string; labelId: string }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('task_labels')
        .delete()
        .eq('task_id', taskId)
        .eq('label_id', labelId)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}

export function useCreateTeamMember() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, avatar_color }: { name: string; avatar_color: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('team_members')
        .insert({ name, avatar_color, user_id: 'guest' })
        .select()
        .single()
      if (error) throw new Error(error.message)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.teamMembers }),
  })
}

export function useAssignTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ taskId, assigneeId }: { taskId: string; assigneeId: string | null }) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('tasks')
        .update({ assignee_id: assigneeId })
        .eq('id', taskId)
      if (error) throw new Error(error.message)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.tasks }),
  })
}
