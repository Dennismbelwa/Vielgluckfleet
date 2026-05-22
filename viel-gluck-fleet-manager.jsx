import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Car, Users, Calendar, DollarSign, Wrench, ClipboardCheck, FileText,
  BarChart3, ChevronRight, Plus, Search, Filter, Eye, Edit, Trash2,
  CheckCircle2, AlertTriangle, Clock, ArrowLeft, Camera, X, Menu,
  Home, CreditCard, Shield, Fuel, Droplets, MapPin, Phone, Mail,
  Hash, Star, TrendingUp, Activity, AlertCircle, ChevronDown, Printer,
  UserCheck, CarFront, Settings, LogOut, Bell, CircleDot, Check,
  Upload, PenLine, RotateCcw, Gauge, CalendarDays, Receipt, BadgeCheck
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

// ─── SEED DATA ──────────────────────────────────────────────
const VEHICLES = [
  { id:"V001", reg:"B 123 ABC", vin:"JM1DE1721G0123456", make:"Mazda", model:"Demio", year:2019, type:"Compact", color:"White", mileage:87420, motIssue:"2025-01-15", motExpiry:"2026-01-15", insuranceExpiry:"2026-03-01", status:"Available", location:"Main Office", photos:[] },
  { id:"V002", reg:"B 456 DEF", vin:"WVWZZZ6RZHY123456", make:"Volkswagen", model:"Polo", year:2020, type:"Compact", color:"Silver", mileage:62310, motIssue:"2025-03-01", motExpiry:"2026-03-01", insuranceExpiry:"2026-05-15", status:"Rented", location:"Main Office", photos:[] },
  { id:"V003", reg:"B 789 GHI", vin:"MMBSTA13AKH123456", make:"Mitsubishi", model:"Mirage", year:2018, type:"Compact", color:"Red", mileage:104500, motIssue:"2024-11-01", motExpiry:"2025-11-01", insuranceExpiry:"2025-12-01", status:"Maintenance", location:"Workshop", photos:[] },
  { id:"V004", reg:"B 012 JKL", vin:"JTDKN3DU5A0123456", make:"Toyota", model:"Yaris", year:2021, type:"Compact", color:"Blue", mileage:41200, motIssue:"2025-06-01", motExpiry:"2026-06-01", insuranceExpiry:"2026-08-01", status:"Available", location:"Main Office", photos:[] },
  { id:"V005", reg:"B 345 MNO", vin:"KNAFX4A61G5123456", make:"Kia", model:"Rio", year:2020, type:"Compact", color:"Grey", mileage:55890, motIssue:"2025-02-15", motExpiry:"2026-02-15", insuranceExpiry:"2026-04-01", status:"Rented", location:"Customer", photos:[] },
  { id:"V006", reg:"B 678 PQR", vin:"MALA741CAFM123456", make:"Mazda", model:"Mazda3", year:2022, type:"Mid-size", color:"Black", mileage:28700, motIssue:"2025-08-01", motExpiry:"2026-08-01", insuranceExpiry:"2026-10-01", status:"Available", location:"Main Office", photos:[] },
  { id:"V007", reg:"B 901 STU", vin:"JTDBR32E960123456", make:"Toyota", model:"Corolla", year:2019, type:"Mid-size", color:"White", mileage:93100, motIssue:"2025-04-01", motExpiry:"2026-04-01", insuranceExpiry:"2026-06-01", status:"Reserved", location:"Main Office", photos:[] },
  { id:"V008", reg:"B 234 VWX", vin:"3N1AB7AP5KL123456", make:"Nissan", model:"Almera", year:2021, type:"Economy", color:"Silver", mileage:38900, motIssue:"2025-07-01", motExpiry:"2026-07-01", insuranceExpiry:"2026-09-01", status:"Available", location:"Main Office", photos:[] },
  { id:"V009", reg:"B 567 YZA", vin:"MHJFM1130LP123456", make:"Honda", model:"Fit", year:2018, type:"Compact", color:"Green", mileage:112300, motIssue:"2024-09-01", motExpiry:"2025-09-01", insuranceExpiry:"2025-11-01", status:"InService", location:"Main Office", photos:[] },
  { id:"V010", reg:"B 890 BCD", vin:"KMHD35LH5GU123456", make:"Hyundai", model:"Accent", year:2020, type:"Economy", color:"White", mileage:67500, motIssue:"2025-05-01", motExpiry:"2026-05-01", insuranceExpiry:"2026-07-01", status:"Available", location:"Main Office", photos:[] },
  { id:"V011", reg:"B 135 EFG", vin:"LVSHFFAL4GE123456", make:"Suzuki", model:"Swift", year:2019, type:"Compact", color:"Red", mileage:79800, motIssue:"2025-01-01", motExpiry:"2026-01-01", insuranceExpiry:"2026-02-15", status:"Rented", location:"Customer", photos:[] },
  { id:"V012", reg:"B 246 HIJ", vin:"WVWZZZ3CZWE123456", make:"Volkswagen", model:"Polo Vivo", year:2021, type:"Economy", color:"Blue", mileage:34200, motIssue:"2025-09-01", motExpiry:"2026-09-01", insuranceExpiry:"2026-11-01", status:"Available", location:"Main Office", photos:[] },
  { id:"V013", reg:"B 357 KLM", vin:"JM1BL1V73D1123456", make:"Mazda", model:"Demio", year:2020, type:"Compact", color:"Grey", mileage:51600, motIssue:"2025-03-15", motExpiry:"2026-03-15", insuranceExpiry:"2026-05-01", status:"Available", location:"Airport Branch", photos:[] },
  { id:"V014", reg:"B 468 NOP", vin:"JTDKN3DU1C0123456", make:"Toyota", model:"Etios", year:2019, type:"Economy", color:"White", mileage:88200, motIssue:"2024-12-01", motExpiry:"2025-12-01", insuranceExpiry:"2026-01-15", status:"Sold", location:"N/A", photos:[] },
  { id:"V015", reg:"B 579 QRS", vin:"KNAFK4A63G5123456", make:"Kia", model:"Picanto", year:2022, type:"Compact", color:"Orange", mileage:19500, motIssue:"2025-10-01", motExpiry:"2026-10-01", insuranceExpiry:"2026-12-01", status:"Available", location:"Main Office", photos:[] },
];

const CUSTOMERS = [
  { id:"C001", name:"Tebogo Mosweu", phone:"+267 7123 4567", idNumber:"539212345", license:"DL-2019-4567", emergency:"+267 7198 7654", notes:"Regular customer, always reliable", balance:0 },
  { id:"C002", name:"Keabetswe Modise", phone:"+267 7234 5678", idNumber:"841034567", license:"DL-2020-8901", emergency:"+267 7245 6789", notes:"Prefers compact vehicles", balance:350 },
  { id:"C003", name:"Mothusi Kgosimore", phone:"+267 7345 6789", idNumber:"690145678", license:"DL-2018-2345", emergency:"+267 7356 7890", notes:"Frequent intercity trips to Francistown", balance:0 },
  { id:"C004", name:"Lesego Tlhong", phone:"+267 7456 7890", idNumber:"920256789", license:"DL-2021-6789", emergency:"+267 7467 8901", notes:"", balance:1200 },
  { id:"C005", name:"Onalenna Phiri", phone:"+267 7567 8901", idNumber:"780367890", license:"DL-2017-0123", emergency:"+267 7578 9012", notes:"Cross-border trips to SA", balance:0 },
  { id:"C006", name:"Kagiso Setlhabi", phone:"+267 7678 9012", idNumber:"880478901", license:"DL-2019-4568", emergency:"+267 7689 0123", notes:"New customer", balance:0 },
];

