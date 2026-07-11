import pg from 'pg';
import 'dotenv/config';

// Connect through the Supabase transaction pooler (port 6543). PgBouncer in
// transaction mode forbids named prepared statements — plain pool.query is fine.
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
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
