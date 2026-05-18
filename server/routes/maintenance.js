import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM maintenance ORDER BY date DESC').all());
});

router.post('/', (req, res) => {
  const m = req.body;
  const last = db.prepare("SELECT id FROM maintenance WHERE id LIKE 'M%' ORDER BY id DESC LIMIT 1").get();
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `M${String(nextNum).padStart(3,'0')}`;
  const veh = db.prepare('SELECT reg FROM vehicles WHERE id=?').get(m.vehicleId);
  db.prepare('INSERT INTO maintenance (id,vehicleId,vehicleReg,type,date,cost,status,notes,nextDue) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, m.vehicleId, veh?.reg||'', m.type, m.date, m.cost||0, m.status||'Scheduled', m.notes||'', m.nextDue||null);
  res.json(db.prepare('SELECT * FROM maintenance WHERE id=?').get(id));
});

router.put('/:id', (req, res) => {
  const m = req.body;
  const veh = db.prepare('SELECT reg FROM vehicles WHERE id=?').get(m.vehicleId);
  db.prepare('UPDATE maintenance SET vehicleId=?,vehicleReg=?,type=?,date=?,cost=?,status=?,notes=?,nextDue=? WHERE id=?')
    .run(m.vehicleId, veh?.reg||m.vehicleReg||'', m.type, m.date, m.cost, m.status, m.notes, m.nextDue||null, req.params.id);
  res.json(db.prepare('SELECT * FROM maintenance WHERE id=?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM maintenance WHERE id=?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
