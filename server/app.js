import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRouter        from './routes/auth.js';
import vehiclesRouter    from './routes/vehicles.js';
import customersRouter   from './routes/customers.js';
import bookingsRouter    from './routes/bookings.js';
import paymentsRouter    from './routes/payments.js';
import maintenanceRouter from './routes/maintenance.js';
import inspectionsRouter from './routes/inspections.js';

const app = express();

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

// Express 5 forwards rejected async handlers here automatically
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
