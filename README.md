# Prezunic — Planejamento de Obra

Aplicação Next.js para transformar um cronograma Microsoft Project em um painel simples de acompanhamento de obra.

## Painéis
- `/` — painel público: avanço, Gantt, Curva S, frentes, dependências e pendências.
- `/admin` — painel administrativo protegido por sessão HTTP-only para editar dados no Supabase.

## Base de referência
Cronograma importado de `BR662-2026-OBRA-SENADOR CANEDO.mpp`. O projeto inicia como **modelo para adaptação**, não como cronograma definitivo da nova obra.

## Variáveis de ambiente
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_DB_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
