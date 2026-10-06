import Link from 'next/link'
import { getDashboardData } from '@/lib/data'
import type { DashboardData, Task } from '@/lib/types'
import styles from './hachuras.module.css'

export const dynamic='force-dynamic'

const DAY=86400000

function dt(value:string){ return new Date(value+'T12:00:00') }

function plannedCurve(tasks:Task[],start:string,end:string){
  const leaf=tasks.filter(t=>!t.is_summary)
  const s=dt(start).getTime()
  const e=dt(end).getTime()
  const span=Math.max(DAY,e-s)
  const out:{date:Date,value:number}[]=[]
  for(let i=0;i<=16;i++){
    const x=s+span*i/16
    let sum=0
    for(const t of leaf){
      const a=dt(t.planned_start).getTime()
      const b=dt(t.planned_end).getTime()
      sum+=x<a?0:x>=b?1:Math.max(0,Math.min(1,(x-a)/Math.max(DAY,b-a)))
    }
    out.push({date:new Date(x),value:leaf.length?sum/leaf.length*100:0})
  }
  return out
}

function projectedCurve(data:DashboardData){
  const sorted=[...data.snapshots].sort((a,b)=>dt(a.snapshot_date).getTime()-dt(b.snapshot_date).getTime())
  if(!sorted.length)return []
  const start=dt(data.project.start_date).getTime()
  const end=dt(data.project.end_date).getTime()
  const span=Math.max(DAY,end-start)
  const first=sorted[0]
  const last=sorted[sorted.length-1]
  const firstTime=dt(first.snapshot_date).getTime()
  const lastTime=dt(last.snapshot_date).getTime()
  const firstValue=Number(first.actual_progress)
  const lastValue=Number(last.actual_progress)
  const rate=sorted.length>=2
    ?(lastValue-firstValue)/Math.max(DAY,lastTime-firstTime)
    :lastValue/Math.max(DAY,lastTime-start)

  const out:{date:Date,value:number}[]=[]
  for(let i=0;i<=16;i++){
    const x=start+span*i/16
    let value=0
    if(x<=lastTime){
      const previous=[...sorted].reverse().find(s=>dt(s.snapshot_date).getTime()<=x)
      value=previous?Number(previous.actual_progress):Math.max(0,lastValue-rate*(lastTime-x))
    }else{
      value=lastValue+rate*(x-lastTime)
    }
    out.push({date:new Date(x),value:Math.max(0,Math.min(100,value))})
  }
  return out
}

type Sample={time:number;planned:number;projected:number}
type Point={x:number;y:number}

function bands(samples:Sample[],xy:(time:number,value:number)=>Point){
  const ahead:string[]=[]
  const behind:string[]=[]
  const polygon=(a:Point,b:Point,c:Point,d:Point)=>
    `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} L ${b.x.toFixed(1)} ${b.y.toFixed(1)} L ${c.x.toFixed(1)} ${c.y.toFixed(1)} L ${d.x.toFixed(1)} ${d.y.toFixed(1)} Z`

  for(let i=0;i<samples.length-1;i++){
    const a=samples[i]
    const b=samples[i+1]
    const da=a.projected-a.planned
    const db=b.projected-b.planned
    const aProjected=xy(a.time,a.projected)
    const bProjected=xy(b.time,b.projected)
    const aPlanned=xy(a.time,a.planned)
    const bPlanned=xy(b.time,b.planned)

    if((da>=0&&db>=0)||(da<=0&&db<=0)){
      if(Math.abs(da)<0.001&&Math.abs(db)<0.001)continue
      const path=polygon(aProjected,bProjected,bPlanned,aPlanned)
      ;(da>=0&&db>=0?ahead:behind).push(path)
      continue
    }

    const ratio=da/(da-db)
    const crossTime=a.time+(b.time-a.time)*ratio
    const crossValue=a.planned+(b.planned-a.planned)*ratio
    const cross=xy(crossTime,crossValue)

    if(da>0){
      ahead.push(`M ${aProjected.x.toFixed(1)} ${aProjected.y.toFixed(1)} L ${cross.x.toFixed(1)} ${cross.y.toFixed(1)} L ${aPlanned.x.toFixed(1)} ${aPlanned.y.toFixed(1)} Z`)
      behind.push(`M ${cross.x.toFixed(1)} ${cross.y.toFixed(1)} L ${bProjected.x.toFixed(1)} ${bProjected.y.toFixed(1)} L ${bPlanned.x.toFixed(1)} ${bPlanned.y.toFixed(1)} Z`)
    }else{
      behind.push(`M ${aProjected.x.toFixed(1)} ${aProjected.y.toFixed(1)} L ${cross.x.toFixed(1)} ${cross.y.toFixed(1)} L ${aPlanned.x.toFixed(1)} ${aPlanned.y.toFixed(1)} Z`)
      ahead.push(`M ${cross.x.toFixed(1)} ${cross.y.toFixed(1)} L ${bProjected.x.toFixed(1)} ${bProjected.y.toFixed(1)} L ${bPlanned.x.toFixed(1)} ${bPlanned.y.toFixed(1)} Z`)
    }
  }

  return {ahead,behind}
}