const BOOKINGS = [
  { id:"BK001", customerId:"C001", customerName:"Tebogo Mosweu", vehicleId:"V002", vehicleReg:"B 456 DEF", pickup:"2026-05-10", return:"2026-05-17", status:"Active", rate:350, total:2450, deposit:1000, paid:2450, tripType:"Local" },
  { id:"BK002", customerId:"C002", customerName:"Keabetswe Modise", vehicleId:"V005", vehicleReg:"B 345 MNO", pickup:"2026-05-12", return:"2026-05-15", status:"Active", rate:300, total:900, deposit:500, paid:550, tripType:"Local" },
  { id:"BK003", customerId:"C003", customerName:"Mothusi Kgosimore", vehicleId:"V011", vehicleReg:"B 135 EFG", pickup:"2026-05-08", return:"2026-05-14", status:"Active", rate:320, total:1920, deposit:800, paid:1920, tripType:"Intercity" },
  { id:"BK004", customerId:"C004", customerName:"Lesego Tlhong", vehicleId:"V007", vehicleReg:"B 901 STU", pickup:"2026-05-18", return:"2026-05-22", status:"Confirmed", rate:400, total:1600, deposit:800, paid:800, tripType:"Cross-border" },
  { id:"BK005", customerId:"C005", customerName:"Onalenna Phiri", vehicleId:"V006", vehicleReg:"B 678 PQR", pickup:"2026-05-20", return:"2026-05-25", status:"Pending", rate:450, total:2250, deposit:1000, paid:0, tripType:"Cross-border" },
  { id:"BK006", customerId:"C001", customerName:"Tebogo Mosweu", vehicleId:"V004", vehicleReg:"B 012 JKL", pickup:"2026-04-01", return:"2026-04-05", status:"Completed", rate:350, total:1400, deposit:700, paid:1400, tripType:"Local" },
  { id:"BK007", customerId:"C006", customerName:"Kagiso Setlhabi", vehicleId:"V008", vehicleReg:"B 234 VWX", pickup:"2026-05-25", return:"2026-05-30", status:"Pending", rate:280, total:1400, deposit:600, paid:0, tripType:"Local" },
];

const MAINTENANCE = [
  { id:"M001", vehicleId:"V003", vehicleReg:"B 789 GHI", type:"Oil Service", date:"2026-05-10", cost:850, status:"In Progress", notes:"Full oil change + filter", nextDue:"2026-08-10" },
  { id:"M002", vehicleId:"V003", vehicleReg:"B 789 GHI", type:"Brake Pads", date:"2026-05-10", cost:1200, status:"In Progress", notes:"Front brake pads replacement", nextDue:"2027-05-10" },
  { id:"M003", vehicleId:"V009", vehicleReg:"B 567 YZA", type:"Tyre Replacement", date:"2026-05-05", cost:3200, status:"Completed", notes:"4 new tyres", nextDue:"2027-11-05" },
  { id:"M004", vehicleId:"V001", vehicleReg:"B 123 ABC", type:"Oil Service", date:"2026-04-15", cost:800, status:"Completed", notes:"Regular service", nextDue:"2026-07-15" },
  { id:"M005", vehicleId:"V010", vehicleReg:"B 890 BCD", type:"MOT Renewal", date:"2026-05-01", cost:450, status:"Completed", notes:"Passed", nextDue:"2027-05-01" },
];

const PAYMENTS = [
  { id:"P001", bookingId:"BK001", customerId:"C001", customerName:"Tebogo Mosweu", amount:1000, type:"Deposit", method:"Cash", date:"2026-05-10", status:"Completed" },
  { id:"P002", bookingId:"BK001", customerId:"C001", customerName:"Tebogo Mosweu", amount:1450, type:"Rental", method:"Bank Transfer", date:"2026-05-10", status:"Completed" },
  { id:"P003", bookingId:"BK002", customerId:"C002", customerName:"Keabetswe Modise", amount:500, type:"Deposit", method:"Cash", date:"2026-05-12", status:"Completed" },
  { id:"P004", bookingId:"BK002", customerId:"C002", customerName:"Keabetswe Modise", amount:50, type:"Cleaning Fee", method:"Cash", date:"2026-05-12", status:"Completed" },
  { id:"P005", bookingId:"BK003", customerId:"C003", customerName:"Mothusi Kgosimore", amount:800, type:"Deposit", method:"Card", date:"2026-05-08", status:"Completed" },
  { id:"P006", bookingId:"BK003", customerId:"C003", customerName:"Mothusi Kgosimore", amount:1120, type:"Rental", method:"Card", date:"2026-05-08", status:"Completed" },
  { id:"P007", bookingId:"BK004", customerId:"C004", customerName:"Lesego Tlhong", amount:800, type:"Deposit", method:"Bank Transfer", date:"2026-05-16", status:"Completed" },
  { id:"P008", bookingId:"BK006", customerId:"C001", customerName:"Tebogo Mosweu", amount:1400, type:"Rental", method:"Cash", date:"2026-04-01", status:"Completed" },
];

const COLORS = {
  Available:"#16a34a", Reserved:"#8b5cf6", Rented:"#2563eb", Maintenance:"#f59e0b", InService:"#6b7280", Sold:"#ef4444",
  Pending:"#f59e0b", Confirmed:"#8b5cf6", Active:"#2563eb", Completed:"#16a34a", Cancelled:"#ef4444"
};

// ─── HELPERS ──────────────────────────────────────────────────
const fmt = n => `BWP ${(n||0).toLocaleString("en-BW", {minimumFractionDigits:2, maximumFractionDigits:2})}`;
const statusBadge = (s, map=COLORS) => (
  <span style={{background:`${map[s]||"#6b7280"}18`, color:map[s]||"#6b7280", border:`1px solid ${map[s]||"#6b7280"}30`}} className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">{s}</span>
);
const today = "2026-05-15";

const USERS = [
  { username:"admin",      password:"admin123",  name:"Admin",          role:"Admin" },
  { username:"operations", password:"ops123",    name:"Operations",     role:"Operations" },
  { username:"finance",    password:"finance123",name:"Finance Officer", role:"Finance" },
];

