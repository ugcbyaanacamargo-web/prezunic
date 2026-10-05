import 'server-only'
import { createClient } from '@supabase/supabase-js'

export function hasSupabaseConfig() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}
export function publicDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('Supabase não configurado')
  return createClient(url, key, { auth: { persistSession:false, autoRefreshToken:false, detectSessionInUrl:false } })
}
export function adminDbSecret() {
  const value = process.env.ADMIN_DB_SECRET
  if (!value) throw new Error('ADMIN_DB_SECRET não configurado')
  return value
}
