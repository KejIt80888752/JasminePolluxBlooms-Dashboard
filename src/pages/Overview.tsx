import { IndianRupee, FileText, Users, CalendarCheck, Inbox } from 'lucide-react';
import flowerData from '../data/flowerData.json';

const { stats } = flowerData;

const STATS = [
  { label:'Total Clients',  val:stats.totalClients.toString(),  sub:'Active customers',    icon:Users,        color:'text-pink-600',   bg:'bg-pink-50'   },
  { label:'Total Invoices', val:stats.totalInvoices.toString(), sub:`${stats.overdueCount} overdue`, icon:FileText, color:'text-red-500', bg:'bg-red-50' },
  { label:'Outstanding',    val:`₹${stats.outstanding.toLocaleString('en-IN')}`, sub:'Pending collection', icon:CalendarCheck, color:'text-orange-500', bg:'bg-orange-50' },
  { label:'Total Revenue',  val:`₹${stats.totalRevenue.toLocaleString('en-IN')}`, sub:'This financial year', icon:IndianRupee, color:'text-green-500', bg:'bg-green-50' },
];

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

      <div className="card p-10 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center mb-4">
          <Inbox size={26} color="#be185d"/>
        </div>
        <p className="section-title text-base mb-1">No activity yet</p>
        <p className="section-sub max-w-md">
          Charts and reports will appear here once you start adding invoices, quotations, and leads.
          Use the sidebar to create your first Billing entry, Quotation, or Lead.
        </p>
      </div>
    </div>
  );
}
