import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE = 'prezunic_admin'

function secret() {
  const value = process.env.SESSION_SECRET
  if (!value) throw new Error('SESSION_SECRET não configurado')
  return value
}

function signature(expires: string) {
  return createHmac('sha256', secret()).update('admin:' + expires).digest('hex')
}

export async function createAdminSession() {
  const expires = String(Date.now() + 12 * 60 * 60 * 1000)
  const token = expires + '.' + signature(expires)
  const store = await cookies()
  store.set(COOKIE, token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 12 * 60 * 60 })
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(COOKIE)
}

export async function isAdmin() {
  try {
    const store = await cookies()
    const token = store.get(COOKIE)?.value
    if (!token) return false
    const [expires, sig] = token.split('.')
    if (!expires || !sig || Number(expires) < Date.now()) return false
    const expected = signature(expires)
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    return a.length === b.length && timingSafeEqual(a, b)
  } catch {
    return false
  }
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}
