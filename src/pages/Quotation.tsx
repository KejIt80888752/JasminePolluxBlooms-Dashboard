import { useState, useEffect } from 'react';
import { Plus, ClipboardList, CheckCircle, Clock, Eye, X, Printer, MessageCircle, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface QRow { id:string; no:string; client:string; service:string; amount:string; date:string; valid:string; status:string; }

const statusClass: Record<string, string> = { Approved:'badge-green', Pending:'badge-yellow', Rejected:'badge-red' };
const EMPTY = { client:'', service:'Wedding Decor', amount:'', validUntil:'', notes:'' };

export default function Quotation() {
  const [data, setData] = useState<QRow[]>([]);
  const [open, setOpen] = useState(false);
  const [viewQ, setViewQ] = useState<QRow|null>(null);
  const [form, setForm] = useState(EMPTY);

  const refresh = async () => {
    const { data: rows, error } = await supabase.from('quotations').select('*').order('created_at', { ascending: false });
    if (!error && rows) setData((rows as any[]).map(r => ({
      id:r.id, no:r.no ?? '', client:r.client ?? '', service:r.service ?? '',
      amount:`₹${(r.amount ?? 0).toLocaleString('en-IN')}`, date:r.date ?? '', valid:r.valid ?? '', status:r.status ?? 'Pending',
    })));
  };

  useEffect(() => { refresh(); }, []);

  const handleCreate = async () => {
    if (!form.client) { alert('Enter Client Name'); return; }
    const no = `QT-${new Date().getFullYear()}-${String(data.length+1).padStart(3,'0')}`;
    const { error } = await supabase.from('quotations').insert({
      no, client: form.client, service: form.service, amount: parseFloat(form.amount)||0,
      date: new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
      valid: form.validUntil ? new Date(form.validUntil).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '15 days',
      status: 'Pending',
    });
    if (error) { alert(`Could not save quotation: ${error.message}`); return; }
    await refresh();
    setOpen(false); setForm(EMPTY);
  };

  return (
    <div className="page-enter">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(190,24,93,.1)' }}><ClipboardList size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Quotes</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(22,163,74,.1)' }}><CheckCircle size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Approved</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.filter(d=>d.status==='Approved').length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{ background:'rgba(245,158,11,.1)' }}><Clock size={18} color="#f59e0b"/></div><div><div className="text-xs text-gray-400 font-medium">Pending</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.filter(d=>d.status==='Pending').length}</div></div></div>
      </div>

      <div className="filter-bar mb-5">
        <button className="btn-brand" onClick={() => setOpen(true)}><Plus size={14} /> New Quotation</button>
        <select className="sel"><option>All Status</option><option>Approved</option><option>Pending</option><option>Rejected</option></select>
        <input className="inp" placeholder="Search client..." />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Quote No</th><th>Client</th><th>Service</th><th>Amount</th><th>Date</th><th>Valid Until</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {data.length === 0 && (
                <tr><td colSpan={8} style={{textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13}}>No quotations yet — click "New Quotation" to create one.</td></tr>
              )}
              {data.map(r => (
                <tr key={r.no}>
                  <td><strong>{r.no}</strong></td>
                  <td>{r.client}</td>
                  <td>{r.service}</td>
                  <td style={{ fontWeight:700, color:'var(--green)' }}>{r.amount}</td>
                  <td>{r.date}</td>
                  <td>{r.valid}</td>
                  <td><span className={`badge ${statusClass[r.status]}`}>{r.status}</span></td>
                  <td style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    <button className="btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:3}} onClick={()=>setViewQ(r)}><Eye size={10}/>View</button>
                    <button className="btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:3}} onClick={()=>window.print()}><Printer size={10}/>Print</button>
                    <button style={{display:'flex',alignItems:'center',gap:3,background:'#25d366',color:'#fff',border:'none',borderRadius:6,padding:'3px 8px',fontSize:10,cursor:'pointer',fontWeight:600}}
                      onClick={()=>window.open(`https://wa.me/?text=Dear ${r.client}, Your Quotation ${r.no} for ${r.service} - ${r.amount} is ready. Valid till ${r.valid}. - Jasmine Pollux Blooms`,'_blank')}>
                      <MessageCircle size={10}/>WA
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-head"><div className="modal-title">New Quotation</div><button className="text-gray-400 hover:text-gray-700 cursor-pointer text-lg p-1" onClick={() => setOpen(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-field"><label className="form-label">Client Name</label><input className="inp" value={form.client} onChange={e=>setForm(f=>({...f,client:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Service Type</label><select className="sel" value={form.service} onChange={e=>setForm(f=>({...f,service:e.target.value}))}>{['Wedding Decor','Bouquets','Garlands','Event Setup','Bulk Flower Supply'].map(s=><option key={s}>{s}</option>)}</select></div>
              </div>
              <div className="form-field"><label className="form-label">Items / Description</label><textarea className="inp" style={{ minHeight:'72px', resize:'vertical' }} value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Amount (₹)</label><input className="inp" type="number" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Valid Until</label><input className="inp" type="date" value={form.validUntil} onChange={e=>setForm(f=>({...f,validUntil:e.target.value}))}/></div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleCreate}>Create Quote</button>
            </div>
          </div>
        </div>
      )}

      {viewQ && (
        <div className="modal-overlay" onClick={()=>setViewQ(null)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
            <div className="modal-head">
              <div className="modal-title">Quotation — {viewQ.no}</div>
              <button className="text-gray-400 hover:text-gray-700 p-1" onClick={()=>setViewQ(null)}><X size={15}/></button>
            </div>
            <div className="modal-body">
              {[['Client',viewQ.client],['Service',viewQ.service],['Amount',viewQ.amount],['Quote Date',viewQ.date],['Valid Until',viewQ.valid],['Status',viewQ.status]].map(([l,v])=>(
                <div key={String(l)} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f3f4f6'}}>
                  <span style={{fontSize:12,color:'#6b7280',fontWeight:600}}>{l}</span>
                  <span style={{fontSize:12,fontWeight:700,color:'#374151'}}>{v}</span>
                </div>
              ))}
            </div>
            <div className="modal-foot">
              <button className="btn-outline" style={{display:'flex',alignItems:'center',gap:5}} onClick={()=>window.print()}><Printer size={13}/>Print</button>
              <button style={{background:'#25d366',color:'#fff',border:'none',borderRadius:8,padding:'7px 16px',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}
                onClick={()=>window.open(`https://wa.me/?text=Quotation ${viewQ.no}: ${viewQ.service} - ${viewQ.amount} for ${viewQ.client}. Valid till ${viewQ.valid}.`,'_blank')}>
                <MessageCircle size={13}/>WhatsApp
              </button>
              <button style={{background:'#2563eb',color:'#fff',border:'none',borderRadius:8,padding:'7px 16px',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6}}>
                <Mail size={13}/>Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
