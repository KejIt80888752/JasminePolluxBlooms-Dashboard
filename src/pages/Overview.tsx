import { IndianRupee, FileText, Users, CalendarCheck, AlertTriangle, CheckCircle2, ArrowUpRight, Flower2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import flowerData from '../data/flowerData.json';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const { stats, topClients: topClientsRaw, invoices: recentInvoices } = flowerData;

const revenueData = [
  { m:'Jul', revenue:380000, events:120000 },
  { m:'Aug', revenue:420000, events:140000 },
  { m:'Sep', revenue:395000, events:130000 },
  { m:'Oct', revenue:520000, events:210000 },
  { m:'Nov', revenue:610000, events:260000 },
  { m:'Dec', revenue:720000, events:340000 },
  { m:'Jan', revenue:480000, events:160000 },
  { m:'Feb', revenue:560000, events:220000 },
  { m:'Mar', revenue:640000, events:280000 },
  { m:'Apr', revenue:590000, events:240000 },
  { m:'May', revenue:670000, events:300000 },
  { m:'Jun', revenue:685000, events:310000 },
];

const topClients = topClientsRaw.map(c => ({ name: c.name, value: c.value }));

const statusMap: Record<string,string> = { Paid:'Completed', Unpaid:'Pending', Overdue:'Pending' };
const recentActivity = recentInvoices.slice(0,5).map(i => ({
  name: i.client, date: i.date, status: statusMap[i.status] ?? 'Pending'
}));

const alerts = [
  { msg:`${stats.overdueCount} invoices overdue — ₹${(stats.outstanding/1000).toFixed(0)}K pending`, warn:true },
  { msg:`${stats.totalQuotations} quotations — ₹${(stats.quotationValue/100000).toFixed(1)}L total value`, warn:false },
  { msg:`${stats.totalClients} active clients in CRM`, warn:false },
  { msg:`Total revenue: ₹${(stats.totalRevenue/100000).toFixed(1)}L this year`, warn:false },
];

const STATS = [
  { label:'Total Clients',  val:stats.totalClients.toString(),  sub:'Active customers',    icon:Users,        color:'text-pink-600',   bg:'bg-pink-50'   },
  { label:'Total Invoices', val:stats.totalInvoices.toString(), sub:`${stats.overdueCount} overdue`, icon:FileText, color:'text-red-500', bg:'bg-red-50' },
  { label:'Outstanding',    val:`₹${(stats.outstanding/1000).toFixed(0)}K`, sub:'Pending collection', icon:CalendarCheck, color:'text-orange-500', bg:'bg-orange-50' },
  { label:'Total Revenue',  val:`₹${(stats.totalRevenue/100000).toFixed(1)}L`, sub:'This financial year', icon:IndianRupee, color:'text-green-500', bg:'bg-green-50' },
];

const statusBadge: Record<string,string> = { Completed:'badge-green', Pending:'badge-yellow' };
const tipStyle = { backgroundColor:'#fff', border:'1px solid #e5e7eb', borderRadius:8, fontSize:12, color:'#374151' };

export default function Overview() {
  return (
    <div className="space-y-5 page-enter">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`p-2.5 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}><s.icon size={18} /></div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{s.val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div><p className="section-title text-base">Monthly Revenue & Event Bookings</p><p className="section-sub">FY 2025–26</p></div>
            <span className="badge badge-brand">FY 2025-26</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#be185d" stopOpacity={0.15}/><stop offset="95%" stopColor="#be185d" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="evGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="m" tick={{ fontSize:11, fill:'#6b7280' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:11, fill:'#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={tipStyle} formatter={(v)=>[fmt(Number(v))]}/>
              <Area type="monotone" dataKey="revenue" name="Revenue"        stroke="#be185d" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r:3, fill:'#be185d', strokeWidth:0 }}/>
              <Area type="monotone" dataKey="events"  name="Event Bookings" stroke="#16a34a" strokeWidth={2}   fill="url(#evGrad)" dot={{ r:3, fill:'#16a34a', strokeWidth:0 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-5">
          <p className="section-title text-base mb-1">Order Breakdown</p>
          <p className="section-sub mb-4">By category</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={[{name:'Weddings',v:320000},{name:'Bouquets',v:98000},{name:'Garlands',v:64000},{name:'Decor',v:186000}]} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="name" tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10, fill:'#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}K`}/>
              <Tooltip contentStyle={tipStyle} formatter={(v)=>[fmt(Number(v)),'Amount']}/>
              <Bar dataKey="v" fill="#be185d" radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card p-5 xl:col-span-2">
          <p className="section-title text-base mb-4">Top Clients by Revenue</p>
          <div className="space-y-3.5">
            {topClients.map((c,i)=>{
              const pct=Math.round((c.value/topClients[0].value)*100);
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600"><span className="text-gray-400 mr-2 font-mono text-xs">{String(i+1).padStart(2,'0')}</span>{c.name}</span>
                    <span className="text-brand font-semibold text-sm">{fmt(c.value)}</span>
                  </div>
                  <div className="prog-bar"><div className="prog-fill bg-brand" style={{ width:`${pct}%` }}/></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <p className="section-title text-sm mb-3">Alerts</p>
            <ul className="space-y-2.5">
              {alerts.map((a,i)=>(
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  {a.warn?<AlertTriangle size={13} className="text-yellow-500 mt-0.5 shrink-0"/>:<CheckCircle2 size={13} className="text-green-400 mt-0.5 shrink-0"/>}
                  {a.msg}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title text-sm">Recent Activity</p>
              <span className="text-xs text-brand flex items-center gap-0.5 cursor-pointer">View all <ArrowUpRight size={11}/></span>
            </div>
            <div className="space-y-2.5">
              {recentActivity.map(a=>(
                <div key={a.name} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-pink-50 border border-pink-100 flex items-center justify-center text-brand text-xs font-bold shrink-0">{a.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{a.name}</p>
                    <p className="text-[10px] text-gray-400">{a.date}</p>
                  </div>
                  <span className={`badge ${statusBadge[a.status]??'badge-gray'}`}>{a.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Event Based Report */}
      <div className="card mt-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="section-title text-sm flex items-center gap-2"><Flower2 size={14} color="#be185d"/> Event Based Report</span>
          <span className="text-xs text-brand flex items-center gap-0.5 cursor-pointer">View all <ArrowUpRight size={11}/></span>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th>Event</th>
                <th>Client</th>
                <th>Type</th>
                <th>Order Value</th>
                <th>Billed</th>
                <th>Received</th>
                <th>Pending</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { project:'Ramesh & Anjali Wedding', client:'The Grand Wedding Co.', type:'Stage + Mandap Decor', boq:'₹1,25,000', billed:'₹1,25,000', received:'₹80,000', pending:'₹45,000', status:'In Progress' },
                { project:'Corporate Annual Meet', client:'Lakeview Banquet Hall', type:'Table Centerpieces', boq:'₹68,000', billed:'₹68,000', received:'₹68,000', pending:'—', status:'Completed' },
                { project:'Fortnightly Supply', client:'Misty Blooms', type:'Bulk Anthurium Supply', boq:'₹6,560', billed:'₹6,560', received:'₹6,560', pending:'—', status:'Completed' },
                { project:'Temple Festival Decor', client:'Sri Krishna Events', type:'Garlands + Flowers', boq:'₹31,200', billed:'₹31,200', received:'₹0', pending:'₹31,200', status:'In Progress' },
                { project:'Housewarming', client:'Orchid Decorators', type:'Entrance Decor', boq:'₹22,800', billed:'₹22,800', received:'₹22,800', pending:'—', status:'Completed' },
              ].map((p,i)=>(
                <tr key={i}>
                  <td><strong className="text-xs">{p.project}</strong></td>
                  <td className="text-xs">{p.client}</td>
                  <td><span className="badge badge-gray text-[10px]">{p.type}</span></td>
                  <td style={{fontWeight:700, color:'var(--blue)'}}>{p.boq}</td>
                  <td style={{fontWeight:600}}>{p.billed}</td>
                  <td style={{fontWeight:700, color:'var(--green)'}}>{p.received}</td>
                  <td style={{fontWeight:700, color: p.pending==='—'?'var(--muted)':'var(--orange)'}}>{p.pending}</td>
                  <td><span className={`badge ${p.status==='Completed'?'badge-green':'badge-yellow'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
