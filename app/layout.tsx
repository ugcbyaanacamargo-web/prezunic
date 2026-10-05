import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prezunic | Planejamento de Obra',
  description: 'Cronograma, avanço, curva S e acompanhamento executivo da obra.'
}
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="pt-BR"><body>{children}</body></html>
}
