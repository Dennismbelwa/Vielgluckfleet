import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all());
});

router.post('/', (req, res) => {
  const p = req.body;
  const last = db.prepare("SELECT id FROM payments WHERE id LIKE 'P%' ORDER BY id DESC LIMIT 1").get();
  const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
  const id = `P${String(nextNum).padStart(3,'0')}`;
  const today = new Date().toISOString().split('T')[0];
  const bk = p.bookingId ? db.prepare('SELECT customerId,customerName FROM bookings WHERE id=?').get(p.bookingId) : null;

  db.prepare('INSERT INTO payments (id,bookingId,customerId,customerName,amount,type,method,date,status) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(id, p.bookingId||null, bk?.customerId||p.customerId||null, bk?.customerName||p.customerName||'', p.amount, p.type||'Rental', p.method||'Cash', today, 'Completed');

  if (p.bookingId) {
    db.prepare('UPDATE bookings SET paid = paid + ? WHERE id = ?').run(p.amount, p.bookingId);
  }

  res.json(db.prepare('SELECT * FROM payments WHERE id=?').get(id));
});

export default router;
