import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/session'
import { loginAction } from '../actions'

export default async function Login({searchParams}:{searchParams:Promise<{error?:string}>}){
  if(await isAdmin()) redirect('/admin')
  const q=await searchParams
  return <main className="login-shell"><section className="login-card"><span className="eyebrow">ACESSO RESTRITO</span><h1>Painel administrativo</h1><p>Edite a identificação da obra, atividades, datas, avanço, responsáveis, predecessoras e pendências. O painel público atualiza a partir do Supabase.</p>
    {q.error&&<div className="error-msg">Usuário ou senha incorretos.</div>}
    <form action={loginAction}><div className="field"><label>USUÁRIO</label><input name="username" autoComplete="username" required/></div><div className="field"><label>SENHA</label><input name="password" type="password" autoComplete="current-password" required/></div><button className="btn" type="submit">Entrar no painel</button></form>
    <p><Link href="/">← Voltar ao painel público</Link></p></section></main>
}
