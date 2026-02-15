import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getCurrentUser, convertToAuthUser, type AuthUser } from '../lib/auth'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ? convertToAuthUser(session.user) : null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session)
      setUser(session?.user ? convertToAuthUser(session.user) : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const refreshUser = async () => {
    const { user: freshUser } = await getCurrentUser()
    setUser(freshUser ? convertToAuthUser(freshUser) : null)
  }

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    refreshUser
  }
}
