import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'vielgluck-secret-2026';

export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(header.slice(7), SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const signToken = (payload) => jwt.sign(payload, SECRET, { expiresIn: '12h' });
