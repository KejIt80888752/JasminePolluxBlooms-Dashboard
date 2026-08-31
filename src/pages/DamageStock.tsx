import { useState } from 'react';
import { Plus, AlertOctagon, X } from 'lucide-react';
import { LOCATIONS } from '../contexts/InventoryContext';

interface Damage {
  id: number;
  code: string;
  name: string;
  qty: number;
  receivedDate: string;
  transferDate: string;
  location: string;
  remarks: string;
}

const INITIAL: Damage[] = [];

const EMPTY = { code:'', name:'', qty:'', receivedDate:'', transferDate:'', location:LOCATIONS[0], remarks:'' };

export default function DamageStock() {
  const [data, setData] = useState<Damage[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string,string>>(EMPTY);

  const handleAdd = () => {
    if (!form.code || !form.name) { alert('Enter Code and Name'); return; }
    setData(prev => [...prev, { id:Date.now(), code:form.code, name:form.name, qty:parseInt(form.qty)||0, receivedDate:form.receivedDate, transferDate:form.transferDate, location:form.location, remarks:form.remarks }]);
    setOpen(false); setForm(EMPTY);
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Damage Stock</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Track damaged / write-off stock.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(220,38,38,.1)'}}><AlertOctagon size={18} color="#dc2626"/></div><div><div className="text-xs text-gray-400 font-medium">Damage Reports</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(245,158,11,.1)'}}><AlertOctagon size={18} color="#f59e0b"/></div><div><div className="text-xs text-gray-400 font-medium">Total Qty Damaged</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.reduce((s,d)=>s+d.qty,0)}</div></div></div>
      </div>

      <div className="filter-bar mb-5">
        <button className="btn-brand" onClick={()=>setOpen(true)}><Plus size={14}/> Report Damage</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Code</th><th>Name</th><th>Quantity</th><th>Received Date</th><th>Transfer Date</th><th>Location</th><th>Remarks</th></tr></thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={7} style={{textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13}}>No damage reports yet — click "Report Damage" to record one.</td></tr>
              )}
              {data.map(r=>(
                <tr key={r.id}>
                  <td className="font-mono text-xs text-gray-500">{r.code}</td>
                  <td style={{fontWeight:600}}>{r.name}</td>
                  <td style={{fontWeight:700, color:'var(--red)'}}>{r.qty}</td>
                  <td className="text-xs">{r.receivedDate || '—'}</td>
                  <td className="text-xs">{r.transferDate || '—'}</td>
                  <td className="text-xs text-gray-500">{r.location}</td>
                  <td className="text-xs">{r.remarks || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={()=>setOpen(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">Report Damage Stock</div>
              <button className="text-gray-400 hover:text-gray-700 p-1" onClick={()=>setOpen(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-field"><label className="form-label">Code</label><input className="inp" placeholder="ANT-MED" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Name</label><input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
              </div>
              <div className="form-field"><label className="form-label">Quantity</label><input className="inp" type="number" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Received Date</label><input className="inp" type="date" value={form.receivedDate} onChange={e=>setForm(f=>({...f,receivedDate:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Transfer Date</label><input className="inp" type="date" value={form.transferDate} onChange={e=>setForm(f=>({...f,transferDate:e.target.value}))}/></div>
              </div>
              <div className="form-field"><label className="form-label">Location</label>
                <select className="sel" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}>
                  {LOCATIONS.map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="form-field"><label className="form-label">Remarks</label><textarea className="inp" style={{minHeight:70,resize:'vertical'}} value={form.remarks} onChange={e=>setForm(f=>({...f,remarks:e.target.value}))}/></div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleAdd}>Report Damage</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
