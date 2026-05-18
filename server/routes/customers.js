import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM customers ORDER BY name').all());
});

router.post('/', (req, res) => {
  const c = req.body;
  const last = db.prepare("SELECT id FROM customers WHERE id LIKE 'C%' ORDER BY id DESC LIMIT 1").get();
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `C${String(nextNum).padStart(3, '0')}`;
  db.prepare('INSERT INTO customers (id,name,phone,email,idNumber,license,emergency,nextOfKinName,nextOfKinContact,notes,balance) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
    .run(id, c.name, c.phone, c.email||'', c.idNumber, c.license, c.emergency, c.nextOfKinName||'', c.nextOfKinContact||'', c.notes||'', 0);
  res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(id));
});

router.put('/:id', (req, res) => {
  const c = req.body;
  db.prepare('UPDATE customers SET name=?,phone=?,email=?,idNumber=?,license=?,emergency=?,nextOfKinName=?,nextOfKinContact=?,notes=?,balance=? WHERE id=?')
    .run(c.name, c.phone, c.email||'', c.idNumber, c.license, c.emergency, c.nextOfKinName||'', c.nextOfKinContact||'', c.notes, c.balance??0, req.params.id);
  res.json(db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

export default router;
