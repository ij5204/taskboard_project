'use client'
import { useState } from 'react'
import { useComments } from '@/lib/queries'
import { useAddComment } from '@/lib/mutations'
import { timeAgo } from '@/lib/utils'

export function CommentThread({
  taskId,
  userId,
}: {
  taskId: string
  userId: string
}) {
  const [body, setBody] = useState('')
  const { data: comments, isLoading } = useComments(taskId)
  const { mutateAsync: addComment, isPending } = useAddComment()

  async function handleSubmit() {
    if (!body.trim()) return
    await addComment({ taskId, body: body.trim(), userId })
    setBody('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
        {isLoading && (
          <p className="text-xs text-neutral-400">Loading comments...</p>
        )}
        {!isLoading && comments?.length === 0 && (
          <p className="text-xs text-neutral-400">No comments yet.</p>
        )}
        {comments?.map(comment => (
          <div key={comment.id} className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium" style={{ color: '#a78bfa' }}>Guest</span>
              <span className="text-xs" style={{ color: '#334155' }}>{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm rounded-lg px-3 py-2" style={{ background: '#1a1d27', color: '#94a3b8', border: '1px solid #2e3350' }}>
              {comment.body}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-neutral-100 flex gap-2">
        <input
          type="text"
          placeholder="Write a comment..."
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          className="flex-1 text-sm rounded-lg px-3 py-2 focus:outline-none"
          style={{ background: '#1a1d27', border: '1px solid #2e3350', color: '#94a3b8' }}
        />
        <button
          onClick={handleSubmit}
          disabled={!body.trim() || isPending}
          className="text-sm font-medium bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}