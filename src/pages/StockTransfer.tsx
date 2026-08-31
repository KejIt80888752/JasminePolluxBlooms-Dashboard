import { useState } from 'react';
import { Plus, ArrowLeftRight, X } from 'lucide-react';
import { LOCATIONS } from '../contexts/InventoryContext';

interface Transfer {
  id: number;
  code: string;
  name: string;
  qty: number;
  receivedDate: string;
  transferDate: string;
  location: string;
}

const INITIAL: Transfer[] = [];

const EMPTY = { code:'', name:'', qty:'', receivedDate:'', transferDate:'', location:LOCATIONS[0] };

export default function StockTransfer() {
  const [data, setData] = useState<Transfer[]>(INITIAL);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string,string>>(EMPTY);

  const handleAdd = () => {
    if (!form.code || !form.name) { alert('Enter Code and Name'); return; }
    setData(prev => [...prev, { id:Date.now(), code:form.code, name:form.name, qty:parseInt(form.qty)||0, receivedDate:form.receivedDate, transferDate:form.transferDate, location:form.location }]);
    setOpen(false); setForm(EMPTY);
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Stock Transfer</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Track stock moved between warehouses.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(190,24,93,.1)'}}><ArrowLeftRight size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Transfers</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(22,163,74,.1)'}}><ArrowLeftRight size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Total Qty Moved</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.reduce((s,d)=>s+d.qty,0)}</div></div></div>
      </div>

      <div className="filter-bar mb-5">
        <button className="btn-brand" onClick={()=>setOpen(true)}><Plus size={14}/> Add Transfer</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Code</th><th>Name</th><th>Quantity</th><th>Received Date</th><th>Transfer Date</th><th>Location</th></tr></thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={6} style={{textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13}}>No transfers yet — click "Add Transfer" to record one.</td></tr>
              )}
              {data.map(r=>(
                <tr key={r.id}>
                  <td className="font-mono text-xs text-gray-500">{r.code}</td>
                  <td style={{fontWeight:600}}>{r.name}</td>
                  <td style={{fontWeight:700}}>{r.qty}</td>
                  <td className="text-xs">{r.receivedDate || '—'}</td>
                  <td className="text-xs">{r.transferDate || '—'}</td>
                  <td className="text-xs text-gray-500">{r.location}</td>
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
              <div className="modal-title">Add Stock Transfer</div>
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
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleAdd}>Add Transfer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
