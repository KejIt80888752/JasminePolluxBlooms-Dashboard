import { useState } from 'react';
import { Plus, Truck, X, Edit2, Trash2 } from 'lucide-react';
import { useVendors, type Vendor } from '../contexts/VendorContext';

const EMPTY = { name:'', mobile:'', address:'', gst:'', pan:'', email:'', bankDetails:'' };

export default function Vendors() {
  const { vendors, addVendor, updateVendor, deleteVendor, nextCode } = useVendors();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY);

  const openAdd = () => { setEditingId(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (v: Vendor) => {
    setEditingId(v.id);
    setForm({ name:v.name, mobile:v.mobile, address:v.address, gst:v.gst, pan:v.pan, email:v.email, bankDetails:v.bankDetails });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.mobile) { alert('Enter Vendor Name and Mobile Number'); return; }
    if (editingId !== null) updateVendor(editingId, form);
    else addVendor(form);
    setOpen(false); setForm(EMPTY); setEditingId(null);
  };

  const handleDelete = (v: Vendor) => {
    if (confirm(`Delete vendor "${v.name}"?`)) deleteVendor(v.id);
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Vendor Details</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Manage supplier / vendor records.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(190,24,93,.1)'}}><Truck size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Vendors</div><div className="text-xl font-bold text-gray-800 mt-0.5">{vendors.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(22,163,74,.1)'}}><Truck size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Next Vendor Code</div><div className="text-xl font-bold text-gray-800 mt-0.5 font-mono">{nextCode()}</div></div></div>
      </div>

      <div className="filter-bar mb-5">
        <button className="btn-brand" onClick={openAdd}><Plus size={14}/> Add Vendor</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Vendor Code</th><th>Name</th><th>Mobile</th><th>Address</th><th>GST</th><th>PAN</th><th>Email</th><th>Bank Details</th><th>Action</th></tr></thead>
            <tbody>
              {vendors.map(v=>(
                <tr key={v.id}>
                  <td className="font-mono text-xs font-semibold" style={{color:'var(--brand)'}}>{v.code}</td>
                  <td style={{fontWeight:600}}>{v.name}</td>
                  <td className="text-xs">{v.mobile}</td>
                  <td className="text-xs" style={{maxWidth:220}}>{v.address}</td>
                  <td className="text-xs font-mono">{v.gst}</td>
                  <td className="text-xs font-mono">{v.pan}</td>
                  <td className="text-xs">{v.email}</td>
                  <td className="text-xs">{v.bankDetails}</td>
                  <td>
                    <div style={{display:'flex',gap:5}}>
                      <button className="btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:3}} onClick={()=>openEdit(v)}><Edit2 size={11}/>Edit</button>
                      <button className="btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:3,color:'#ef4444'}} onClick={()=>handleDelete(v)}><Trash2 size={11}/>Delete</button>
                    </div>
                  </td>
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
              <div className="modal-title">{editingId !== null ? 'Edit Vendor' : `Add Vendor — ${nextCode()}`}</div>
              <button className="text-gray-400 hover:text-gray-700 p-1" onClick={()=>setOpen(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-field"><label className="form-label">Vendor Name</label><input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Mobile Number</label><input className="inp" value={form.mobile} onChange={e=>setForm(f=>({...f,mobile:e.target.value}))}/></div>
              </div>
              <div className="form-field"><label className="form-label">Address</label><input className="inp" value={form.address} onChange={e=>setForm(f=>({...f,address:e.target.value}))}/></div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">GST</label><input className="inp font-mono" value={form.gst} onChange={e=>setForm(f=>({...f,gst:e.target.value.toUpperCase()}))}/></div>
                <div className="form-field"><label className="form-label">PAN</label><input className="inp font-mono" value={form.pan} onChange={e=>setForm(f=>({...f,pan:e.target.value.toUpperCase()}))}/></div>
              </div>
              <div className="form-field"><label className="form-label">Email</label><input className="inp" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/></div>
              <div className="form-field"><label className="form-label">Bank Details</label><textarea className="inp" style={{minHeight:60,resize:'vertical'}} placeholder="Bank name, A/c no, IFSC" value={form.bankDetails} onChange={e=>setForm(f=>({...f,bankDetails:e.target.value}))}/></div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleSave}>{editingId !== null ? 'Save Changes' : 'Add Vendor'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
