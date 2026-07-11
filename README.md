# Viel Glück Fleet Manager

Car-hire fleet management app: Vite + React frontend, Express API, Postgres (Supabase).

## Local development

```
npm install
npm run dev:server   # Express API on :3001 (needs DATABASE_URL in .env)
npm run dev          # Vite on :5173, proxies /api → :3001
```

`.env` needs `DATABASE_URL` (Postgres connection string) and `JWT_SECRET` — see `.env.example`.
For a fresh database: run `supabase/migrations/0001_init.sql`, then `node scripts/seed-users.mjs`.

## Deployment (Vercel + Supabase)

- Frontend is built by Vercel's Vite preset and served from CDN; the whole Express
  API runs as a single serverless function (`api/index.js`), routed via `vercel.json`.
- Vercel env vars (Production + Preview): `DATABASE_URL` (Supabase **transaction
  pooler** string, port 6543) and `JWT_SECRET`.
- Database schema lives in `supabase/migrations/0001_init.sql` — run it once in the
  Supabase SQL editor for a new project.

## Migrating data from the old Railway deployment

1. Deploy the `railway-export` branch to Railway (adds a temporary authenticated
   `GET /api/export` endpoint to the old SQLite build).
2. `curl -H "Authorization: Bearer <token>" https://<railway-app>/api/export > export.json`
3. `SUPABASE_DB_URL='<direct 5432 connection string>' node scripts/import-to-supabase.mjs export.json`
   — imports all tables in FK order, preserves IDs, resets identity sequences, and
   prints per-table row counts to compare.
4. Smoke-check the Vercel deployment, point users/DNS at it, then retire Railway.
