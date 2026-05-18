import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM vehicles ORDER BY id').all());
});

router.post('/', (req, res) => {
  const v = req.body;
  const last = db.prepare("SELECT id FROM vehicles WHERE id LIKE 'V%' ORDER BY id DESC LIMIT 1").get();
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `V${String(nextNum).padStart(3, '0')}`;
  db.prepare(`INSERT INTO vehicles (id,reg,vin,make,model,year,type,color,mileage,motIssue,motExpiry,insuranceExpiry,status,location)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(id, v.reg, v.vin, v.make, v.model, v.year, v.type, v.color, v.mileage, v.motIssue, v.motExpiry, v.insuranceExpiry, v.status||'Available', v.location||'Main Office');
  res.json(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(id));
});

router.put('/:id', (req, res) => {
  const v = req.body;
  db.prepare(`UPDATE vehicles SET reg=?,vin=?,make=?,model=?,year=?,type=?,color=?,mileage=?,motIssue=?,motExpiry=?,insuranceExpiry=?,status=?,location=? WHERE id=?`)
    .run(v.reg, v.vin, v.make, v.model, v.year, v.type, v.color, v.mileage, v.motIssue, v.motExpiry, v.insuranceExpiry, v.status, v.location, req.params.id);
  res.json(db.prepare('SELECT * FROM vehicles WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM vehicles WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
