'use server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminSession, clearAdminSession, requireAdmin, safeEqual } from '@/lib/session'
import { adminDbSecret, publicDb } from '@/lib/supabase'

function text(f:FormData,k:string){ return String(f.get(k)??'').trim() }
function payload(f:FormData, keys:string[]){ return Object.fromEntries(keys.map(k=>[k,text(f,k)])) }
async function rpc(name:string,args:Record<string,unknown>){ const {error}=await publicDb().rpc(name,args); if(error) throw new Error(error.message) }

export async function loginAction(formData:FormData){
  const user=text(formData,'username'), pass=text(formData,'password')
  const eu=process.env.ADMIN_USERNAME??'', ep=process.env.ADMIN_PASSWORD??''
  if(!eu||!ep||!safeEqual(user,eu)||!safeEqual(pass,ep)) redirect('/admin/login?error=1')
  await createAdminSession(); redirect('/admin')
}
export async function logoutAction(){ await clearAdminSession(); redirect('/') }

export async function saveProjectAction(formData:FormData){
  await requireAdmin(); const p=payload(formData,['id','slug','name','code','client','location','start_date','end_date','baseline_end_date','progress','status','data_status','reference_source'])
  await rpc('admin_save_project',{p_secret:adminDbSecret(),p_payload:p}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=project')
}
export async function savePhaseAction(formData:FormData){
  await requireAdmin(); const p=payload(formData,['id','project_id','source_uid','name','sort_order','planned_start','planned_end','progress','responsible','status','description'])
  await rpc('admin_save_phase',{p_secret:adminDbSecret(),p_payload:p}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=phase')
}
export async function saveTaskAction(formData:FormData){
  await requireAdmin(); const p:Record<string,unknown>=payload(formData,['id','project_id','phase_id','source_id','source_uid','parent_source_uid','outline_level','wbs','name','planned_start','planned_end','actual_start','actual_end','progress','status','responsible','predecessor_text','notes','sort_order'])
  p.critical=formData.get('critical')==='on'; p.is_milestone=formData.get('is_milestone')==='on'; p.is_summary=formData.get('is_summary')==='on'
  await rpc('admin_save_task',{p_secret:adminDbSecret(),p_payload:p}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=task')
}
export async function deleteTaskAction(formData:FormData){
  await requireAdmin(); await rpc('admin_delete_task',{p_secret:adminDbSecret(),p_id:text(formData,'id')}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=deleted')
}
export async function saveIssueAction(formData:FormData){
  await requireAdmin(); const p=payload(formData,['id','project_id','title','category','priority','status','owner','due_date','notes'])
  await rpc('admin_save_issue',{p_secret:adminDbSecret(),p_payload:p}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=issue')
}
export async function deleteIssueAction(formData:FormData){
  await requireAdmin(); await rpc('admin_delete_issue',{p_secret:adminDbSecret(),p_id:text(formData,'id')}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=deleted')
}
export async function addSnapshotAction(formData:FormData){
  await requireAdmin(); const p=payload(formData,['project_id','snapshot_date','planned_progress','actual_progress','note'])
  await rpc('admin_add_snapshot',{p_secret:adminDbSecret(),p_payload:p}); revalidatePath('/'); revalidatePath('/admin'); redirect('/admin?saved=snapshot')
}
