import { useState } from 'react';
import { Plus, Package, AlertTriangle, Boxes, X } from 'lucide-react';

const DATA = [
  { id:1, code:'ANT-MED', name:'Anthurium Medium', category:'Anthurium', variety:'Local', qty:120, minQty:50, unit:'Nos', rate:50, location:'Cold Room A', status:'OK' },
  { id:2, code:'ANT-SML', name:'Anthurium Small', category:'Anthurium', variety:'Local', qty:80, minQty:40, unit:'Nos', rate:40, location:'Cold Room A', status:'OK' },
  { id:3, code:'ANT-MIN', name:'Anthurium Mini', category:'Anthurium', variety:'Local', qty:18, minQty:30, unit:'Nos', rate:30, location:'Cold Room A', status:'Low Stock' },
  { id:4, code:'ROSE-RED', name:'Red Rose', category:'Rose', variety:'Bangalore Rose', qty:300, minQty:100, unit:'Nos', rate:12, location:'Cold Room B', status:'OK' },
  { id:5, code:'ROSE-WHT', name:'White Rose', category:'Rose', variety:'Dutch', qty:45, minQty:60, unit:'Nos', rate:18, location:'Cold Room B', status:'Low Stock' },
  { id:6, code:'MARI-YEL', name:'Marigold Yellow', category:'Marigold', variety:'Local', qty:0, minQty:20, unit:'Kg', rate:80, location:'Warehouse', status:'Out of Stock' },
  { id:7, code:'JASMINE', name:'Jasmine (Malli)', category:'Jasmine', variety:'Mysore Mallige', qty:35, minQty:15, unit:'Kg', rate:600, location:'Cold Room A', status:'OK' },
  { id:8, code:'LILY-WHT', name:'White Lily', category:'Lily', variety:'Asiatic', qty:24, minQty:20, unit:'Stems', rate:45, location:'Cold Room B', status:'OK' },
  { id:9, code:'ORCHID', name:'Orchid Stem', category:'Orchid', variety:'Thai', qty:60, minQty:25, unit:'Stems', rate:65, location:'Cold Room B', status:'OK' },
  { id:10, code:'RIBBON-DEC', name:'Decoration Ribbon', category:'Accessory', variety:'Satin', qty:200, minQty:50, unit:'Mtrs', rate:8, location:'Warehouse', status:'OK' },
];

type Row = typeof DATA[0];
const cats = ['All','Anthurium','Rose','Marigold','Jasmine','Lily','Orchid','Accessory'];
const sc: Record<string,string> = { OK:'badge-green', 'Low Stock':'badge-yellow', 'Out of Stock':'badge-red' };

const EMPTY = { code:'', name:'', category:'Anthurium', variety:'', qty:'', minQty:'', unit:'Nos', rate:'', location:'Cold Room A', status:'OK' };

