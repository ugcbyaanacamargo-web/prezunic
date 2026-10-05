import Link from 'next/link'
import type { DashboardData, Task } from '@/lib/types'

const DAY=86400000
function dt(s:string){ return new Date(s+'T12:00:00') }
function fmt(s?:string|null){ return s?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit'}).format(dt(s)):'—' }
function days(a:string,b:string){ return Math.max(1,Math.round((dt(b).getTime()-dt(a).getTime())/DAY)+1) }
function taskStatus(t:Task){ if(t.progress>=100)return 'done'; if(t.progress>0)return 'active'; return 'planned' }
function plannedCurve(tasks:Task[],start:string,end:string){
  const leaf=tasks.filter(t=>!t.is_summary); const s=dt(start).getTime(), e=dt(end).getTime(), span=Math.max(DAY,e-s); const out=[]
  for(let i=0;i<=12;i++){ const x=s+span*i/12; let sum=0
    for(const t of leaf){ const a=dt(t.planned_start).getTime(),b=dt(t.planned_end).getTime(); sum+=x<a?0:x>=b?1:Math.max(0,Math.min(1,(x-a)/Math.max(DAY,b-a))) }
    out.push({date:new Date(x),value:leaf.length?sum/leaf.length*100:0})
  } return out
}
function Curve({data}:{data:DashboardData}){
  const planned=plannedCurve(data.tasks,data.project.start_date,data.project.end_date); const w=900,h=230,p=30
  const min=dt(data.project.start_date).getTime(),max=dt(data.project.end_date).getTime(),span=Math.max(DAY,max-min)
  const xy=(time:number,val:number)=>({x:p+(time-min)/span*(w-2*p),y:h-p-(val/100)*(h-2*p)})
  const path=planned.map((v,i)=>{const q=xy(v.date.getTime(),v.value);return (i?'L':'M')+q.x.toFixed(1)+' '+q.y.toFixed(1)}).join(' ')
  return <div className="curve-wrap"><svg className="curve" viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Curva S planejada e avanço registrado">
    {[0,25,50,75,100].map(v=><g key={v}><line x1={p} x2={w-p} y1={xy(min,v).y} y2={xy(min,v).y} className="grid-line"/><text x={4} y={xy(min,v).y+4}>{v}%</text></g>)}
    <path d={path} className="planned-line"/>
    {data.snapshots.map(s=>{const q=xy(dt(s.snapshot_date).getTime(),Number(s.actual_progress));return <g key={s.id}><circle cx={q.x} cy={q.y} r="6" className="actual-dot"/><text x={q.x+9} y={q.y-9} className="point-label">Real {Number(s.actual_progress).toFixed(0)}%</text></g>})}
  </svg><div className="curve-legend"><span><i className="line-key"/>Planejado calculado pelas atividades</span><span><i className="dot-key"/>Medições reais registradas</span></div></div>
}

export function ProjectDashboard({data}:{data:DashboardData}){
  const {project,phases,tasks,issues}=data; const leaf=tasks.filter(t=>!t.is_summary); const inProgress=leaf.filter(t=>t.progress>0&&t.progress<100).length
  const explicitLinks=leaf.filter(t=>t.predecessor_text).length; const openIssues=issues.filter(i=>!/^conclu|^fech/i.test(i.status)).length
  const totalDays=days(project.start_date,project.end_date); const s=dt(project.start_date).getTime(),e=dt(project.end_date).getTime(),span=Math.max(DAY,e-s)
  const gantt=(t:Task)=>{const a=Math.max(0,Math.min(1,(dt(t.planned_start).getTime()-s)/span))*100;const b=Math.max(0,Math.min(1,(dt(t.planned_end).getTime()-s)/span))*100;return {left:a+'%',width:Math.max(1.4,b-a)+'%'}}
  return <main>
    <header className="topbar"><div className="brand"><span className="brand-mark">P</span><div><b>PREZUNIC</b><small>PLANEJAMENTO DE OBRA</small></div></div>
      <nav><a href="#visao">Visão geral</a><a href="#curva">Curva S</a><a href="#cronograma">Cronograma</a><a href="#pendencias">Pendências</a></nav>
      <Link className="admin-link" href="/admin">Administrativo</Link></header>

    <section className="hero" id="visao"><div><span className="eyebrow">{project.code} · {project.status}</span><h1>{project.name}</h1><p>{project.client} · {project.location}</p>
      <div className="hero-dates"><div><small>INÍCIO</small><strong>{fmt(project.start_date)}</strong></div><span>→</span><div><small>FIM</small><strong>{fmt(project.end_date)}</strong></div><div><small>DURAÇÃO</small><strong>{totalDays} dias corridos</strong></div></div></div>
      <div className="progress-ring" style={{background:`conic-gradient(var(--accent) ${Number(project.progress)}%,rgba(255,255,255,.08) 0)`}}><div><strong>{Number(project.progress).toFixed(0)}%</strong><span>avanço registrado</span></div></div></section>

    {project.data_status==='modelo_inicial'&&<div className="model-banner"><b>MODELO IMPORTADO DO MS PROJECT</b><span>Base: {project.reference_source}. Este é um cronograma de referência para você adaptar à nova obra no painel administrativo.</span></div>}

    <section className="kpis"><article><span>ATIVIDADES</span><strong>{leaf.length}</strong><small>tarefas executivas</small></article><article><span>FRENTES PRINCIPAIS</span><strong>{phases.length}</strong><small>grupos de trabalho</small></article><article><span>EM ANDAMENTO</span><strong>{inProgress}</strong><small>com avanço registrado</small></article><article><span>VÍNCULOS EXPLÍCITOS</span><strong>{explicitLinks}</strong><small>predecessoras do Project</small></article><article><span>PENDÊNCIAS</span><strong>{openIssues}</strong><small>itens de gestão</small></article></section>

    <section className="section"><div className="section-head"><div><span className="eyebrow">VISÃO POR FRENTE</span><h2>Avanço das etapas</h2></div><span className="muted">Os percentuais abaixo vieram do arquivo de referência.</span></div>
      <div className="phase-grid">{phases.map((p,i)=><article className="phase-card" key={p.id}><div className="phase-number">{String(i+1).padStart(2,'0')}</div><h3>{p.name}</h3><div className="bar"><i style={{width:Number(p.progress)+'%'}}/></div><div className="phase-foot"><b>{Number(p.progress).toFixed(0)}%</b><span>{fmt(p.planned_start)} — {fmt(p.planned_end)}</span></div></article>)}</div></section>

    <section className="section chart-panel" id="curva"><div className="section-head"><div><span className="eyebrow">CONTROLE DE PRAZO</span><h2>Curva S</h2></div><span className="muted">Planejado calculado pela distribuição das atividades; o real aparece apenas quando há medição registrada.</span></div><Curve data={data}/></section>

    <section className="section gantt-section" id="cronograma"><div className="section-head"><div><span className="eyebrow">LINHA DO TEMPO</span><h2>Gantt simplificado</h2></div><div className="legend"><span><i className="dot active"/>Com avanço</span><span><i className="dot planned"/>Planejada</span><span><i className="dot summary"/>Resumo</span></div></div>
      <div className="gantt"><div className="gantt-head"><div>ESTRUTURA DO PROJECT</div><div className="gantt-scale"><span>{fmt(project.start_date)}</span><span>período de referência</span><span>{fmt(project.end_date)}</span></div></div>
        {tasks.map(t=><div className={'gantt-row '+(t.is_summary?'summary-row':'')} key={t.id}><div className="gantt-label" style={{paddingLeft:`${Math.max(0,t.outline_level-2)*13}px`}}><span className="task-id">{t.source_id}</span><div><b>{t.name}</b><small>{t.progress}% · {t.predecessor_text?'Pred. '+t.predecessor_text:'Sem predecessor explícito'}</small></div></div><div className="gantt-track"><span className={'gantt-bar '+(t.is_summary?'summary':taskStatus(t))} style={gantt(t)}><i style={{width:Number(t.progress)+'%'}}/></span></div></div>)}
      </div></section>

    <section className="two-cols"><article className="panel"><div className="section-head compact"><div><span className="eyebrow">DEPENDÊNCIAS</span><h2>Vínculos importados</h2></div></div><div className="list">{tasks.filter(t=>t.predecessor_text).length?tasks.filter(t=>t.predecessor_text).map(t=><div className="list-item" key={t.id}><span className="status-pill">PRED. {t.predecessor_text}</span><div><b>{t.name}</b><small>{fmt(t.planned_start)} → {fmt(t.planned_end)}</small></div></div>):<p className="muted">Nenhum vínculo explícito encontrado.</p>}</div></article>
      <article className="panel" id="pendencias"><div className="section-head compact"><div><span className="eyebrow">GESTÃO</span><h2>Pendências</h2></div></div><div className="list">{issues.map(i=><div className="list-item" key={i.id}><span className={'priority '+i.priority}>{i.priority}</span><div><b>{i.title}</b><small>{i.category} · {i.owner}</small></div><time>{fmt(i.due_date)}</time></div>)}</div></article></section>

    <section className="section table-section"><div className="section-head"><div><span className="eyebrow">DADOS COMPLETOS</span><h2>Lista de atividades</h2></div></div><div className="table-scroll"><table><thead><tr><th>ID</th><th>Atividade</th><th>Início</th><th>Fim</th><th>Avanço</th><th>Predecessora</th></tr></thead><tbody>{tasks.map(t=><tr key={t.id} className={t.is_summary?'summary-tr':''}><td>{t.source_id}</td><td style={{paddingLeft:`${16+Math.max(0,t.outline_level-2)*18}px`}}>{t.name}</td><td>{fmt(t.planned_start)}</td><td>{fmt(t.planned_end)}</td><td><b>{t.progress}%</b></td><td>{t.predecessor_text||'—'}</td></tr>)}</tbody></table></div></section>

    <footer><div><b>PREZUNIC · PLANEJAMENTO DE OBRA</b><span>Atualização pelo painel administrativo</span></div><small>Dados: {data.source==='supabase'?'Supabase':'base local de contingência'}</small></footer>
  </main>
}
