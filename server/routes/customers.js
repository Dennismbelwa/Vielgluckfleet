import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  res.json(await db.all('SELECT * FROM customers ORDER BY name'));
});

router.post('/', async (req, res) => {
  const c = req.body;
  const last = await db.get("SELECT id FROM customers WHERE id LIKE 'C%' ORDER BY id DESC LIMIT 1");
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `C${String(nextNum).padStart(3, '0')}`;
  await db.run('INSERT INTO customers (id,name,phone,email,"idNumber",license,emergency,"nextOfKinName","nextOfKinContact","physicalAddress","workPlace","workContact",notes,balance) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [id, c.name, c.phone, c.email||'', c.idNumber, c.license, c.emergency, c.nextOfKinName||'', c.nextOfKinContact||'', c.physicalAddress||'', c.workPlace||'', c.workContact||'', c.notes||'', 0]);
  res.json(await db.get('SELECT * FROM customers WHERE id = ?', [id]));
});

router.put('/:id', async (req, res) => {
  const c = req.body;
  await db.run('UPDATE customers SET name=?,phone=?,email=?,"idNumber"=?,license=?,emergency=?,"nextOfKinName"=?,"nextOfKinContact"=?,"physicalAddress"=?,"workPlace"=?,"workContact"=?,notes=?,balance=? WHERE id=?',
    [c.name, c.phone, c.email||'', c.idNumber, c.license, c.emergency, c.nextOfKinName||'', c.nextOfKinContact||'', c.physicalAddress||'', c.workPlace||'', c.workContact||'', c.notes, c.balance??0, req.params.id]);
  res.json(await db.get('SELECT * FROM customers WHERE id = ?', [req.params.id]));
});

router.delete('/:id', async (req, res) => {
  await db.run('DELETE FROM customers WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
