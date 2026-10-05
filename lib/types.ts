export type Project = {
  id: string; slug: string; name: string; code: string; client: string; location: string;
  start_date: string; end_date: string; baseline_end_date: string | null; progress: number;
  status: string; data_status: 'modelo_inicial' | 'obra_real'; reference_source?: string | null; updated_at?: string;
}
export type Phase = {
  id: string; project_id: string; source_uid?: number | null; name: string; sort_order: number;
  planned_start: string; planned_end: string; progress: number; responsible: string; status: string; description?: string | null;
}
export type Task = {
  id: string; project_id: string; phase_id?: string | null; source_id?: number | null; source_uid?: number | null;
  parent_source_uid?: number | null; outline_level: number; wbs: string; name: string; planned_start: string; planned_end: string;
  actual_start?: string | null; actual_end?: string | null; progress: number; status: string; responsible: string;
  predecessor_text?: string | null; critical: boolean; is_milestone: boolean; is_summary: boolean; notes?: string | null; sort_order: number;
}
export type Issue = {
  id: string; project_id: string; title: string; category: string; priority: 'baixa'|'media'|'alta'|'critica';
  status: string; owner: string; due_date?: string | null; notes?: string | null;
}
export type ProgressSnapshot = {
  id: string; project_id: string; snapshot_date: string; planned_progress: number; actual_progress: number; note?: string | null;
}
export type DashboardData = { project: Project; phases: Phase[]; tasks: Task[]; issues: Issue[]; snapshots: ProgressSnapshot[]; source: 'supabase'|'demo' }