// ─── LOGIN SCREEN ─────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [creds, setCreds] = useState({ username:"", password:"" });
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const user = USERS.find(u => u.username === creds.username.trim().toLowerCase() && u.password === creds.password);
    if (user) { onLogin(user); }
    else { setError("Incorrect username or password."); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { font-family:'DM Sans',sans-serif; }`}</style>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl" style={{background:"linear-gradient(135deg,#e2725b 0%,#d4a574 100%)"}}>
            <CarFront size={32} color="#fff"/>
          </div>
          <h1 className="text-white text-2xl font-bold tracking-tight" style={{fontFamily:"'Outfit',sans-serif"}}>Viel Glück</h1>
          <p className="text-white/40 text-xs uppercase tracking-[0.25em] mt-1">Fleet Manager</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-7 shadow-2xl">
          <h2 className="text-gray-900 font-bold text-lg mb-1" style={{fontFamily:"'Outfit',sans-serif"}}>Welcome back</h2>
          <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Username</label>
              <input
                value={creds.username}
                onChange={e=>{ setCreds({...creds,username:e.target.value}); setError(""); }}
                placeholder="e.g. admin"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw?"text":"password"}
                  value={creds.password}
                  onChange={e=>{ setCreds({...creds,password:e.target.value}); setError(""); }}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
                />
                <button type="button" onClick={()=>setShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <Eye size={15}/> : <Eye size={15} className="opacity-40"/>}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle size={14} className="text-red-500 shrink-0"/>
                <span className="text-xs text-red-600">{error}</span>
              </div>
            )}

            <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg shadow-orange-200/50 mt-1" style={{background:"linear-gradient(135deg,#e2725b 0%,#d4a574 100%)"}}>
              Sign In
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2 font-semibold">Demo credentials</p>
            <div className="space-y-1">
              {USERS.map(u=>(
                <button key={u.username} onClick={()=>{ setCreds({username:u.username,password:u.password}); setError(""); }}
                  className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs text-gray-600 hover:bg-orange-50/60 transition-colors text-left">
                  <span className="font-semibold text-gray-700">{u.username}</span>
                  <span className="text-gray-400">{u.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">© 2026 Viel Glück Car Hire · Botswana</p>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [maintenance, setMaintenance] = useState(MAINTENANCE);
  const [payments, setPayments] = useState(PAYMENTS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [activeUser, setActiveUser] = useState(null);

  if (!activeUser) return <LoginScreen onLogin={user=>{ setActiveUser(user); setPage("dashboard"); }}/>;

  const handleLogout = () => { setActiveUser(null); setPage("dashboard"); setSidebarOpen(false); };

  const nav = [
    { id:"dashboard", label:"Dashboard", icon:Home },
    { id:"vehicles", label:"Vehicles", icon:Car },
    { id:"bookings", label:"Bookings", icon:Calendar },
    { id:"customers", label:"Customers", icon:Users },
    { id:"checkout", label:"Check-Out", icon:ClipboardCheck },
    { id:"returns", label:"Returns", icon:RotateCcw },
    { id:"inspection", label:"Inspections", icon:Shield },
    { id:"payments", label:"Payments", icon:CreditCard },
    { id:"maintenance", label:"Maintenance", icon:Wrench },
    { id:"reports", label:"Reports", icon:BarChart3 },
    { id:"settings", label:"Settings", icon:Settings },
  ];

  const goTo = (p, d) => { setPage(p); setDetail(d||null); setSidebarOpen(false); setSearch(""); };

  // ─── SIDEBAR ────────────────────────────────────────────────
  const Sidebar = () => (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen?"translate-x-0":"-translate-x-full"}`}
        style={{background:"linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)"}}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg, #e2725b 0%, #d4a574 100%)"}}>
              <CarFront size={22} color="#fff"/>
            </div>
            <div>
              <h1 className="text-white font-bold text-base tracking-tight" style={{fontFamily:"'Outfit', sans-serif"}}>Viel Glück</h1>
              <p className="text-white/50 text-[10px] uppercase tracking-[0.2em]">Fleet Manager</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {nav.map(n => {
            const Icon = n.icon;
            const active = page === n.id;
            return (
              <button key={n.id} onClick={()=>goTo(n.id)}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all ${active ? "text-white bg-white/10 border-r-3" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                style={active?{borderRightColor:"#e2725b"}:{}}>
                <Icon size={18}/><span>{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:"#e2725b"}}>A</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{activeUser.name}</p>
              <p className="text-white/40 text-[10px]">{activeUser.role}</p>
            </div>
            <LogOut size={14} className="text-white/40 cursor-pointer hover:text-white" onClick={handleLogout}/>
          </div>
        </div>
      </aside>
    </>
  );

  // ─── HEADER ─────────────────────────────────────────────────
  const Header = () => (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4">
      <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{nav.find(n=>n.id===page)?.label || "Dashboard"}</h2>
        <p className="text-xs text-gray-400">{new Date().toLocaleDateString("en-BW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
      </div>
      <div className="relative hidden sm:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-9 pr-4 py-2 text-sm rounded-xl bg-gray-50 border border-gray-100 w-56 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"/>
      </div>
      <button className="relative p-2 rounded-xl hover:bg-gray-50">
        <Bell size={18} className="text-gray-400"/>
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"/>
      </button>
    </header>
  );

  // ─── STAT CARD ──────────────────────────────────────────────
  const StatCard = ({icon:Icon, label, value, sub, color, onClick}) => (
    <div onClick={onClick} className={`bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all ${onClick?"cursor-pointer":""}`}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${color}14`}}>
          <Icon size={20} style={{color}}/>
        </div>
        {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
      </div>
      <p className="text-2xl font-bold mt-3 text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );

  // ─── MODAL SHELL ────────────────────────────────────────────
  const Modal = ({title, children, wide}) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto pb-8" onClick={()=>setModal(null)}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide?"max-w-3xl":"max-w-lg"} relative`} onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{title}</h3>
          <button onClick={()=>setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18}/></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );

  // ─── TABLE ──────────────────────────────────────────────────
  const Table = ({cols, data, onRow}) => (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50/80">
          {cols.map((c,i)=><th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{c.label}</th>)}
        </tr></thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan={cols.length} className="px-4 py-12 text-center text-gray-300">No records found</td></tr>}
          {data.map((row,ri)=>(
            <tr key={ri} onClick={()=>onRow?.(row)} className={`border-t border-gray-50 ${onRow?"cursor-pointer hover:bg-orange-50/30":""} transition-colors`}>
              {cols.map((c,ci)=><td key={ci} className="px-4 py-3 whitespace-nowrap">{c.render?c.render(row):row[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ─── FORM FIELD ─────────────────────────────────────────────
  const Field = ({label, children, span}) => (
    <div className={span ? `col-span-${span}` : ""}>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
  const Input = (props) => <input {...props} className={`w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white ${props.className||""}`}/>;
  const Select = ({options, ...props}) => (
    <select {...props} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white">
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  );
  const Btn = ({children, variant="primary", ...props}) => {
    const styles = {
      primary:"bg-gradient-to-r from-[#e2725b] to-[#d4a574] text-white hover:opacity-90 shadow-lg shadow-orange-200/50",
      secondary:"bg-gray-100 text-gray-700 hover:bg-gray-200",
      danger:"bg-red-50 text-red-600 hover:bg-red-100",
      success:"bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    };
    return <button {...props} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${styles[variant]} ${props.className||""}`}>{children}</button>;
  };

  // ─── DASHBOARD ──────────────────────────────────────────────
  const Dashboard = () => {
    const avail = vehicles.filter(v=>v.status==="Available").length;
    const rented = vehicles.filter(v=>v.status==="Rented").length;
    const maint = vehicles.filter(v=>v.status==="Maintenance"||v.status==="InService").length;
    const active = vehicles.filter(v=>v.status!=="Sold").length;
    const util = active > 0 ? Math.round((rented / active)*100) : 0;
    const totalRevenue = payments.reduce((s,p)=>s+p.amount,0);
    const overdue = bookings.filter(b=>b.status==="Active"&&b.return<today).length;
    const upcoming = bookings.filter(b=>b.status==="Pending"||b.status==="Confirmed").length;
    const outstanding = customers.reduce((s,c)=>s+c.balance,0) + bookings.filter(b=>b.status==="Active").reduce((s,b)=>s+(b.total-b.paid),0);
    const motDue = vehicles.filter(v=>v.status!=="Sold"&&v.motExpiry<=today).length;

    const pieData = [
      {name:"Available",value:avail,color:"#16a34a"},
      {name:"Rented",value:rented,color:"#2563eb"},
      {name:"Reserved",value:vehicles.filter(v=>v.status==="Reserved").length,color:"#8b5cf6"},
      {name:"Maintenance",value:maint,color:"#f59e0b"},
    ].filter(d=>d.value>0);

    const revByMonth = [
      {month:"Jan",revenue:18500},{month:"Feb",revenue:22300},{month:"Mar",revenue:19800},
      {month:"Apr",revenue:25600},{month:"May",revenue:totalRevenue},
    ];

    const topVehicles = [
      {name:"Polo B 456",rentals:12},{name:"Demio B 123",rentals:10},{name:"Rio B 345",rentals:9},
      {name:"Yaris B 012",rentals:8},{name:"Swift B 135",rentals:7},
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Car} label="Total Fleet" value={active} color="#1a1a2e" onClick={()=>goTo("vehicles")}/>
          <StatCard icon={CheckCircle2} label="Available" value={avail} color="#16a34a" onClick={()=>goTo("vehicles")}/>
          <StatCard icon={CarFront} label="Rented Out" value={rented} color="#2563eb" onClick={()=>goTo("bookings")}/>
          <StatCard icon={Wrench} label="In Maintenance" value={maint} color="#f59e0b" onClick={()=>goTo("maintenance")}/>
          <StatCard icon={TrendingUp} label="Utilization" value={`${util}%`} color="#8b5cf6"/>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Total Revenue" value={fmt(totalRevenue)} color="#16a34a"/>
          <StatCard icon={AlertTriangle} label="Overdue Returns" value={overdue} color="#ef4444" onClick={()=>goTo("returns")}/>
          <StatCard icon={Calendar} label="Upcoming Bookings" value={upcoming} color="#8b5cf6" onClick={()=>goTo("bookings")}/>
          <StatCard icon={AlertCircle} label="Outstanding" value={fmt(outstanding)} color="#f59e0b" onClick={()=>goTo("payments")}/>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Fleet Status Pie */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Fleet Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {pieData.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip formatter={(v,n)=>[v,n]}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {pieData.map(d=>(
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/>{d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Monthly Revenue (BWP)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/>
                <YAxis tick={{fontSize:12}} stroke="#94a3b8"/>
                <Tooltip formatter={v=>fmt(v)}/>
                <Bar dataKey="revenue" fill="#e2725b" radius={[8,8,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Active Rentals */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Active Rentals</h3>
              <button onClick={()=>goTo("bookings")} className="text-xs text-orange-500 font-semibold hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {bookings.filter(b=>b.status==="Active").slice(0,4).map(b=>(
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 hover:bg-orange-50/40 cursor-pointer transition-colors" onClick={()=>goTo("bookings",b)}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:"#2563eb18"}}><Car size={16} style={{color:"#2563eb"}}/></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.vehicleReg} · Due {b.return}</p>
                  </div>
                  {b.return < today && <span className="text-xs text-red-500 font-semibold">OVERDUE</span>}
                  {statusBadge(b.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Top Vehicles */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Most Rented Vehicles</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topVehicles} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis type="number" tick={{fontSize:12}} stroke="#94a3b8"/>
                <YAxis dataKey="name" type="category" tick={{fontSize:11}} stroke="#94a3b8" width={90}/>
                <Tooltip/>
                <Bar dataKey="rentals" fill="#d4a574" radius={[0,8,8,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts Row */}
        {(motDue > 0 || overdue > 0) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {motDue > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <AlertTriangle size={20} className="text-amber-500 shrink-0"/>
                <div>
                  <p className="text-sm font-semibold text-amber-800">{motDue} vehicle(s) with expired MOT</p>
                  <p className="text-xs text-amber-600 mt-0.5">Requires immediate attention</p>
                </div>
                <button onClick={()=>goTo("maintenance")} className="ml-auto text-xs text-amber-700 font-semibold hover:underline shrink-0">View →</button>
              </div>
            )}
            {overdue > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
                <Clock size={20} className="text-red-500 shrink-0"/>
                <div>
                  <p className="text-sm font-semibold text-red-800">{overdue} overdue return(s)</p>
                  <p className="text-xs text-red-600 mt-0.5">Contact customers immediately</p>
                </div>
                <button onClick={()=>goTo("returns")} className="ml-auto text-xs text-red-700 font-semibold hover:underline shrink-0">View →</button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── VEHICLES ───────────────────────────────────────────────
  const VehiclesPage = () => {
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState(null);
    const filtered = vehicles.filter(v => {
      if (statusFilter !== "All" && v.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [v.reg,v.make,v.model,v.vin,v.color].some(f=>(f||"").toLowerCase().includes(q));
      }
      return true;
    });

    const saveVehicle = () => {
      if (!form) return;
      if (form.id) {
        setVehicles(prev => prev.map(v => v.id === form.id ? form : v));
      } else {
        setVehicles(prev => [...prev, {...form, id:`V${String(prev.length+1).padStart(3,"0")}`, photos:[]}]);
      }
      setModal(null);
    };

    const VehicleForm = () => (
      <div className="grid grid-cols-2 gap-4">
        <Field label="Registration"><Input value={form.reg||""} onChange={e=>setForm({...form,reg:e.target.value})}/></Field>
        <Field label="VIN"><Input value={form.vin||""} onChange={e=>setForm({...form,vin:e.target.value})}/></Field>
        <Field label="Make"><Input value={form.make||""} onChange={e=>setForm({...form,make:e.target.value})}/></Field>
        <Field label="Model"><Input value={form.model||""} onChange={e=>setForm({...form,model:e.target.value})}/></Field>
        <Field label="Year"><Input type="number" value={form.year||""} onChange={e=>setForm({...form,year:parseInt(e.target.value)})}/></Field>
        <Field label="Type"><Select options={["Compact","Mid-size","Economy"]} value={form.type||"Compact"} onChange={e=>setForm({...form,type:e.target.value})}/></Field>
        <Field label="Color"><Input value={form.color||""} onChange={e=>setForm({...form,color:e.target.value})}/></Field>
        <Field label="Mileage"><Input type="number" value={form.mileage||""} onChange={e=>setForm({...form,mileage:parseInt(e.target.value)})}/></Field>
        <Field label="MOT Issue"><Input type="date" value={form.motIssue||""} onChange={e=>setForm({...form,motIssue:e.target.value})}/></Field>
        <Field label="MOT Expiry"><Input type="date" value={form.motExpiry||""} onChange={e=>setForm({...form,motExpiry:e.target.value})}/></Field>
        <Field label="Insurance Expiry"><Input type="date" value={form.insuranceExpiry||""} onChange={e=>setForm({...form,insuranceExpiry:e.target.value})}/></Field>
        <Field label="Status"><Select options={["Available","Reserved","Rented","Maintenance","InService","Sold"]} value={form.status||"Available"} onChange={e=>setForm({...form,status:e.target.value})}/></Field>
        <Field label="Location"><Input value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})}/></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn onClick={saveVehicle}>{form.id ? "Update" : "Add"} Vehicle</Btn>
        </div>
      </div>
    );

    const VehicleDetail = () => {
      const v = detail;
      const vBookings = bookings.filter(b=>b.vehicleId===v.id);
      const vMaint = maintenance.filter(m=>m.vehicleId===v.id);
      return (
        <div className="space-y-6">
          <button onClick={()=>setDetail(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16}/>Back to fleet</button>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{v.make} {v.model} ({v.year})</h3>
                  {statusBadge(v.status)}
                </div>
                <p className="text-gray-400 text-sm">{v.reg} · {v.color}</p>
              </div>
              <Btn onClick={()=>{setForm(v);setModal("vehicle")}}><Edit size={14} className="mr-1.5"/>Edit</Btn>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[["VIN",v.vin],["Mileage",`${v.mileage?.toLocaleString()} km`],["Type",v.type],["Location",v.location],["MOT Expiry",v.motExpiry],["Insurance Expiry",v.insuranceExpiry]].map(([l,val])=>(
                <div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p></div>
              ))}
            </div>
          </div>
          {vBookings.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Booking History</h4>
              <Table cols={[
                {label:"ID",key:"id"},{label:"Customer",key:"customerName"},{label:"Pickup",key:"pickup"},{label:"Return",key:"return"},
                {label:"Status",render:r=>statusBadge(r.status)},{label:"Total",render:r=>fmt(r.total)}
              ]} data={vBookings}/>
            </div>
          )}
          {vMaint.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Maintenance Records</h4>
              <Table cols={[
                {label:"Type",key:"type"},{label:"Date",key:"date"},{label:"Cost",render:r=>fmt(r.cost)},{label:"Status",render:r=>statusBadge(r.status)},{label:"Next Due",key:"nextDue"}
              ]} data={vMaint}/>
            </div>
          )}
        </div>
      );
    };

    if (detail) return <VehicleDetail/>;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {["All","Available","Rented","Reserved","Maintenance","InService","Sold"].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter===s?"bg-gray-900 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
          <div className="ml-auto">
            <Btn onClick={()=>{setForm({reg:"",vin:"",make:"",model:"",year:2024,type:"Compact",color:"",mileage:0,motIssue:"",motExpiry:"",insuranceExpiry:"",status:"Available",location:"Main Office"});setModal("vehicle");}}><Plus size={14} className="mr-1.5"/>Add Vehicle</Btn>
          </div>
        </div>
        <Table cols={[
          {label:"Reg",render:r=><span className="font-mono font-semibold text-gray-900">{r.reg}</span>},
          {label:"Vehicle",render:r=><span>{r.make} {r.model}</span>},
          {label:"Year",key:"year"},
          {label:"Color",key:"color"},
          {label:"Mileage",render:r=>`${r.mileage?.toLocaleString()} km`},
          {label:"Status",render:r=>statusBadge(r.status)},
          {label:"Location",key:"location"},
        ]} data={filtered} onRow={r=>setDetail(r)}/>
        {modal==="vehicle" && <Modal title={form?.id?"Edit Vehicle":"New Vehicle"} wide><VehicleForm/></Modal>}
      </div>
    );
  };

  // ─── BOOKINGS ───────────────────────────────────────────────
  const BookingsPage = () => {
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState(null);
    const filtered = bookings.filter(b => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [b.id,b.customerName,b.vehicleReg].some(f=>(f||"").toLowerCase().includes(q));
      }
      return true;
    });

    const saveBooking = () => {
      if (!form) return;
      const cust = customers.find(c=>c.id===form.customerId);
      const veh = vehicles.find(v=>v.id===form.vehicleId);
      const days = Math.max(1, Math.ceil((new Date(form.return) - new Date(form.pickup))/(1000*60*60*24)));
      const updated = {...form, customerName:cust?.name||"", vehicleReg:veh?.reg||"", total:days*form.rate};
      if (form.id) {
        setBookings(prev => prev.map(b => b.id === form.id ? updated : b));
      } else {
        setBookings(prev => [...prev, {...updated, id:`BK${String(prev.length+1).padStart(3,"0")}`, paid:0}]);
      }
      setModal(null);
    };

    const BookingForm = () => (
      <div className="grid grid-cols-2 gap-4">
        <Field label="Customer"><Select options={[{value:"",label:"Select..."},...customers.map(c=>({value:c.id,label:c.name}))]} value={form.customerId||""} onChange={e=>setForm({...form,customerId:e.target.value})}/></Field>
        <Field label="Vehicle"><Select options={[{value:"",label:"Select..."},...vehicles.filter(v=>v.status==="Available"||v.id===form.vehicleId).map(v=>({value:v.id,label:`${v.make} ${v.model} (${v.reg})`}))]} value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})}/></Field>
        <Field label="Pickup Date"><Input type="date" value={form.pickup||""} onChange={e=>setForm({...form,pickup:e.target.value})}/></Field>
        <Field label="Return Date"><Input type="date" value={form.return||""} onChange={e=>setForm({...form,return:e.target.value})}/></Field>
        <Field label="Daily Rate (BWP)"><Input type="number" value={form.rate||""} onChange={e=>setForm({...form,rate:parseInt(e.target.value)})}/></Field>
        <Field label="Trip Type"><Select options={["Local","Intercity","Cross-border"]} value={form.tripType||"Local"} onChange={e=>setForm({...form,tripType:e.target.value})}/></Field>
        <Field label="Status"><Select options={["Pending","Confirmed","Active","Completed","Cancelled"]} value={form.status||"Pending"} onChange={e=>setForm({...form,status:e.target.value})}/></Field>
        <Field label="Deposit (BWP)"><Input type="number" value={form.deposit||""} onChange={e=>setForm({...form,deposit:parseInt(e.target.value)})}/></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn onClick={saveBooking}>{form.id ? "Update" : "Create"} Booking</Btn>
        </div>
      </div>
    );

    const BookingDetail = () => {
      const b = detail;
      const bPayments = payments.filter(p=>p.bookingId===b.id);
      return (
        <div className="space-y-6">
          <button onClick={()=>setDetail(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16}/>Back to bookings</button>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Booking {b.id}</h3>
                  {statusBadge(b.status)}
                </div>
                <p className="text-gray-400 text-sm">{b.customerName} · {b.vehicleReg}</p>
              </div>
              <div className="flex gap-2">
                <Btn onClick={()=>{setForm(b);setModal("booking");}}><Edit size={14} className="mr-1.5"/>Edit</Btn>
                {b.status==="Active" && <Btn variant="success" onClick={()=>goTo("returns",b)}><RotateCcw size={14} className="mr-1.5"/>Process Return</Btn>}
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[["Pickup",b.pickup],["Return",b.return],["Daily Rate",fmt(b.rate)],["Total",fmt(b.total)],["Deposit",fmt(b.deposit)],["Paid",fmt(b.paid)],["Balance",fmt(b.total-b.paid)],["Trip",b.tripType]].map(([l,val])=>(
                <div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p></div>
              ))}
            </div>
            {b.return < today && b.status === "Active" && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500"/><span className="text-sm text-red-700 font-medium">This rental is overdue by {Math.ceil((new Date(today)-new Date(b.return))/(1000*60*60*24))} day(s)</span>
              </div>
            )}
          </div>
          {bPayments.length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Payments</h4>
              <Table cols={[
                {label:"Date",key:"date"},{label:"Type",key:"type"},{label:"Method",key:"method"},{label:"Amount",render:r=>fmt(r.amount)},{label:"Status",render:r=>statusBadge(r.status)}
              ]} data={bPayments}/>
            </div>
          )}
        </div>
      );
    };

    if (detail) return <BookingDetail/>;

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {["All","Pending","Confirmed","Active","Completed","Cancelled"].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter===s?"bg-gray-900 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>
            ))}
          </div>
          <div className="ml-auto">
            <Btn onClick={()=>{setForm({customerId:"",vehicleId:"",pickup:"",return:"",rate:300,status:"Pending",deposit:500,tripType:"Local"});setModal("booking");}}><Plus size={14} className="mr-1.5"/>New Booking</Btn>
          </div>
        </div>
        <Table cols={[
          {label:"ID",render:r=><span className="font-mono font-semibold">{r.id}</span>},
          {label:"Customer",key:"customerName"},
          {label:"Vehicle",key:"vehicleReg"},
          {label:"Pickup",key:"pickup"},
          {label:"Return",render:r=><span className={r.return<today&&r.status==="Active"?"text-red-500 font-semibold":""}>{r.return}</span>},
          {label:"Status",render:r=>statusBadge(r.status)},
          {label:"Total",render:r=>fmt(r.total)},
          {label:"Balance",render:r=>{const bal=r.total-r.paid; return <span className={bal>0?"text-red-500 font-semibold":"text-green-600"}>{fmt(bal)}</span>}},
        ]} data={filtered} onRow={r=>setDetail(r)}/>
        {modal==="booking" && <Modal title={form?.id?"Edit Booking":"New Booking"} wide><BookingForm/></Modal>}
      </div>
    );
  };

  // ─── CUSTOMERS ──────────────────────────────────────────────
  const CustomersPage = () => {
    const [form, setForm] = useState(null);
    const filtered = customers.filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [c.name,c.phone,c.idNumber,c.license].some(f=>(f||"").toLowerCase().includes(q));
    });

    const saveCustomer = () => {
      if (!form) return;
      if (form.id) {
        setCustomers(prev => prev.map(c => c.id === form.id ? form : c));
      } else {
        setCustomers(prev => [...prev, {...form, id:`C${String(prev.length+1).padStart(3,"0")}`, balance:0}]);
      }
      setModal(null);
    };

    const CustomerForm = () => (
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name"><Input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
        <Field label="Phone"><Input value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})}/></Field>
        <Field label="ID/Passport No."><Input value={form.idNumber||""} onChange={e=>setForm({...form,idNumber:e.target.value})}/></Field>
        <Field label="License No."><Input value={form.license||""} onChange={e=>setForm({...form,license:e.target.value})}/></Field>
        <Field label="Emergency Contact"><Input value={form.emergency||""} onChange={e=>setForm({...form,emergency:e.target.value})}/></Field>
        <div/>
        <div className="col-span-2">
          <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none"/></Field>
        </div>
        <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn onClick={saveCustomer}>{form.id ? "Update" : "Add"} Customer</Btn>
        </div>
      </div>
    );

    const CustomerDetail = () => {
      const c = detail;
      const cBookings = bookings.filter(b=>b.customerId===c.id);
      return (
        <div className="space-y-6">
          <button onClick={()=>setDetail(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16}/>Back to customers</button>
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{c.name}</h3>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Phone size={14}/>{c.phone}</span>
                  <span className="flex items-center gap-1"><Hash size={14}/>{c.idNumber}</span>
                  <span className="flex items-center gap-1"><BadgeCheck size={14}/>{c.license}</span>
                </div>
              </div>
              <Btn onClick={()=>{setForm(c);setModal("customer");}}><Edit size={14} className="mr-1.5"/>Edit</Btn>
            </div>
            {c.balance > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-500"/><span className="text-sm text-amber-700 font-medium">Outstanding balance: {fmt(c.balance)}</span>
              </div>
            )}
            {c.notes && <p className="mt-3 text-sm text-gray-500 italic">"{c.notes}"</p>}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Rental History ({cBookings.length})</h4>
            <Table cols={[
              {label:"ID",key:"id"},{label:"Vehicle",key:"vehicleReg"},{label:"Pickup",key:"pickup"},{label:"Return",key:"return"},
              {label:"Status",render:r=>statusBadge(r.status)},{label:"Total",render:r=>fmt(r.total)}
            ]} data={cBookings} onRow={r=>goTo("bookings",r)}/>
          </div>
        </div>
      );
    };

    if (detail) return <CustomerDetail/>;

    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Btn onClick={()=>{setForm({name:"",phone:"",idNumber:"",license:"",emergency:"",notes:""});setModal("customer");}}><Plus size={14} className="mr-1.5"/>Add Customer</Btn>
        </div>
        <Table cols={[
          {label:"Name",render:r=><span className="font-semibold text-gray-900">{r.name}</span>},
          {label:"Phone",key:"phone"},
          {label:"ID/Passport",key:"idNumber"},
          {label:"License",key:"license"},
          {label:"Balance",render:r=><span className={r.balance>0?"text-red-500 font-semibold":"text-green-600"}>{fmt(r.balance)}</span>},
        ]} data={filtered} onRow={r=>setDetail(r)}/>
        {modal==="customer" && <Modal title={form?.id?"Edit Customer":"New Customer"}><CustomerForm/></Modal>}
      </div>
    );
  };

  // ─── CHECK-OUT WORKFLOW ─────────────────────────────────────
  const CheckOutPage = () => {
    const activeBookings = bookings.filter(b=>b.status==="Confirmed");
    const [selected, setSelected] = useState(null);
    const [co, setCo] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false});

    const processCheckOut = () => {
      if (!selected) return;
      setBookings(prev=>prev.map(b=>b.id===selected.id?{...b,status:"Active"}:b));
      setVehicles(prev=>prev.map(v=>v.id===selected.vehicleId?{...v,status:"Rented",location:"Customer",mileage:parseInt(co.mileage)||v.mileage}:v));
      setSelected(null);
      setCo({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false});
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Confirmed Bookings Ready for Check-Out</h3>
          {activeBookings.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">No confirmed bookings awaiting check-out</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeBookings.map(b=>(
                <div key={b.id} onClick={()=>setSelected(b)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selected?.id===b.id?"border-orange-400 bg-orange-50/50":"border-gray-100 hover:border-gray-200"}`}>
                  <p className="font-semibold text-gray-900 text-sm">{b.customerName}</p>
                  <p className="text-xs text-gray-400 mt-1">{b.vehicleReg} · Pickup: {b.pickup}</p>
                  <p className="text-xs text-gray-400">{b.tripType} · {fmt(b.rate)}/day</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Vehicle Inspection — Check-Out</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Odometer Reading (km)"><Input type="number" value={co.mileage} onChange={e=>setCo({...co,mileage:e.target.value})} placeholder="e.g. 87420"/></Field>
              <Field label="Fuel Level"><Select options={["Empty","Below Quarter","Quarter","Half","Three Quarter","Full"]} value={co.fuel} onChange={e=>setCo({...co,fuel:e.target.value})}/></Field>
              <Field label="Vehicle Clean?">
                <div className="flex gap-3 mt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={co.clean} onChange={()=>setCo({...co,clean:true})} className="accent-orange-500"/>Yes</label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={!co.clean} onChange={()=>setCo({...co,clean:false})} className="accent-orange-500"/>No</label>
                </div>
              </Field>
              <Field label="Upload Photos">
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 cursor-pointer hover:bg-gray-50">
                  <Camera size={16}/>Tap to capture / upload
                </div>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Existing Damages/Notes">
                  <textarea value={co.damages} onChange={e=>setCo({...co,damages:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none" placeholder="Note any scratches, dents, etc."/>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={co.signature} onChange={e=>setCo({...co,signature:e.target.checked})} className="accent-orange-500 w-4 h-4"/>
                  <span className="text-sm text-gray-700">Customer has signed the rental agreement</span>
                </label>
              </div>
              <div className="sm:col-span-2 flex justify-end pt-3 border-t border-gray-100">
                <Btn onClick={processCheckOut} className={`${!co.signature||!co.mileage?"opacity-50 pointer-events-none":""}`}>
                  <CheckCircle2 size={14} className="mr-1.5"/>Complete Check-Out
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── RETURNS WORKFLOW ───────────────────────────────────────
  const ReturnsPage = () => {
    const activeRentals = bookings.filter(b=>b.status==="Active");
    const [selected, setSelected] = useState(detail || null);
    const [ret, setRet] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",smokeFee:false,stainFee:false,mudFee:false});

    const processReturn = () => {
      if (!selected) return;
      let penalties = 0;
      const newPayments = [];
      if (!ret.clean) { penalties += 50; newPayments.push({id:`P${String(payments.length+1).padStart(3,"0")}`,bookingId:selected.id,customerId:selected.customerId,customerName:selected.customerName,amount:50,type:"Cleaning Fee",method:"Cash",date:today,status:"Pending"}); }
      if (ret.smokeFee) { penalties += 200; newPayments.push({id:`P${String(payments.length+newPayments.length+1).padStart(3,"0")}`,bookingId:selected.id,customerId:selected.customerId,customerName:selected.customerName,amount:200,type:"Smoking Fee",method:"Cash",date:today,status:"Pending"}); }
      if (ret.stainFee) { penalties += 150; newPayments.push({id:`P${String(payments.length+newPayments.length+1).padStart(3,"0")}`,bookingId:selected.id,customerId:selected.customerId,customerName:selected.customerName,amount:150,type:"Stain Fee",method:"Cash",date:today,status:"Pending"}); }
      if (ret.mudFee) { penalties += 100; newPayments.push({id:`P${String(payments.length+newPayments.length+1).padStart(3,"0")}`,bookingId:selected.id,customerId:selected.customerId,customerName:selected.customerName,amount:100,type:"Mud/Sand Fee",method:"Cash",date:today,status:"Pending"}); }

      setBookings(prev=>prev.map(b=>b.id===selected.id?{...b,status:"Completed",total:b.total+penalties}:b));
      setVehicles(prev=>prev.map(v=>v.id===selected.vehicleId?{...v,status:"Available",location:"Main Office",mileage:parseInt(ret.mileage)||v.mileage}:v));
      if (newPayments.length) setPayments(prev=>[...prev,...newPayments]);
      setSelected(null);
      setRet({mileage:"",fuel:"Empty",clean:true,damages:"",smokeFee:false,stainFee:false,mudFee:false});
      if (detail) setDetail(null);
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Active Rentals</h3>
          {activeRentals.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">No active rentals</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeRentals.map(b=>(
                <div key={b.id} onClick={()=>setSelected(b)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selected?.id===b.id?"border-orange-400 bg-orange-50/50":"border-gray-100 hover:border-gray-200"}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm">{b.customerName}</p>
                    {b.return < today && <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">OVERDUE</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{b.vehicleReg} · Due: {b.return}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Return Inspection — {selected.vehicleReg}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Return Odometer (km)"><Input type="number" value={ret.mileage} onChange={e=>setRet({...ret,mileage:e.target.value})}/></Field>
              <Field label="Fuel Level"><Select options={["Empty","Below Quarter","Quarter","Half","Three Quarter","Full"]} value={ret.fuel} onChange={e=>setRet({...ret,fuel:e.target.value})}/></Field>
              <Field label="Vehicle Clean?">
                <div className="flex gap-3 mt-1">
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={ret.clean} onChange={()=>setRet({...ret,clean:true})} className="accent-orange-500"/>Yes</label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={!ret.clean} onChange={()=>setRet({...ret,clean:false})} className="accent-orange-500"/>No — add BWP 50 fee</label>
                </div>
              </Field>
              <Field label="Upload Return Photos">
                <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 cursor-pointer hover:bg-gray-50">
                  <Camera size={16}/>Tap to capture / upload
                </div>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Return Damages/Notes">
                  <textarea value={ret.damages} onChange={e=>setRet({...ret,damages:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none" placeholder="New damages found at return..."/>
                </Field>
              </div>
              <div className="sm:col-span-2 space-y-2">
                <p className="text-xs font-semibold text-gray-500">Optional Penalties</p>
                {[["smokeFee","Smoking smell — BWP 200"],["stainFee","Interior stain cleaning — BWP 150"],["mudFee","Excessive mud/sand — BWP 100"]].map(([k,l])=>(
                  <label key={k} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={ret[k]} onChange={e=>setRet({...ret,[k]:e.target.checked})} className="accent-orange-500 w-4 h-4"/>
                    <span className="text-sm text-gray-700">{l}</span>
                  </label>
                ))}
              </div>
              <div className="sm:col-span-2 flex justify-end pt-3 border-t border-gray-100">
                <Btn onClick={processReturn} className={`${!ret.mileage?"opacity-50 pointer-events-none":""}`}>
                  <CheckCircle2 size={14} className="mr-1.5"/>Complete Return
                </Btn>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── INSPECTION ─────────────────────────────────────────────
  const InspectionPage = () => {
    const areas = ["Front Bumper","Rear Bumper","Left Side","Right Side","Windshield","Tyres/Rims","Interior"];
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [inspections, setInspections] = useState(areas.map(a=>({area:a,condition:"Good",severity:"None",notes:""})));

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Vehicle Damage Inspection</h3>
          <Field label="Select Vehicle">
            <Select options={[{value:"",label:"Choose vehicle..."},...vehicles.filter(v=>v.status!=="Sold").map(v=>({value:v.id,label:`${v.make} ${v.model} — ${v.reg}`}))]} value={selectedVehicle} onChange={e=>setSelectedVehicle(e.target.value)}/>
          </Field>
        </div>

        {selectedVehicle && (
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Inspection Checklist</h4>
            <div className="space-y-4">
              {inspections.map((insp, i) => (
                <div key={insp.area} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-sm text-gray-800">{insp.area}</p>
                    <div className="flex gap-1.5">
                      {["Good","Minor","Major"].map(s=>(
                        <button key={s} onClick={()=>{const u=[...inspections];u[i]={...u[i],severity:s};setInspections(u);}}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${insp.severity===s ? (s==="Good"?"bg-green-100 text-green-700":s==="Minor"?"bg-amber-100 text-amber-700":"bg-red-100 text-red-700") : "bg-white text-gray-400 border border-gray-200"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <input value={insp.notes} onChange={e=>{const u=[...inspections];u[i]={...u[i],notes:e.target.value};setInspections(u);}}
                      placeholder="Damage notes..." className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm"/>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 cursor-pointer hover:bg-white">
                      <Camera size={14}/>Photo
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Btn><CheckCircle2 size={14} className="mr-1.5"/>Save Inspection</Btn>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── PAYMENTS ───────────────────────────────────────────────
  const PaymentsPage = () => {
    const [form, setForm] = useState(null);
    const filtered = payments.filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [p.id,p.customerName,p.bookingId,p.type].some(f=>(f||"").toLowerCase().includes(q));
    });

    const totalCollected = payments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0);
    const totalPending = payments.filter(p=>p.status==="Pending").reduce((s,p)=>s+p.amount,0);
    const cleaningFees = payments.filter(p=>p.type.includes("Fee")||p.type.includes("Cleaning")).reduce((s,p)=>s+p.amount,0);

    const addPayment = () => {
      if (!form) return;
      const bk = bookings.find(b=>b.id===form.bookingId);
      setPayments(prev=>[...prev,{...form, id:`P${String(prev.length+1).padStart(3,"0")}`, customerId:bk?.customerId||"", customerName:bk?.customerName||form.customerName||"", date:today, status:"Completed"}]);
      if (bk) setBookings(prev=>prev.map(b=>b.id===bk.id?{...b,paid:b.paid+parseInt(form.amount)}:b));
      setModal(null);
    };

    const PaymentForm = () => (
      <div className="grid grid-cols-2 gap-4">
        <Field label="Booking"><Select options={[{value:"",label:"Select..."},...bookings.filter(b=>b.status==="Active"||b.status==="Completed").map(b=>({value:b.id,label:`${b.id} — ${b.customerName}`}))]} value={form.bookingId||""} onChange={e=>setForm({...form,bookingId:e.target.value})}/></Field>
        <Field label="Amount (BWP)"><Input type="number" value={form.amount||""} onChange={e=>setForm({...form,amount:parseInt(e.target.value)})}/></Field>
        <Field label="Type"><Select options={["Deposit","Rental","Cleaning Fee","Damage Fee","Refund","Other"]} value={form.type||"Rental"} onChange={e=>setForm({...form,type:e.target.value})}/></Field>
        <Field label="Method"><Select options={["Cash","Card","Bank Transfer"]} value={form.method||"Cash"} onChange={e=>setForm({...form,method:e.target.value})}/></Field>
        <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn onClick={addPayment}>Record Payment</Btn>
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={DollarSign} label="Collected" value={fmt(totalCollected)} color="#16a34a"/>
          <StatCard icon={Clock} label="Pending" value={fmt(totalPending)} color="#f59e0b"/>
          <StatCard icon={Droplets} label="Penalties/Fees" value={fmt(cleaningFees)} color="#e2725b"/>
        </div>
        <div className="flex justify-end">
          <Btn onClick={()=>{setForm({bookingId:"",amount:"",type:"Rental",method:"Cash"});setModal("payment");}}><Plus size={14} className="mr-1.5"/>Record Payment</Btn>
        </div>
        <Table cols={[
          {label:"ID",render:r=><span className="font-mono">{r.id}</span>},
          {label:"Date",key:"date"},
          {label:"Customer",key:"customerName"},
          {label:"Booking",key:"bookingId"},
          {label:"Type",key:"type"},
          {label:"Method",key:"method"},
          {label:"Amount",render:r=><span className="font-semibold">{fmt(r.amount)}</span>},
          {label:"Status",render:r=>statusBadge(r.status)},
        ]} data={filtered}/>
        {modal==="payment" && <Modal title="Record Payment"><PaymentForm/></Modal>}
      </div>
    );
  };

  // ─── MAINTENANCE ────────────────────────────────────────────
  const MaintenancePage = () => {
    const [form, setForm] = useState(null);
    const motExpiring = vehicles.filter(v=>v.status!=="Sold"&&v.motExpiry&&v.motExpiry<=today);

    const saveMaint = () => {
      if (!form) return;
      const veh = vehicles.find(v=>v.id===form.vehicleId);
      if (form.id) {
        setMaintenance(prev=>prev.map(m=>m.id===form.id?{...form,vehicleReg:veh?.reg||""}:m));
      } else {
        setMaintenance(prev=>[...prev,{...form,id:`M${String(prev.length+1).padStart(3,"0")}`,vehicleReg:veh?.reg||""}]);
      }
      setModal(null);
    };

    const MaintForm = () => (
      <div className="grid grid-cols-2 gap-4">
        <Field label="Vehicle"><Select options={[{value:"",label:"Select..."},...vehicles.filter(v=>v.status!=="Sold").map(v=>({value:v.id,label:`${v.make} ${v.model} (${v.reg})`}))]} value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})}/></Field>
        <Field label="Service Type"><Select options={["Oil Service","Tyre Replacement","Brake Pads","MOT Renewal","Insurance Renewal","General Service","Roadworthy","Body Repair","Electrical","Other"]} value={form.type||"Oil Service"} onChange={e=>setForm({...form,type:e.target.value})}/></Field>
        <Field label="Date"><Input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
        <Field label="Cost (BWP)"><Input type="number" value={form.cost||""} onChange={e=>setForm({...form,cost:parseInt(e.target.value)})}/></Field>
        <Field label="Status"><Select options={["Scheduled","In Progress","Completed"]} value={form.status||"Scheduled"} onChange={e=>setForm({...form,status:e.target.value})}/></Field>
        <Field label="Next Due"><Input type="date" value={form.nextDue||""} onChange={e=>setForm({...form,nextDue:e.target.value})}/></Field>
        <div className="col-span-2">
          <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none"/></Field>
        </div>
        <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
          <Btn onClick={saveMaint}>{form.id ? "Update" : "Add"} Record</Btn>
        </div>
      </div>
    );

    return (
      <div className="space-y-4">
        {motExpiring.length > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-center gap-2 mb-2"><AlertTriangle size={18} className="text-amber-500"/><p className="font-semibold text-amber-800 text-sm">MOT/Insurance Alerts</p></div>
            <div className="space-y-1">
              {motExpiring.map(v=>(
                <p key={v.id} className="text-sm text-amber-700">{v.make} {v.model} ({v.reg}) — MOT expired {v.motExpiry}</p>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end">
          <Btn onClick={()=>{setForm({vehicleId:"",type:"Oil Service",date:today,cost:"",status:"Scheduled",nextDue:"",notes:""});setModal("maint");}}><Plus size={14} className="mr-1.5"/>Add Record</Btn>
        </div>
        <Table cols={[
          {label:"Vehicle",key:"vehicleReg"},
          {label:"Type",key:"type"},
          {label:"Date",key:"date"},
          {label:"Cost",render:r=>fmt(r.cost)},
          {label:"Status",render:r=>statusBadge(r.status)},
          {label:"Next Due",key:"nextDue"},
          {label:"Notes",render:r=><span className="truncate max-w-[150px] block text-gray-500">{r.notes}</span>},
        ]} data={maintenance} onRow={r=>{setForm(r);setModal("maint");}}/>
        {modal==="maint" && <Modal title={form?.id?"Edit Maintenance":"New Maintenance"} wide><MaintForm/></Modal>}
      </div>
    );
  };

  // ─── REPORTS ────────────────────────────────────────────────
  const ReportsPage = () => {
    const totalRev = payments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0);
    const maintCost = maintenance.reduce((s,m)=>s+m.cost,0);
    const activeVeh = vehicles.filter(v=>v.status!=="Sold").length;
    const rentedNow = vehicles.filter(v=>v.status==="Rented").length;
    const util = activeVeh>0?Math.round((rentedNow/activeVeh)*100):0;
    const cleanFees = payments.filter(p=>["Cleaning Fee","Smoking Fee","Stain Fee","Mud/Sand Fee"].includes(p.type)).reduce((s,p)=>s+p.amount,0);

    const revPerVehicle = vehicles.filter(v=>v.status!=="Sold").map(v=>{
      const vBookings = bookings.filter(b=>b.vehicleId===v.id);
      const rev = vBookings.reduce((s,b)=>s+b.total,0);
      return {name:`${v.make} ${v.model}`.substring(0,12), revenue:rev};
    }).sort((a,b)=>b.revenue-a.revenue).slice(0,8);

    const maintPerVehicle = vehicles.filter(v=>v.status!=="Sold").map(v=>{
      const cost = maintenance.filter(m=>m.vehicleId===v.id).reduce((s,m)=>s+m.cost,0);
      return {name:`${v.make[0]}. ${v.model}`, cost};
    }).filter(v=>v.cost>0).sort((a,b)=>b.cost-a.cost);

    const statusDist = [
      {name:"Available",value:vehicles.filter(v=>v.status==="Available").length,color:"#16a34a"},
      {name:"Rented",value:vehicles.filter(v=>v.status==="Rented").length,color:"#2563eb"},
      {name:"Other",value:vehicles.filter(v=>!["Available","Rented","Sold"].includes(v.status)).length,color:"#f59e0b"},
    ].filter(d=>d.value>0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Total Revenue" value={fmt(totalRev)} color="#16a34a"/>
          <StatCard icon={Wrench} label="Maintenance Costs" value={fmt(maintCost)} color="#f59e0b"/>
          <StatCard icon={Activity} label="Fleet Utilization" value={`${util}%`} color="#2563eb"/>
          <StatCard icon={Droplets} label="Penalty Fees" value={fmt(cleanFees)} color="#e2725b"/>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Revenue per Vehicle (BWP)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revPerVehicle}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis dataKey="name" tick={{fontSize:10}} stroke="#94a3b8" angle={-20} textAnchor="end" height={50}/>
                <YAxis tick={{fontSize:11}} stroke="#94a3b8"/>
                <Tooltip formatter={v=>fmt(v)}/>
                <Bar dataKey="revenue" fill="#e2725b" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Maintenance Cost per Vehicle (BWP)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={maintPerVehicle} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                <XAxis type="number" tick={{fontSize:11}} stroke="#94a3b8"/>
                <YAxis dataKey="name" type="category" tick={{fontSize:11}} stroke="#94a3b8" width={80}/>
                <Tooltip formatter={v=>fmt(v)}/>
                <Bar dataKey="cost" fill="#f59e0b" radius={[0,6,6,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Fleet Distribution</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                  {statusDist.map((d,i)=><Cell key={i} fill={d.color}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center">
              {statusDist.map(d=>(
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/>{d.name} ({d.value})
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 lg:col-span-2">
            <h3 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Quick Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Total Bookings", bookings.length],
                ["Completed Rentals", bookings.filter(b=>b.status==="Completed").length],
                ["Active Rentals", bookings.filter(b=>b.status==="Active").length],
                ["Total Customers", customers.length],
                ["Avg Revenue/Booking", fmt(totalRev / Math.max(bookings.length,1))],
                ["Maintenance Records", maintenance.length],
                ["Idle Vehicles", vehicles.filter(v=>v.status==="Available").length],
                ["Cleaning Fees Collected", fmt(cleanFees)],
              ].map(([label, value]) => (
                <div key={label} className="p-3 rounded-xl bg-gray-50/60">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-sm font-bold text-gray-800 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── SETTINGS ───────────────────────────────────────────────
  const SettingsPage = () => {
    const [gracePeriod, setGracePeriod] = useState(2);
    const [lateRate, setLateRate] = useState(150);
    const [cleaningFee, setCleaningFee] = useState(50);
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-xl">
          <h3 className="font-bold text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Business Settings</h3>
          <div className="space-y-4">
            <Field label="Late Return Grace Period (hours)"><Input type="number" value={gracePeriod} onChange={e=>setGracePeriod(e.target.value)}/></Field>
            <Field label="Late Return Fee (BWP/day)"><Input type="number" value={lateRate} onChange={e=>setLateRate(e.target.value)}/></Field>
            <Field label="Dirty Vehicle Fee (BWP)"><Input type="number" value={cleaningFee} onChange={e=>setCleaningFee(e.target.value)}/></Field>
            <div className="pt-3 border-t border-gray-100"><Btn>Save Settings</Btn></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-xl">
          <h3 className="font-bold text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>User Roles</h3>
          <div className="space-y-3">
            {[{name:"Admin",desc:"Full access to all modules"},{name:"Operations",desc:"Bookings, check-out, returns, inspections"},{name:"Finance",desc:"Payments, invoicing, reports"}].map(r=>(
              <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">{r.name[0]}</div>
                <div><p className="text-sm font-semibold text-gray-800">{r.name}</p><p className="text-xs text-gray-400">{r.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ─── RENDER ─────────────────────────────────────────────────
  const pages = {
    dashboard: Dashboard,
    vehicles: VehiclesPage,
    bookings: BookingsPage,
    customers: CustomersPage,
    checkout: CheckOutPage,
    returns: ReturnsPage,
    inspection: InspectionPage,
    payments: PaymentsPage,
    maintenance: MaintenancePage,
    reports: ReportsPage,
    settings: SettingsPage,
  };
  const PageComponent = pages[page] || Dashboard;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
      <div className="min-h-screen bg-[#f8f7f4]">
        <Sidebar/>
        <div className="lg:ml-64 min-h-screen flex flex-col">
          <Header/>
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            <PageComponent/>
          </main>
        </div>
      </div>
    </>
  );
}
