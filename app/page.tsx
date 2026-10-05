import { getDashboardData } from '@/lib/data'
import { ProjectDashboard } from './dashboard'
export const dynamic='force-dynamic'
export default async function Home(){ return <ProjectDashboard data={await getDashboardData()}/> }
