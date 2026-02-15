import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
}

// Sign up with email and password
export async function signUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name
        }
      }
    })

    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Sign up failed' }
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Sign in failed' }
  }
}

// Sign out
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Sign out failed' }
  }
}

// Get current user
export async function getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Failed to get user' }
  }
}

// Get session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return { session, error: null }
  } catch (error) {
    return { session: null, error: error instanceof Error ? error.message : 'Failed to get session' }
  }
}

// Update user profile
export async function updateProfile(updates: { name?: string; avatar?: string }) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })

    if (error) throw error
    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Update failed' }
  }
}

// Reset password
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Reset password failed' }
  }
}

// Convert Supabase User to AuthUser
export function convertToAuthUser(user: User | null): AuthUser | null {
  if (!user) return null

  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name,
    avatar: user.user_metadata?.avatar
  }
}
