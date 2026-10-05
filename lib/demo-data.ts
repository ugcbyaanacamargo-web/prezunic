import type { DashboardData } from './types'

const projectId = 'demo-project'

export const demoData: DashboardData = {
  source: 'demo',
  project: {
    id: projectId,
    slug: 'prezunic',
    name: 'Prezunic — Planejamento de Obra',
    code: 'PREZUNIC',
    client: 'Prezunic',
    location: 'Obra a definir',
    start_date: '2026-10-12',
    end_date: '2027-02-20',
    baseline_end_date: '2027-02-20',
    progress: 18,
    status: 'Em planejamento',
    data_status: 'modelo_inicial',
  },
  phases: [
    {id:'p1',project_id:projectId,name:'Mobilização e projetos',sort_order:1,planned_start:'2026-10-12',planned_end:'2026-10-30',progress:72,responsible:'Coordenação',status:'Em andamento'},
    {id:'p2',project_id:projectId,name:'Demolições e preparação',sort_order:2,planned_start:'2026-10-19',planned_end:'2026-11-08',progress:46,responsible:'Civil',status:'Em andamento'},
    {id:'p3',project_id:projectId,name:'Obras civis',sort_order:3,planned_start:'2026-10-26',planned_end:'2026-12-12',progress:18,responsible:'Civil',status:'Em andamento'},
    {id:'p4',project_id:projectId,name:'Instalações',sort_order:4,planned_start:'2026-11-09',planned_end:'2026-12-27',progress:8,responsible:'Instalações',status:'Planejado'},
    {id:'p5',project_id:projectId,name:'Acabamentos',sort_order:5,planned_start:'2026-12-01',planned_end:'2027-01-24',progress:0,responsible:'Acabamentos',status:'Planejado'},
    {id:'p6',project_id:projectId,name:'Equipamentos e comissionamento',sort_order:6,planned_start:'2027-01-11',planned_end:'2027-02-12',progress:0,responsible:'Implantação',status:'Planejado'},
    {id:'p7',project_id:projectId,name:'Entrega e abertura',sort_order:7,planned_start:'2027-02-13',planned_end:'2027-02-20',progress:0,responsible:'Coordenação',status:'Planejado'},
  ],
  tasks: [
    {id:'t1',project_id:projectId,phase_id:'p1',wbs:'1.1',name:'Mobilização de canteiro',planned_start:'2026-10-12',planned_end:'2026-10-16',progress:100,status:'Concluída',responsible:'Coordenação',critical:true,is_milestone:false,sort_order:1},
    {id:'t2',project_id:projectId,phase_id:'p1',wbs:'1.2',name:'Compatibilização de projetos',planned_start:'2026-10-12',planned_end:'2026-10-30',progress:55,status:'Em andamento',responsible:'Projetos',critical:true,is_milestone:false,sort_order:2},
    {id:'t3',project_id:projectId,phase_id:'p2',wbs:'2.1',name:'Isolamento e proteções',planned_start:'2026-10-19',planned_end:'2026-10-23',progress:100,status:'Concluída',responsible:'Civil',critical:false,is_milestone:false,sort_order:3},
    {id:'t4',project_id:projectId,phase_id:'p2',wbs:'2.2',name:'Demolições e retiradas',planned_start:'2026-10-22',planned_end:'2026-11-08',progress:35,status:'Em andamento',responsible:'Civil',critical:true,is_milestone:false,sort_order:4},
    {id:'t5',project_id:projectId,phase_id:'p3',wbs:'3.1',name:'Alvenarias e regularizações',planned_start:'2026-10-26',planned_end:'2026-11-22',progress:26,status:'Em andamento',responsible:'Civil',critical:true,is_milestone:false,sort_order:5},
    {id:'t6',project_id:projectId,phase_id:'p3',wbs:'3.2',name:'Bases, reforços e adequações',planned_start:'2026-11-09',planned_end:'2026-12-12',progress:5,status:'Planejado',responsible:'Civil',critical:false,is_milestone:false,sort_order:6},
    {id:'t7',project_id:projectId,phase_id:'p4',wbs:'4.1',name:'Infraestrutura elétrica',planned_start:'2026-11-09',planned_end:'2026-12-20',progress:8,status:'Planejado',responsible:'Elétrica',critical:true,is_milestone:false,sort_order:7},
    {id:'t8',project_id:projectId,phase_id:'p4',wbs:'4.2',name:'Hidráulica, esgoto e incêndio',planned_start:'2026-11-12',planned_end:'2026-12-27',progress:6,status:'Planejado',responsible:'Hidráulica',critical:false,is_milestone:false,sort_order:8},
    {id:'t9',project_id:projectId,phase_id:'p5',wbs:'5.1',name:'Forros e fechamentos',planned_start:'2026-12-01',planned_end:'2027-01-10',progress:0,status:'Planejado',responsible:'Acabamentos',critical:true,is_milestone:false,sort_order:9},
    {id:'t10',project_id:projectId,phase_id:'p5',wbs:'5.2',name:'Pisos, revestimentos e pintura',planned_start:'2026-12-15',planned_end:'2027-01-24',progress:0,status:'Planejado',responsible:'Acabamentos',critical:true,is_milestone:false,sort_order:10},
    {id:'t11',project_id:projectId,phase_id:'p6',wbs:'6.1',name:'Montagem de equipamentos',planned_start:'2027-01-11',planned_end:'2027-02-02',progress:0,status:'Planejado',responsible:'Implantação',critical:true,is_milestone:false,sort_order:11},
    {id:'t12',project_id:projectId,phase_id:'p6',wbs:'6.2',name:'Testes e comissionamento',planned_start:'2027-02-01',planned_end:'2027-02-12',progress:0,status:'Planejado',responsible:'Implantação',critical:true,is_milestone:false,sort_order:12},
    {id:'t13',project_id:projectId,phase_id:'p7',wbs:'7.1',name:'Vistoria final',planned_start:'2027-02-13',planned_end:'2027-02-13',progress:0,status:'Marco',responsible:'Coordenação',critical:true,is_milestone:true,sort_order:13},
    {id:'t14',project_id:projectId,phase_id:'p7',wbs:'7.2',name:'Entrega técnica',planned_start:'2027-02-18',planned_end:'2027-02-18',progress:0,status:'Marco',responsible:'Coordenação',critical:true,is_milestone:true,sort_order:14},
    {id:'t15',project_id:projectId,phase_id:'p7',wbs:'7.3',name:'Abertura',planned_start:'2027-02-20',planned_end:'2027-02-20',progress:0,status:'Marco',responsible:'Operação',critical:true,is_milestone:true,sort_order:15},
  ],
  issues: [
    {id:'i1',project_id:projectId,title:'Concluir compatibilização das interferências',category:'Projetos',priority:'alta',status:'Aberta',owner:'Coordenação',due_date:'2026-10-30'},
    {id:'i2',project_id:projectId,title:'Confirmar pontos finais de equipamentos',category:'Interfaces',priority:'alta',status:'Aberta',owner:'Implantação',due_date:'2026-11-10'},
    {id:'i3',project_id:projectId,title:'Liberar sequência executiva das instalações',category:'Planejamento',priority:'media',status:'Em análise',owner:'Engenharia',due_date:'2026-11-14'},
  ],
}
