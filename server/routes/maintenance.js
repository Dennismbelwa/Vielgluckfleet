import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  res.json(await db.all('SELECT * FROM maintenance ORDER BY date DESC'));
});

router.post('/', async (req, res) => {
  const m = req.body;
  const last = await db.get("SELECT id FROM maintenance WHERE id LIKE 'M%' ORDER BY id DESC LIMIT 1");
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `M${String(nextNum).padStart(3,'0')}`;
  const veh = await db.get('SELECT reg FROM vehicles WHERE id=?', [m.vehicleId]);
  await db.run('INSERT INTO maintenance (id,"vehicleId","vehicleReg",type,date,cost,status,notes,"nextDue") VALUES (?,?,?,?,?,?,?,?,?)',
    [id, m.vehicleId, veh?.reg||'', m.type, m.date, m.cost||0, m.status||'Scheduled', m.notes||'', m.nextDue||null]);
  res.json(await db.get('SELECT * FROM maintenance WHERE id=?', [id]));
});

router.put('/:id', async (req, res) => {
  const m = req.body;
  const veh = await db.get('SELECT reg FROM vehicles WHERE id=?', [m.vehicleId]);
  await db.run('UPDATE maintenance SET "vehicleId"=?,"vehicleReg"=?,type=?,date=?,cost=?,status=?,notes=?,"nextDue"=? WHERE id=?',
    [m.vehicleId, veh?.reg||m.vehicleReg||'', m.type, m.date, m.cost, m.status, m.notes, m.nextDue||null, req.params.id]);
  res.json(await db.get('SELECT * FROM maintenance WHERE id=?', [req.params.id]));
});

router.delete('/:id', async (req, res) => {
  await db.run('DELETE FROM maintenance WHERE id=?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
