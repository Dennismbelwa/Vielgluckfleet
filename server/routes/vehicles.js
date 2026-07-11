import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  res.json(await db.all('SELECT * FROM vehicles ORDER BY id'));
});

router.post('/', async (req, res) => {
  const v = req.body;
  const last = await db.get("SELECT id FROM vehicles WHERE id LIKE 'V%' ORDER BY id DESC LIMIT 1");
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `V${String(nextNum).padStart(3, '0')}`;
  await db.run(`INSERT INTO vehicles (id,reg,vin,make,model,year,type,color,mileage,"motIssue","motExpiry","insuranceExpiry",status,location)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, v.reg, v.vin, v.make, v.model, v.year, v.type, v.color, v.mileage, v.motIssue, v.motExpiry, v.insuranceExpiry, v.status||'Available', v.location||'Main Office']);
  res.json(await db.get('SELECT * FROM vehicles WHERE id = ?', [id]));
});

router.put('/:id', async (req, res) => {
  const v = req.body;
  await db.run(`UPDATE vehicles SET reg=?,vin=?,make=?,model=?,year=?,type=?,color=?,mileage=?,"motIssue"=?,"motExpiry"=?,"insuranceExpiry"=?,status=?,location=? WHERE id=?`,
    [v.reg, v.vin, v.make, v.model, v.year, v.type, v.color, v.mileage, v.motIssue, v.motExpiry, v.insuranceExpiry, v.status, v.location, req.params.id]);
  res.json(await db.get('SELECT * FROM vehicles WHERE id = ?', [req.params.id]));
});

router.delete('/:id', async (req, res) => {
  await db.run('DELETE FROM vehicles WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
