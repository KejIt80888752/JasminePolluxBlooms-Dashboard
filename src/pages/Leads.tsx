import { useState } from 'react';
import { Plus, UserPlus, Phone, Handshake } from 'lucide-react';

const DATA = [
  { name:'Ramesh Gowda', company:'The Grand Wedding Co.', phone:'98432 11234', source:'Referral', interest:'Wedding Decor', date:'22 Jun 2026', status:'New' },
  { name:'Anjali Rao', company:'Lakeview Banquet Hall', phone:'97654 32109', source:'Online', interest:'Table Centerpieces', date:'21 Jun 2026', status:'Contacted' },
  { name:'Suresh Kumar', company:'Sri Krishna Events', phone:'98765 43210', source:'Walk-in', interest:'Garlands', date:'20 Jun 2026', status:'Converted' },
  { name:'Deepa Nair', company:'Green Garden Resort', phone:'96543 21098', source:'Cold Call', interest:'Bouquets', date:'18 Jun 2026', status:'Contacted' },
  { name:'Manoj Shetty', company:'New Horizon Convention', phone:'95432 10987', source:'Online', interest:'Stage Decor', date:'17 Jun 2026', status:'New' },
  { name:'Kavya Reddy', company:'Orchid Decorators', phone:'94321 09876', source:'Referral', interest:'Bulk Flower Supply', date:'15 Jun 2026', status:'Converted' },
];

const sc: Record<string, string> = { New:'badge-blue', Contacted:'badge-yellow', Converted:'badge-green' };

export default function Leads() {
  const [open, setOpen] = useState(false);

  return (
    <div className="page-enter">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(37,99,235,.1)' }}><UserPlus size={18} color="#2563eb"/></div><div><div className="text-xs text-gray-400 font-medium">New Leads</div><div className="text-xl font-bold text-gray-800 mt-0.5">18</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(245,158,11,.1)' }}><Phone size={18} color="#f59e0b"/></div><div><div className="text-xs text-gray-400 font-medium">Contacted</div><div className="text-xl font-bold text-gray-800 mt-0.5">14</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(22,163,74,.1)' }}><Handshake size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Converted</div><div className="text-xl font-bold text-gray-800 mt-0.5">9</div></div></div>
      </div>

      <div className="filter-bar mb-5">
        <button className="btn-brand" onClick={() => setOpen(true)}><Plus size={14} /> Add Lead</button>
        <select className="sel"><option>All Status</option><option>New</option><option>Contacted</option><option>Converted</option></select>
        <select className="sel"><option>All Sources</option><option>Walk-in</option><option>Online</option><option>Referral</option><option>Cold Call</option></select>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Name</th><th>Company</th><th>Phone</th><th>Source</th><th>Interest</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {DATA.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.company}</td>
                  <td>{r.phone}</td>
                  <td><span className="badge badge-gray">{r.source}</span></td>
                  <td>{r.interest}</td>
                  <td>{r.date}</td>
                  <td><span className={`badge ${sc[r.status]}`}>{r.status}</span></td>
                  <td><button className="btn-outline btn-sm">Follow Up</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div className="modal-title">Add Lead</div><button className="text-gray-400 hover:text-gray-700 cursor-pointer text-lg p-1" onClick={() => setOpen(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-field"><label className="form-label">Name</label><input className="inp" /></div>
                <div className="form-field"><label className="form-label">Company</label><input className="inp" /></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Phone</label><input className="inp" /></div>
                <div className="form-field"><label className="form-label">Email</label><input className="inp" type="email" /></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Source</label><select className="sel"><option>Walk-in</option><option>Online</option><option>Referral</option><option>Cold Call</option></select></div>
                <div className="form-field"><label className="form-label">Interest</label><select className="sel"><option>Wedding Decor</option><option>Bouquets</option><option>Garlands</option><option>Event Setup</option><option>Bulk Flower Supply</option></select></div>
              </div>
              <div className="form-field"><label className="form-label">Notes</label><textarea className="inp" style={{ minHeight:'72px', resize:'vertical' }} /></div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={() => setOpen(false)}>Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
