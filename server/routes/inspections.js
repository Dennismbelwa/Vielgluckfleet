import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const rows = await db.all('SELECT * FROM inspections ORDER BY created_at DESC');
  res.json(rows.map(i => ({ ...i, areas: JSON.parse(i.areas || '[]') })));
});

router.post('/', async (req, res) => {
  const { vehicleId, bookingId, type, areas, notes } = req.body;
  const { rows } = await db.run('INSERT INTO inspections ("vehicleId","bookingId",type,areas,notes) VALUES (?,?,?,?,?) RETURNING id',
    [vehicleId, bookingId||null, type||'pre', JSON.stringify(areas||[]), notes||'']);
  res.json({ id: rows[0].id, vehicleId, bookingId, type, areas, notes });
});

export default router;
