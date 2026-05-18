import { Router } from 'express';
import db from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
    .map(b => ({ ...b, return: b.returnDate })));
});

router.post('/', (req, res) => {
  const b = req.body;
  const last = db.prepare("SELECT id FROM bookings WHERE id LIKE 'BK%' ORDER BY id DESC LIMIT 1").get();
  const nextNum = last ? parseInt(last.id.slice(2)) + 1 : 1;
  const id = `BK${String(nextNum).padStart(3, '0')}`;
  const cust = db.prepare('SELECT name FROM customers WHERE id=?').get(b.customerId);
  const veh  = db.prepare('SELECT reg FROM vehicles WHERE id=?').get(b.vehicleId);
  const days = Math.max(1, Math.ceil((new Date(b.return) - new Date(b.pickup)) / 86400000));
  const total = days * (b.rate || 0);
  db.prepare(`INSERT INTO bookings (id,customerId,customerName,vehicleId,vehicleReg,pickup,returnDate,status,rate,total,deposit,paid,tripType)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(id, b.customerId, cust?.name||b.customerName||'', b.vehicleId, veh?.reg||b.vehicleReg||'', b.pickup, b.return, b.status||'Pending', b.rate, total, b.deposit||0, 0, b.tripType||'Local');
  res.json({ ...db.prepare('SELECT * FROM bookings WHERE id=?').get(id), return: b.return });
});

router.put('/:id', (req, res) => {
  const b = req.body;
  const cust = db.prepare('SELECT name FROM customers WHERE id=?').get(b.customerId);
  const veh  = db.prepare('SELECT reg FROM vehicles WHERE id=?').get(b.vehicleId);
  const days = Math.max(1, Math.ceil((new Date(b.return) - new Date(b.pickup)) / 86400000));
  const total = days * (b.rate || 0);
  db.prepare(`UPDATE bookings SET customerId=?,customerName=?,vehicleId=?,vehicleReg=?,pickup=?,returnDate=?,status=?,rate=?,total=?,deposit=?,paid=?,tripType=? WHERE id=?`)
    .run(b.customerId, cust?.name||b.customerName||'', b.vehicleId, veh?.reg||b.vehicleReg||'', b.pickup, b.return, b.status, b.rate, total, b.deposit, b.paid??0, b.tripType, req.params.id);
  res.json({ ...db.prepare('SELECT * FROM bookings WHERE id=?').get(req.params.id), return: b.return });
});

// Checkout — mark Active, update vehicle status
router.post('/:id/checkout', (req, res) => {
  const { mileage } = req.body;
  const booking = db.prepare('SELECT * FROM bookings WHERE id=?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  db.prepare("UPDATE bookings SET status='Active' WHERE id=?").run(req.params.id);
  db.prepare("UPDATE vehicles SET status='Rented', location='Customer', mileage=? WHERE id=?").run(mileage || 0, booking.vehicleId);
  res.json({ ok: true });
});

// Return — mark Completed, update vehicle, create penalty payments
router.post('/:id/return', (req, res) => {
  const { mileage, clean, smokeFee, stainFee, mudFee } = req.body;
  const booking = db.prepare('SELECT * FROM bookings WHERE id=?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const today = new Date().toISOString().split('T')[0];
  let penalties = 0;
  const newPayments = [];
  const lastPay = db.prepare("SELECT id FROM payments WHERE id LIKE 'P%' ORDER BY id DESC LIMIT 1").get();
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

  const insertPay = db.prepare('INSERT INTO payments (id,bookingId,customerId,customerName,amount,type,method,date,status) VALUES (?,?,?,?,?,?,?,?,?)');
  newPayments.forEach(p => insertPay.run(p.id, p.bookingId, p.customerId, p.customerName, p.amount, p.type, p.method, p.date, p.status));

  db.prepare("UPDATE bookings SET status='Completed', total=total+? WHERE id=?").run(penalties, req.params.id);
  db.prepare("UPDATE vehicles SET status='Available', location='Main Office', mileage=? WHERE id=?").run(mileage||0, booking.vehicleId);

  res.json({ ok: true });
});

export default router;