function fmt(value:string){
  return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'}).format(dt(value))
}

export default async function HachurasPage(){
  const data=await getDashboardData()
  const planned=plannedCurve(data.tasks,data.project.start_date,data.project.end_date)
  const projected=projectedCurve(data)

  const width=980
  const height=320
  const padding=44
  const min=dt(data.project.start_date).getTime()
  const max=dt(data.project.end_date).getTime()
  const span=Math.max(DAY,max-min)
  const xy=(time:number,value:number)=>({
    x:padding+(time-min)/span*(width-padding*2),
    y:height-padding-(value/100)*(height-padding*2)
  })
  const path=(points:{date:Date,value:number}[])=>
    points.map((item,index)=>{
      const p=xy(item.date.getTime(),item.value)
      return `${index?'L':'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
    }).join(' ')

  const sampleData:Sample[]=planned.map((item,index)=>({
    time:item.date.getTime(),
    planned:item.value,
    projected:projected[index]?.value??item.value
  }))
  const fillBands=projected.length?bands(sampleData,xy):{ahead:[],behind:[]}

  return <main className={styles.page}>
    <header className={styles.header}>
      <div>
        <span className={styles.kicker}>VISUALIZAÇÃO INDEPENDENTE</span>
        <h1>Curva S com hachuras</h1>
        <p>Esta página é separada do dashboard existente e não altera a Curva S já publicada.</p>
      </div>
      <Link className={styles.back} href="/">Voltar ao dashboard</Link>
    </header>

    <section className={styles.summary}>
      <div><span>Projeto</span><strong>{data.project.name}</strong></div>
      <div><span>Período</span><strong>{fmt(data.project.start_date)} — {fmt(data.project.end_date)}</strong></div>
      <div><span>Avanço atual</span><strong>{Number(data.project.progress).toFixed(0)}%</strong></div>
      <div><span>Fonte</span><strong>{data.source==='supabase'?'Supabase':'Base local'}</strong></div>
    </section>

    <section className={styles.card}>
      <div className={styles.cardHead}>
        <div>
          <span className={styles.kicker}>DESVIO DE PRAZO</span>
          <h2>Planejado x projeção</h2>
        </div>
        <p>Verde = acima do previsto. Vermelho = abaixo do previsto.</p>
      </div>

      <div className={styles.scroller}>
        <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Curva S independente com hachuras de desvio">
          <defs>
            <pattern id="independent-green" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
              <rect width="14" height="14" fill="rgba(185,243,74,.10)"/>
              <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(185,243,74,.62)" strokeWidth="4"/>
            </pattern>
            <pattern id="independent-red" patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(45)">
              <rect width="14" height="14" fill="rgba(255,102,97,.10)"/>
              <line x1="0" y1="0" x2="0" y2="14" stroke="rgba(255,102,97,.62)" strokeWidth="4"/>
            </pattern>
          </defs>

          {[0,25,50,75,100].map(value=>{
            const p=xy(min,value)
            return <g key={value}>
              <line className={styles.grid} x1={padding} x2={width-padding} y1={p.y} y2={p.y}/>
              <text className={styles.axisText} x={8} y={p.y+4}>{value}%</text>
            </g>
          })}

          {fillBands.ahead.map((d,index)=><path key={'ahead-'+index} d={d} fill="url(#independent-green)"/>)}
          {fillBands.behind.map((d,index)=><path key={'behind-'+index} d={d} fill="url(#independent-red)"/>)}

          <path className={styles.planned} d={path(planned)}/>
          {projected.length>0&&<path className={styles.projected} d={path(projected)}/>}

          {data.snapshots.map(snapshot=>{
            const p=xy(dt(snapshot.snapshot_date).getTime(),Number(snapshot.actual_progress))
            return <g key={snapshot.id}>
              <circle className={styles.actualDot} cx={p.x} cy={p.y} r="6"/>
              <text className={styles.actualLabel} x={p.x+9} y={p.y-10}>{Number(snapshot.actual_progress).toFixed(0)}%</text>
            </g>
          })}
        </svg>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.planKey}/>Planejado</span>
        <span><i className={styles.projKey}/>Projeção</span>
        <span><i className={styles.greenKey}/>Acima do previsto</span>
        <span><i className={styles.redKey}/>Abaixo do previsto</span>
        <span><i className={styles.dotKey}/>Medição real</span>
      </div>
    </section>
  </main>
}
