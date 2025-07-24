import { createClient } from '@supabase/supabase-js'

// Try to import config values if they exist
let projectId = ''
let publicAnonKey = ''

// In development, these will be imported from info.tsx
// In production, they'll be empty and env vars will be used
try {
  // @ts-ignore - This file might not exist in production
  const info = require('./info')
  projectId = info.projectId || ''
  publicAnonKey = info.publicAnonKey || ''
} catch {
  // info.tsx doesn't exist, use env vars
}

// Use environment variables for production, fallback to info.tsx for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (projectId ? `https://${projectId}.supabase.co` : '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey

let supabaseClient;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  // Create a dummy client to prevent runtime errors
  // This will fail gracefully when API calls are made
  const dummyUrl = 'https://dummy.supabase.co'
  const dummyKey = 'dummy-key'
  supabaseClient = createClient(dummyUrl, dummyKey)
} else {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseClient

export const API_BASE_URL = `${supabaseUrl}/functions/v1/make-server-549d2100`

// Auth helpers
export const signUp = async (email: string, password: string, name: string, username: string, role: string, skills: string[]) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`
      },
      body: JSON.stringify({ email, password, name, username, role, skills })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Signup failed')
    }
    
    return data
  } catch (error) {
    console.error('Signup error:', error)
    throw error
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      throw error
    }
    return session
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

// API helpers
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const session = await getCurrentSession()
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    } else {
      headers['Authorization'] = `Bearer ${supabaseAnonKey}`
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`)
    }
    
    return data
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error)
    throw error
  }
}