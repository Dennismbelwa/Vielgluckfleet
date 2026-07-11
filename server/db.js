import pg from 'pg';
import fs from 'fs';
import { config } from 'dotenv';

// .env.local (synced from Vercel via `vercel env pull`) wins over .env
config({ path: '.env.local', quiet: true });
config({ quiet: true });

// Connect through the Supabase transaction pooler (port 6543). PgBouncer in
// transaction mode forbids named prepared statements — plain pool.query is fine.
// POSTGRES_URL is what the Vercel Marketplace integration auto-provisions.
// Supabase's TLS chain is signed by its own root CA, so verify against the
// pinned CA cert. The URL's sslmode param must be dropped or it overrides the
// explicit ssl config and fails against pg's default trust store.
export const supabaseTls = (urlString) => {
  if (!/\.supabase\.(co|com)/.test(urlString || '')) return { connectionString: urlString };
  const url = new URL(urlString);
  url.searchParams.delete('sslmode');
  return {
    connectionString: url.toString(),
    ssl: { ca: fs.readFileSync(new URL('./supabase-ca.crt', import.meta.url)).toString() },
  };
};

const pool = new pg.Pool({
  ...supabaseTls(process.env.DATABASE_URL || process.env.POSTGRES_URL),
  max: 3,
  idleTimeoutMillis: 30_000,
});

// Rewrite SQLite-style '?' placeholders to Postgres '$1','$2',...
// Safe here: no SQL in this codebase contains a literal '?' inside a string.
const toPg = (sql) => {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
};

const wrap = (client) => ({
  all: async (sql, params = []) => (await client.query(toPg(sql), params)).rows,
  get: async (sql, params = []) => (await client.query(toPg(sql), params)).rows[0],
  run: async (sql, params = []) => {
    const r = await client.query(toPg(sql), params);
    return { changes: r.rowCount, rows: r.rows };
  },
});

const db = wrap(pool);

// Transaction helper: await db.tx(async (t) => { await t.run(...); ... })
db.tx = async (fn) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(wrap(client));
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default db;
