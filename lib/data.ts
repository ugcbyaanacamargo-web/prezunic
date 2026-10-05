import 'server-only'
import { demoData } from './demo-data'
import { hasSupabaseConfig, publicDb } from './supabase'
import type { DashboardData } from './types'

export async function getDashboardData(): Promise<DashboardData> {
  if (!hasSupabaseConfig()) return demoData

  try {
    const db = publicDb()
    const { data: project, error: projectError } = await db.from('projects').select('*').eq('slug', 'prezunic').single()
    if (projectError || !project) return demoData

    const [phasesRes, tasksRes, issuesRes] = await Promise.all([
      db.from('phases').select('*').eq('project_id', project.id).order('sort_order'),
      db.from('tasks').select('*').eq('project_id', project.id).order('sort_order'),
      db.from('issues').select('*').eq('project_id', project.id).order('created_at', { ascending: false }),
    ])

    if (phasesRes.error || tasksRes.error || issuesRes.error) return demoData

    return {
      source: 'supabase',
      project,
      phases: phasesRes.data ?? [],
      tasks: tasksRes.data ?? [],
      issues: issuesRes.data ?? [],
    } as DashboardData
  } catch {
    return demoData
  }
}