export default function Inventory() {
  const [data, setData] = useState<Row[]>(DATA);
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string,string>>(EMPTY);

  const filtered = filter==='All' ? data : data.filter(d=>d.category===filter);
  const totalValue = data.reduce((s,d)=>s+(d.qty*d.rate),0);
  const lowStock   = data.filter(d=>d.status==='Low Stock'||d.status==='Out of Stock').length;
  const outOfStock = data.filter(d=>d.status==='Out of Stock').length;

  const handleAdd = () => {
    const qty = parseInt(form.qty)||0;
    const minQty = parseInt(form.minQty)||0;
    const rate = parseFloat(form.rate)||0;
    const status = qty===0?'Out of Stock':qty<minQty?'Low Stock':'OK';
    const newRow: Row = { id:Date.now(), code:form.code, name:form.name, category:form.category, variety:form.variety, qty, minQty, unit:form.unit, rate, location:form.location, status };
    setData(prev=>[...prev, newRow]);
    setOpen(false); setForm(EMPTY);
  };

  return (
    <div className="page-enter">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(190,24,93,.1)'}}><Boxes size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Items</div><div className="text-xl font-bold text-gray-800 mt-0.5">{data.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(22,163,74,.1)'}}><Package size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Inventory Value</div><div className="text-xl font-bold text-gray-800 mt-0.5">₹{totalValue.toLocaleString('en-IN')}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(245,158,11,.1)'}}><AlertTriangle size={18} color="#f59e0b"/></div><div><div className="text-xs text-gray-400 font-medium">Low Stock</div><div className="text-xl font-bold text-gray-800 mt-0.5">{lowStock} items</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(220,38,38,.1)'}}><AlertTriangle size={18} color="#dc2626"/></div><div><div className="text-xs text-gray-400 font-medium">Out of Stock</div><div className="text-xl font-bold text-gray-800 mt-0.5">{outOfStock} items</div></div></div>
      </div>

      {/* Filter + Add */}
      <div className="filter-bar mb-5">
        <div className="flex flex-wrap gap-1">
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filter===c?'bg-brand text-white border-brand':'border-gray-200 text-gray-600 hover:border-brand hover:text-brand'}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex-1"/>
        <button onClick={()=>setOpen(true)} className="btn-brand text-xs flex items-center gap-1.5">
          <Plus size={13}/> Add Item
        </button>
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th>Code</th>
                <th style={{minWidth:180}}>Item Name</th>
                <th>Category</th>
                <th>Variety</th>
                <th>Qty</th>
                <th>Min Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Value (₹)</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d=>(
                <tr key={d.id}>
                  <td className="font-mono text-xs text-gray-500">{d.code}</td>
                  <td style={{fontWeight:600}}>{d.name}</td>
                  <td><span className="badge badge-gray text-[10px]">{d.category}</span></td>
                  <td className="text-xs">{d.variety}</td>
                  <td style={{fontWeight:700, color: d.qty===0?'var(--red)':d.qty<d.minQty?'var(--orange)':'var(--green)'}}>{d.qty}</td>
                  <td className="text-xs text-gray-400">{d.minQty}</td>
                  <td className="text-xs">{d.unit}</td>
                  <td>₹{d.rate.toLocaleString('en-IN')}</td>
                  <td style={{fontWeight:600}}>₹{(d.qty*d.rate).toLocaleString('en-IN')}</td>
                  <td className="text-xs text-gray-500">{d.location}</td>
                  <td><span className={`badge ${sc[d.status]}`}>{d.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {open && (
        <div className="modal-overlay" onClick={()=>setOpen(false)}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title">Add Inventory Item</div>
              <button className="text-gray-400 hover:text-gray-700 p-1" onClick={()=>setOpen(false)}><X size={16}/></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-field"><label className="form-label">Item Code</label><input className="inp" placeholder="ANT-MED" value={form.code} onChange={e=>setForm(f=>({...f,code:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Category</label>
                  <select className="sel" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}>
                    {['Anthurium','Rose','Marigold','Jasmine','Lily','Orchid','Accessory'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-field"><label className="form-label">Item Name</label><input className="inp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/></div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Variety</label><input className="inp" value={form.variety} onChange={e=>setForm(f=>({...f,variety:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Unit</label>
                  <select className="sel" value={form.unit} onChange={e=>setForm(f=>({...f,unit:e.target.value}))}>
                    {['Nos','Kg','Stems','Mtrs','Bunch','Dozen'].map(u=><option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Quantity</label><input className="inp" type="number" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Min. Quantity</label><input className="inp" type="number" value={form.minQty} onChange={e=>setForm(f=>({...f,minQty:e.target.value}))}/></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Rate (₹)</label><input className="inp" type="number" value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Location</label>
                  <select className="sel" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}>
                    {['Cold Room A','Cold Room B','Warehouse'].map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn-outline" onClick={()=>setOpen(false)}>Cancel</button>
              <button className="btn-brand" onClick={handleAdd}>Add to Inventory</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
