import 'server-only'
import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE='prezunic_admin'
function secret(){ const v=process.env.SESSION_SECRET; if(!v) throw new Error('SESSION_SECRET não configurado'); return v }
function sign(expires:string){ return createHmac('sha256',secret()).update('admin:'+expires).digest('hex') }
export function safeEqual(a:string,b:string){ const x=Buffer.from(a),y=Buffer.from(b); return x.length===y.length && timingSafeEqual(x,y) }
export async function createAdminSession(){
  const expires=String(Date.now()+12*60*60*1000); const token=expires+'.'+sign(expires); const store=await cookies()
  store.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:12*60*60})
}
export async function clearAdminSession(){ (await cookies()).delete(COOKIE) }
export async function isAdmin(){
  try{ const token=(await cookies()).get(COOKIE)?.value; if(!token) return false; const [expires,sig]=token.split('.')
    if(!expires||!sig||Number(expires)<Date.now()) return false; return safeEqual(sig,sign(expires)) } catch { return false }
}
export async function requireAdmin(){ if(!(await isAdmin())) redirect('/admin/login') }
