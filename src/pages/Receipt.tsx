import { useState, Fragment } from 'react';
import { Plus, Trash2, FileText, Download, Receipt as ReceiptIcon } from 'lucide-react';
import VoucherPDF, { type VoucherRow } from '../components/VoucherPDF';

type Item = VoucherRow & { id:number };
type View = 'form' | 'list';

interface SavedReceipt { vNo:string; receivedFrom:string; date:string; total:number; }

const SAVED: SavedReceipt[] = [];

const fmt = (n:number) => n.toLocaleString('en-IN');
function newItem(): Item { return { id:Date.now()+Math.random(), ref:'', desc:'', col3:'', amount:0 }; }

export default function Receipt() {
  const [view, setView] = useState<View>('list');
  const [saved, setSaved] = useState(SAVED);
  const [items, setItems] = useState<Item[]>([newItem()]);
  const [vNo, setVNo] = useState(`RC-${String(SAVED.length+1).padStart(3,'0')}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [receivedFrom, setReceivedFrom] = useState('');
  const [showPDF, setShowPDF] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);

  const total = items.reduce((s,it)=>s+(it.amount||0),0);
  const updateItem = (id:number, field:keyof Item, val:string|number) =>
    setItems(prev=>prev.map(it=>it.id===id?{...it,[field]:val}:it));
  const addItem = () => setItems(p=>[...p,newItem()]);
  const delItem = (id:number) => setItems(p=>p.filter(it=>it.id!==id));
  const clearForm = () => { setItems([newItem()]); setReceivedFrom(''); };

  const buildData = () => ({
    title:'RECEIPT' as const, vNo, date: new Date(date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}),
    partyLabel:'Received From', partyName: receivedFrom||'—', col3Label:'Mode of Receipt',
    rows: items.filter(it=>it.desc||it.ref).map(({id,...rest})=>rest),
  });

  const openPDF = () => { setPdfData(buildData()); setShowPDF(true); };
  const openPDFFromList = (v: SavedReceipt) => {
    setPdfData({ title:'RECEIPT', vNo:v.vNo, date:v.date, partyLabel:'Received From', partyName:v.receivedFrom, col3Label:'Mode of Receipt', rows:[{ref:'',desc:'Payment received',col3:'UPI',amount:v.total}] });
    setShowPDF(true);
  };
  const saveReceipt = () => {
    if(!receivedFrom){ alert('Enter Received From'); return; }
    setSaved(p=>[{ vNo, receivedFrom, date: new Date(date).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}), total },...p]);
    setView('list'); clearForm();
    setVNo(`RC-${String(saved.length+2).padStart(3,'0')}`);
  };

  if(showPDF && pdfData) return <VoucherPDF data={pdfData} onClose={()=>setShowPDF(false)}/>;

  if(view==='list') return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Receipt</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Record incoming payments received.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(190,24,93,.1)'}}><ReceiptIcon size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Receipts</div><div className="text-xl font-bold text-gray-800 mt-0.5">{saved.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(22,163,74,.1)'}}><ReceiptIcon size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Total Received</div><div className="text-xl font-bold text-gray-800 mt-0.5">₹{fmt(saved.reduce((s,v)=>s+v.total,0))}</div></div></div>
      </div>
      <div className="filter-bar mb-5">
        <button className="btn-brand flex items-center gap-2" onClick={()=>setView('form')}><Plus size={14}/> New Receipt</button>
      </div>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>V.No</th><th>Received From</th><th>Date</th><th>Amount</th><th>Action</th></tr></thead>
            <tbody>
              {saved.length === 0 && (
                <tr><td colSpan={5} style={{textAlign:'center', padding:'32px 0', color:'var(--muted)', fontSize:13}}>No receipts yet — click "New Receipt" to create one.</td></tr>
              )}
              {saved.map((v,i)=>(
                <tr key={i}>
                  <td><strong>{v.vNo}</strong></td>
                  <td>{v.receivedFrom}</td>
                  <td className="text-xs">{v.date}</td>
                  <td style={{fontWeight:700,color:'var(--green)'}}>₹{fmt(v.total)}</td>
                  <td><button className="btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:3}} onClick={()=>openPDFFromList(v)}><Download size={10}/>PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-enter" style={{paddingBottom:80}}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">New Receipt</h2>
          <p className="text-xs text-gray-400 mt-0.5">Record an incoming payment</p>
        </div>
        <button className="btn-outline flex items-center gap-2 text-xs" onClick={()=>setView('list')}><FileText size={13}/> Receipt List</button>
      </div>

      <div className="card mb-4 p-5">
        <div className="grid grid-cols-3 gap-4">
          <div><label className="form-label">V.NO</label><input className="inp font-mono font-bold" value={vNo} onChange={e=>setVNo(e.target.value)}/></div>
          <div><label className="form-label">DATE</label><input className="inp" type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>
          <div><label className="form-label">RECEIVED FROM <span className="text-red-500">*</span></label><input className="inp" value={receivedFrom} onChange={e=>setReceivedFrom(e.target.value)}/></div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100"><span className="font-semibold text-sm text-gray-700">Receipt Rows</span></div>
        <div className="overflow-x-auto">
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:700}}>
            <thead><tr style={{background:'#fdf2f8'}}>{['Against Bill','Description','Mode of Receipt','Amount (₹)',''].map(h=>(
              <th key={h} style={{textAlign:'left',padding:'8px 12px',fontSize:11,fontWeight:700,color:'#6b7280',borderBottom:'1px solid #f3d9e8'}}>{h}</th>
            ))}</tr></thead>
            <tbody>
              {items.map(it=>(
                <Fragment key={it.id}>
                <tr style={{borderBottom:'1px solid #f3f4f6'}}>
                  <td style={{padding:'6px 8px', width:100}}><input className="inp py-1 text-xs w-full" value={it.ref} onChange={e=>updateItem(it.id,'ref',e.target.value)}/></td>
                  <td style={{padding:'6px 8px', minWidth:220}}><input className="inp py-1 text-xs w-full" value={it.desc} onChange={e=>updateItem(it.id,'desc',e.target.value)}/></td>
                  <td style={{padding:'6px 8px', minWidth:140}}>
                    <select className="sel py-1 text-xs w-full" value={it.col3} onChange={e=>updateItem(it.id,'col3',e.target.value)}>
                      <option value="">Select</option>
                      {['Cash','UPI','Bank Transfer','Cheque','Card'].map(m=><option key={m}>{m}</option>)}
                    </select>
                  </td>
                  <td style={{padding:'6px 8px', width:120}}><input className="inp py-1 text-xs w-full text-right" type="number" value={it.amount} onChange={e=>updateItem(it.id,'amount',parseFloat(e.target.value)||0)}/></td>
                  <td style={{padding:'6px 8px'}}>{items.length>1 && <button onClick={()=>delItem(it.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={13}/></button>}</td>
                </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-50"><button onClick={addItem} className="btn-outline flex items-center gap-2 text-xs"><Plus size={12}/> Add Row</button></div>
        <div className="border-t border-gray-100 px-5 py-4 flex justify-end">
          <div style={{minWidth:240}} className="flex items-center justify-between">
            <span className="font-bold text-gray-800 text-base">Total</span>
            <span style={{fontSize:20, fontWeight:900, color:'#be185d'}}>₹{fmt(total)}</span>
          </div>
        </div>
      </div>

      <div style={{position:'fixed', bottom:0, left:240, right:0, background:'#fff', borderTop:'1px solid #e5e7eb', padding:'12px 24px', display:'flex', alignItems:'center', gap:12, zIndex:50, boxShadow:'0 -2px 12px rgba(0,0,0,0.06)'}}>
        <button className="btn-outline" onClick={clearForm}>Clear</button>
        <div style={{flex:1}}/>
        <button onClick={openPDF} style={{background:'#be185d',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><Download size={14}/> Preview &amp; Download PDF</button>
        <button onClick={saveReceipt} style={{background:'#d97706',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}><FileText size={14}/> Save Receipt</button>
      </div>
    </div>
  );
}
