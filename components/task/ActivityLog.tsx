'use client'
import { useActivity } from '@/lib/queries'
import { timeAgo } from '@/lib/utils'

export function ActivityLog({ taskId }: { taskId: string }) {
  const { data: activity, isLoading } = useActivity(taskId)

  return (
    <div className="p-5 flex flex-col gap-3">
      {isLoading && (
        <p className="text-xs text-neutral-400">Loading activity...</p>
      )}
      {!isLoading && activity?.length === 0 && (
        <p className="text-xs text-neutral-400">No activity yet.</p>
      )}
      {activity?.map(log => (
        <div key={log.id} className="flex items-start gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-1.5 flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="text-sm text-neutral-700">
              {log.event_type === 'status_changed' && log.payload && (
                <>
                  Moved from{' '}
                  <span className="font-medium">{log.payload.from?.replace('_', ' ')}</span>
                  {' '}to{' '}
                  <span className="font-medium">{log.payload.to?.replace('_', ' ')}</span>
                </>
              )}
              {log.event_type !== 'status_changed' && log.event_type}
            </p>
            <span className="text-xs text-neutral-400">{timeAgo(log.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}