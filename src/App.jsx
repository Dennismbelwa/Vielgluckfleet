import { useState, useEffect, useRef } from "react";
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
import { api } from './api.js';

// ─── HELPERS ──────────────────────────────────────────────────
const COLORS = {
  Available:"#16a34a", Reserved:"#8b5cf6", Rented:"#2563eb", Maintenance:"#f59e0b", InService:"#6b7280", Sold:"#ef4444",
  Pending:"#f59e0b", Confirmed:"#8b5cf6", Active:"#2563eb", Completed:"#16a34a", Cancelled:"#ef4444"
};

const fmt = n => `BWP ${(n||0).toLocaleString("en-BW", {minimumFractionDigits:2, maximumFractionDigits:2})}`;
const statusBadge = (s, map=COLORS) => (
  <span style={{background:`${map[s]||"#6b7280"}18`, color:map[s]||"#6b7280", border:`1px solid ${map[s]||"#6b7280"}30`}} className="px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">{s}</span>
);
const today = new Date().toISOString().split('T')[0];

// ─── JWT DECODE (payload only, no verify) ─────────────────────
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// ─── PURE UI PRIMITIVES (outside App so React never remounts them on re-render) ──

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

const Modal = ({title, children, wide, onClose}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-8 px-4 overflow-y-auto pb-8" onClick={onClose}>
    <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide?"max-w-3xl":"max-w-lg"} relative`} onClick={e=>e.stopPropagation()}>
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{title}</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18}/></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const StatCard = ({icon:Icon, label, value, sub, color, onClick}) => (
  <div onClick={onClick} className={`bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl transition-all duration-200 ${onClick?"cursor-pointer hover:-translate-y-0.5":""}`}>
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{background:`linear-gradient(135deg, ${color} 0%, ${color}bb 100%)`, boxShadow:`0 6px 16px ${color}35`}}>
        <Icon size={22} color="#fff" strokeWidth={2}/>
      </div>
      {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
    </div>
    <p className="text-2xl font-bold mt-3 text-gray-900">{value}</p>
    <p className="text-xs text-gray-400 mt-1">{label}</p>
  </div>
);

const Table = ({cols, data, onRow}) => (
  <>
    <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-100">
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
    <div className="md:hidden space-y-2">
      {data.length===0 && <p className="text-center text-gray-300 py-12 text-sm">No records found</p>}
      {data.map((row,ri)=>(
        <div key={ri} onClick={()=>onRow?.(row)} className={`bg-white rounded-xl border border-gray-100 p-4 space-y-2 ${onRow?"cursor-pointer active:bg-orange-50/30":""}`}>
          {cols.slice(0,5).map((c,ci)=>(
            <div key={ci} className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-medium">{c.label}</span>
              <span className="text-sm text-gray-800 text-right max-w-[55%]">{c.render?c.render(row):row[c.key]}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </>
);

// ─── SIGNATURE PAD ────────────────────────────────────────────
const SignaturePad = ({ label, value, onChange }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
  };
  const start = e => { e.preventDefault(); drawing.current = true; const c = canvasRef.current; const ctx = c.getContext('2d'); const p = getPos(e,c); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const draw  = e => { if (!drawing.current) return; e.preventDefault(); const c = canvasRef.current; const ctx = c.getContext('2d'); ctx.lineWidth = 2.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1a1a2e'; const p = getPos(e,c); ctx.lineTo(p.x,p.y); ctx.stroke(); };
  const stop  = () => { if (!drawing.current) return; drawing.current = false; const c = canvasRef.current; const d = c.getContext('2d').getImageData(0,0,c.width,c.height).data; if ([...d].some((v,i)=>i%4!==3&&v<240)) onChange(c.toDataURL()); };
  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0,0,c.width,c.height); onChange(null); };
  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</p>
      <div className={`relative rounded-xl overflow-hidden border-2 ${value?"border-green-400 bg-green-50/20":"border-dashed border-gray-300 bg-gray-50/40"}`}>
        <canvas ref={canvasRef} width={700} height={160} className="w-full touch-none cursor-crosshair"
          onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseLeave={stop}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}/>
        {!value && <p className="absolute inset-0 flex items-center justify-center text-sm text-gray-300 pointer-events-none select-none">Draw signature here</p>}
      </div>
      <div className="flex justify-between items-center mt-1.5">
        <button onClick={clear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear</button>
        {value && <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 size={12}/>Signed</span>}
      </div>
    </div>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [loginCreds, setLoginCreds] = useState({ username:"", password:"" });
  const [loginError, setLoginError] = useState("");
  const [contractData, setContractData] = useState(null);
  const [customerSig, setCustomerSig] = useState(null);
  const [agentSig, setAgentSig] = useState(null);
  const [loginShowPw, setLoginShowPw] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);

  // On mount: check for stored token
  useEffect(() => {
    const token = localStorage.getItem('vg_token');
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload) {
        setActiveUser({ name: payload.name || payload.username || "User", role: payload.role || "User", username: payload.username });
      } else {
        localStorage.removeItem('vg_token');
      }
    }
  }, []);

  // Load all data when user is set
  useEffect(() => {
    if (activeUser) loadAll();
  }, [activeUser]);

  const loadAll = async () => {
    try {
      const [v, c, b, p, m] = await Promise.all([
        api.getVehicles(),
        api.getCustomers(),
        api.getBookings(),
        api.getPayments(),
        api.getMaintenance(),
      ]);
      setVehicles(v || []);
      setCustomers(c || []);
      setBookings(b || []);
      setPayments(p || []);
      setMaintenance(m || []);
    } catch (err) {
      console.error("loadAll error:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await api.login(loginCreds.username.trim(), loginCreds.password);
      localStorage.setItem('vg_token', res.token);
      const payload = decodeJwtPayload(res.token);
      setActiveUser({ name: payload?.name || res.name || loginCreds.username, role: payload?.role || res.role || "User", username: loginCreds.username });
      setPage("dashboard");
    } catch (err) {
      setLoginError("Incorrect username or password.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vg_token');
    setActiveUser(null);
    setPage("dashboard");
    setSidebarOpen(false);
    setVehicles([]);
    setCustomers([]);
    setBookings([]);
    setPayments([]);
    setMaintenance([]);
  };

  // ─── LOGIN SCREEN ─────────────────────────────────────────────
  if (!activeUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{background:"linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap'); * { font-family:'DM Sans',sans-serif; }`}</style>
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl" style={{background:"linear-gradient(135deg,#e2725b 0%,#d4a574 100%)"}}>
              <CarFront size={32} color="#fff"/>
            </div>
            <h1 className="text-white text-2xl font-bold tracking-tight" style={{fontFamily:"'Outfit',sans-serif"}}>Viel Glück</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.25em] mt-1">Fleet Manager</p>
          </div>

          <div className="bg-white rounded-2xl p-7 shadow-2xl">
            <h2 className="text-gray-900 font-bold text-lg mb-1" style={{fontFamily:"'Outfit',sans-serif"}}>Welcome back</h2>
            <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Username</label>
                <input
                  value={loginCreds.username}
                  onChange={e=>{ setLoginCreds({...loginCreds,username:e.target.value}); setLoginError(""); }}
                  placeholder="e.g. admin"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={loginShowPw?"text":"password"}
                    value={loginCreds.password}
                    onChange={e=>{ setLoginCreds({...loginCreds,password:e.target.value}); setLoginError(""); }}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300 bg-white"
                  />
                  <button type="button" onClick={()=>setLoginShowPw(p=>!p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {loginShowPw ? <Eye size={15}/> : <Eye size={15} className="opacity-40"/>}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle size={14} className="text-red-500 shrink-0"/>
                  <span className="text-xs text-red-600">{loginError}</span>
                </div>
              )}

              <button type="submit" disabled={loginLoading} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-lg shadow-orange-200/50 mt-1 disabled:opacity-60" style={{background:"linear-gradient(135deg,#e2725b 0%,#d4a574 100%)"}}>
                {loginLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-white/20 text-xs mt-6">© 2026 Viel Glück Car Hire · Botswana</p>
        </div>
      </div>
    );
  }

  const nav = [
    { id:"dashboard", label:"Dashboard", icon:Home },
    { id:"vehicles", label:"Vehicles", icon:Car },
    { id:"bookings", label:"Bookings", icon:Calendar },
    { id:"customers", label:"Customers", icon:Users },
    { id:"walkin", label:"Walk-in", icon:UserCheck },
    { id:"checkout", label:"Hand Over", icon:ClipboardCheck },
    { id:"returns", label:"Return Car", icon:RotateCcw },
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
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all mx-1 rounded-xl ${active ? "text-white" : "text-white/55 hover:text-white hover:bg-white/5"}`}
                style={active?{background:"linear-gradient(135deg,rgba(226,114,91,0.25) 0%,rgba(212,165,116,0.15) 100%)",borderLeft:"3px solid #e2725b"}:{borderLeft:"3px solid transparent"}}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active?"shadow-lg":"" }`}
                  style={active?{background:"linear-gradient(135deg,#e2725b 0%,#d4a574 100%)",boxShadow:"0 4px 12px rgba(226,114,91,0.4)"}:{}}>
                  <Icon size={16} color={active?"#fff":"currentColor"}/>
                </div>
                <span className={active?"font-semibold":""}>{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{background:"#e2725b"}}>{(activeUser.name||"U")[0].toUpperCase()}</div>
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
  const Header = () => {
    const overdueBookings = bookings.filter(b=>b.status==="Active"&&b.return<today);
    const motExpiredVehicles = vehicles.filter(v=>v.status!=="Sold"&&v.motExpiry&&v.motExpiry<=today);
    const todayReturns = bookings.filter(b=>b.status==="Active"&&b.return===today);
    const hasAlerts = overdueBookings.length>0||motExpiredVehicles.length>0||todayReturns.length>0;
    return (
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4">
        <button className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100" onClick={()=>setSidebarOpen(true)}><Menu size={20}/></button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>{nav.find(n=>n.id===page)?.label || "Dashboard"}</h2>
          <p className="text-xs text-gray-400">{new Date().toLocaleDateString("en-BW",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div className="relative">
          <button className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors" onClick={()=>setBellOpen(o=>!o)}>
            <Bell size={20} className={hasAlerts?"text-orange-400":"text-gray-400"}/>
            {hasAlerts && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white animate-pulse"/>}
          </button>
          {bellOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={()=>setBellOpen(false)}/>
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <p className="font-bold text-sm text-gray-900" style={{fontFamily:"'Outfit',sans-serif"}}>Notifications</p>
                  <button onClick={()=>setBellOpen(false)}><X size={14} className="text-gray-400"/></button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {!hasAlerts && (
                    <p className="text-center text-sm text-green-600 font-semibold py-8">All clear ✓</p>
                  )}
                  {overdueBookings.map(b=>(
                    <div key={b.id} onClick={()=>{goTo("returns",b);setBellOpen(false);}} className="flex items-start gap-3 px-4 py-3 hover:bg-red-50/50 cursor-pointer border-b border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"/>
                      <div>
                        <p className="text-sm font-semibold text-red-700">{b.customerName} — OVERDUE</p>
                        <p className="text-xs text-gray-400">{b.vehicleReg} · was due {b.return}</p>
                      </div>
                    </div>
                  ))}
                  {motExpiredVehicles.map(v=>(
                    <div key={v.id} onClick={()=>{goTo("maintenance");setBellOpen(false);}} className="flex items-start gap-3 px-4 py-3 hover:bg-amber-50/50 cursor-pointer border-b border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"/>
                      <div>
                        <p className="text-sm font-semibold text-amber-700">{v.make} {v.model} — MOT Expired</p>
                        <p className="text-xs text-gray-400">{v.reg} · expired {v.motExpiry}</p>
                      </div>
                    </div>
                  ))}
                  {todayReturns.map(b=>(
                    <div key={b.id} onClick={()=>{goTo("returns",b);setBellOpen(false);}} className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50/50 cursor-pointer border-b border-gray-50">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"/>
                      <div>
                        <p className="text-sm font-semibold text-blue-700">{b.customerName} — Due Today</p>
                        <p className="text-xs text-gray-400">{b.vehicleReg} · return today</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </header>
    );
  };

  // ─── PRINT HELPERS ────────────────────────────────────────────
  const printReceipt = (p) => {
    const booking = bookings.find(b=>b.id===p.bookingId);
    const html = `<!DOCTYPE html><html><head><title>Receipt ${p.id}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;max-width:420px;margin:40px auto;color:#1a1a2e;padding:20px}
      .header{text-align:center;border-bottom:3px solid #e2725b;padding-bottom:16px;margin-bottom:20px}
      .logo{font-size:26px;font-weight:900;color:#e2725b}
      .sub{font-size:10px;color:#888;letter-spacing:3px;margin-top:2px}
      .badge{display:inline-block;background:#e2725b;color:#fff;font-size:11px;font-weight:700;padding:3px 12px;border-radius:20px;margin:10px 0 0}
      .section{margin:14px 0}
      .row{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f0f0f0;font-size:13px}
      .lbl{color:#888}.val{font-weight:600}
      .total-row{display:flex;justify-content:space-between;margin-top:14px;padding-top:14px;border-top:2px solid #e2725b}
      .total-val{font-size:22px;font-weight:900;color:#e2725b}
      .footer{text-align:center;margin-top:24px;padding-top:16px;border-top:1px dashed #ddd;font-size:11px;color:#aaa;line-height:1.8}
    </style></head><body>
    <div class="header"><div class="logo">Viel Gl&#xFC;ck</div><div class="sub">FLEET MANAGER &middot; BOTSWANA</div><div class="badge">PAYMENT RECEIPT</div></div>
    <div class="section">
      <div class="row"><span class="lbl">Receipt No.</span><span class="val">${p.id}</span></div>
      <div class="row"><span class="lbl">Date</span><span class="val">${p.date||today}</span></div>
      <div class="row"><span class="lbl">Customer</span><span class="val">${p.customerName||'&mdash;'}</span></div>
      <div class="row"><span class="lbl">Booking Ref.</span><span class="val">${p.bookingId||'&mdash;'}</span></div>
      ${booking?`<div class="row"><span class="lbl">Vehicle</span><span class="val">${booking.vehicleReg||''}</span></div>`:''}
      ${booking?`<div class="row"><span class="lbl">Rental Period</span><span class="val">${booking.pickup||''} &rarr; ${booking.returnDate||booking.return||''}</span></div>`:''}
    </div>
    <div class="section">
      <div class="row"><span class="lbl">Payment Type</span><span class="val">${p.type||'&mdash;'}</span></div>
      <div class="row"><span class="lbl">Method</span><span class="val">${p.method||'Cash'}</span></div>
      <div class="row"><span class="lbl">Status</span><span class="val">${p.status||'Completed'}</span></div>
    </div>
    <div class="total-row"><span style="font-size:14px;font-weight:700">Amount Paid</span><span class="total-val">${fmt(p.amount)}</span></div>
    <div class="footer">Thank you for choosing Viel Gl&#xFC;ck Car Hire<br>This is an official receipt &copy; ${new Date().getFullYear()} Viel Gl&#xFC;ck Car Hire &middot; Botswana</div>
    </body></html>`;
    const w = window.open('','_blank','width=480,height=700');
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(()=>{ w.print(); }, 400);
  };

  const printMonthlyReport = (reportMonth, filteredPmts, totalRev, maintCost, util) => {
    const rows = filteredPmts.map(p=>`<tr><td>${p.id}</td><td>${p.date||''}</td><td>${p.customerName||''}</td><td>${p.bookingId||''}</td><td>${p.type||''}</td><td>${p.method||''}</td><td style="text-align:right;font-weight:600">${fmt(p.amount)}</td></tr>`).join('');
    const html = `<!DOCTYPE html><html><head><title>Report ${reportMonth}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;color:#1a1a2e;padding:30px;font-size:12px}
      h1{font-size:20px;color:#e2725b;margin-bottom:4px}.sub{color:#888;font-size:11px;margin-bottom:20px}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:22px}
      .stat{background:#f8f8f8;border-radius:8px;padding:10px;text-align:center}
      .stat-val{font-size:16px;font-weight:800;color:#e2725b}.stat-lbl{font-size:10px;color:#888;margin-top:2px}
      table{width:100%;border-collapse:collapse}th{background:#1a1a2e;color:#fff;padding:7px 8px;text-align:left;font-size:10px}
      td{padding:6px 8px;border-bottom:1px solid #f0f0f0;font-size:11px}tr:nth-child(even){background:#fafafa}
      .footer{margin-top:18px;text-align:center;font-size:10px;color:#aaa}
    </style></head><body>
    <h1>Viel Gl&#xFC;ck Fleet Manager</h1>
    <div class="sub">Monthly Payments Report &middot; ${reportMonth} &middot; Printed ${today}</div>
    <div class="stats">
      <div class="stat"><div class="stat-val">${fmt(totalRev)}</div><div class="stat-lbl">Total Revenue</div></div>
      <div class="stat"><div class="stat-val">${fmt(maintCost)}</div><div class="stat-lbl">Maint. Costs</div></div>
      <div class="stat"><div class="stat-val">${util}%</div><div class="stat-lbl">Utilization</div></div>
      <div class="stat"><div class="stat-val">${filteredPmts.length}</div><div class="stat-lbl">Transactions</div></div>
    </div>
    <table><thead><tr><th>ID</th><th>Date</th><th>Customer</th><th>Booking</th><th>Type</th><th>Method</th><th>Amount</th></tr></thead>
    <tbody>${rows||'<tr><td colspan="7" style="text-align:center;color:#aaa;padding:20px">No payments this month</td></tr>'}</tbody></table>
    <div class="footer">&copy; ${new Date().getFullYear()} Viel Gl&#xFC;ck Car Hire &middot; Botswana</div>
    </body></html>`;
    const w = window.open('','_blank','width=900,height=700');
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(()=>{ w.print(); }, 400);
  };

  // ─── CONTRACT HELPERS ─────────────────────────────────────────
  const openContract = (booking, inspectionData, onSigned) => {
    const customer = customers.find(c=>c.id===booking.customerId) || {};
    const vehicle  = vehicles.find(v=>v.id===booking.vehicleId) || {};
    setCustomerSig(null);
    setAgentSig(null);
    setContractData({ booking, customer, vehicle, inspection: inspectionData || {}, _onSigned: onSigned });
  };

  const printContract = () => {
    if (!contractData) return;
    const { booking, customer, vehicle, inspection } = contractData;
    const sigBlock = (label, sig) => sig
      ? `<div><p style="font-size:11px;color:#888;margin-bottom:4px">${label}</p><img src="${sig}" style="height:60px;border-bottom:1px solid #333;display:block"/></div>`
      : `<div><p style="font-size:11px;color:#888;margin-bottom:4px">${label}</p><div style="height:60px;border-bottom:1px solid #333"></div></div>`;
    const html = `<!DOCTYPE html><html><head><title>Rental Agreement — ${booking?.id}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:Arial,sans-serif;color:#1a1a2e;padding:30px;font-size:12px;line-height:1.6}
      .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #e2725b;padding-bottom:14px;margin-bottom:20px}
      .logo{font-size:22px;font-weight:900;color:#e2725b}.sub{font-size:10px;color:#888;letter-spacing:2px}
      .ref{text-align:right}.ref p{font-size:11px;color:#888}.ref strong{font-size:14px;color:#1a1a2e}
      .section{margin-bottom:18px}.section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#e2725b;border-bottom:1px solid #f0f0f0;padding-bottom:4px;margin-bottom:10px}
      .grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .field p:first-child{font-size:10px;color:#888}.field p:last-child{font-size:12px;font-weight:600}
      .terms{background:#f9f9f9;border-radius:6px;padding:12px;font-size:10px;color:#555;line-height:1.7}
      .terms li{margin-bottom:4px}
      .sigs{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:20px}
      @media print{body{padding:15px}}
    </style></head><body>
    <div class="header">
      <div><div class="logo">Viel Gl&#xFC;ck</div><div class="sub">FLEET MANAGER &middot; BOTSWANA</div><div style="margin-top:6px;font-size:11px;color:#555">Car Hire Rental Agreement</div></div>
      <div class="ref"><p>Agreement No.</p><strong>${booking?.id||'—'}</strong><p style="margin-top:4px">Date: ${today}</p></div>
    </div>
    <div class="section"><div class="section-title">Renter Information</div>
      <div class="grid2">
        <div class="field"><p>Full Name</p><p>${customer?.name||'—'}</p></div>
        <div class="field"><p>Phone</p><p>${customer?.phone||'—'}</p></div>
        <div class="field"><p>ID / Passport No.</p><p>${customer?.idNumber||'—'}</p></div>
        <div class="field"><p>Driver License No.</p><p>${customer?.license||'—'}</p></div>
        <div class="field"><p>Email</p><p>${customer?.email||'—'}</p></div>
        <div class="field"><p>Emergency Contact</p><p>${customer?.emergency||'—'}</p></div>
        <div class="field"><p>Next of Kin</p><p>${customer?.nextOfKinName||'—'}</p></div>
        <div class="field"><p>Next of Kin Contact</p><p>${customer?.nextOfKinContact||'—'}</p></div>
      </div>
    </div>
    <div class="section"><div class="section-title">Vehicle Details</div>
      <div class="grid2">
        <div class="field"><p>Vehicle</p><p>${vehicle?.make||''} ${vehicle?.model||''} ${vehicle?.year||''}</p></div>
        <div class="field"><p>Registration</p><p>${vehicle?.reg||'—'}</p></div>
        <div class="field"><p>VIN</p><p>${vehicle?.vin||'—'}</p></div>
        <div class="field"><p>Color</p><p>${vehicle?.color||'—'}</p></div>
        <div class="field"><p>Odometer at Pick-up</p><p>${inspection?.mileage||'—'} km</p></div>
        <div class="field"><p>Fuel Level at Pick-up</p><p>${inspection?.fuel||'—'}</p></div>
      </div>
    </div>
    <div class="section"><div class="section-title">Rental Terms</div>
      <div class="grid2">
        <div class="field"><p>Pick-up Date</p><p>${booking?.pickup||'—'}</p></div>
        <div class="field"><p>Return Date</p><p>${booking?.returnDate||booking?.return||'—'}</p></div>
        <div class="field"><p>Daily Rate</p><p>${fmt(booking?.rate)}</p></div>
        <div class="field"><p>Total Amount</p><p>${fmt(booking?.total)}</p></div>
        <div class="field"><p>Deposit Paid</p><p>${fmt(booking?.deposit)}</p></div>
        <div class="field"><p>Trip Type</p><p>${booking?.tripType||'Local'}</p></div>
      </div>
    </div>
    ${inspection?.damages ? `<div class="section"><div class="section-title">Pre-Rental Inspection Notes</div><p style="font-size:12px;color:#555">${inspection.damages}</p></div>` : ''}
    <div class="section"><div class="section-title">Terms &amp; Conditions</div>
      <div class="terms"><ol>
        <li>The renter is responsible for the vehicle during the rental period and must return it in the same condition.</li>
        <li>Any damage not noted at the time of pick-up will be charged to the renter.</li>
        <li>The renter must have a valid driver's license for the duration of the rental.</li>
        <li>Smoking, pets, and off-road driving are strictly prohibited unless prior written consent is given.</li>
        <li>The renter is liable for all traffic fines and parking violations incurred during the rental period.</li>
        <li>Fuel must be returned at the same level as at pick-up or a refuelling fee will apply.</li>
        <li>Late returns beyond the agreed date will be charged at the daily rate plus a ${fmt(150)} late fee per day.</li>
        <li>The vehicle must not be driven outside Botswana without prior written authorisation.</li>
        <li>Viel Glück Car Hire reserves the right to recover the vehicle if terms are breached.</li>
        <li>The renter confirms they have inspected the vehicle and agree to the above terms.</li>
      </ol></div>
    </div>
    <div class="sigs">
      ${sigBlock('Customer Signature &amp; Date', customerSig)}
      ${sigBlock('Agent Signature &amp; Date', agentSig)}
    </div>
    </body></html>`;
    const w = window.open('','_blank','width=900,height=800');
    w.document.write(html); w.document.close(); w.focus();
    setTimeout(()=>{ w.print(); }, 500);
  };

  // ─── MODAL SAVE FUNCTIONS ────────────────────────────────────
  const saveVehicle = async () => {
    if (!form) return;
    try {
      if (form.id) { await api.updateVehicle(form.id, form); }
      else { await api.createVehicle({...form, photos:[]}); }
      await loadAll(); setModal(null);
    } catch (err) { alert("Error saving vehicle: " + err.message); }
  };

  const saveBooking = async () => {
    if (!form) return;
    const cust = customers.find(c=>c.id===form.customerId);
    const veh = vehicles.find(v=>v.id===form.vehicleId);
    const days = Math.max(1, Math.ceil((new Date(form.return) - new Date(form.pickup))/(1000*60*60*24)));
    const payload = {...form, customerName:cust?.name||"", vehicleReg:veh?.reg||"", total:days*(form.rate||0)};
    try {
      if (form.id) { await api.updateBooking(form.id, payload); }
      else { await api.createBooking({...payload, paid:0}); }
      await loadAll(); setModal(null);
    } catch (err) { alert("Error saving booking: " + err.message); }
  };

  const saveCustomer = async () => {
    if (!form) return;
    try {
      if (form.id) { await api.updateCustomer(form.id, form); }
      else { await api.createCustomer({...form, balance:0}); }
      await loadAll(); setModal(null);
    } catch (err) { alert("Error saving customer: " + err.message); }
  };

  const addPayment = async () => {
    if (!form) return;
    const bk = bookings.find(b=>b.id===form.bookingId);
    try {
      await api.createPayment({...form, customerId:bk?.customerId||"", customerName:bk?.customerName||form.customerName||"", date:today, status:"Completed"});
      await loadAll(); setModal(null);
    } catch (err) { alert("Error recording payment: " + err.message); }
  };

  const saveMaint = async () => {
    if (!form) return;
    const veh = vehicles.find(v=>v.id===form.vehicleId);
    try {
      if (form.id) { await api.updateMaintenance(form.id, {...form, vehicleReg:veh?.reg||""}); }
      else { await api.createMaintenance({...form, vehicleReg:veh?.reg||""}); }
      await loadAll(); setModal(null);
    } catch (err) { alert("Error saving maintenance: " + err.message); }
  };

  // ─── DASHBOARD ──────────────────────────────────────────────
  const Dashboard = () => {
    const avail = vehicles.filter(v=>v.status==="Available").length;
    const rented = vehicles.filter(v=>v.status==="Rented").length;
    const maint = vehicles.filter(v=>v.status==="Maintenance"||v.status==="InService").length;
    const active = vehicles.filter(v=>v.status!=="Sold").length;
    const util = active > 0 ? Math.round((rented / active)*100) : 0;
    const totalRevenue = payments.reduce((s,p)=>s+p.amount,0);
    const todayRevenue = payments.filter(p=>p.date===today).reduce((s,p)=>s+p.amount,0);
    const overdue = bookings.filter(b=>b.status==="Active"&&b.return<today).length;
    const upcoming = bookings.filter(b=>b.status==="Pending"||b.status==="Confirmed").length;
    const outstanding = customers.reduce((s,c)=>s+(c.balance||0),0) + bookings.filter(b=>b.status==="Active").reduce((s,b)=>s+((b.total||0)-(b.paid||0)),0);
    const motDue = vehicles.filter(v=>v.status!=="Sold"&&v.motExpiry&&v.motExpiry<=today).length;

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard icon={DollarSign} label="Total Revenue" value={fmt(totalRevenue)} color="#16a34a"/>
          <StatCard icon={Receipt} label="Today's Collections" value={fmt(todayRevenue)} color="#16a34a"/>
          <StatCard icon={AlertTriangle} label="Overdue Returns" value={overdue} color="#ef4444" onClick={()=>goTo("returns")}/>
          <StatCard icon={Calendar} label="Upcoming Bookings" value={upcoming} color="#8b5cf6" onClick={()=>goTo("bookings")}/>
          <StatCard icon={AlertCircle} label="Outstanding" value={fmt(outstanding)} color="#f59e0b" onClick={()=>goTo("payments")}/>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
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
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm" style={{fontFamily:"'Outfit', sans-serif"}}>Active Rentals</h3>
              <button onClick={()=>goTo("bookings")} className="text-xs text-orange-500 font-semibold hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {bookings.filter(b=>b.status==="Active").slice(0,4).map(b=>(
                <div key={b.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60 hover:bg-orange-50/40 cursor-pointer transition-colors" onClick={()=>goTo("bookings",b)}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{background:"linear-gradient(135deg,#2563eb,#3b82f6)",boxShadow:"0 3px 8px rgba(37,99,235,0.3)"}}><Car size={16} color="#fff" strokeWidth={2}/></div>
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

        {(motDue > 0 || overdue > 0) && (
          <div className="grid sm:grid-cols-2 gap-4">
            {motDue > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:"linear-gradient(135deg,#f59e0b,#fbbf24)",boxShadow:"0 4px 10px rgba(245,158,11,0.35)"}}>
                  <AlertTriangle size={18} color="#fff" strokeWidth={2.5}/>
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-800">{motDue} vehicle(s) with expired MOT</p>
                  <p className="text-xs text-amber-600 mt-0.5">Requires immediate attention</p>
                </div>
                <button onClick={()=>goTo("maintenance")} className="ml-auto text-xs text-amber-700 font-semibold hover:underline shrink-0">View →</button>
              </div>
            )}
            {overdue > 0 && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:"linear-gradient(135deg,#ef4444,#f87171)",boxShadow:"0 4px 10px rgba(239,68,68,0.35)"}}>
                  <Clock size={18} color="#fff" strokeWidth={2.5}/>
                </div>
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
    const filtered = vehicles.filter(v => {
      if (statusFilter !== "All" && v.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [v.reg,v.make,v.model,v.vin,v.color].some(f=>(f||"").toLowerCase().includes(q));
      }
      return true;
    });



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
      </div>
    );
  };

  // ─── BOOKINGS ───────────────────────────────────────────────
  const BookingsPage = () => {
    const [statusFilter, setStatusFilter] = useState("All");
    const filtered = bookings.filter(b => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [b.id,b.customerName,b.vehicleReg].some(f=>(f||"").toLowerCase().includes(q));
      }
      return true;
    });

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
              {[["Pickup",b.pickup],["Return",b.return],["Daily Rate",fmt(b.rate)],["Total",fmt(b.total)],["Deposit",fmt(b.deposit)],["Paid",fmt(b.paid)],["Balance",fmt((b.total||0)-(b.paid||0))],["Trip",b.tripType]].map(([l,val])=>(
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
          {label:"Balance",render:r=>{const bal=(r.total||0)-(r.paid||0); return <span className={bal>0?"text-red-500 font-semibold":"text-green-600"}>{fmt(bal)}</span>}},
        ]} data={filtered} onRow={r=>setDetail(r)}/>
      </div>
    );
  };

  // ─── CUSTOMERS ──────────────────────────────────────────────
  const CustomersPage = () => {
    const filtered = customers.filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [c.name,c.phone,c.idNumber,c.license].some(f=>(f||"").toLowerCase().includes(q));
    });

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
          <Btn onClick={()=>{setForm({name:"",phone:"",email:"",idNumber:"",license:"",emergency:"",nextOfKinName:"",nextOfKinContact:"",notes:""});setModal("customer");}}><Plus size={14} className="mr-1.5"/>Add Customer</Btn>
        </div>
        <Table cols={[
          {label:"Name",render:r=><span className="font-semibold text-gray-900">{r.name}</span>},
          {label:"Phone",key:"phone"},
          {label:"ID/Passport",key:"idNumber"},
          {label:"License",key:"license"},
          {label:"Balance",render:r=><span className={r.balance>0?"text-red-500 font-semibold":"text-green-600"}>{fmt(r.balance)}</span>},
        ]} data={filtered} onRow={r=>setDetail(r)}/>
      </div>
    );
  };

  // ─── WALK-IN WIZARD ─────────────────────────────────────────
  const WalkInPage = () => {
    const [step, setStep] = useState(1);
    const [custForm, setCustForm] = useState({ name:"", phone:"", email:"", idNumber:"", license:"", emergency:"", nextOfKinName:"", nextOfKinContact:"", notes:"" });
    const [bookForm, setBookForm] = useState({ vehicleId:"", pickup:today, return:"", rate:300, tripType:"Local", deposit:500 });
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});

    const selectedVehicle = vehicles.find(v=>v.id===bookForm.vehicleId);
    const days = bookForm.pickup && bookForm.return
      ? Math.max(1, Math.ceil((new Date(bookForm.return) - new Date(bookForm.pickup))/(1000*60*60*24)))
      : 0;
    const total = days * (bookForm.rate||0);

    const handleConfirm = async () => {
      setSaving(true);
      try {
        // Create customer
        const newCust = await api.createCustomer({...custForm, balance:0});
        const custId = newCust.id || newCust.customer?.id;
        // Create booking
        await api.createBooking({
          customerId: custId,
          customerName: custForm.name,
          vehicleId: bookForm.vehicleId,
          vehicleReg: selectedVehicle?.reg || "",
          pickup: bookForm.pickup,
          return: bookForm.return,
          rate: bookForm.rate,
          tripType: bookForm.tripType,
          deposit: bookForm.deposit,
          total,
          paid: 0,
          status: "Confirmed",
        });
        await loadAll();
        setDone(true);
      } catch (err) {
        alert("Error creating walk-in booking: " + err.message);
      } finally {
        setSaving(false);
      }
    };

    if (done) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
            <CheckCircle2 size={36} className="text-green-600"/>
          </div>
          <h3 className="text-xl font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Walk-in Booking Created!</h3>
          <p className="text-gray-400 text-sm">Customer and booking have been saved successfully.</p>
          <div className="flex gap-3">
            <Btn variant="secondary" onClick={()=>{ setStep(1); setCustForm({name:"",phone:"",email:"",idNumber:"",license:"",emergency:"",nextOfKinName:"",nextOfKinContact:"",notes:""}); setBookForm({vehicleId:"",pickup:today,return:"",rate:300,tripType:"Local",deposit:500}); setDone(false); }}>New Walk-in</Btn>
            <Btn onClick={()=>goTo("bookings")}>View Bookings</Btn>
          </div>
        </div>
      );
    }

    const stepLabels = ["Customer Details","Vehicle & Dates","Review & Confirm"];

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Steps indicator */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-0">
            {stepLabels.map((label, i) => {
              const idx = i + 1;
              const active = step === idx;
              const done = step > idx;
              return (
                <div key={idx} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? "bg-green-500 text-white" : active ? "bg-gradient-to-r from-[#e2725b] to-[#d4a574] text-white" : "bg-gray-100 text-gray-400"}`}>
                      {done ? <Check size={14}/> : idx}
                    </div>
                    <span className={`text-[10px] mt-1 font-semibold whitespace-nowrap ${active ? "text-orange-500" : done ? "text-green-600" : "text-gray-400"}`}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded ${step > idx ? "bg-green-400" : "bg-gray-200"}`}/>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Customer Details */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name">
                <Input value={custForm.name} onChange={e=>{setCustForm({...custForm,name:e.target.value});setErrors(p=>({...p,name:""}));}} placeholder="e.g. Tebogo Mosweu" className={errors.name?"border-red-400":""}/>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </Field>
              <Field label="Phone">
                <Input value={custForm.phone} onChange={e=>{setCustForm({...custForm,phone:e.target.value});setErrors(p=>({...p,phone:""}));}} placeholder="+267 7xxx xxxx" className={errors.phone?"border-red-400":""}/>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </Field>
              <Field label="Email Address"><Input type="email" value={custForm.email} onChange={e=>setCustForm({...custForm,email:e.target.value})} placeholder="e.g. name@email.com"/></Field>
              <Field label="ID / Passport No.">
                <Input value={custForm.idNumber} onChange={e=>{setCustForm({...custForm,idNumber:e.target.value});setErrors(p=>({...p,idNumber:""}));}} className={errors.idNumber?"border-red-400":""}/>
                {errors.idNumber && <p className="text-xs text-red-500 mt-1">{errors.idNumber}</p>}
              </Field>
              <Field label="Driver License No.">
                <Input value={custForm.license} onChange={e=>{setCustForm({...custForm,license:e.target.value});setErrors(p=>({...p,license:""}));}} className={errors.license?"border-red-400":""}/>
                {errors.license && <p className="text-xs text-red-500 mt-1">{errors.license}</p>}
              </Field>
              <Field label="Emergency Contact"><Input value={custForm.emergency} onChange={e=>setCustForm({...custForm,emergency:e.target.value})}/></Field>
              <Field label="Next of Kin Name"><Input value={custForm.nextOfKinName} onChange={e=>setCustForm({...custForm,nextOfKinName:e.target.value})}/></Field>
              <Field label="Next of Kin Contact"><Input value={custForm.nextOfKinContact} onChange={e=>setCustForm({...custForm,nextOfKinContact:e.target.value})}/></Field>
              <div/>
              <div className="col-span-2">
                <Field label="Notes (optional)"><textarea value={custForm.notes} onChange={e=>setCustForm({...custForm,notes:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-16 resize-none"/></Field>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Btn onClick={()=>{
                const e={};
                if (!custForm.name) e.name="Full name is required.";
                if (!custForm.phone) e.phone="Phone is required.";
                if (!custForm.idNumber) e.idNumber="ID/Passport number is required.";
                if (!custForm.license) e.license="Driver license is required.";
                if (Object.keys(e).length>0) { setErrors(e); return; }
                setErrors({});
                setStep(2);
              }}>Next: Vehicle & Dates <ChevronRight size={14} className="ml-1"/></Btn>
            </div>
          </div>
        )}

        {/* Step 2: Vehicle & Dates */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
            <h3 className="font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Vehicle & Dates</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Field label="Select Available Vehicle">
                  <Select
                    options={[{value:"",label:"Choose vehicle..."},...vehicles.filter(v=>v.status==="Available").map(v=>({value:v.id,label:`${v.make} ${v.model} (${v.reg}) — ${v.type}`}))]}
                    value={bookForm.vehicleId}
                    onChange={e=>{setBookForm({...bookForm,vehicleId:e.target.value});setErrors(p=>({...p,vehicleId:""}));}}
                    className={errors.vehicleId?"border-red-400":""}
                  />
                  {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId}</p>}
                </Field>
              </div>
              <Field label="Pickup Date">
                <Input type="date" value={bookForm.pickup} onChange={e=>{setBookForm({...bookForm,pickup:e.target.value});setErrors(p=>({...p,pickup:""}));}} className={errors.pickup?"border-red-400":""}/>
                {errors.pickup && <p className="text-xs text-red-500 mt-1">{errors.pickup}</p>}
              </Field>
              <Field label="Return Date">
                <Input type="date" value={bookForm.return} onChange={e=>{setBookForm({...bookForm,return:e.target.value});setErrors(p=>({...p,returnDate:""}));}} className={errors.returnDate?"border-red-400":""}/>
                {errors.returnDate && <p className="text-xs text-red-500 mt-1">{errors.returnDate}</p>}
              </Field>
              <Field label="Daily Rate (BWP)"><Input type="number" value={bookForm.rate} onChange={e=>setBookForm({...bookForm,rate:parseInt(e.target.value)||0})}/></Field>
              <Field label="Deposit (BWP)"><Input type="number" value={bookForm.deposit} onChange={e=>setBookForm({...bookForm,deposit:parseInt(e.target.value)||0})}/></Field>
              <div className="col-span-2">
                <Field label="Trip Type">
                  <Select options={["Local","Intercity","Cross-border"]} value={bookForm.tripType} onChange={e=>setBookForm({...bookForm,tripType:e.target.value})}/>
                </Field>
              </div>
              {days > 0 && (
                <div className="col-span-2 p-3 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-between">
                  <span className="text-sm text-orange-700">{days} day(s) × {fmt(bookForm.rate)}/day</span>
                  <span className="font-bold text-orange-700">{fmt(total)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-2">
              <Btn variant="secondary" onClick={()=>setStep(1)}>Back</Btn>
              <Btn onClick={()=>{
                const e={};
                if (!bookForm.vehicleId) e.vehicleId="Please select a vehicle.";
                if (!bookForm.pickup) e.pickup="Pickup date is required.";
                if (!bookForm.return) e.returnDate="Return date is required.";
                else if (bookForm.return<=bookForm.pickup) e.returnDate="Return date must be after pickup date.";
                if (Object.keys(e).length>0) { setErrors(e); return; }
                setErrors({});
                setStep(3);
              }}>Next: Review <ChevronRight size={14} className="ml-1"/></Btn>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirm */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
            <h3 className="font-bold text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>Review & Confirm</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Customer</p>
                <div className="grid grid-cols-2 gap-2">
                  {[["Name",custForm.name],["Phone",custForm.phone],["ID No.",custForm.idNumber],["License",custForm.license],["Emergency",custForm.emergency]].map(([l,v])=>v?(
                    <div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-semibold text-gray-800">{v}</p></div>
                  ):null)}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Booking</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ["Vehicle", selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.reg})` : "—"],
                    ["Trip Type", bookForm.tripType],
                    ["Pickup", bookForm.pickup],
                    ["Return", bookForm.return],
                    ["Duration", `${days} day(s)`],
                    ["Daily Rate", fmt(bookForm.rate)],
                    ["Deposit", fmt(bookForm.deposit)],
                    ["Total", fmt(total)],
                  ].map(([l,v])=>(
                    <div key={l}><p className="text-xs text-gray-400">{l}</p><p className="text-sm font-semibold text-gray-800">{v}</p></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Btn variant="secondary" onClick={()=>setStep(2)}>Back</Btn>
              <Btn onClick={handleConfirm} className={saving?"opacity-60 pointer-events-none":""}>
                <CheckCircle2 size={14} className="mr-1.5"/>{saving ? "Saving…" : "Confirm Walk-in Booking"}
              </Btn>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── CHECK-OUT WORKFLOW ─────────────────────────────────────
  const CheckOutPage = () => {
    const activeBookings = bookings.filter(b=>b.status==="Confirmed");
    const [selected, setSelected] = useState(null);
    const [co, setCo] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false,photos:[]});

    const processCheckOut = async () => {
      if (!selected) return;
      try {
        await api.checkout(selected.id, {
          mileage: parseInt(co.mileage) || undefined,
          fuel: co.fuel,
          clean: co.clean,
          damages: co.damages,
          signature: co.signature,
        });
        await loadAll();
        setSelected(null);
        setCo({mileage:"",fuel:"Empty",clean:true,damages:"",signature:false,photos:[]});
      } catch (err) {
        alert("Error processing check-out: " + err.message);
      }
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
                <label className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-dashed border-orange-300 text-sm text-orange-500 cursor-pointer hover:bg-orange-50 transition-colors">
                  <Camera size={16}/>Tap to open camera / upload
                  <input type="file" accept="image/*" capture="environment" multiple className="hidden"
                    onChange={e=>{
                      const files=Array.from(e.target.files);
                      const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f);}));
                      Promise.all(readers).then(urls=>setCo(prev=>({...prev,photos:[...(prev.photos||[]),...urls]})));
                      e.target.value='';
                    }}/>
                </label>
                {co.photos?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {co.photos.map((src,i)=>(
                      <div key={i} className="relative">
                        <img src={src} alt="checkout" className="w-16 h-16 object-cover rounded-lg border border-gray-200"/>
                        <button onClick={()=>setCo(prev=>({...prev,photos:prev.photos.filter((_,idx)=>idx!==i)}))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>
              <div className="sm:col-span-2">
                <Field label="Existing Damages/Notes">
                  <textarea value={co.damages} onChange={e=>setCo({...co,damages:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none" placeholder="Note any scratches, dents, etc."/>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <div className={`p-4 rounded-xl border-2 transition-all ${co.signature ? "border-green-300 bg-green-50/50" : "border-orange-200 bg-orange-50/30"}`}>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Rental Agreement & Signature</p>
                      <p className="text-xs text-gray-400 mt-0.5">{co.signature ? "Contract signed — ready to complete check-out" : "Generate contract for customer to sign before handover"}</p>
                    </div>
                    {co.signature
                      ? <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><CheckCircle2 size={16}/>Signed</span>
                      : <Btn onClick={()=>openContract(selected, co, ()=>setCo(prev=>({...prev,signature:true})))}><PenLine size={14} className="mr-1.5"/>Generate Contract</Btn>
                    }
                  </div>
                </div>
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
    const [ret, setRet] = useState({mileage:"",fuel:"Empty",clean:true,damages:"",smokeFee:false,stainFee:false,mudFee:false,photos:[]});

    const processReturn = async () => {
      if (!selected) return;
      const penalties = [];
      if (!ret.clean) penalties.push({type:"Cleaning Fee",amount:50});
      if (ret.smokeFee) penalties.push({type:"Smoking Fee",amount:200});
      if (ret.stainFee) penalties.push({type:"Stain Fee",amount:150});
      if (ret.mudFee) penalties.push({type:"Mud/Sand Fee",amount:100});
      try {
        await api.processReturn(selected.id, {
          mileage: parseInt(ret.mileage) || undefined,
          fuel: ret.fuel,
          clean: ret.clean,
          damages: ret.damages,
          penalties,
        });
        await loadAll();
        setSelected(null);
        setRet({mileage:"",fuel:"Empty",clean:true,damages:"",smokeFee:false,stainFee:false,mudFee:false,photos:[]});
        if (detail) setDetail(null);
      } catch (err) {
        alert("Error processing return: " + err.message);
      }
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
                <label className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl border border-dashed border-orange-300 text-sm text-orange-500 cursor-pointer hover:bg-orange-50 transition-colors">
                  <Camera size={16}/>Tap to open camera / upload
                  <input type="file" accept="image/*" capture="environment" multiple className="hidden"
                    onChange={e=>{
                      const files=Array.from(e.target.files);
                      const readers=files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f);}));
                      Promise.all(readers).then(urls=>setRet(prev=>({...prev,photos:[...(prev.photos||[]),...urls]})));
                      e.target.value='';
                    }}/>
                </label>
                {ret.photos?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ret.photos.map((src,i)=>(
                      <div key={i} className="relative">
                        <img src={src} alt="return" className="w-16 h-16 object-cover rounded-lg border border-gray-200"/>
                        <button onClick={()=>setRet(prev=>({...prev,photos:prev.photos.filter((_,idx)=>idx!==i)}))}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none">×</button>
                      </div>
                    ))}
                  </div>
                )}
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
    const [inspections, setInspections] = useState(areas.map(a=>({area:a,condition:"Good",severity:"None",notes:"",photos:[]})));
    const [saving, setSaving] = useState(false);

    const saveInspection = async () => {
      if (!selectedVehicle) return;
      setSaving(true);
      try {
        await api.createInspection({
          vehicleId: selectedVehicle,
          date: today,
          items: inspections,
        });
        alert("Inspection saved successfully.");
        setSelectedVehicle("");
        setInspections(areas.map(a=>({area:a,condition:"Good",severity:"None",notes:"",photos:[]})));
      } catch (err) {
        alert("Error saving inspection: " + err.message);
      } finally {
        setSaving(false);
      }
    };

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
                    <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-orange-300 text-xs text-orange-500 cursor-pointer hover:bg-orange-50 transition-colors whitespace-nowrap">
                      <Camera size={14}/>Photo
                      <input type="file" accept="image/*" capture="environment" multiple className="hidden"
                        onChange={e=>{
                          const files = Array.from(e.target.files);
                          const readers = files.map(f=>new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(f);}));
                          Promise.all(readers).then(urls=>{const u=[...inspections];u[i]={...u[i],photos:[...(u[i].photos||[]),...urls]};setInspections(u);});
                          e.target.value='';
                        }}/>
                    </label>
                  </div>
                  {insp.photos?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {insp.photos.map((src,pi)=>(
                        <div key={pi} className="relative">
                          <img src={src} alt="inspection" className="w-16 h-16 object-cover rounded-lg border border-gray-200"/>
                          <button onClick={()=>{const u=[...inspections];u[i]={...u[i],photos:u[i].photos.filter((_,idx)=>idx!==pi)};setInspections(u);}}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center leading-none">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Btn onClick={saveInspection} className={saving?"opacity-60 pointer-events-none":""}>
                <CheckCircle2 size={14} className="mr-1.5"/>{saving ? "Saving…" : "Save Inspection"}
              </Btn>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── PAYMENTS ───────────────────────────────────────────────
  const PaymentsPage = () => {
    const filtered = payments.filter(p => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [p.id,p.customerName,p.bookingId,p.type].some(f=>(f||"").toLowerCase().includes(q));
    });

    const totalCollected = payments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0);
    const pendingAmt = bookings.filter(b=>b.status==="Active").reduce((s,b)=>s+Math.max(0,(b.total||0)-(b.paid||0)),0);
    const cleaningFees = payments.filter(p=>p.type&&(p.type.includes("Fee")||p.type.includes("Cleaning"))).reduce((s,p)=>s+p.amount,0);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard icon={DollarSign} label="Collected" value={fmt(totalCollected)} color="#16a34a"/>
          <StatCard icon={Clock} label="Pending" value={fmt(pendingAmt)} color="#f59e0b"/>
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
          {label:"",render:r=>(
            <button onClick={e=>{e.stopPropagation();printReceipt(r);}}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-orange-500 hover:bg-orange-50 border border-orange-200 transition-colors">
              <Printer size={13}/>Receipt
            </button>
          )},
        ]} data={filtered}/>
      </div>
    );
  };

  // ─── MAINTENANCE ────────────────────────────────────────────
  const MaintenancePage = () => {
    const motExpiring = vehicles.filter(v=>v.status!=="Sold"&&v.motExpiry&&v.motExpiry<=today);

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
      </div>
    );
  };

  // ─── REPORTS ────────────────────────────────────────────────
  const ReportsPage = () => {
    const [reportMonth, setReportMonth] = useState(today.slice(0,7));
    const filteredPayments = payments.filter(p=>p.date?.startsWith(reportMonth));
    const totalRev = filteredPayments.filter(p=>p.status==="Completed").reduce((s,p)=>s+p.amount,0);
    const maintCost = maintenance.reduce((s,m)=>s+(m.cost||0),0);
    const activeVeh = vehicles.filter(v=>v.status!=="Sold").length;
    const rentedNow = vehicles.filter(v=>v.status==="Rented").length;
    const util = activeVeh>0?Math.round((rentedNow/activeVeh)*100):0;
    const cleanFees = filteredPayments.filter(p=>["Cleaning Fee","Smoking Fee","Stain Fee","Mud/Sand Fee"].includes(p.type)).reduce((s,p)=>s+p.amount,0);

    const revPerVehicle = vehicles.filter(v=>v.status!=="Sold").map(v=>{
      const vBookings = bookings.filter(b=>b.vehicleId===v.id);
      const rev = vBookings.reduce((s,b)=>s+(b.total||0),0);
      return {name:`${v.make} ${v.model}`.substring(0,12), revenue:rev};
    }).sort((a,b)=>b.revenue-a.revenue).slice(0,8);

    const maintPerVehicle = vehicles.filter(v=>v.status!=="Sold").map(v=>{
      const cost = maintenance.filter(m=>m.vehicleId===v.id).reduce((s,m)=>s+(m.cost||0),0);
      return {name:`${v.make[0]}. ${v.model}`, cost};
    }).filter(v=>v.cost>0).sort((a,b)=>b.cost-a.cost);

    const statusDist = [
      {name:"Available",value:vehicles.filter(v=>v.status==="Available").length,color:"#16a34a"},
      {name:"Rented",value:vehicles.filter(v=>v.status==="Rented").length,color:"#2563eb"},
      {name:"Other",value:vehicles.filter(v=>!["Available","Rented","Sold"].includes(v.status)).length,color:"#f59e0b"},
    ].filter(d=>d.value>0);

    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-600">Month:</label>
            <input type="month" value={reportMonth} onChange={e=>setReportMonth(e.target.value)}
              className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"/>
            <button onClick={()=>setReportMonth(today.slice(0,7))} className="text-xs text-orange-500 hover:underline">Reset</button>
          </div>
          <button onClick={()=>printMonthlyReport(reportMonth,filteredPayments,totalRev,maintCost,util)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-200 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors">
            <Printer size={15}/>Print Monthly Report
          </button>
        </div>
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

        {/* Monthly Payments Breakdown */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-gray-900" style={{fontFamily:"'Outfit', sans-serif"}}>
              Payment Transactions — {reportMonth} ({filteredPayments.length} records)
            </h3>
            <button onClick={()=>printMonthlyReport(reportMonth,filteredPayments,totalRev,maintCost,util)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-orange-500 hover:bg-orange-50 border border-orange-200 transition-colors">
              <Printer size={13}/>Print
            </button>
          </div>
          {filteredPayments.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">No payments recorded for {reportMonth}</div>
          ) : (
            <Table cols={[
              {label:"ID",render:r=><span className="font-mono text-xs">{r.id}</span>},
              {label:"Date",key:"date"},
              {label:"Customer",key:"customerName"},
              {label:"Booking",key:"bookingId"},
              {label:"Type",key:"type"},
              {label:"Method",key:"method"},
              {label:"Amount",render:r=><span className="font-bold text-gray-900">{fmt(r.amount)}</span>},
              {label:"Status",render:r=>statusBadge(r.status)},
              {label:"",render:r=>(
                <button onClick={e=>{e.stopPropagation();printReceipt(r);}}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-orange-500 hover:bg-orange-50 border border-orange-200 transition-colors">
                  <Printer size={12}/>Receipt
                </button>
              )},
            ]} data={filteredPayments}/>
          )}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm text-gray-500">{filteredPayments.length} transactions</span>
            <span className="text-base font-bold text-gray-900">Total: <span style={{color:"#e2725b"}}>{fmt(totalRev)}</span></span>
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
    const [bizName, setBizName] = useState(localStorage.getItem('vg_company_name')||'Viel Glück Car Hire');
    const [defaultRate, setDefaultRate] = useState(localStorage.getItem('vg_default_rate')||'300');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
      localStorage.setItem('vg_company_name', bizName);
      localStorage.setItem('vg_default_rate', defaultRate);
      setSaved(true);
      setTimeout(()=>setSaved(false), 2000);
    };

    return (
      <div className="space-y-6">
        {saved && <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg z-50">✓ Settings saved</div>}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-xl">
          <h3 className="font-bold text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>Business Settings</h3>
          <div className="space-y-4">
            <Field label="Company Name"><Input value={bizName} onChange={e=>setBizName(e.target.value)}/></Field>
            <Field label="Default Daily Rate (BWP)"><Input type="number" value={defaultRate} onChange={e=>setDefaultRate(e.target.value)}/></Field>
            <Field label="Late Return Grace Period (hours)"><Input type="number" value={gracePeriod} onChange={e=>setGracePeriod(e.target.value)}/></Field>
            <Field label="Late Return Fee (BWP/day)"><Input type="number" value={lateRate} onChange={e=>setLateRate(e.target.value)}/></Field>
            <Field label="Dirty Vehicle Fee (BWP)"><Input type="number" value={cleaningFee} onChange={e=>setCleaningFee(e.target.value)}/></Field>
            <div className="pt-3 border-t border-gray-100"><Btn onClick={handleSave}>Save Settings</Btn></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 max-w-xl">
          <h3 className="font-bold text-gray-900 mb-4" style={{fontFamily:"'Outfit', sans-serif"}}>User Roles</h3>
          <div className="space-y-3">
            {[{name:"Admin",desc:"Full access to all modules"},{name:"Operations",desc:"Bookings, check-out, returns, inspections"},{name:"Finance",desc:"Payments, invoicing, reports"}].map(r=>(
              <div key={r.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/60">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{background:"linear-gradient(135deg,#e2725b,#d4a574)"}}>{r.name[0]}</div>
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
    walkin: WalkInPage,
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
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden pb-20 lg:pb-0">
            <PageComponent/>
          </main>
        </div>
        {/* ── MODALS rendered at App level so inputs never lose focus ── */}
        {modal==="vehicle" && form && (
          <Modal title={form.id?"Edit Vehicle":"New Vehicle"} wide onClose={()=>setModal(null)}>
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
                <Btn onClick={saveVehicle}>{form.id?"Update":"Add"} Vehicle</Btn>
              </div>
            </div>
          </Modal>
        )}
        {modal==="booking" && form && (
          <Modal title={form.id?"Edit Booking":"New Booking"} wide onClose={()=>setModal(null)}>
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
                <Btn onClick={saveBooking}>{form.id?"Update":"Create"} Booking</Btn>
              </div>
            </div>
          </Modal>
        )}
        {modal==="customer" && form && (
          <Modal title={form.id?"Edit Customer":"New Customer"} onClose={()=>setModal(null)}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name"><Input value={form.name||""} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
              <Field label="Phone"><Input value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})}/></Field>
              <Field label="Email Address"><Input type="email" value={form.email||""} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
              <Field label="ID/Passport No."><Input value={form.idNumber||""} onChange={e=>setForm({...form,idNumber:e.target.value})}/></Field>
              <Field label="License No."><Input value={form.license||""} onChange={e=>setForm({...form,license:e.target.value})}/></Field>
              <Field label="Emergency Contact"><Input value={form.emergency||""} onChange={e=>setForm({...form,emergency:e.target.value})}/></Field>
              <Field label="Next of Kin Name"><Input value={form.nextOfKinName||""} onChange={e=>setForm({...form,nextOfKinName:e.target.value})}/></Field>
              <Field label="Next of Kin Contact"><Input value={form.nextOfKinContact||""} onChange={e=>setForm({...form,nextOfKinContact:e.target.value})}/></Field>
              <div className="col-span-2">
                <Field label="Notes"><textarea value={form.notes||""} onChange={e=>setForm({...form,notes:e.target.value})} className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 h-20 resize-none"/></Field>
              </div>
              <div className="col-span-2 flex justify-end gap-3 pt-3 border-t border-gray-100">
                <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
                <Btn onClick={saveCustomer}>{form.id?"Update":"Add"} Customer</Btn>
              </div>
            </div>
          </Modal>
        )}
        {modal==="payment" && form && (
          <Modal title="Record Payment" onClose={()=>setModal(null)}>
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
          </Modal>
        )}
        {modal==="maint" && form && (
          <Modal title={form.id?"Edit Maintenance":"New Maintenance"} wide onClose={()=>setModal(null)}>
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
                <Btn onClick={saveMaint}>{form.id?"Update":"Add"} Record</Btn>
              </div>
            </div>
          </Modal>
        )}

        {/* ── CONTRACT MODAL ── */}
        {contractData && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto p-3 sm:p-6">
            <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl my-4">
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#e2725b,#d4a574)",boxShadow:"0 4px 12px rgba(226,114,91,0.3)"}}>
                      <FileText size={18} color="#fff"/>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900" style={{fontFamily:"'Outfit',sans-serif"}}>Rental Agreement</h2>
                      <p className="text-xs text-gray-400">{contractData.booking?.id} · {today}</p>
                    </div>
                  </div>
                </div>
                <button onClick={()=>setContractData(null)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={18} className="text-gray-400"/></button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
                {/* Renter */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Renter Information</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["Full Name", contractData.customer?.name],
                      ["Phone", contractData.customer?.phone],
                      ["Email", contractData.customer?.email],
                      ["ID / Passport", contractData.customer?.idNumber],
                      ["Driver License", contractData.customer?.license],
                      ["Emergency Contact", contractData.customer?.emergency],
                      ["Next of Kin", contractData.customer?.nextOfKinName],
                      ["Next of Kin Contact", contractData.customer?.nextOfKinContact],
                    ].map(([l,v])=>(
                      <div key={l} className="bg-gray-50/70 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{l}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{v||'—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vehicle */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Vehicle Details</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["Vehicle", `${contractData.vehicle?.make||''} ${contractData.vehicle?.model||''} ${contractData.vehicle?.year||''}`],
                      ["Registration", contractData.vehicle?.reg],
                      ["Color", contractData.vehicle?.color],
                      ["VIN", contractData.vehicle?.vin],
                      ["Odometer at Pick-up", `${contractData.inspection?.mileage||'—'} km`],
                      ["Fuel Level", contractData.inspection?.fuel||'—'],
                    ].map(([l,v])=>(
                      <div key={l} className="bg-gray-50/70 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{l}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{v||'—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rental Terms */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Rental Terms</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      ["Pick-up Date", contractData.booking?.pickup],
                      ["Return Date", contractData.booking?.returnDate||contractData.booking?.return],
                      ["Trip Type", contractData.booking?.tripType||'Local'],
                      ["Daily Rate", fmt(contractData.booking?.rate)],
                      ["Total Amount", fmt(contractData.booking?.total)],
                      ["Deposit", fmt(contractData.booking?.deposit)],
                    ].map(([l,v])=>(
                      <div key={l} className="bg-gray-50/70 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">{l}</p>
                        <p className="text-sm font-semibold text-gray-800 mt-0.5">{v||'—'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Inspection Notes */}
                {contractData.inspection?.damages && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">Pre-Rental Inspection Notes</p>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">{contractData.inspection.damages}</div>
                  </div>
                )}

                {/* Terms */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Terms & Conditions</p>
                  <div className="bg-gray-50/70 rounded-xl p-4 text-xs text-gray-600 space-y-2 leading-relaxed">
                    {[
                      "The renter is responsible for the vehicle during the rental period and must return it in the same condition.",
                      "Any damage not noted at pick-up will be charged to the renter at full repair cost.",
                      "The renter must hold a valid driver's license for the entire rental period.",
                      "Smoking, pets, and off-road driving are strictly prohibited without prior written consent.",
                      "The renter is liable for all traffic fines and parking violations incurred during the rental.",
                      "Fuel must be returned at the same level as pick-up or a refuelling fee applies.",
                      "Late returns will be charged at the daily rate plus a late fee of BWP 150 per day.",
                      "The vehicle must not cross into neighbouring countries without prior written authorisation from Viel Glück Car Hire.",
                      "Viel Glück Car Hire reserves the right to recover the vehicle if any terms are breached.",
                      "By signing, the renter confirms they have read, understood, and agree to all terms above.",
                    ].map((t,i)=>(
                      <div key={i} className="flex gap-2"><span className="text-orange-400 font-bold shrink-0">{i+1}.</span><span>{t}</span></div>
                    ))}
                  </div>
                </div>

                {/* Signatures */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Signatures</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <SignaturePad label={`Customer — ${contractData.customer?.name||''}`} value={customerSig} onChange={setCustomerSig}/>
                    <SignaturePad label={`Agent — ${activeUser?.name||'Staff'}`} value={agentSig} onChange={setAgentSig}/>
                  </div>
                </div>
              </div>

              {/* Footer actions */}
              <div className="p-5 border-t border-gray-100 flex flex-wrap gap-3 justify-between items-center">
                <button onClick={printContract} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  <Printer size={15}/>Print / Save PDF
                </button>
                <div className="flex gap-3">
                  <button onClick={()=>setContractData(null)} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors">Cancel</button>
                  <button
                    disabled={!customerSig || !agentSig}
                    onClick={()=>{
                      if(contractData._onSigned) contractData._onSigned();
                      setContractData(null);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${customerSig&&agentSig?"shadow-lg hover:opacity-90":"opacity-40 cursor-not-allowed"}`}
                    style={{background:"linear-gradient(135deg,#e2725b,#d4a574)"}}>
                    <CheckCircle2 size={14} className="inline mr-1.5"/>Confirm & Sign Contract
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom tab bar — mobile only */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 flex items-stretch pb-safe">
          {[
            {id:"dashboard",label:"Home",icon:Home},
            {id:"bookings",label:"Bookings",icon:Calendar},
            {id:"walkin",label:"Walk-in",icon:UserCheck},
            {id:"payments",label:"Payments",icon:CreditCard},
            {id:"reports",label:"Reports",icon:BarChart3},
            {id:"more",label:"More",icon:Menu},
          ].map(tab=>{
            const Icon=tab.icon;
            const active=page===tab.id;
            return (
              <button key={tab.id} onClick={()=>tab.id==="more"?setSidebarOpen(true):goTo(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-all relative">
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{background:"linear-gradient(90deg,#e2725b,#d4a574)"}}/>}
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all ${active?"shadow-md":""}`}
                  style={active?{background:"linear-gradient(135deg,#e2725b 0%,#d4a574 100%)",boxShadow:"0 4px 12px rgba(226,114,91,0.35)"}:{}}>
                  <Icon size={18} color={active?"#fff":"#9ca3af"} strokeWidth={active?2.5:2}/>
                </div>
                <span className="text-[10px] font-semibold" style={{color:active?"#e2725b":"#9ca3af"}}>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
