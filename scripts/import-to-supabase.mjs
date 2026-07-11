// One-off import of Railway SQLite data into Supabase Postgres.
//
// Usage:
//   SUPABASE_DB_URL='postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres' \
//     node scripts/import-to-supabase.mjs export.json
//   (or pass a fleet.db file instead of export.json — requires better-sqlite3 installed)
//
// Use the DIRECT connection string (port 5432), not the transaction pooler.
// Inserts run in a single transaction in FK order, preserving all IDs, then
// the identity sequences for users/inspections are reset past the max id.

import pg from 'pg';
import fs from 'fs';
import { supabaseTls } from '../server/db.js';

const TABLES = ['users', 'vehicles', 'customers', 'bookings', 'payments', 'maintenance', 'inspections'];

const source = process.argv[2];
const dbUrl = process.env.SUPABASE_DB_URL;
if (!source || !dbUrl) {
  console.error('Usage: SUPABASE_DB_URL=<direct 5432 connection string> node scripts/import-to-supabase.mjs <export.json | fleet.db>');
  process.exit(1);
}

async function loadData() {
  if (source.endsWith('.json')) {
    return JSON.parse(fs.readFileSync(source, 'utf8'));
  }
  const { default: Database } = await import('better-sqlite3');
  const sqlite = new Database(source, { readonly: true });
  const data = {};
  for (const t of TABLES) data[t] = sqlite.prepare(`SELECT * FROM ${t}`).all();
  sqlite.close();
  return data;
}

// SQLite stores created_at as 'YYYY-MM-DD HH:MM:SS' in UTC; tag it so Postgres
// stores the correct instant.
const fixTimestamp = (v) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(v) ? `${v}Z` : v;

const data = await loadData();
const client = new pg.Client(supabaseTls(dbUrl));
await client.connect();

try {
  await client.query('BEGIN');

  // Replace any pre-existing rows (e.g. seeded default users) so imported
  // rows keep their original IDs. Runs inside the transaction: a failed
  // import rolls back to the pre-import state.
  await client.query(`TRUNCATE ${TABLES.join(', ')} RESTART IDENTITY CASCADE`);

  for (const table of TABLES) {
    const rows = data[table] || [];
    for (const row of rows) {
      const cols = Object.keys(row);
      const quoted = cols.map(c => `"${c}"`).join(',');
      const placeholders = cols.map((_, i) => `$${i + 1}`).join(',');
      const values = cols.map(c => (c === 'created_at' ? fixTimestamp(row[c]) : row[c]));
      await client.query(`INSERT INTO ${table} (${quoted}) VALUES (${placeholders})`, values);
    }
  }

  await client.query(`SELECT setval(pg_get_serial_sequence('users','id'), (SELECT COALESCE(MAX(id),1) FROM users))`);
  await client.query(`SELECT setval(pg_get_serial_sequence('inspections','id'), (SELECT COALESCE(MAX(id),1) FROM inspections))`);

  await client.query('COMMIT');

  console.log('Imported row counts (source → Supabase):');
  for (const table of TABLES) {
    const { rows } = await client.query(`SELECT COUNT(*)::int AS c FROM ${table}`);
    const src = (data[table] || []).length;
    const ok = rows[0].c === src ? 'OK' : 'MISMATCH';
    console.log(`  ${table.padEnd(12)} ${String(src).padStart(5)} → ${String(rows[0].c).padStart(5)}  ${ok}`);
  }
} catch (e) {
  await client.query('ROLLBACK');
  console.error('Import failed, rolled back:', e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
