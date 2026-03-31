'use client'
import { useAuth } from '@/hooks/useAuth'
import { BoardView } from '@/components/board/BoardView'
import { Spinner } from '@/components/ui/Spinner'

export default function BoardPage() {
  const { loading, userId } = useAuth()

  if (loading) return <Spinner />
  if (!userId) return <Spinner />

  return <BoardView userId={userId} />
}