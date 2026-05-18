import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM inspections ORDER BY created_at DESC').all()
    .map(i => ({ ...i, areas: JSON.parse(i.areas || '[]') })));
});

router.post('/', (req, res) => {
  const { vehicleId, bookingId, type, areas, notes } = req.body;
  const result = db.prepare('INSERT INTO inspections (vehicleId,bookingId,type,areas,notes) VALUES (?,?,?,?,?)')
    .run(vehicleId, bookingId||null, type||'pre', JSON.stringify(areas||[]), notes||'');
  res.json({ id: result.lastInsertRowid, vehicleId, bookingId, type, areas, notes });
});

export default router;
