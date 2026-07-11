// Seed the three login users into a fresh database. Safe to re-run
// (ON CONFLICT DO NOTHING). Not needed when data was migrated from Railway.
//
// Usage: node scripts/seed-users.mjs   (uses DATABASE_URL from .env)

import bcrypt from 'bcryptjs';
import db from '../server/db.js';

const users = [
  ['admin',      'admin123',   'Admin',           'Admin'],
  ['operations', 'ops123',     'Operations',      'Operations'],
  ['finance',    'finance123', 'Finance Officer', 'Finance'],
];

for (const [username, password, name, role] of users) {
  const { changes } = await db.run(
    'INSERT INTO users (username,password,name,role) VALUES (?,?,?,?) ON CONFLICT (username) DO NOTHING',
    [username, bcrypt.hashSync(password, 10), name, role]
  );
  console.log(`${username}: ${changes ? 'created' : 'already exists'}`);
}

process.exit(0);
