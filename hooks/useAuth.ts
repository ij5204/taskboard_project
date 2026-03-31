import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import type { Session } from '@supabase/supabase-js'

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    const init = async () => {
      const { data: { session: existing } } = await supabase.auth.getSession()
      if (existing) {
        setSession(existing)
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.signInAnonymously()
      if (error) {
        console.error('Auth error:', error.message)
        setLoading(false)
        return
      }
      setSession(data.session)
      setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return {
    session,
    userId: session?.user.id ?? null,
    loading,
  }
}