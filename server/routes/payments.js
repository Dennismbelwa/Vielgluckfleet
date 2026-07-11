import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  res.json(await db.all('SELECT * FROM payments ORDER BY created_at DESC'));
});

router.post('/', async (req, res) => {
  const p = req.body;
  const payment = await db.tx(async (t) => {
    const last = await t.get("SELECT id FROM payments WHERE id LIKE 'P%' ORDER BY id DESC LIMIT 1");
    const nextNum = last ? parseInt(last.id.slice(1)) + 1 : 1;
    const id = `P${String(nextNum).padStart(3,'0')}`;
    const today = new Date().toISOString().split('T')[0];
    const bk = p.bookingId ? await t.get('SELECT "customerId","customerName" FROM bookings WHERE id=?', [p.bookingId]) : null;

    await t.run('INSERT INTO payments (id,"bookingId","customerId","customerName",amount,type,method,date,status) VALUES (?,?,?,?,?,?,?,?,?)',
      [id, p.bookingId||null, bk?.customerId||p.customerId||null, bk?.customerName||p.customerName||'', p.amount, p.type||'Rental', p.method||'Cash', today, 'Completed']);

    if (p.bookingId) {
      await t.run('UPDATE bookings SET paid = paid + ? WHERE id = ?', [p.amount, p.bookingId]);
    }

    return t.get('SELECT * FROM payments WHERE id=?', [id]);
  });

  res.json(payment);
});

export default router;
