import { useState, useEffect } from 'react';
import { Plus, UserPlus, Phone, Handshake } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Lead { id:string; name:string; company:string; phone:string; source:string; interest:string; date:string; status:string; }

const sc: Record<string, string> = { New:'badge-blue', Contacted:'badge-yellow', Converted:'badge-green' };
const EMPTY = { name:'', company:'', phone:'', email:'', source:'Walk-in', interest:'Wedding Decor', notes:'' };

export default function Leads() {
  const [data, setData] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const refresh = async () => {
    const { data: rows, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
    if (!error && rows) setData((rows as any[]).map(r => ({
      id:r.id, name:r.name ?? '', company:r.company ?? '', phone:r.phone ?? '',
      source:r.source ?? '', interest:r.interest ?? '', date:r.date ?? '', status:r.status ?? 'New',
    })));
  };

  useEffect(() => { refresh(); }, []);

  const newCount = data.filter(d=>d.status==='New').length;
  const contactedCount = data.filter(d=>d.status==='Contacted').length;
  const convertedCount = data.filter(d=>d.status==='Converted').length;

  const handleAdd = async () => {
    if (!form.name) { alert('Enter lead name'); return; }
    const { error } = await supabase.from('leads').insert({
      name: form.name, company: form.company, phone: form.phone, source: form.source, interest: form.interest,
      date: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}), status: 'New',
    });
    if (error) { alert(`Could not save lead: ${error.message}`); return; }
    await refresh();
    setOpen(false); setForm(EMPTY);
  };

  return (
    <div className="page-enter">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(37,99,235,.1)' }}><UserPlus size={18} color="#2563eb"/></div><div><div className="text-xs text-gray-400 font-medium">New Leads</div><div className="text-xl font-bold text-gray-800 mt-0.5">{newCount}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(245,158,11,.1)' }}><Phone size={18} color="#f59e0b"/></div><div><div className="text-xs text-gray-400 font-medium">Contacted</div><div className="text-xl font-bold text-gray-800 mt-0.5">{contactedCount}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(22,163,74,.1)' }}><Handshake size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Converted</div><div className="text-xl font-bold text-gray-800 mt-0.5">{convertedCount}</div></div></div>
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
              {data.length === 0 && (
                <tr><td colSpan={8} style={{textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13}}>No leads yet — click "Add Lead" to create one.</td></tr>
              )}
              {data.map((r, i) => (
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
                <div className="form-field"><label className="form-label">Name</label><input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Company</label><input className="inp" value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))}/></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Phone</label><input className="inp" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Email</label><input className="inp" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Source</label><select className="sel" value={form.source} onChange={e=>setForm(f=>({...f,source:e.target.value}))}>{['Walk-in','Online','Referral','Cold Call'].map(s=><option key={s}>{s}</option>)}</select></div>
                <div className="form-field"><label className="form-label">Interest</label><select className="sel" value={form.interest} onChange={e=>setForm(f=>({...f,interest:e.target.value}))}>{['Wedding Decor','Bouquets','Garlands','Event Setup','Bulk Flower Supply'].map(i=><option key={i}>{i}</option>)}</select></div>
              </div>
              <div className="form-field"><label className="form-label">Notes</label><textarea className="inp" style={{ minHeight:'72px', resize:'vertical' }} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleAdd}>Add Lead</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
