import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import db from './db.js';
import { requireAuth } from './middleware/auth.js';
import authRouter        from './routes/auth.js';
import vehiclesRouter    from './routes/vehicles.js';
import customersRouter   from './routes/customers.js';
import bookingsRouter    from './routes/bookings.js';
import paymentsRouter    from './routes/payments.js';
import maintenanceRouter from './routes/maintenance.js';
import inspectionsRouter from './routes/inspections.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth',        authRouter);
app.use('/api/vehicles',    vehiclesRouter);
app.use('/api/customers',   customersRouter);
app.use('/api/bookings',    bookingsRouter);
app.use('/api/payments',    paymentsRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/inspections', inspectionsRouter);

// Health check
app.get('/api/health', (_, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// TEMPORARY: full-database export for the Supabase migration. Deploy this
// branch to Railway, download the snapshot, then delete the branch.
//   curl -H "Authorization: Bearer <token>" https://<railway-app>/api/export > export.json
app.get('/api/export', requireAuth, (_, res) => {
  const tables = ['users', 'vehicles', 'customers', 'bookings', 'payments', 'maintenance', 'inspections'];
  const out = {};
  for (const t of tables) out[t] = db.prepare(`SELECT * FROM ${t}`).all();
  res.json(out);
});

// Serve Vite build in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('/{*path}', (_, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Viel Glück API running on port ${PORT}`));
