import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/client'
import type { Task, Comment, ActivityLog, Label, TeamMember } from './types'

export const keys = {
  tasks: ['tasks'] as const,
  comments: (taskId: string) => ['comments', taskId] as const,
  activity: (taskId: string) => ['activity', taskId] as const,
  labels: ['labels'] as const,
  teamMembers: ['teamMembers'] as const,
}

export function useTasks() {
  return useQuery({
    queryKey: keys.tasks,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:team_members(*),
          task_labels(label:labels(*))
        `)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Task[]
    },
  })
}

export function useComments(taskId: string) {
  return useQuery({
    queryKey: keys.comments(taskId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data as Comment[]
    },
  })
}

export function useActivity(taskId: string) {
  return useQuery({
    queryKey: keys.activity(taskId),
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as ActivityLog[]
    },
  })
}

export function useLabels() {
  return useQuery({
    queryKey: keys.labels,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('name')
      if (error) throw error
      return data as Label[]
    },
  })
}

export function useTeamMembers() {
  return useQuery({
    queryKey: keys.teamMembers,
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('name')
      if (error) throw error
      return data as TeamMember[]
    },
  })
}