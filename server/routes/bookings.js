import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const rows = await db.all('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(rows.map(b => ({ ...b, return: b.returnDate })));
});

router.post('/', async (req, res) => {
  const b = req.body;
  const last = await db.get("SELECT id FROM bookings WHERE id LIKE 'BK%' ORDER BY id DESC LIMIT 1");
  const nextNum = last ? parseInt(last.id.slice(2)) + 1 : 1;
  const id = `BK${String(nextNum).padStart(3, '0')}`;
  const cust = await db.get('SELECT name FROM customers WHERE id=?', [b.customerId]);
  const veh  = await db.get('SELECT reg FROM vehicles WHERE id=?', [b.vehicleId]);
  const days = Math.max(1, Math.ceil((new Date(b.return) - new Date(b.pickup)) / 86400000));
  const total = days * (b.rate || 0);
  await db.run(`INSERT INTO bookings (id,"customerId","customerName","vehicleId","vehicleReg",pickup,"pickupTime","returnDate",status,rate,total,deposit,paid,"tripType")
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [id, b.customerId, cust?.name||b.customerName||'', b.vehicleId, veh?.reg||b.vehicleReg||'', b.pickup, b.pickupTime||null, b.return, b.status||'Pending', b.rate, total, b.deposit||0, 0, b.tripType||'Local']);
  res.json({ ...(await db.get('SELECT * FROM bookings WHERE id=?', [id])), return: b.return });
});

router.put('/:id', async (req, res) => {
  const b = req.body;
  const cust = await db.get('SELECT name FROM customers WHERE id=?', [b.customerId]);
  const veh  = await db.get('SELECT reg FROM vehicles WHERE id=?', [b.vehicleId]);
  const days = Math.max(1, Math.ceil((new Date(b.return) - new Date(b.pickup)) / 86400000));
  const total = days * (b.rate || 0);
  await db.run(`UPDATE bookings SET "customerId"=?,"customerName"=?,"vehicleId"=?,"vehicleReg"=?,pickup=?,"pickupTime"=?,"returnDate"=?,status=?,rate=?,total=?,deposit=?,paid=?,"tripType"=? WHERE id=?`,
    [b.customerId, cust?.name||b.customerName||'', b.vehicleId, veh?.reg||b.vehicleReg||'', b.pickup, b.pickupTime||null, b.return, b.status, b.rate, total, b.deposit, b.paid??0, b.tripType, req.params.id]);
  res.json({ ...(await db.get('SELECT * FROM bookings WHERE id=?', [req.params.id])), return: b.return });
});

// Checkout — mark Active, update vehicle status
router.post('/:id/checkout', async (req, res) => {
  const { mileage, fuel, clean, damages } = req.body;
  const booking = await db.get('SELECT * FROM bookings WHERE id=?', [req.params.id]);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  await db.tx(async (t) => {
    await t.run("UPDATE bookings SET status='Active' WHERE id=?", [req.params.id]);
    await t.run("UPDATE vehicles SET status='Rented', location='Customer', mileage=? WHERE id=?", [mileage || 0, booking.vehicleId]);
    // Record the hand-over inspection so it shows in the inspection log
    const notes = [
      mileage ? `${mileage} km` : null,
      fuel ? `Fuel: ${fuel}` : null,
      clean !== undefined ? (clean ? 'Clean' : 'Not clean') : null,
      damages ? `Damages: ${damages}` : null,
    ].filter(Boolean).join(' · ');
    await t.run('INSERT INTO inspections ("vehicleId","bookingId",type,areas,notes) VALUES (?,?,?,?,?)',
      [booking.vehicleId, booking.id, 'pre', JSON.stringify({ mileage: mileage || null, fuel: fuel || null, clean }), notes || 'Hand-over inspection']);
  });
  res.json({ ok: true });
});

// Return — mark Completed, update vehicle, create penalty payments
router.post('/:id/return', async (req, res) => {
  const { mileage, fuel, clean, damages, smokeFee, stainFee, mudFee } = req.body;
  const booking = await db.get('SELECT * FROM bookings WHERE id=?', [req.params.id]);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const today = new Date().toISOString().split('T')[0];

  await db.tx(async (t) => {
    let penalties = 0;
    const newPayments = [];
    const lastPay = await t.get("SELECT id FROM payments WHERE id LIKE 'P%' ORDER BY id DESC LIMIT 1");
    let pNum = lastPay ? parseInt(lastPay.id.slice(1)) + 1 : 1;

    const addFee = (amount, type) => {
      const pid = `P${String(pNum++).padStart(3,'0')}`;
      newPayments.push({ id:pid, bookingId:booking.id, customerId:booking.customerId, customerName:booking.customerName, amount, type, method:'Cash', date:today, status:'Pending' });
      penalties += amount;
    };

    if (!clean) addFee(50, 'Cleaning Fee');
    if (smokeFee) addFee(200, 'Smoking Fee');
    if (stainFee) addFee(150, 'Stain Fee');
    if (mudFee)   addFee(100, 'Mud/Sand Fee');

    for (const p of newPayments) {
      await t.run('INSERT INTO payments (id,"bookingId","customerId","customerName",amount,type,method,date,status) VALUES (?,?,?,?,?,?,?,?,?)',
        [p.id, p.bookingId, p.customerId, p.customerName, p.amount, p.type, p.method, p.date, p.status]);
    }

    await t.run("UPDATE bookings SET status='Completed', total=total+? WHERE id=?", [penalties, req.params.id]);
    await t.run("UPDATE vehicles SET status='Available', location='Main Office', mileage=? WHERE id=?", [mileage||0, booking.vehicleId]);

    // Record the return inspection so it shows in the inspection log
    const notes = [
      mileage ? `${mileage} km` : null,
      fuel ? `Fuel: ${fuel}` : null,
      clean !== undefined ? (clean ? 'Clean' : 'Not clean') : null,
      damages ? `Damages: ${damages}` : null,
      newPayments.length ? `Penalties: ${newPayments.map(p=>p.type).join(', ')}` : null,
    ].filter(Boolean).join(' · ');
    await t.run('INSERT INTO inspections ("vehicleId","bookingId",type,areas,notes) VALUES (?,?,?,?,?)',
      [booking.vehicleId, booking.id, 'post', JSON.stringify({ mileage: mileage || null, fuel: fuel || null, clean, penalties: newPayments.map(p=>p.type) }), notes || 'Return inspection']);
  });

  res.json({ ok: true });
});

export default router;
