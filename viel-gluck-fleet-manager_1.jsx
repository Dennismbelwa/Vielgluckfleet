import { useState, useMemo } from "react";
import {
  Car, Users, Calendar, DollarSign, Wrench, ClipboardCheck, FileText,
  BarChart3, Plus, Search, Eye, Edit, Trash2,
  CheckCircle2, AlertTriangle, Clock, ArrowLeft, Camera, X, Menu,
  Home, CreditCard, Shield, Fuel, Droplets, MapPin, Phone,
  Hash, TrendingUp, Activity, AlertCircle, Printer,
  UserCheck, CarFront, Settings, LogOut, Bell, Check,
  RotateCcw, Gauge, CalendarDays, Receipt, BadgeCheck, LogIn
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";

// ─── SEED DATA ──────────────────────────────────────────────
const VEHICLES = [
  { id:"V001", reg:"B 123 ABC", vin:"JM1DE1721G0123456", make:"Mazda", model:"Demio", year:2019, type:"Compact", color:"White", mileage:87420, motIssue:"2025-01-15", motExpiry:"2026-01-15", insuranceExpiry:"2026-03-01", status:"Available", location:"Main Office" },
  { id:"V002", reg:"B 456 DEF", vin:"WVWZZZ6RZHY123456", make:"Volkswagen", model:"Polo", year:2020, type:"Compact", color:"Silver", mileage:62310, motIssue:"2025-03-01", motExpiry:"2026-03-01", insuranceExpiry:"2026-05-15", status:"Available", location:"Main Office" },
  { id:"V003", reg:"B 789 GHI", vin:"MMBSTA13AKH123456", make:"Mitsubishi", model:"Mirage", year:2018, type:"Compact", color:"Red", mileage:104500, motIssue:"2024-11-01", motExpiry:"2025-11-01", insuranceExpiry:"2025-12-01", status:"Available", location:"Main Office" },
  { id:"V004", reg:"B 012 JKL", vin:"JTDKN3DU5A0123456", make:"Toyota", model:"Yaris", year:2021, type:"Compact", color:"Blue", mileage:41200, motIssue:"2025-06-01", motExpiry:"2026-06-01", insuranceExpiry:"2026-08-01", status:"Available", location:"Main Office" },
  { id:"V005", reg:"B 345 MNO", vin:"KNAFX4A61G5123456", make:"Kia", model:"Rio", year:2020, type:"Compact", color:"Grey", mileage:55890, motIssue:"2025-02-15", motExpiry:"2026-02-15", insuranceExpiry:"2026-04-01", status:"Available", location:"Main Office" },
  { id:"V006", reg:"B 678 PQR", vin:"MALA741CAFM123456", make:"Mazda", model:"Mazda3", year:2022, type:"Mid-size", color:"Black", mileage:28700, motIssue:"2025-08-01", motExpiry:"2026-08-01", insuranceExpiry:"2026-10-01", status:"Available", location:"Main Office" },
  { id:"V007", reg:"B 901 STU", vin:"JTDBR32E960123456", make:"Toyota", model:"Corolla", year:2019, type:"Mid-size", color:"White", mileage:93100, motIssue:"2025-04-01", motExpiry:"2026-04-01", insuranceExpiry:"2026-06-01", status:"Available", location:"Main Office" },
  { id:"V008", reg:"B 234 VWX", vin:"3N1AB7AP5KL123456", make:"Nissan", model:"Almera", year:2021, type:"Economy", color:"Silver", mileage:38900, motIssue:"2025-07-01", motExpiry:"2026-07-01", insuranceExpiry:"2026-09-01", status:"Available", location:"Main Office" },
  { id:"V009", reg:"B 567 YZA", vin:"MHJFM1130LP123456", make:"Honda", model:"Fit", year:2018, type:"Compact", color:"Green", mileage:112300, motIssue:"2024-09-01", motExpiry:"2025-09-01", insuranceExpiry:"2025-11-01", status:"Available", location:"Main Office" },
  { id:"V010", reg:"B 890 BCD", vin:"KMHD35LH5GU123456", make:"Hyundai", model:"Accent", year:2020, type:"Economy", color:"White", mileage:67500, motIssue:"2025-05-01", motExpiry:"2026-05-01", insuranceExpiry:"2026-07-01", status:"Available", location:"Main Office" },
  { id:"V011", reg:"B 135 EFG", vin:"LVSHFFAL4GE123456", make:"Suzuki", model:"Swift", year:2019, type:"Compact", color:"Red", mileage:79800, motIssue:"2025-01-01", motExpiry:"2026-01-01", insuranceExpiry:"2026-02-15", status:"Available", location:"Main Office" },
  { id:"V012", reg:"B 246 HIJ", vin:"WVWZZZ3CZWE123456", make:"Volkswagen", model:"Polo Vivo", year:2021, type:"Economy", color:"Blue", mileage:34200, motIssue:"2025-09-01", motExpiry:"2026-09-01", insuranceExpiry:"2026-11-01", status:"Available", location:"Main Office" },
  { id:"V013", reg:"B 357 KLM", vin:"JM1BL1V73D1123456", make:"Mazda", model:"Demio", year:2020, type:"Compact", color:"Grey", mileage:51600, motIssue:"2025-03-15", motExpiry:"2026-03-15", insuranceExpiry:"2026-05-01", status:"Available", location:"Airport Branch" },
  { id:"V014", reg:"B 468 NOP", vin:"JTDKN3DU1C0123456", make:"Toyota", model:"Etios", year:2019, type:"Economy", color:"White", mileage:88200, motIssue:"2024-12-01", motExpiry:"2025-12-01", insuranceExpiry:"2026-01-15", status:"Sold", location:"N/A" },
  { id:"V015", reg:"B 579 QRS", vin:"KNAFK4A63G5123456", make:"Kia", model:"Picanto", year:2022, type:"Compact", color:"Orange", mileage:19500, motIssue:"2025-10-01", motExpiry:"2026-10-01", insuranceExpiry:"2026-12-01", status:"Available", location:"Main Office" },
];

const CUSTOMERS = [
  { id:"C001", name:"Tebogo Mosweu", phone:"+267 7123 4567", idNumber:"539212345", license:"DL-2019-4567", emergency:"+267 7198 7654", notes:"Regular customer, always reliable", balance:0 },
  { id:"C002", name:"Keabetswe Modise", phone:"+267 7234 5678", idNumber:"841034567", license:"DL-2020-8901", emergency:"+267 7245 6789", notes:"Prefers compact vehicles", balance:350 },
  { id:"C003", name:"Mothusi Kgosimore", phone:"+267 7345 6789", idNumber:"690145678", license:"DL-2018-2345", emergency:"+267 7356 7890", notes:"Frequent intercity trips to Francistown", balance:0 },
  { id:"C004", name:"Lesego Tlhong", phone:"+267 7456 7890", idNumber:"920256789", license:"DL-2021-6789", emergency:"+267 7467 8901", notes:"", balance:1200 },
  { id:"C005", name:"Onalenna Phiri", phone:"+267 7567 8901", idNumber:"780367890", license:"DL-2017-0123", emergency:"+267 7578 9012", notes:"Cross-border trips to SA", balance:0 },
  { id:"C006", name:"Kagiso Setlhabi", phone:"+267 7678 9012", idNumber:"880478901", license:"DL-2019-4568", emergency:"+267 7689 0123", notes:"New customer", balance:0 },
];

const INIT_BOOKINGS = [
  { id:"BK001", customerId:"C001", customerName:"Tebogo Mosweu", vehicleId:"V002", vehicleReg:"B 456 DEF", pickup:"2026-04-01", return:"2026-04-05", status:"Completed", rate:350, total:1400, deposit:700, paid:1400, tripType:"Local" },
  { id:"BK002", customerId:"C003", customerName:"Mothusi Kgosimore", vehicleId:"V011", vehicleReg:"B 135 EFG", pickup:"2026-03-15", return:"2026-03-20", status:"Completed", rate:320, total:1600, deposit:800, paid:1600, tripType:"Intercity" },
  { id:"BK003", customerId:"C002", customerName:"Keabetswe Modise", vehicleId:"V005", vehicleReg:"B 345 MNO", pickup:"2026-04-10", return:"2026-04-14", status:"Completed", rate:300, total:1200, deposit:500, paid:1200, tripType:"Local" },
];

const INIT_MAINTENANCE = [
  { id:"M001", vehicleId:"V003", vehicleReg:"B 789 GHI", type:"Oil Service", date:"2026-04-10", cost:850, status:"Completed", notes:"Full oil change + filter", nextDue:"2026-07-10" },
  { id:"M002", vehicleId:"V009", vehicleReg:"B 567 YZA", type:"Tyre Replacement", date:"2026-04-05", cost:3200, status:"Completed", notes:"4 new tyres", nextDue:"2027-10-05" },
  { id:"M003", vehicleId:"V001", vehicleReg:"B 123 ABC", type:"Oil Service", date:"2026-03-15", cost:800, status:"Completed", notes:"Regular service", nextDue:"2026-06-15" },
  { id:"M004", vehicleId:"V010", vehicleReg:"B 890 BCD", type:"MOT Renewal", date:"2026-05-01", cost:450, status:"Completed", notes:"Passed", nextDue:"2027-05-01" },
];

const INIT_PAYMENTS = [
  { id:"P001", bookingId:"BK001", customerId:"C001", customerName:"Tebogo Mosweu", amount:700, type:"Deposit", method:"Cash", date:"2026-04-01", status:"Completed" },
  { id:"P002", bookingId:"BK001", customerId:"C001", customerName:"Tebogo Mosweu", amount:700, type:"Rental", method:"Bank Transfer", date:"2026-04-05", status:"Completed" },
  { id:"P003", bookingId:"BK002", customerId:"C003", customerName:"Mothusi Kgosimore", amount:1600, type:"Rental", method:"Card", date:"2026-03-15", status:"Completed" },
  { id:"P004", bookingId:"BK003", customerId:"C002", customerName:"Keabetswe Modise", amount:1200, type:"Rental", method:"Cash", date:"2026-04-10", status:"Completed" },
];

const COLORS = {
  Available:"#16a34a", Reserved:"#8b5cf6", Rented:"#2563eb", Maintenance:"#f59e0b", InService:"#6b7280", Sold:"#ef4444",
  Pending:"#f59e0b", Confirmed:"#8b5cf6", Active:"#2563eb", Completed:"#16a34a", Cancelled:"#ef4444",
  "In Progress":"#2563eb", Scheduled:"#8b5cf6"
};

// ─── HELPERS ────────────────────────────────────────────────
const fmt = n => `BWP ${(n||0).toLocaleString("en-BW", {minimumFractionDigits:2, maximumFractionDigits:2})}`;
const statusBadge = (s) => (
  <span style={{background:`${COLORS[s]||"#6b7280"}18`, color:COLORS[s]||"#6b7280", border:`1px solid ${COLORS[s]||"#6b7280"}30`}} className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">{s}</span>
);
const today = "2026-05-15";
const matchSearch = (q, ...fields) => {
  if (!q) return true;
  const lower = q.toLowerCase();
  return fields.some(f => (f||"").toString().toLowerCase().includes(lower));
};

// ─── MAIN APP ───────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [bookings, setBookings] = useState(INIT_BOOKINGS);
  const [maintenance, setMaintenance] = useState(INIT_MAINTENANCE);
  const [payments, setPayments] = useState(INIT_PAYMENTS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [activeUser] = useState({ name:"Admin", role:"Admin" });

  const nav = [
    { id:"dashboard", label:"Dashboard", icon:Home },
    { id:"vehicles", label:"Vehicles", icon:Car },
    { id:"bookings", label:"Bookings", icon:Calendar },
    { id:"customers", label:"Customers", icon:Users },
    { id:"checkin", label:"Check-In", icon:LogIn },
    { id:"checkout", label:"Check-Out", icon:ClipboardCheck },
    { id:"returns", label:"Returns", icon:RotateCcw },
    { id:"inspection", label:"Inspections", icon:Shield },
    { id:"payments", label:"Payments", icon:CreditCard },
    { id:"maintenance", label:"Maintenance", icon:Wrench },
    { id:"reports", label:"Reports", icon:BarChart3 },
    { id:"settings", label:"Settings", icon:Settings },
  ];

  const goTo = (p, d) => { setPage(p); setDetail(d||null); setSidebarOpen(false); setSearch(""); };

  // ─── SIDEBAR ──────────────────────────────────────────────
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
            <LogOut size={14} className="text-white/40 cursor-pointer hover:text-white"/>
          </div>
        </div>
      </aside>
    </>
  );

  // ─── HEADER WITH SEARCH ───────────────────────────────────
  const Header = () => (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-3">
      <div className="flex items-center gap-3">
        <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 shrink-0" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900 truncate" style={{fontFamily:"'Outfit', sans-serif"}}>{nav.find(n=>n.id===page)?.label || "Dashboard"}</h2>
          <p className="text-xs text-gray-400 hidden sm:block">{new Date().toLocaleDateString("en-BW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <button className="relative p-2 rounded-xl hover:bg-gray-50 shrink-0">
          <Bell size={18} className="text-gray-400"/>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"/>
        </button>
      </div>
      <div className="relative mt-3">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"/>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Search ${nav.find(n=>n.id===page)?.label || ""}... (type to filter)`}
          className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 placeholder-gray-400"
        />
        {search && (
          <button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={16}/>
          </button>
        )}
      </div>
    </header>
  );

  // ─── SHARED COMPONENTS ────────────────────────────────────
  const StatCard = ({icon:Icon, label, value, sub, color, onClick}) => (
    <div onClick={onClick} className={`bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg hover:shadow-gray-100/50 transition-all ${onClick?"cursor-pointer":""}`}>
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${color}14`}}><Icon size={20} style={{color}}/></div>
        {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
      </div>
      <p className="text-2xl font-bold mt-3 text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );

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

  const Table = ({cols, data, onRow}) => (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead><tr className="bg-gray-50/80">
          {cols.map((c,i)=><th key={i} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">{c.label}</th>)}
        </tr></thead>
        <tbody>
          {data.length===0 && <tr><td colSpan={cols.length} className="px-4 py-12 text-center text-gray-300">No records found</td></tr>}
          {data.map((row,ri)=>(
            <tr key={ri} onClick={()=>onRow?.(row)} className={`border-t border-gray-50 ${onRow?"cursor-pointer hover:bg-orange-50/30":""} transition-colors`}>
              {cols.map((c,ci)=><td key={ci} className="px-4 py-3 whitespace-nowrap">{c.render?c.render(row):row[c.key]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const Field = ({label, children}) => (<div><label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>{children}</div>);
  const Input = (props) => <input {...props} className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white ${props.className||""}`}/>;
  const Select = ({options,...props}) => (<select {...props} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white">{options.map(o=><option key={o.value??o} value={o.value??o}>{o.label||o}</option>)}</select>);
  const Textarea = (props) => <textarea {...props} className={`w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none bg-white ${props.className||""}`}/>;
  const Btn = ({children, variant="primary",...props}) => {
    const s = {primary:"bg-gradient-to-r from-[#e2725b] to-[#d4a574] text-white hover:opacity-90 shadow-lg shadow-orange-200/50",secondary:"bg-gray-100 text-gray-700 hover:bg-gray-200",danger:"bg-red-50 text-red-600 hover:bg-red-100",success:"bg-emerald-50 text-emerald-700 hover:bg-emerald-100"};
    return <button {...props} className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${s[variant]} ${props.className||""}`}>{children}</button>;
  };

  // ═══════════════════════════════════════════════════════════
  // ─── DASHBOARD ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const Dashboard = () => {
    const avail = vehicles.filter(v=>v.status==="Available").length;
    const rented = vehicles.filter(v=>v.status==="Rented").length;
    const maint = vehicles.filter(v=>v.status==="Maintenance"||v.status==="InService").length;
    const active = vehicles.filter(v=>v.status!=="Sold").length;
    const util = active>0?Math.round((rented/active)*100):0;
    const totalRevenue = payments.reduce((s,p)=>s+p.amount,0);
    const overdue = bookings.filter(b=>b.status==="Active"&&b.return<today).length;
    const upcoming = bookings.filter(b=>b.status==="Pending"||b.status==="Confirmed").length;
    const outstanding = customers.reduce((s,c)=>s+c.balance,0)+bookings.filter(b=>b.status==="Active").reduce((s,b)=>s+Math.max(0,b.total-b.paid),0);

    const pieData = [
      {name:"Available",value:avail,color:"#16a34a"},
      {name:"Rented",value:rented,color:"#2563eb"},
      {name:"Reserved",value:vehicles.filter(v=>v.status==="Reserved").length,color:"#8b5cf6"},
      {name:"Maintenance",value:maint,color:"#f59e0b"},
    ].filter(d=>d.value>0);
    const finalPie = pieData.length?pieData:[{name:"Available",value:active,color:"#16a34a"}];

    const revByMonth = [{month:"Jan",revenue:18500},{month:"Feb",revenue:22300},{month:"Mar",revenue:19800},{month:"Apr",revenue:25600},{month:"May",revenue:totalRevenue}];
    const topVehicles = [{name:"Polo B 456",rentals:12},{name:"Demio B 123",rentals:10},{name:"Rio B 345",rentals:9},{name:"Yaris B 012",rentals:8},{name:"Swift B 135",rentals:7}];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={Car} label="Total Fleet" value={active} color="#1a1a2e" onClick={()=>goTo("vehicles")}/>
          <StatCard icon={CheckCircle2} label="Available" value={avail} color="#16a34a" onClick={()=>goTo("vehicles")}/>
          <StatCard icon={CarFront} label="Rented Out" value={rented} color="#2563eb"/>
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
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Fleet Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart><Pie data={finalPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                {finalPie.map((d,i)=><Cell key={i} fill={d.color}/>)}
              </Pie><Tooltip formatter={(v,n)=>[v,n]}/></PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 justify-center mt-2">{finalPie.map(d=>(<div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}}/>{d.name} ({d.value})</div>))}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 lg:col-span-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Monthly Revenue (BWP)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revByMonth}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="month" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis tick={{fontSize:12}} stroke="#94a3b8"/><Tooltip formatter={v=>fmt(v)}/><Bar dataKey="revenue" fill="#e2725b" radius={[8,8,0,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-900 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Active Rentals</h3><button onClick={()=>goTo("bookings")} className="text-xs text-orange-500 font-semibold hover:underline">View all</button></div>
            {bookings.filter(b=>b.status==="Active").length===0?(<p className="text-gray-300 text-sm text-center py-8">No active rentals — all vehicles available</p>):(
              <div className="space-y-3">{bookings.filter(b=>b.status==="Active").slice(0,4).map(b=>(
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 hover:bg-orange-50/40 cursor-pointer transition-colors" onClick={()=>goTo("bookings",b)}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:"#2563eb18"}}><Car size={16} style={{color:"#2563eb"}}/></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-gray-800 truncate">{b.customerName}</p><p className="text-xs text-gray-400">{b.vehicleReg} · Due {b.return}</p></div>
                  {b.return<today&&<span className="text-xs text-red-500 font-semibold">OVERDUE</span>}
                  {statusBadge(b.status)}
                </div>
              ))}</div>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Most Rented Vehicles</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topVehicles} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:12}} stroke="#94a3b8"/><YAxis dataKey="name" type="category" tick={{fontSize:11}} stroke="#94a3b8" width={90}/><Tooltip/><Bar dataKey="rentals" fill="#d4a574" radius={[0,8,8,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {overdue>0&&(<div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100"><Clock size={20} className="text-red-500 shrink-0"/><div><p className="text-sm font-semibold text-red-800">{overdue} overdue return(s)</p><p className="text-xs text-red-600 mt-0.5">Contact customers immediately</p></div><button onClick={()=>goTo("returns")} className="ml-auto text-xs text-red-700 font-semibold hover:underline shrink-0">View →</button></div>)}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // ─── VEHICLES ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const VehiclesPage = () => {
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState(null);
    const filtered = vehicles.filter(v=>{
      if(statusFilter!=="All"&&v.status!==statusFilter)return false;
      return matchSearch(search,v.reg,v.make,v.model,v.vin,v.color,v.type,v.location);
    });
    const saveVehicle = () => { if(!form)return; if(form.id){setVehicles(p=>p.map(v=>v.id===form.id?form:v));}else{setVehicles(p=>[...p,{...form,id:`V${String(p.length+1).padStart(3,"0")}`}]);} setModal(null); };

    const VehicleForm = () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Registration"><Input value={form.reg||""} onChange={e=>setForm({...form,reg:e.target.value})} placeholder="e.g. B 123 ABC"/></Field>
        <Field label="VIN / Chassis No."><Input value={form.vin||""} onChange={e=>setForm({...form,vin:e.target.value})}/></Field>
        <Field label="Make"><Input value={form.make||""} onChange={e=>setForm({...form,make:e.target.value})} placeholder="e.g. Mazda"/></Field>
        <Field label="Model"><Input value={form.model||""} onChange={e=>setForm({...form,model:e.target.value})} placeholder="e.g. Demio"/></Field>
        <Field label="Year"><Input type="number" value={form.year||""} onChange={e=>setForm({...form,year:parseInt(e.target.value)})}/></Field>
        <Field label="Type"><Select options={["Compact","Mid-size","Economy"]} value={form.type||"Compact"} onChange={e=>setForm({...form,type:e.target.value})}/></Field>
        <Field label="Color"><Input value={form.color||""} onChange={e=>setForm({...form,color:e.target.value})}/></Field>
        <Field label="Current Mileage (km)"><Input type="number" value={form.mileage||""} onChange={e=>setForm({...form,mileage:parseInt(e.target.value)})}/></Field>
        <Field label="MOT Issue"><Input type="date" value={form.motIssue||""} onChange={e=>setForm({...form,motIssue:e.target.value})}/></Field>
        <Field label="MOT Expiry"><Input type="date" value={form.motExpiry||""} onChange={e=>setForm({...form,motExpiry:e.target.value})}/></Field>
        <Field label="Insurance Expiry"><Input type="date" value={form.insuranceExpiry||""} onChange={e=>setForm({...form,insuranceExpiry:e.target.value})}/></Field>
        <Field label="Status"><Select options={["Available","Reserved","Rented","Maintenance","InService","Sold"]} value={form.status||"Available"} onChange={e=>setForm({...form,status:e.target.value})}/></Field>
        <Field label="Location"><Input value={form.location||""} onChange={e=>setForm({...form,location:e.target.value})}/></Field>
        <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={saveVehicle}>{form.id?"Update":"Add"} Vehicle</Btn></div>
      </div>
    );

    const VehicleDetail = () => { const v=detail; const vB=bookings.filter(b=>b.vehicleId===v.id); const vM=maintenance.filter(m=>m.vehicleId===v.id);
      return (<div className="space-y-6">
        <button onClick={()=>setDetail(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16}/>Back to fleet</button>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-3 mb-1"><h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{v.make} {v.model} ({v.year})</h3>{statusBadge(v.status)}</div><p className="text-gray-400 text-sm">{v.reg} · {v.color}</p></div>
            <div className="flex gap-2"><Btn onClick={()=>{setForm(v);setModal("vehicle");}}><Edit size={14} className="mr-1.5"/>Edit</Btn>{v.status==="Available"&&<Btn variant="success" onClick={()=>goTo("checkin")}><LogIn size={14} className="mr-1.5"/>Check-In</Btn>}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">{[["VIN",v.vin],["Mileage",`${v.mileage?.toLocaleString()} km`],["Type",v.type],["Location",v.location],["MOT Expiry",v.motExpiry],["Insurance Expiry",v.insuranceExpiry]].map(([l,val])=>(<div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-semibold text-gray-800 mt-0.5">{val}</p></div>))}</div>
        </div>
        {vB.length>0&&<div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Booking History</h4><Table cols={[{label:"ID",key:"id"},{label:"Customer",key:"customerName"},{label:"Pickup",key:"pickup"},{label:"Return",key:"return"},{label:"Status",render:r=>statusBadge(r.status)},{label:"Total",render:r=>fmt(r.total)}]} data={vB}/></div>}
        {vM.length>0&&<div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Maintenance Records</h4><Table cols={[{label:"Type",key:"type"},{label:"Date",key:"date"},{label:"Cost",render:r=>fmt(r.cost)},{label:"Status",render:r=>statusBadge(r.status)},{label:"Next Due",key:"nextDue"}]} data={vM}/></div>}
      </div>);
    };

    if(detail)return <VehicleDetail/>;
    return (<div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-gray-900 shrink-0" style={{fontFamily:"'Outfit', sans-serif"}}>Fleet Vehicles</h3><Btn onClick={()=>{setForm({reg:"",vin:"",make:"",model:"",year:2024,type:"Compact",color:"",mileage:0,motIssue:"",motExpiry:"",insuranceExpiry:"",status:"Available",location:"Main Office"});setModal("vehicle");}}><Plus size={14} className="mr-1.5"/>Add Vehicle</Btn></div>
      <div className="flex gap-1.5 flex-wrap">{["All","Available","Rented","Reserved","Maintenance","InService","Sold"].map(s=>(<button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter===s?"bg-gray-900 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>))}</div>
      <Table cols={[{label:"Reg",render:r=><span className="font-mono font-semibold text-gray-900">{r.reg}</span>},{label:"Vehicle",render:r=>`${r.make} ${r.model}`},{label:"Year",key:"year"},{label:"Color",key:"color"},{label:"Mileage",render:r=>`${r.mileage?.toLocaleString()} km`},{label:"Status",render:r=>statusBadge(r.status)},{label:"Location",key:"location"}]} data={filtered} onRow={r=>setDetail(r)}/>
      {modal==="vehicle"&&<Modal title={form?.id?"Edit Vehicle":"New Vehicle"} wide><VehicleForm/></Modal>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── BOOKINGS ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const BookingsPage = () => {
    const [statusFilter, setStatusFilter] = useState("All");
    const [form, setForm] = useState(null);
    const filtered = bookings.filter(b=>{if(statusFilter!=="All"&&b.status!==statusFilter)return false;return matchSearch(search,b.id,b.customerName,b.vehicleReg,b.tripType,b.status);});
    const saveBooking = () => { if(!form)return; const c=customers.find(x=>x.id===form.customerId); const v=vehicles.find(x=>x.id===form.vehicleId); const days=Math.max(1,Math.ceil((new Date(form.return)-new Date(form.pickup))/86400000)); const u={...form,customerName:c?.name||"",vehicleReg:v?.reg||"",total:days*(form.rate||0)}; if(form.id){setBookings(p=>p.map(b=>b.id===form.id?u:b));}else{setBookings(p=>[...p,{...u,id:`BK${String(p.length+1).padStart(3,"0")}`,paid:0}]);} setModal(null); };

    const BookingForm = () => (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Customer"><Select options={[{value:"",label:"— Select customer —"},...customers.map(c=>({value:c.id,label:c.name}))]} value={form.customerId||""} onChange={e=>setForm({...form,customerId:e.target.value})}/></Field>
      <Field label="Vehicle"><Select options={[{value:"",label:"— Select vehicle —"},...vehicles.filter(v=>v.status==="Available"||v.id===form.vehicleId).map(v=>({value:v.id,label:`${v.make} ${v.model} (${v.reg})`}))]} value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})}/></Field>
      <Field label="Pickup Date"><Input type="date" value={form.pickup||""} onChange={e=>setForm({...form,pickup:e.target.value})}/></Field>
      <Field label="Return Date"><Input type="date" value={form.return||""} onChange={e=>setForm({...form,return:e.target.value})}/></Field>
      <Field label="Daily Rate (BWP)"><Input type="number" value={form.rate||""} onChange={e=>setForm({...form,rate:parseInt(e.target.value)||0})}/></Field>
      <Field label="Trip Type"><Select options={["Local","Intercity","Cross-border"]} value={form.tripType||"Local"} onChange={e=>setForm({...form,tripType:e.target.value})}/></Field>
      <Field label="Status"><Select options={["Pending","Confirmed","Active","Completed","Cancelled"]} value={form.status||"Pending"} onChange={e=>setForm({...form,status:e.target.value})}/></Field>
      <Field label="Deposit (BWP)"><Input type="number" value={form.deposit||""} onChange={e=>setForm({...form,deposit:parseInt(e.target.value)||0})}/></Field>
      <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={saveBooking}>{form.id?"Update":"Create"} Booking</Btn></div>
    </div>);

    const BookingDetail = () => { const b=detail; const bp=payments.filter(p=>p.bookingId===b.id);
      return (<div className="space-y-6">
        <button onClick={()=>setDetail(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16}/>Back to bookings</button>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-3 mb-1"><h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Booking {b.id}</h3>{statusBadge(b.status)}</div><p className="text-gray-400 text-sm">{b.customerName} · {b.vehicleReg}</p></div>
            <div className="flex gap-2"><Btn onClick={()=>{setForm(b);setModal("booking");}}><Edit size={14} className="mr-1.5"/>Edit</Btn>{b.status==="Active"&&<Btn variant="success" onClick={()=>goTo("returns",b)}><RotateCcw size={14} className="mr-1.5"/>Process Return</Btn>}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">{[["Pickup",b.pickup],["Return",b.return],["Daily Rate",fmt(b.rate)],["Total",fmt(b.total)],["Deposit",fmt(b.deposit)],["Paid",fmt(b.paid)],["Balance",fmt(Math.max(0,b.total-b.paid))],["Trip",b.tripType]].map(([l,v])=>(<div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-semibold text-gray-800 mt-0.5">{v}</p></div>))}</div>
          {b.return<today&&b.status==="Active"&&<div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/><span className="text-sm text-red-700 font-medium">Overdue by {Math.ceil((new Date(today)-new Date(b.return))/86400000)} day(s)</span></div>}
        </div>
        {bp.length>0&&<div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Payments</h4><Table cols={[{label:"Date",key:"date"},{label:"Type",key:"type"},{label:"Method",key:"method"},{label:"Amount",render:r=>fmt(r.amount)},{label:"Status",render:r=>statusBadge(r.status)}]} data={bp}/></div>}
      </div>);
    };

    if(detail)return <BookingDetail/>;
    return (<div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-gray-900 shrink-0" style={{fontFamily:"'Outfit', sans-serif"}}>All Bookings</h3><Btn onClick={()=>{setForm({customerId:"",vehicleId:"",pickup:"",return:"",rate:300,status:"Pending",deposit:500,tripType:"Local"});setModal("booking");}}><Plus size={14} className="mr-1.5"/>New Booking</Btn></div>
      <div className="flex gap-1.5 flex-wrap">{["All","Pending","Confirmed","Active","Completed","Cancelled"].map(s=>(<button key={s} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter===s?"bg-gray-900 text-white":"bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>{s}</button>))}</div>
      <Table cols={[{label:"ID",render:r=><span className="font-mono font-semibold">{r.id}</span>},{label:"Customer",key:"customerName"},{label:"Vehicle",key:"vehicleReg"},{label:"Pickup",key:"pickup"},{label:"Return",render:r=><span className={r.return<today&&r.status==="Active"?"text-red-500 font-semibold":""}>{r.return}</span>},{label:"Status",render:r=>statusBadge(r.status)},{label:"Total",render:r=>fmt(r.total)},{label:"Balance",render:r=>{const bl=Math.max(0,r.total-r.paid);return <span className={bl>0?"text-red-500 font-semibold":"text-green-600"}>{fmt(bl)}</span>}}]} data={filtered} onRow={r=>setDetail(r)}/>
      {modal==="booking"&&<Modal title={form?.id?"Edit Booking":"New Booking"} wide><BookingForm/></Modal>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── CUSTOMERS ────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const CustomersPage = () => {
    const [form, setForm] = useState(null);
    const filtered = customers.filter(c=>matchSearch(search,c.name,c.phone,c.idNumber,c.license));
    const saveCust = () => { if(!form)return; if(form.id){setCustomers(p=>p.map(c=>c.id===form.id?form:c));}else{setCustomers(p=>[...p,{...form,id:`C${String(p.length+1).padStart(3,"0")}`,balance:0}]);} setModal(null); };

    const CustForm = () => (<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Full Name"><Input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})} placeholder="First and Last name"/></Field>
      <Field label="Phone Number"><Input value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+267 7xxx xxxx"/></Field>
      <Field label="ID / Passport No."><Input value={form.idNumber||""} onChange={e=>setForm({...form,idNumber:e.target.value})}/></Field>
      <Field label="Driver's License No."><Input value={form.license||""} onChange={e=>setForm({...form,license:e.target.value})}/></Field>
      <Field label="Emergency Contact"><Input value={form.emergency||""} onChange={e=>setForm({...form,emergency:e.target.value})}/></Field><div/>
      <div className="sm:col-span-2"><Field label="Notes"><Textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}/></Field></div>
      <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={saveCust}>{form.id?"Update":"Add"} Customer</Btn></div>
    </div>);

    const CustDetail = () => { const c=detail; const cb=bookings.filter(b=>b.customerId===c.id);
      return (<div className="space-y-6">
        <button onClick={()=>setDetail(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"><ArrowLeft size={16}/>Back</button>
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{c.name}</h3><div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500"><span className="flex items-center gap-1"><Phone size={14}/>{c.phone}</span><span className="flex items-center gap-1"><Hash size={14}/>{c.idNumber}</span><span className="flex items-center gap-1"><BadgeCheck size={14}/>{c.license}</span></div></div><Btn onClick={()=>{setForm(c);setModal("customer");}}><Edit size={14} className="mr-1.5"/>Edit</Btn></div>
          {c.balance>0&&<div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-2"><AlertCircle size={16} className="text-amber-500"/><span className="text-sm text-amber-700 font-medium">Outstanding: {fmt(c.balance)}</span></div>}
          {c.notes&&<p className="mt-3 text-sm text-gray-500 italic">"{c.notes}"</p>}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-3" style={{fontFamily:"'Outfit', sans-serif"}}>Rental History ({cb.length})</h4><Table cols={[{label:"ID",key:"id"},{label:"Vehicle",key:"vehicleReg"},{label:"Pickup",key:"pickup"},{label:"Return",key:"return"},{label:"Status",render:r=>statusBadge(r.status)},{label:"Total",render:r=>fmt(r.total)}]} data={cb} onRow={r=>goTo("bookings",r)}/></div>
      </div>);
    };
    if(detail)return <CustDetail/>;
    return (<div className="space-y-4">
      <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-gray-900 shrink-0" style={{fontFamily:"'Outfit', sans-serif"}}>Customers</h3><Btn onClick={()=>{setForm({name:"",phone:"",idNumber:"",license:"",emergency:"",notes:""});setModal("customer");}}><Plus size={14} className="mr-1.5"/>Add Customer</Btn></div>
      <Table cols={[{label:"Name",render:r=><span className="font-semibold text-gray-900">{r.name}</span>},{label:"Phone",key:"phone"},{label:"ID/Passport",key:"idNumber"},{label:"License",key:"license"},{label:"Balance",render:r=><span className={r.balance>0?"text-red-500 font-semibold":"text-green-600"}>{fmt(r.balance)}</span>}]} data={filtered} onRow={r=>setDetail(r)}/>
      {modal==="customer"&&<Modal title={form?.id?"Edit Customer":"New Customer"}><CustForm/></Modal>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── CHECK-IN (Walk-In Registration) ──────────────────────
  // ═══════════════════════════════════════════════════════════
  const CheckInPage = () => {
    const availCars = vehicles.filter(v=>v.status==="Available");
    const [step, setStep] = useState(1);
    const [selVeh, setSelVeh] = useState(null);
    const [isNew, setIsNew] = useState(false);
    const [existId, setExistId] = useState("");
    const [newC, setNewC] = useState({name:"",phone:"",idNumber:"",license:"",emergency:"",notes:""});
    const [rental, setRental] = useState({pickup:today,return:"",rate:300,deposit:500,tripType:"Local"});
    const [insp, setInsp] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false});
    const [carSearch, setCarSearch] = useState("");
    const [done, setDone] = useState("");

    const fCars = availCars.filter(v=>matchSearch(carSearch,v.reg,v.make,v.model,v.color,v.type));
    const selCust = existId ? customers.find(c=>c.id===existId) : null;
    const ok2 = isNew ? (newC.name&&newC.phone&&newC.idNumber&&newC.license) : !!existId;
    const ok3 = rental.return && rental.rate;
    const ok4 = insp.mileage && insp.signature;

    const reset = () => { setStep(1);setSelVeh(null);setIsNew(false);setExistId("");setNewC({name:"",phone:"",idNumber:"",license:"",emergency:"",notes:""});setRental({pickup:today,return:"",rate:300,deposit:500,tripType:"Local"});setInsp({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false});setCarSearch(""); };

    const finish = () => {
      let cid=existId, cname=selCust?.name||"";
      if(isNew){ cid=`C${String(customers.length+1).padStart(3,"0")}`; cname=newC.name; setCustomers(p=>[...p,{...newC,id:cid,balance:0}]); }
      const days=Math.max(1,Math.ceil((new Date(rental.return)-new Date(rental.pickup))/86400000));
      const total=days*rental.rate; const bid=`BK${String(bookings.length+1).padStart(3,"0")}`;
      setBookings(p=>[...p,{id:bid,customerId:cid,customerName:cname,vehicleId:selVeh.id,vehicleReg:selVeh.reg,pickup:rental.pickup,return:rental.return,status:"Active",rate:rental.rate,total,deposit:rental.deposit,paid:rental.deposit,tripType:rental.tripType}]);
      setVehicles(p=>p.map(v=>v.id===selVeh.id?{...v,status:"Rented",location:"Customer",mileage:parseInt(insp.mileage)||v.mileage}:v));
      if(rental.deposit>0){setPayments(p=>[...p,{id:`P${String(p.length+1).padStart(3,"0")}`,bookingId:bid,customerId:cid,customerName:cname,amount:rental.deposit,type:"Deposit",method:"Cash",date:today,status:"Completed"}]);}
      setDone(`${selVeh.make} ${selVeh.model} (${selVeh.reg}) checked in to ${cname}`); reset();
    };

    if(done) return (<div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"><CheckCircle2 size={32} className="text-green-600"/></div>
      <h3 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily:"'Outfit', sans-serif"}}>Check-In Complete!</h3>
      <p className="text-gray-500 text-sm mb-6 text-center max-w-md">{done}</p>
      <div className="flex gap-3"><Btn onClick={()=>setDone("")}>New Check-In</Btn><Btn variant="secondary" onClick={()=>{setDone("");goTo("bookings");}}>View Bookings</Btn></div>
    </div>);

    const steps=["Select Vehicle","Renter Details","Rental & Inspection","Confirm"];
    const StepBar = () => (<div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">{steps.map((s,i)=>(<div key={i} className="flex items-center gap-2 shrink-0"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step>i+1?"bg-green-500 text-white":step===i+1?"bg-gradient-to-r from-[#e2725b] to-[#d4a574] text-white":"bg-gray-100 text-gray-400"}`}>{step>i+1?<Check size={14}/>:i+1}</div><span className={`text-xs font-semibold ${step===i+1?"text-gray-900":"text-gray-400"}`}>{s}</span>{i<3&&<div className={`w-6 h-0.5 ${step>i+1?"bg-green-300":"bg-gray-200"}`}/>}</div>))}</div>);

    return (<div className="space-y-4">
      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Check-In — Register Vehicle to Renter</h3>
      <StepBar/>

      {/* STEP 1 */}
      {step===1&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h4 className="font-bold text-sm text-gray-800 mb-3">Choose an available vehicle</h4>
        <div className="relative mb-4"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"/><input value={carSearch} onChange={e=>setCarSearch(e.target.value)} placeholder="Search by reg, make, model, color..." className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-200"/></div>
        {fCars.length===0?<p className="text-gray-300 text-sm text-center py-8">No available vehicles match your search</p>:(
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[420px] overflow-y-auto">{fCars.map(v=>(
            <div key={v.id} onClick={()=>{setSelVeh(v);setStep(2);}} className="p-4 rounded-xl border-2 border-gray-100 hover:border-orange-300 hover:bg-orange-50/30 cursor-pointer transition-all">
              <div className="flex items-center justify-between mb-2"><span className="font-mono font-bold text-gray-900 text-sm">{v.reg}</span><span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">AVAILABLE</span></div>
              <p className="text-sm font-semibold text-gray-800">{v.make} {v.model} <span className="font-normal text-gray-400">({v.year})</span></p>
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-400"><span>{v.color}</span><span>·</span><span>{v.mileage?.toLocaleString()} km</span><span>·</span><span>{v.type}</span></div>
              <p className="text-xs text-gray-400 mt-1"><MapPin size={11} className="inline mr-0.5"/>{v.location}</p>
            </div>
          ))}</div>
        )}
      </div>)}

      {/* STEP 2 */}
      {step===2&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100"><Car size={18} className="text-blue-600"/><div><p className="text-sm font-semibold text-blue-900">{selVeh.make} {selVeh.model}</p><p className="text-xs text-blue-600">{selVeh.reg} · {selVeh.color} · {selVeh.mileage?.toLocaleString()} km</p></div></div>
        <h4 className="font-bold text-sm text-gray-800 mb-4">Who is renting this vehicle?</h4>
        <div className="flex gap-3 mb-5">
          <button onClick={()=>{setIsNew(false);}} className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${!isNew?"border-orange-400 bg-orange-50 text-orange-700":"border-gray-200 text-gray-400 hover:border-gray-300"}`}><Users size={16} className="inline mr-1.5"/>Existing Customer</button>
          <button onClick={()=>{setIsNew(true);setExistId("");}} className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${isNew?"border-orange-400 bg-orange-50 text-orange-700":"border-gray-200 text-gray-400 hover:border-gray-300"}`}><Plus size={16} className="inline mr-1.5"/>New Customer</button>
        </div>
        {!isNew?(<div>
          <Field label="Select Customer"><Select options={[{value:"",label:"— Choose customer —"},...customers.map(c=>({value:c.id,label:`${c.name}  ·  ${c.phone}  ·  ID: ${c.idNumber}`}))]} value={existId} onChange={e=>setExistId(e.target.value)}/></Field>
          {selCust&&<div className="mt-4 p-4 rounded-xl bg-gray-50 border border-gray-100"><p className="text-sm font-bold text-gray-900 mb-2">{selCust.name}</p><div className="grid grid-cols-2 gap-2 text-xs text-gray-500"><span><Phone size={12} className="inline mr-1"/>{selCust.phone}</span><span><Hash size={12} className="inline mr-1"/>ID: {selCust.idNumber}</span><span><BadgeCheck size={12} className="inline mr-1"/>License: {selCust.license}</span><span><Phone size={12} className="inline mr-1"/>Emergency: {selCust.emergency}</span></div>{selCust.balance>0&&<p className="text-xs text-red-500 font-semibold mt-2">⚠ Outstanding: {fmt(selCust.balance)}</p>}</div>}
        </div>):(<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name *"><Input value={newC.name} onChange={e=>setNewC({...newC,name:e.target.value})} placeholder="First and Last name"/></Field>
          <Field label="Phone Number *"><Input value={newC.phone} onChange={e=>setNewC({...newC,phone:e.target.value})} placeholder="+267 7xxx xxxx"/></Field>
          <Field label="ID / Passport No. *"><Input value={newC.idNumber} onChange={e=>setNewC({...newC,idNumber:e.target.value})}/></Field>
          <Field label="Driver's License No. *"><Input value={newC.license} onChange={e=>setNewC({...newC,license:e.target.value})}/></Field>
          <Field label="Emergency Contact"><Input value={newC.emergency} onChange={e=>setNewC({...newC,emergency:e.target.value})}/></Field><div/>
          <div className="sm:col-span-2"><Field label="Notes"><Textarea value={newC.notes} onChange={e=>setNewC({...newC,notes:e.target.value})}/></Field></div>
        </div>)}
        <div className="flex justify-between pt-4 mt-4 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setStep(1)}><ArrowLeft size={14} className="mr-1.5"/>Back</Btn><Btn onClick={()=>setStep(3)} className={!ok2?"opacity-40 pointer-events-none":""}>Continue</Btn></div>
      </div>)}

      {/* STEP 3 */}
      {step===3&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-blue-50 border border-blue-100"><Car size={18} className="text-blue-600"/><div className="flex-1"><p className="text-sm font-semibold text-blue-900">{selVeh.make} {selVeh.model} ({selVeh.reg})</p></div><UserCheck size={18} className="text-blue-600"/><p className="text-sm font-semibold text-blue-900">{isNew?newC.name:selCust?.name}</p></div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Rental Terms</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Field label="Pickup Date"><Input type="date" value={rental.pickup} onChange={e=>setRental({...rental,pickup:e.target.value})}/></Field>
          <Field label="Return Date *"><Input type="date" value={rental.return} onChange={e=>setRental({...rental,return:e.target.value})}/></Field>
          <Field label="Daily Rate (BWP) *"><Input type="number" value={rental.rate} onChange={e=>setRental({...rental,rate:parseInt(e.target.value)||0})}/></Field>
          <Field label="Deposit (BWP)"><Input type="number" value={rental.deposit} onChange={e=>setRental({...rental,deposit:parseInt(e.target.value)||0})}/></Field>
          <Field label="Trip Type"><Select options={["Local","Intercity","Cross-border"]} value={rental.tripType} onChange={e=>setRental({...rental,tripType:e.target.value})}/></Field>
          {rental.return&&rental.rate>0&&<div className="flex items-center"><div className="p-3 rounded-xl bg-green-50 border border-green-100 w-full"><p className="text-xs text-green-600">Estimated Total</p><p className="text-lg font-bold text-green-800">{fmt(Math.max(1,Math.ceil((new Date(rental.return)-new Date(rental.pickup))/86400000))*rental.rate)}</p></div></div>}
        </div>
        <h4 className="font-bold text-sm text-gray-800 mb-3">Vehicle Inspection</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Odometer Reading (km) *"><Input type="number" value={insp.mileage} onChange={e=>setInsp({...insp,mileage:e.target.value})} placeholder={`Current: ${selVeh.mileage?.toLocaleString()} km`}/></Field>
          <Field label="Fuel Level"><Select options={["Empty","Below Quarter","Quarter","Half","Three Quarter","Full"]} value={insp.fuel} onChange={e=>setInsp({...insp,fuel:e.target.value})}/></Field>
          <Field label="Vehicle Clean?"><div className="flex gap-4 mt-1"><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={insp.clean} onChange={()=>setInsp({...insp,clean:true})} className="accent-orange-500"/>Yes</label><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={!insp.clean} onChange={()=>setInsp({...insp,clean:false})} className="accent-orange-500"/>No</label></div></Field>
          <Field label="Vehicle Photos"><div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 cursor-pointer hover:bg-gray-50"><Camera size={16}/>Tap to capture / upload</div></Field>
          <div className="sm:col-span-2"><Field label="Existing Damages / Notes"><Textarea value={insp.damages} onChange={e=>setInsp({...insp,damages:e.target.value})} placeholder="Note any scratches, dents, marks..."/></Field></div>
          <div className="sm:col-span-2"><label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-gray-50 border border-gray-200"><input type="checkbox" checked={insp.signature} onChange={e=>setInsp({...insp,signature:e.target.checked})} className="accent-orange-500 w-5 h-5"/><span className="text-sm text-gray-700 font-medium">Customer has signed the rental agreement</span></label></div>
        </div>
        <div className="flex justify-between pt-4 mt-4 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setStep(2)}><ArrowLeft size={14} className="mr-1.5"/>Back</Btn><Btn onClick={()=>setStep(4)} className={!(ok3&&ok4)?"opacity-40 pointer-events-none":""}>Review & Confirm</Btn></div>
      </div>)}

      {/* STEP 4 */}
      {step===4&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h4 className="font-bold text-sm text-gray-800 mb-4">Confirm Check-In Details</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100"><p className="text-xs text-gray-400 font-semibold uppercase mb-2">Vehicle</p><p className="text-sm font-bold text-gray-900">{selVeh.make} {selVeh.model} ({selVeh.year})</p><p className="text-xs text-gray-500 mt-1">{selVeh.reg} · {selVeh.color}</p><p className="text-xs text-gray-500">Odometer: {parseInt(insp.mileage)?.toLocaleString()} km · Fuel: {insp.fuel}</p></div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100"><p className="text-xs text-gray-400 font-semibold uppercase mb-2">Renter</p><p className="text-sm font-bold text-gray-900">{isNew?newC.name:selCust?.name}</p><p className="text-xs text-gray-500 mt-1">Phone: {isNew?newC.phone:selCust?.phone}</p><p className="text-xs text-gray-500">ID: {isNew?newC.idNumber:selCust?.idNumber}</p><p className="text-xs text-gray-500">License: {isNew?newC.license:selCust?.license}</p>{isNew&&<span className="inline-block mt-2 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">NEW CUSTOMER</span>}</div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100"><p className="text-xs text-gray-400 font-semibold uppercase mb-2">Rental Terms</p><div className="grid grid-cols-2 gap-2 text-sm"><div><p className="text-xs text-gray-400">Pickup</p><p className="font-semibold text-gray-800">{rental.pickup}</p></div><div><p className="text-xs text-gray-400">Return</p><p className="font-semibold text-gray-800">{rental.return}</p></div><div><p className="text-xs text-gray-400">Daily Rate</p><p className="font-semibold text-gray-800">{fmt(rental.rate)}</p></div><div><p className="text-xs text-gray-400">Trip Type</p><p className="font-semibold text-gray-800">{rental.tripType}</p></div></div></div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-100"><div className="flex justify-between items-center mb-1"><span className="text-xs text-green-600">Total ({Math.max(1,Math.ceil((new Date(rental.return)-new Date(rental.pickup))/86400000))} days)</span><span className="text-lg font-bold text-green-800">{fmt(Math.max(1,Math.ceil((new Date(rental.return)-new Date(rental.pickup))/86400000))*rental.rate)}</span></div><div className="flex justify-between items-center"><span className="text-xs text-green-600">Deposit Collected</span><span className="text-sm font-semibold text-green-700">{fmt(rental.deposit)}</span></div></div>
            {insp.damages&&<div className="p-3 rounded-xl bg-amber-50 border border-amber-100"><p className="text-xs text-amber-600 font-semibold mb-1">Noted Damages</p><p className="text-xs text-amber-700">{insp.damages}</p></div>}
          </div>
        </div>
        <div className="flex justify-between pt-4 mt-4 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setStep(3)}><ArrowLeft size={14} className="mr-1.5"/>Back</Btn><Btn onClick={finish}><CheckCircle2 size={14} className="mr-1.5"/>Confirm Check-In</Btn></div>
      </div>)}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── CHECK-OUT (from confirmed bookings) ──────────────────
  // ═══════════════════════════════════════════════════════════
  const CheckOutPage = () => {
    const confirmed = bookings.filter(b=>b.status==="Confirmed");
    const [sel, setSel] = useState(null);
    const [co, setCo] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false});
    const proc = () => { if(!sel)return; setBookings(p=>p.map(b=>b.id===sel.id?{...b,status:"Active"}:b)); setVehicles(p=>p.map(v=>v.id===sel.vehicleId?{...v,status:"Rented",location:"Customer",mileage:parseInt(co.mileage)||v.mileage}:v)); setSel(null); setCo({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false}); };
    return (<div className="space-y-6">
      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Check-Out — Confirmed Bookings</h3>
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        <p className="text-xs text-gray-400 mb-3">Select a confirmed booking to process check-out</p>
        {confirmed.length===0?(<div className="text-center py-10"><p className="text-gray-300 text-sm mb-3">No confirmed bookings awaiting check-out</p><p className="text-xs text-gray-400">Use <button onClick={()=>goTo("checkin")} className="text-orange-500 font-semibold underline">Check-In</button> for walk-in rentals, or <button onClick={()=>goTo("bookings")} className="text-orange-500 font-semibold underline">Bookings</button> to create a reservation first.</p></div>):(
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{confirmed.map(b=>(<div key={b.id} onClick={()=>setSel(b)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${sel?.id===b.id?"border-orange-400 bg-orange-50/50":"border-gray-100 hover:border-gray-200"}`}><p className="font-semibold text-gray-900 text-sm">{b.customerName}</p><p className="text-xs text-gray-400 mt-1">{b.vehicleReg} · Pickup: {b.pickup}</p><p className="text-xs text-gray-400">{b.tripType} · {fmt(b.rate)}/day</p></div>))}</div>
        )}
      </div>
      {sel&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Vehicle Inspection</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Odometer (km)"><Input type="number" value={co.mileage} onChange={e=>setCo({...co,mileage:e.target.value})}/></Field>
          <Field label="Fuel Level"><Select options={["Empty","Below Quarter","Quarter","Half","Three Quarter","Full"]} value={co.fuel} onChange={e=>setCo({...co,fuel:e.target.value})}/></Field>
          <Field label="Vehicle Clean?"><div className="flex gap-4 mt-1"><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={co.clean} onChange={()=>setCo({...co,clean:true})} className="accent-orange-500"/>Yes</label><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={!co.clean} onChange={()=>setCo({...co,clean:false})} className="accent-orange-500"/>No</label></div></Field>
          <Field label="Photos"><div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 cursor-pointer hover:bg-gray-50"><Camera size={16}/>Capture / upload</div></Field>
          <div className="sm:col-span-2"><Field label="Damages / Notes"><Textarea value={co.damages} onChange={e=>setCo({...co,damages:e.target.value})}/></Field></div>
          <div className="sm:col-span-2"><label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-gray-50 border border-gray-200"><input type="checkbox" checked={co.signature} onChange={e=>setCo({...co,signature:e.target.checked})} className="accent-orange-500 w-5 h-5"/><span className="text-sm text-gray-700 font-medium">Customer has signed the rental agreement</span></label></div>
          <div className="sm:col-span-2 flex justify-end pt-3 border-t border-gray-100"><Btn onClick={proc} className={!(co.signature&&co.mileage)?"opacity-40 pointer-events-none":""}><CheckCircle2 size={14} className="mr-1.5"/>Complete Check-Out</Btn></div>
        </div>
      </div>)}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── RETURNS ──────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const ReturnsPage = () => {
    const activeR = bookings.filter(b=>b.status==="Active");
    const [sel, setSel] = useState(detail||null);
    const [ret, setRet] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",smokeFee:false,stainFee:false,mudFee:false});
    const proc = () => { if(!sel)return; let pen=0; const np=[];
      const addP=(t,a)=>{pen+=a;np.push({id:`P${String(payments.length+np.length+1).padStart(3,"0")}`,bookingId:sel.id,customerId:sel.customerId,customerName:sel.customerName,amount:a,type:t,method:"Cash",date:today,status:"Pending"});};
      if(!ret.clean)addP("Cleaning Fee",50); if(ret.smokeFee)addP("Smoking Fee",200); if(ret.stainFee)addP("Stain Fee",150); if(ret.mudFee)addP("Mud/Sand Fee",100);
      setBookings(p=>p.map(b=>b.id===sel.id?{...b,status:"Completed",total:b.total+pen}:b));
      setVehicles(p=>p.map(v=>v.id===sel.vehicleId?{...v,status:"Available",location:"Main Office",mileage:parseInt(ret.mileage)||v.mileage}:v));
      if(np.length)setPayments(p=>[...p,...np]); setSel(null); setRet({mileage:"",fuel:"Empty",clean:true,damages:"",smokeFee:false,stainFee:false,mudFee:false}); if(detail)setDetail(null);
    };
    return (<div className="space-y-6">
      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Returns — Process Vehicle Returns</h3>
      <div className="bg-white rounded-2xl p-5 border border-gray-100">
        {activeR.length===0?<p className="text-gray-300 text-sm py-8 text-center">No active rentals to return</p>:(
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{activeR.map(b=>(<div key={b.id} onClick={()=>setSel(b)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${sel?.id===b.id?"border-orange-400 bg-orange-50/50":"border-gray-100 hover:border-gray-200"}`}><div className="flex items-center justify-between"><p className="font-semibold text-gray-900 text-sm">{b.customerName}</p>{b.return<today&&<span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">OVERDUE</span>}</div><p className="text-xs text-gray-400 mt-1">{b.vehicleReg} · Due: {b.return}</p></div>))}</div>
        )}
      </div>
      {sel&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Return Inspection — {sel.vehicleReg}</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Return Odometer (km) *"><Input type="number" value={ret.mileage} onChange={e=>setRet({...ret,mileage:e.target.value})}/></Field>
          <Field label="Fuel Level"><Select options={["Empty","Below Quarter","Quarter","Half","Three Quarter","Full"]} value={ret.fuel} onChange={e=>setRet({...ret,fuel:e.target.value})}/></Field>
          <Field label="Vehicle Clean?"><div className="flex gap-4 mt-1"><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={ret.clean} onChange={()=>setRet({...ret,clean:true})} className="accent-orange-500"/>Yes</label><label className="flex items-center gap-2 text-sm cursor-pointer"><input type="radio" checked={!ret.clean} onChange={()=>setRet({...ret,clean:false})} className="accent-orange-500"/>No — add BWP 50</label></div></Field>
          <Field label="Photos"><div className="flex items-center gap-2 mt-1 px-3 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 cursor-pointer hover:bg-gray-50"><Camera size={16}/>Capture / upload</div></Field>
          <div className="sm:col-span-2"><Field label="Damages / Notes"><Textarea value={ret.damages} onChange={e=>setRet({...ret,damages:e.target.value})}/></Field></div>
          <div className="sm:col-span-2 space-y-2"><p className="text-xs font-semibold text-gray-500">Optional Penalties</p>
            {[["smokeFee","Smoking smell — BWP 200"],["stainFee","Interior stain cleaning — BWP 150"],["mudFee","Excessive mud/sand — BWP 100"]].map(([k,l])=>(<label key={k} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={ret[k]} onChange={e=>setRet({...ret,[k]:e.target.checked})} className="accent-orange-500 w-4 h-4"/><span className="text-sm text-gray-700">{l}</span></label>))}
          </div>
          <div className="sm:col-span-2 flex justify-end pt-3 border-t border-gray-100"><Btn onClick={proc} className={!ret.mileage?"opacity-40 pointer-events-none":""}><CheckCircle2 size={14} className="mr-1.5"/>Complete Return</Btn></div>
        </div>
      </div>)}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── INSPECTIONS ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const InspectionPage = () => {
    const areas=["Front Bumper","Rear Bumper","Left Side","Right Side","Windshield","Tyres/Rims","Interior"];
    const [selV, setSelV] = useState("");
    const [ins, setIns] = useState(areas.map(a=>({area:a,severity:"Good",notes:""})));
    const fv = vehicles.filter(v=>v.status!=="Sold").filter(v=>matchSearch(search,v.reg,v.make,v.model));
    return (<div className="space-y-6">
      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Vehicle Damage Inspection</h3>
      <div className="bg-white rounded-2xl p-5 border border-gray-100"><Field label="Select Vehicle"><Select options={[{value:"",label:"— Choose vehicle —"},...fv.map(v=>({value:v.id,label:`${v.make} ${v.model} — ${v.reg}`}))]} value={selV} onChange={e=>setSelV(e.target.value)}/></Field></div>
      {selV&&(<div className="bg-white rounded-2xl p-5 border border-gray-100">
        <h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Inspection Checklist</h4>
        <div className="space-y-4">{ins.map((x,i)=>(<div key={x.area} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
          <div className="flex items-center justify-between mb-3"><p className="font-semibold text-sm text-gray-800">{x.area}</p><div className="flex gap-1.5">{["Good","Minor","Major"].map(s=>(<button key={s} onClick={()=>{const u=[...ins];u[i]={...u[i],severity:s};setIns(u);}} className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${x.severity===s?(s==="Good"?"bg-green-100 text-green-700":s==="Minor"?"bg-amber-100 text-amber-700":"bg-red-100 text-red-700"):"bg-white text-gray-400 border border-gray-200"}`}>{s}</button>))}</div></div>
          <div className="flex gap-3"><input value={x.notes} onChange={e=>{const u=[...ins];u[i]={...u[i],notes:e.target.value};setIns(u);}} placeholder="Damage notes..." className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"/><div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 cursor-pointer hover:bg-white"><Camera size={14}/>Photo</div></div>
        </div>))}</div>
        <div className="flex justify-end pt-4"><Btn><CheckCircle2 size={14} className="mr-1.5"/>Save Inspection</Btn></div>
      </div>)}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── PAYMENTS ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const PaymentsPage = () => {
    const [form, setForm] = useState(null);
    const filtered = payments.filter(p=>matchSearch(search,p.id,p.customerName,p.bookingId,p.type,p.method));
    const tc=payments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0);
    const tp=payments.filter(p=>p.status==="Pending").reduce((s,p)=>s+p.amount,0);
    const cf=payments.filter(p=>p.type.includes("Fee")).reduce((s,p)=>s+p.amount,0);
    const addP=()=>{if(!form)return;const bk=bookings.find(b=>b.id===form.bookingId);setPayments(p=>[...p,{...form,id:`P${String(p.length+1).padStart(3,"0")}`,customerId:bk?.customerId||"",customerName:bk?.customerName||"",date:today,status:"Completed"}]);if(bk)setBookings(p=>p.map(b=>b.id===bk.id?{...b,paid:b.paid+(parseInt(form.amount)||0)}:b));setModal(null);};
    return (<div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4"><StatCard icon={DollarSign} label="Collected" value={fmt(tc)} color="#16a34a"/><StatCard icon={Clock} label="Pending" value={fmt(tp)} color="#f59e0b"/><StatCard icon={Droplets} label="Penalties/Fees" value={fmt(cf)} color="#e2725b"/></div>
      <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-gray-900 shrink-0" style={{fontFamily:"'Outfit', sans-serif"}}>Payment Records</h3><Btn onClick={()=>{setForm({bookingId:"",amount:"",type:"Rental",method:"Cash"});setModal("payment");}}><Plus size={14} className="mr-1.5"/>Record Payment</Btn></div>
      <Table cols={[{label:"ID",render:r=><span className="font-mono">{r.id}</span>},{label:"Date",key:"date"},{label:"Customer",key:"customerName"},{label:"Booking",key:"bookingId"},{label:"Type",key:"type"},{label:"Method",key:"method"},{label:"Amount",render:r=><span className="font-semibold">{fmt(r.amount)}</span>},{label:"Status",render:r=>statusBadge(r.status)}]} data={filtered}/>
      {modal==="payment"&&<Modal title="Record Payment"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Booking"><Select options={[{value:"",label:"— Select —"},...bookings.filter(b=>b.status==="Active"||b.status==="Completed").map(b=>({value:b.id,label:`${b.id} — ${b.customerName}`}))]} value={form.bookingId||""} onChange={e=>setForm({...form,bookingId:e.target.value})}/></Field>
        <Field label="Amount (BWP)"><Input type="number" value={form.amount||""} onChange={e=>setForm({...form,amount:parseInt(e.target.value)||0})}/></Field>
        <Field label="Type"><Select options={["Deposit","Rental","Cleaning Fee","Damage Fee","Refund","Other"]} value={form.type||"Rental"} onChange={e=>setForm({...form,type:e.target.value})}/></Field>
        <Field label="Method"><Select options={["Cash","Card","Bank Transfer"]} value={form.method||"Cash"} onChange={e=>setForm({...form,method:e.target.value})}/></Field>
        <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={addP}>Record Payment</Btn></div>
      </div></Modal>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── MAINTENANCE ──────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const MaintenancePage = () => {
    const [form, setForm] = useState(null);
    const motExp = vehicles.filter(v=>v.status!=="Sold"&&v.motExpiry&&v.motExpiry<=today);
    const filtered = maintenance.filter(m=>matchSearch(search,m.vehicleReg,m.type,m.status,m.notes));
    const save=()=>{if(!form)return;const v=vehicles.find(x=>x.id===form.vehicleId);if(form.id){setMaintenance(p=>p.map(m=>m.id===form.id?{...form,vehicleReg:v?.reg||""}:m));}else{setMaintenance(p=>[...p,{...form,id:`M${String(p.length+1).padStart(3,"0")}`,vehicleReg:v?.reg||""}]);}setModal(null);};
    return (<div className="space-y-4">
      {motExp.length>0&&<div className="p-4 rounded-2xl bg-amber-50 border border-amber-100"><div className="flex items-center gap-2 mb-2"><AlertTriangle size={18} className="text-amber-500"/><p className="font-semibold text-amber-800 text-sm">MOT/Insurance Alerts</p></div>{motExp.map(v=><p key={v.id} className="text-sm text-amber-700">{v.make} {v.model} ({v.reg}) — MOT expired {v.motExpiry}</p>)}</div>}
      <div className="flex items-center justify-between gap-3"><h3 className="text-base font-bold text-gray-900 shrink-0" style={{fontFamily:"'Outfit', sans-serif"}}>Maintenance Records</h3><Btn onClick={()=>{setForm({vehicleId:"",type:"Oil Service",date:today,cost:"",status:"Scheduled",nextDue:"",notes:""});setModal("maint");}}><Plus size={14} className="mr-1.5"/>Add Record</Btn></div>
      <Table cols={[{label:"Vehicle",key:"vehicleReg"},{label:"Type",key:"type"},{label:"Date",key:"date"},{label:"Cost",render:r=>fmt(r.cost)},{label:"Status",render:r=>statusBadge(r.status)},{label:"Next Due",key:"nextDue"},{label:"Notes",render:r=><span className="truncate max-w-[150px] block text-gray-500">{r.notes}</span>}]} data={filtered} onRow={r=>{setForm(r);setModal("maint");}}/>
      {modal==="maint"&&<Modal title={form?.id?"Edit Maintenance":"New Maintenance"} wide><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Vehicle"><Select options={[{value:"",label:"— Select —"},...vehicles.filter(v=>v.status!=="Sold").map(v=>({value:v.id,label:`${v.make} ${v.model} (${v.reg})`}))]} value={form.vehicleId||""} onChange={e=>setForm({...form,vehicleId:e.target.value})}/></Field>
        <Field label="Type"><Select options={["Oil Service","Tyre Replacement","Brake Pads","MOT Renewal","Insurance Renewal","General Service","Roadworthy","Body Repair","Electrical","Other"]} value={form.type||"Oil Service"} onChange={e=>setForm({...form,type:e.target.value})}/></Field>
        <Field label="Date"><Input type="date" value={form.date||""} onChange={e=>setForm({...form,date:e.target.value})}/></Field>
        <Field label="Cost (BWP)"><Input type="number" value={form.cost||""} onChange={e=>setForm({...form,cost:parseInt(e.target.value)||0})}/></Field>
        <Field label="Status"><Select options={["Scheduled","In Progress","Completed"]} value={form.status||"Scheduled"} onChange={e=>setForm({...form,status:e.target.value})}/></Field>
        <Field label="Next Due"><Input type="date" value={form.nextDue||""} onChange={e=>setForm({...form,nextDue:e.target.value})}/></Field>
        <div className="sm:col-span-2"><Field label="Notes"><Textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})}/></Field></div>
        <div className="sm:col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100"><Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn><Btn onClick={save}>{form.id?"Update":"Add"} Record</Btn></div>
      </div></Modal>}
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── REPORTS ──────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const ReportsPage = () => {
    const tr=payments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0); const mc=maintenance.reduce((s,m)=>s+m.cost,0); const av=vehicles.filter(v=>v.status!=="Sold").length; const rn=vehicles.filter(v=>v.status==="Rented").length; const ut=av>0?Math.round((rn/av)*100):0;
    const cf=payments.filter(p=>["Cleaning Fee","Smoking Fee","Stain Fee","Mud/Sand Fee"].includes(p.type)).reduce((s,p)=>s+p.amount,0);
    const rpv=vehicles.filter(v=>v.status!=="Sold").map(v=>({name:`${v.make} ${v.model}`.substring(0,12),revenue:bookings.filter(b=>b.vehicleId===v.id).reduce((s,b)=>s+b.total,0)})).sort((a,b)=>b.revenue-a.revenue).slice(0,8);
    const mpv=vehicles.filter(v=>v.status!=="Sold").map(v=>({name:`${v.make[0]}. ${v.model}`,cost:maintenance.filter(m=>m.vehicleId===v.id).reduce((s,m)=>s+m.cost,0)})).filter(v=>v.cost>0).sort((a,b)=>b.cost-a.cost);
    return (<div className="space-y-6">
      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Reports & Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><StatCard icon={DollarSign} label="Total Revenue" value={fmt(tr)} color="#16a34a"/><StatCard icon={Wrench} label="Maintenance Costs" value={fmt(mc)} color="#f59e0b"/><StatCard icon={Activity} label="Fleet Utilization" value={`${ut}%`} color="#2563eb"/><StatCard icon={Droplets} label="Penalty Fees" value={fmt(cf)} color="#e2725b"/></div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Revenue per Vehicle</h4><ResponsiveContainer width="100%" height={250}><BarChart data={rpv}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:10}} stroke="#94a3b8" angle={-20} textAnchor="end" height={50}/><YAxis tick={{fontSize:11}} stroke="#94a3b8"/><Tooltip formatter={v=>fmt(v)}/><Bar dataKey="revenue" fill="#e2725b" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer></div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Maintenance Cost per Vehicle</h4><ResponsiveContainer width="100%" height={250}><BarChart data={mpv} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:11}} stroke="#94a3b8"/><YAxis dataKey="name" type="category" tick={{fontSize:11}} stroke="#94a3b8" width={80}/><Tooltip formatter={v=>fmt(v)}/><Bar dataKey="cost" fill="#f59e0b" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></div>
      </div>
      <div className="bg-white rounded-2xl p-5 border border-gray-100"><h4 className="font-bold text-sm text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Quick Summary</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[["Total Bookings",bookings.length],["Completed",bookings.filter(b=>b.status==="Completed").length],["Active",bookings.filter(b=>b.status==="Active").length],["Customers",customers.length],["Avg Rev/Booking",fmt(tr/Math.max(bookings.length,1))],["Maintenance Records",maintenance.length],["Idle Vehicles",vehicles.filter(v=>v.status==="Available").length],["Cleaning Fees",fmt(cf)]].map(([l,v])=>(<div key={l} className="p-3 rounded-xl bg-gray-50/60"><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-bold text-gray-800 mt-1">{v}</p></div>))}</div></div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── SETTINGS ─────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const SettingsPage = () => {
    const [gp, setGp] = useState(2); const [lr, setLr] = useState(150); const [cf, setCf] = useState(50);
    return (<div className="space-y-6">
      <h3 className="text-base font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Settings</h3>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-xl"><h4 className="font-bold text-sm text-gray-900 mb-4">Business Rules</h4><div className="space-y-4"><Field label="Late Return Grace Period (hours)"><Input type="number" value={gp} onChange={e=>setGp(e.target.value)}/></Field><Field label="Late Return Fee (BWP/day)"><Input type="number" value={lr} onChange={e=>setLr(e.target.value)}/></Field><Field label="Dirty Vehicle Fee (BWP)"><Input type="number" value={cf} onChange={e=>setCf(e.target.value)}/></Field><div className="pt-3 border-t border-gray-100"><Btn>Save Settings</Btn></div></div></div>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-xl"><h4 className="font-bold text-sm text-gray-900 mb-4">User Roles</h4><div className="space-y-3">{[{name:"Admin",desc:"Full access to all modules"},{name:"Operations",desc:"Bookings, check-in/out, returns, inspections"},{name:"Finance",desc:"Payments, invoicing, reports"}].map(r=>(<div key={r.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60"><div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-bold">{r.name[0]}</div><div><p className="text-sm font-semibold text-gray-800">{r.name}</p><p className="text-xs text-gray-400">{r.desc}</p></div></div>))}</div></div>
    </div>);
  };

  // ═══════════════════════════════════════════════════════════
  // ─── RENDER ───────────────────────────────────────────────
  // ═══════════════════════════════════════════════════════════
  const pages = {dashboard:Dashboard,vehicles:VehiclesPage,bookings:BookingsPage,customers:CustomersPage,checkin:CheckInPage,checkout:CheckOutPage,returns:ReturnsPage,inspection:InspectionPage,payments:PaymentsPage,maintenance:MaintenancePage,reports:ReportsPage,settings:SettingsPage};
  const PC = pages[page]||Dashboard;

  return (<>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');*{font-family:'DM Sans',sans-serif;}::-webkit-scrollbar{width:6px;height:6px;}::-webkit-scrollbar-track{background:transparent;}::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:10px;}`}</style>
    <div className="min-h-screen bg-[#f8f7f4]">
      <Sidebar/>
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden"><PC/></main>
      </div>
    </div>
  </>);
}
