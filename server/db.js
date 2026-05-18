import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'fleet.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Operations'
  );

  CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    reg TEXT UNIQUE NOT NULL,
    vin TEXT,
    make TEXT,
    model TEXT,
    year INTEGER,
    type TEXT,
    color TEXT,
    mileage INTEGER DEFAULT 0,
    motIssue TEXT,
    motExpiry TEXT,
    insuranceExpiry TEXT,
    status TEXT DEFAULT 'Available',
    location TEXT DEFAULT 'Main Office',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    idNumber TEXT,
    license TEXT,
    emergency TEXT,
    nextOfKinName TEXT,
    nextOfKinContact TEXT,
    notes TEXT,
    balance REAL DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    customerId TEXT NOT NULL,
    customerName TEXT,
    vehicleId TEXT NOT NULL,
    vehicleReg TEXT,
    pickup TEXT,
    returnDate TEXT,
    status TEXT DEFAULT 'Pending',
    rate REAL,
    total REAL,
    deposit REAL,
    paid REAL DEFAULT 0,
    tripType TEXT DEFAULT 'Local',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (customerId) REFERENCES customers(id),
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    bookingId TEXT,
    customerId TEXT,
    customerName TEXT,
    amount REAL,
    type TEXT,
    method TEXT DEFAULT 'Cash',
    date TEXT,
    status TEXT DEFAULT 'Completed',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS maintenance (
    id TEXT PRIMARY KEY,
    vehicleId TEXT NOT NULL,
    vehicleReg TEXT,
    type TEXT,
    date TEXT,
    cost REAL DEFAULT 0,
    status TEXT DEFAULT 'Scheduled',
    notes TEXT,
    nextDue TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
  );

  CREATE TABLE IF NOT EXISTS inspections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    bookingId TEXT,
    type TEXT DEFAULT 'pre',
    areas TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// ── Seed if empty ──────────────────────────────────────────────

const seedIfEmpty = (table, count) => db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get().c === 0;

if (seedIfEmpty('users')) {
  const insert = db.prepare('INSERT INTO users (username,password,name,role) VALUES (?,?,?,?)');
  insert.run('admin',      bcrypt.hashSync('admin123',  10), 'Admin',          'Admin');
  insert.run('operations', bcrypt.hashSync('ops123',    10), 'Operations',     'Operations');
  insert.run('finance',    bcrypt.hashSync('finance123',10), 'Finance Officer', 'Finance');
}

