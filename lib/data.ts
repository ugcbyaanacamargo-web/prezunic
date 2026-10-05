import 'server-only'
import { referenceData } from './reference-data'
import { adminDbSecret, hasSupabaseConfig, publicDb } from './supabase'
import type { DashboardData } from './types'

async function readFromDb():Promise<DashboardData|null>{
  const db=publicDb(); const {data:project,error}=await db.from('projects').select('*').eq('slug','prezunic').single()
  if(error||!project) return null
  const [phases,tasks,issues,snapshots]=await Promise.all([
    db.from('phases').select('*').eq('project_id',project.id).order('sort_order'),
    db.from('tasks').select('*').eq('project_id',project.id).order('sort_order'),
    db.from('issues').select('*').eq('project_id',project.id).order('created_at',{ascending:false}),
    db.from('progress_snapshots').select('*').eq('project_id',project.id).order('snapshot_date'),
  ])
  if(phases.error||tasks.error||issues.error||snapshots.error) return null
  return {source:'supabase',project,phases:phases.data??[],tasks:tasks.data??[],issues:issues.data??[],snapshots:snapshots.data??[]} as DashboardData
}
export async function getDashboardData(): Promise<DashboardData> {
  if(!hasSupabaseConfig()) return referenceData
  try{
    const current=await readFromDb(); if(current) return current
    const db=publicDb(); const {error}=await db.rpc('admin_seed_reference',{p_secret:adminDbSecret(),p_payload:referenceData})
    if(error) return referenceData
    return (await readFromDb())??referenceData
  }catch{return referenceData}
}
