import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username.trim().toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Incorrect username or password' });

  const token = signToken({ id: user.id, username: user.username, name: user.name, role: user.role });
  res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
});

router.post('/change-password', (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(currentPassword, user.password))
    return res.status(401).json({ error: 'Current password incorrect' });
  db.prepare('UPDATE users SET password = ? WHERE username = ?').run(bcrypt.hashSync(newPassword, 10), username);
  res.json({ ok: true });
});

export default router;