if (seedIfEmpty('vehicles')) {
  const ins = db.prepare(`INSERT INTO vehicles (id,reg,vin,make,model,year,type,color,mileage,motIssue,motExpiry,insuranceExpiry,status,location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  const vehicles = [
    ['V001','B 123 ABC','JM1DE1721G0123456','Mazda','Demio',2019,'Compact','White',87420,'2025-01-15','2026-01-15','2026-03-01','Available','Main Office'],
    ['V002','B 456 DEF','WVWZZZ6RZHY123456','Volkswagen','Polo',2020,'Compact','Silver',62310,'2025-03-01','2026-03-01','2026-05-15','Rented','Main Office'],
    ['V003','B 789 GHI','MMBSTA13AKH123456','Mitsubishi','Mirage',2018,'Compact','Red',104500,'2024-11-01','2025-11-01','2025-12-01','Maintenance','Workshop'],
    ['V004','B 012 JKL','JTDKN3DU5A0123456','Toyota','Yaris',2021,'Compact','Blue',41200,'2025-06-01','2026-06-01','2026-08-01','Available','Main Office'],
    ['V005','B 345 MNO','KNAFX4A61G5123456','Kia','Rio',2020,'Compact','Grey',55890,'2025-02-15','2026-02-15','2026-04-01','Rented','Customer'],
    ['V006','B 678 PQR','MALA741CAFM123456','Mazda','Mazda3',2022,'Mid-size','Black',28700,'2025-08-01','2026-08-01','2026-10-01','Available','Main Office'],
    ['V007','B 901 STU','JTDBR32E960123456','Toyota','Corolla',2019,'Mid-size','White',93100,'2025-04-01','2026-04-01','2026-06-01','Reserved','Main Office'],
    ['V008','B 234 VWX','3N1AB7AP5KL123456','Nissan','Almera',2021,'Economy','Silver',38900,'2025-07-01','2026-07-01','2026-09-01','Available','Main Office'],
    ['V009','B 567 YZA','MHJFM1130LP123456','Honda','Fit',2018,'Compact','Green',112300,'2024-09-01','2025-09-01','2025-11-01','InService','Main Office'],
    ['V010','B 890 BCD','KMHD35LH5GU123456','Hyundai','Accent',2020,'Economy','White',67500,'2025-05-01','2026-05-01','2026-07-01','Available','Main Office'],
    ['V011','B 135 EFG','LVSHFFAL4GE123456','Suzuki','Swift',2019,'Compact','Red',79800,'2025-01-01','2026-01-01','2026-02-15','Rented','Customer'],
    ['V012','B 246 HIJ','WVWZZZ3CZWE123456','Volkswagen','Polo Vivo',2021,'Economy','Blue',34200,'2025-09-01','2026-09-01','2026-11-01','Available','Main Office'],
    ['V013','B 357 KLM','JM1BL1V73D1123456','Mazda','Demio',2020,'Compact','Grey',51600,'2025-03-15','2026-03-15','2026-05-01','Available','Airport Branch'],
    ['V014','B 468 NOP','JTDKN3DU1C0123456','Toyota','Etios',2019,'Economy','White',88200,'2024-12-01','2025-12-01','2026-01-15','Sold','N/A'],
    ['V015','B 579 QRS','KNAFK4A63G5123456','Kia','Picanto',2022,'Compact','Orange',19500,'2025-10-01','2026-10-01','2026-12-01','Available','Main Office'],
  ];
  vehicles.forEach(v => ins.run(...v));
}

if (seedIfEmpty('customers')) {
  const ins = db.prepare('INSERT INTO customers (id,name,phone,idNumber,license,emergency,notes,balance) VALUES (?,?,?,?,?,?,?,?)');
  [
    ['C001','Tebogo Mosweu','+267 7123 4567','539212345','DL-2019-4567','+267 7198 7654','Regular customer, always reliable',0],
    ['C002','Keabetswe Modise','+267 7234 5678','841034567','DL-2020-8901','+267 7245 6789','Prefers compact vehicles',350],
    ['C003','Mothusi Kgosimore','+267 7345 6789','690145678','DL-2018-2345','+267 7356 7890','Frequent intercity trips to Francistown',0],
    ['C004','Lesego Tlhong','+267 7456 7890','920256789','DL-2021-6789','+267 7467 8901','',1200],
    ['C005','Onalenna Phiri','+267 7567 8901','780367890','DL-2017-0123','+267 7578 9012','Cross-border trips to SA',0],
    ['C006','Kagiso Setlhabi','+267 7678 9012','880478901','DL-2019-4568','+267 7689 0123','New customer',0],
  ].forEach(c => ins.run(...c));
}

if (seedIfEmpty('bookings')) {
  const ins = db.prepare('INSERT INTO bookings (id,customerId,customerName,vehicleId,vehicleReg,pickup,returnDate,status,rate,total,deposit,paid,tripType) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
  [
    ['BK001','C001','Tebogo Mosweu','V002','B 456 DEF','2026-05-10','2026-05-17','Active',350,2450,1000,2450,'Local'],
    ['BK002','C002','Keabetswe Modise','V005','B 345 MNO','2026-05-12','2026-05-15','Active',300,900,500,550,'Local'],
    ['BK003','C003','Mothusi Kgosimore','V011','B 135 EFG','2026-05-08','2026-05-14','Active',320,1920,800,1920,'Intercity'],
    ['BK004','C004','Lesego Tlhong','V007','B 901 STU','2026-05-18','2026-05-22','Confirmed',400,1600,800,800,'Cross-border'],
    ['BK005','C005','Onalenna Phiri','V006','B 678 PQR','2026-05-20','2026-05-25','Pending',450,2250,1000,0,'Cross-border'],
    ['BK006','C001','Tebogo Mosweu','V004','B 012 JKL','2026-04-01','2026-04-05','Completed',350,1400,700,1400,'Local'],
    ['BK007','C006','Kagiso Setlhabi','V008','B 234 VWX','2026-05-25','2026-05-30','Pending',280,1400,600,0,'Local'],
  ].forEach(b => ins.run(...b));
}

if (seedIfEmpty('payments')) {
  const ins = db.prepare('INSERT INTO payments (id,bookingId,customerId,customerName,amount,type,method,date,status) VALUES (?,?,?,?,?,?,?,?,?)');
  [
    ['P001','BK001','C001','Tebogo Mosweu',1000,'Deposit','Cash','2026-05-10','Completed'],
    ['P002','BK001','C001','Tebogo Mosweu',1450,'Rental','Bank Transfer','2026-05-10','Completed'],
    ['P003','BK002','C002','Keabetswe Modise',500,'Deposit','Cash','2026-05-12','Completed'],
    ['P004','BK002','C002','Keabetswe Modise',50,'Cleaning Fee','Cash','2026-05-12','Completed'],
    ['P005','BK003','C003','Mothusi Kgosimore',800,'Deposit','Card','2026-05-08','Completed'],
    ['P006','BK003','C003','Mothusi Kgosimore',1120,'Rental','Card','2026-05-08','Completed'],
    ['P007','BK004','C004','Lesego Tlhong',800,'Deposit','Bank Transfer','2026-05-16','Completed'],
    ['P008','BK006','C001','Tebogo Mosweu',1400,'Rental','Cash','2026-04-01','Completed'],
  ].forEach(p => ins.run(...p));
}

if (seedIfEmpty('maintenance')) {
  const ins = db.prepare('INSERT INTO maintenance (id,vehicleId,vehicleReg,type,date,cost,status,notes,nextDue) VALUES (?,?,?,?,?,?,?,?,?)');
  [
    ['M001','V003','B 789 GHI','Oil Service','2026-05-10',850,'In Progress','Full oil change + filter','2026-08-10'],
    ['M002','V003','B 789 GHI','Brake Pads','2026-05-10',1200,'In Progress','Front brake pads replacement','2027-05-10'],
    ['M003','V009','B 567 YZA','Tyre Replacement','2026-05-05',3200,'Completed','4 new tyres','2027-11-05'],
    ['M004','V001','B 123 ABC','Oil Service','2026-04-15',800,'Completed','Regular service','2026-07-15'],
    ['M005','V010','B 890 BCD','MOT Renewal','2026-05-01',450,'Completed','Passed','2027-05-01'],
  ].forEach(m => ins.run(...m));
}

export default db;
