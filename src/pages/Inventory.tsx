import { useState, useRef } from 'react';
import { Plus, Package, AlertTriangle, Boxes, X, Upload, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useInventory, LOCATIONS } from '../contexts/InventoryContext';
import { useVendors } from '../contexts/VendorContext';

const cats = ['All','Anthurium','Rose','Marigold','Jasmine','Lily','Orchid','Accessory'];
const sc: Record<string,string> = { OK:'badge-green', 'Low Stock':'badge-yellow', 'Out of Stock':'badge-red' };

const EMPTY = { code:'', colour:'', category:'Anthurium', variety:'', qty:'', rate:'', location:LOCATIONS[0], billNo:'', vendorName:'' };

export default function Inventory() {
  const { items, addItem, addItems } = useInventory();
  const { vendors } = useVendors();
  const [filter, setFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string,string>>(EMPTY);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filter==='All' ? items : items.filter(d=>d.category===filter);
  const totalValue = items.reduce((s,d)=>s+(d.qty*d.rate),0);
  const lowStock   = items.filter(d=>d.status==='Low Stock'||d.status==='Out of Stock').length;
  const outOfStock = items.filter(d=>d.status==='Out of Stock').length;

  const handleAdd = () => {
    const qty = parseInt(form.qty)||0;
    const rate = parseFloat(form.rate)||0;
    addItem({ code:form.code, colour:form.colour, category:form.category, variety:form.variety, qty, unit:'Nos', rate, location:form.location, billNo:form.billNo, vendorName:form.vendorName });
    setOpen(false); setForm(EMPTY);
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Code:'ANT-MED', Colour:'Green', Category:'Anthurium', Variety:'Local', Qty:100, Unit:'Nos', Rate:50, Location:'Warehouse - 1', BillNo:'JPB-2026-101', VendorName:'Black Tulip Flowers Intl' },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, 'inventory-template.xlsx');
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target?.result, { type: 'binary' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet);
      const parsed = rows.map(r => ({
        code: String(r.Code||''), colour: String(r.Colour||''), category: String(r.Category||'Anthurium'),
        variety: String(r.Variety||''), qty: parseInt(r.Qty)||0, unit: String(r.Unit||'Nos'),
        rate: parseFloat(r.Rate)||0, location: String(r.Location||LOCATIONS[0]),
        billNo: String(r.BillNo||''), vendorName: String(r.VendorName||''),
      }));
      if (parsed.length) addItems(parsed);
      if (fileRef.current) fileRef.current.value = '';
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="page-enter">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(190,24,93,.1)'}}><Boxes size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Items</div><div className="text-xl font-bold text-gray-800 mt-0.5">{items.length}</div></div></div>
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
        <button onClick={downloadTemplate} className="btn-outline text-xs flex items-center gap-1.5">
          <Download size={13}/> Excel Template
        </button>
        <button onClick={()=>fileRef.current?.click()} className="btn-outline text-xs flex items-center gap-1.5">
          <Upload size={13}/> Bulk Upload
        </button>
        <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{display:'none'}} onChange={handleFile}/>
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
                <th style={{minWidth:120}}>Item Colour</th>
                <th>Category</th>
                <th>Variety</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>Value (₹)</th>
                <th>Location</th>
                <th>Bill No</th>
                <th>Vendor Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={12} style={{textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13}}>No inventory yet — click "Add Item" or use Bulk Upload to get started.</td></tr>
              )}
              {filtered.map(d=>(
                <tr key={d.id}>
                  <td className="font-mono text-xs text-gray-500">{d.code}</td>
                  <td style={{fontWeight:600}}>{d.colour}</td>
                  <td><span className="badge badge-gray text-[10px]">{d.category}</span></td>
                  <td className="text-xs">{d.variety}</td>
                  <td style={{fontWeight:700, color: d.qty===0?'var(--red)':d.qty<20?'var(--orange)':'var(--green)'}}>{d.qty}</td>
                  <td className="text-xs">{d.unit}</td>
                  <td>₹{d.rate.toLocaleString('en-IN')}</td>
                  <td style={{fontWeight:600}}>₹{(d.qty*d.rate).toLocaleString('en-IN')}</td>
                  <td className="text-xs text-gray-500">{d.location}</td>
                  <td className="text-xs font-mono">{d.billNo || '—'}</td>
                  <td className="text-xs">{d.vendorName || '—'}</td>
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
              <div className="form-field"><label className="form-label">Item Colour</label><input className="inp" placeholder="e.g. Red, White, Pink" value={form.colour} onChange={e=>setForm(f=>({...f,colour:e.target.value}))}/></div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Variety</label><input className="inp" value={form.variety} onChange={e=>setForm(f=>({...f,variety:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Quantity</label><input className="inp" type="number" value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Rate (₹)</label><input className="inp" type="number" value={form.rate} onChange={e=>setForm(f=>({...f,rate:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Location</label>
                  <select className="sel" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}>
                    {LOCATIONS.map(l=><option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-field"><label className="form-label">Bill No</label><input className="inp" placeholder="JPB-2026-101" value={form.billNo} onChange={e=>setForm(f=>({...f,billNo:e.target.value}))}/></div>
                <div className="form-field"><label className="form-label">Vendor Name</label>
                  <input className="inp" list="vendor-names" placeholder="Vendor name" value={form.vendorName} onChange={e=>setForm(f=>({...f,vendorName:e.target.value}))}/>
                  <datalist id="vendor-names">{vendors.map(v=><option key={v.id} value={v.name}/>)}</datalist>
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
