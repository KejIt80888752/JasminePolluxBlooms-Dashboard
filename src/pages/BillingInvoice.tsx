import { useState } from 'react';
import { Plus, MessageCircle, Trash2, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import InvoicePDF from '../components/InvoicePDF';
import flowerData from '../data/flowerData.json';

type Item = { id:number; desc:string; ordQty:number; avlQty:number; unit:string; rate:number; };
type View = 'form' | 'list';

/* ── Flower catalog auto-fill ── */
const PRODUCTS: Record<string, Omit<Item,'id'|'ordQty'|'avlQty'>> = {
  'Anthurium Medium': { desc:'Anthurium Medium', unit:'Nos', rate:50 },
  'Anthurium Small':  { desc:'Anthurium Small',  unit:'Nos', rate:40 },
  'Anthurium Mini':   { desc:'Anthurium Mini',   unit:'Nos', rate:30 },
  'Red Rose':         { desc:'Red Rose',         unit:'Nos', rate:12 },
  'White Rose':       { desc:'White Rose',       unit:'Nos', rate:18 },
  'Marigold':         { desc:'Marigold Yellow',  unit:'Kg',  rate:80 },
  'Jasmine (Malli)':  { desc:'Jasmine (Malli)',  unit:'Kg',  rate:600 },
  'White Lily':       { desc:'White Lily',       unit:'Stems', rate:45 },
  'Orchid Stem':      { desc:'Orchid Stem',      unit:'Stems', rate:65 },
  'Decoration Charges': { desc:'Decoration / Event Setup Charges', unit:'Job', rate:5000 },
};

const SAVED_INVOICES = flowerData.invoices.map(i => ({
  no: i.no, client: i.client, taxable: i.taxable, gst: i.gst, total: i.total,
  date: i.date, due: i.due, status: i.status as 'Paid'|'Unpaid'|'Overdue',
}));

const sc: Record<string,string> = { Paid:'badge-green', Unpaid:'badge-yellow', Overdue:'badge-red' };
const fmt  = (n:number) => n.toLocaleString('en-IN');
const fmtR = (n:number) => '₹'+fmt(n);

function newItem(): Item { return { id:Date.now()+Math.random(), desc:'', ordQty:1, avlQty:1, unit:'Nos', rate:0 }; }

function calcItem(it:Item) {
  const total = it.avlQty * it.rate;
  return { total };
}

export default function BillingInvoice() {
  const [view, setView]   = useState<View>('list');
  const [items, setItems] = useState<Item[]>([newItem()]);
  const [saved, setSaved] = useState(SAVED_INVOICES);
  const [showPDF, setShowPDF] = useState(false);
  const [pdfInvoiceData, setPdfInvoiceData] = useState<any>(null);

  const [billNo,   setBillNo]   = useState(`JPB-2026-${String(SAVED_INVOICES.length+1).padStart(3,'0')}`);
  const [invDate,  setInvDate]  = useState(new Date().toISOString().slice(0,10));
  const [dDate,    setDDate]    = useState(new Date().toISOString().slice(0,10));
  const [reference,setReference]= useState('');
  const [party,    setParty]    = useState('');
  const [deliveryLoc, setDeliveryLoc] = useState('');
  const [transport, setTransport] = useState(0);

  const itemsTotal = items.reduce((s,it)=>s+calcItem(it).total,0);
  const grandTotal = itemsTotal + (transport || 0);

  const updateItem = (id:number, field:keyof Item, val:string|number) =>
    setItems(prev=>prev.map(it=>it.id===id?{...it,[field]:val}:it));

  const autoFill = (id:number, name:string) => {
    updateItem(id,'desc',name);
    const p = PRODUCTS[name];
    if(p) setItems(prev=>prev.map(it=>it.id===id?{...it,...p}:it));
  };

  const addItem = () => setItems(p=>[...p,newItem()]);
  const delItem = (id:number) => setItems(p=>p.filter(it=>it.id!==id));
  const clearForm = () => { setItems([newItem()]); setParty(''); setDeliveryLoc(''); setReference(''); setTransport(0); };

  const saveInvoice = () => {
    if(!party){ alert('Enter Customer Name'); return; }
    setSaved(p=>[{ no:billNo, client:party, taxable:Math.round(itemsTotal), gst:0, total:Math.round(grandTotal), date:new Date(invDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}).replace(/ /g,'-'), due:'7 days', status:'Unpaid' },...p]);
    setView('list');
    clearForm();
    setBillNo(`JPB-2026-${String(saved.length+2).padStart(3,'0')}`);
  };

  const openPDF = () => {
    setPdfInvoiceData({
      billNo, date: new Date(invDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'}),
      dDate: new Date(dDate).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'2-digit'}),
      reference, buyerName: party||'—', deliveryLocation: deliveryLoc,
      items: items.filter(it=>it.desc).map(it=>({ desc:it.desc, ordQty:it.ordQty, avlQty:it.avlQty, unit:it.unit, rate:it.rate })),
      transport,
    });
    setShowPDF(true);
  };

  const openPDFFromList = (r: typeof saved[0]) => {
    setPdfInvoiceData({
      billNo: r.no, date: r.date, dDate: r.date, reference: '', buyerName: r.client, deliveryLocation: '',
      items: [{ desc:'Flower Supply / Decoration', ordQty:1, avlQty:1, unit:'Job', rate:r.taxable }],
      transport: 0,
    });
    setShowPDF(true);
  };

  const sendWhatsApp = () => {
    if(!party){ alert('Enter Customer Name'); return; }
    const msg = encodeURIComponent(`Dear ${party},\n\nPlease find your Order Form:\nBill No: ${billNo}\nDate: ${invDate}\nAmount: ₹${fmt(Math.round(grandTotal))}\n\nThank you,\nJasmine Pollux Blooms\n📞 +91 97403 24378`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  if(showPDF && pdfInvoiceData) return (
    <InvoicePDF data={pdfInvoiceData} onClose={()=>setShowPDF(false)}/>
  );

  if(view==='list') return (
    <div className="page-enter">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(190,24,93,.1)'}}><FileText size={18} color="#be185d"/></div><div><div className="text-xs text-gray-400 font-medium">Total Invoices</div><div className="text-xl font-bold text-gray-800 mt-0.5">{saved.length}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(22,163,74,.1)'}}><CheckCircle size={18} color="#16a34a"/></div><div><div className="text-xs text-gray-400 font-medium">Total Billed</div><div className="text-xl font-bold text-gray-800 mt-0.5">₹{fmt(saved.reduce((s,i)=>s+i.total,0))}</div></div></div>
        <div className="stat-card"><div className="p-2.5 rounded-xl flex items-center justify-center shrink-0" style={{background:'rgba(220,38,38,.1)'}}><AlertCircle size={18} color="#dc2626"/></div><div><div className="text-xs text-gray-400 font-medium">Unpaid / Overdue</div><div className="text-xl font-bold text-gray-800 mt-0.5">{saved.filter(i=>i.status!=='Paid').length}</div></div></div>
      </div>

      <div className="filter-bar mb-5">
        <select className="sel"><option>All Status</option><option>Paid</option><option>Unpaid</option><option>Overdue</option></select>
        <div className="flex-1"/>
        <button className="btn-brand flex items-center gap-2" onClick={()=>setView('form')}><Plus size={14}/> New Invoice</button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Bill No</th><th>Customer</th><th>Amount</th><th>Date</th><th>Due</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {saved.map((r,i)=>(
                <tr key={i}>
                  <td><strong>{r.no}</strong></td>
                  <td>{r.client}</td>
                  <td style={{fontWeight:700,color:'var(--green)'}}>{fmtR(r.total)}</td>
                  <td className="text-xs">{r.date}</td>
                  <td className="text-xs">{r.due}</td>
                  <td><span className={`badge ${sc[r.status]}`}>{r.status}</span></td>
                  <td>
                    <div style={{display:'flex',gap:5}}>
                      <button className="btn-outline btn-sm" style={{display:'flex',alignItems:'center',gap:3}} onClick={()=>openPDFFromList(r)}><Download size={10}/>PDF</button>
                      <button style={{display:'flex',alignItems:'center',gap:3,background:'#25d366',color:'#fff',border:'none',borderRadius:6,padding:'3px 8px',fontSize:10,cursor:'pointer',fontWeight:600}}
                        onClick={()=>window.open(`https://wa.me/?text=Invoice ${r.no} - ₹${fmt(r.total)} due from ${r.client}`,'_blank')}>
                        <MessageCircle size={10}/>WA
                      </button>
                    </div>
                  </td>
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
          <h2 className="text-lg font-bold text-gray-800">Billing — New Order Form</h2>
          <p className="text-xs text-gray-400 mt-0.5">Flower supply / event decoration order form</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-brand flex items-center gap-2 text-xs" onClick={()=>setView('form')}><Plus size={13}/> New Invoice</button>
          <button className="btn-outline flex items-center gap-2 text-xs" onClick={()=>setView('list')}><FileText size={13}/> Invoice List</button>
        </div>
      </div>

      <div className="card mb-4 p-5">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="form-label">BILL NO</label>
            <input className="inp font-mono font-bold" value={billNo} onChange={e=>setBillNo(e.target.value)}/>
          </div>
          <div>
            <label className="form-label">DATE</label>
            <input className="inp" type="date" value={invDate} onChange={e=>setInvDate(e.target.value)}/>
          </div>
          <div>
            <label className="form-label">D-DATE (Delivery)</label>
            <input className="inp" type="date" value={dDate} onChange={e=>setDDate(e.target.value)}/>
          </div>
          <div>
            <label className="form-label">REFERENCE</label>
            <input className="inp" placeholder="Optional reference" value={reference} onChange={e=>setReference(e.target.value)}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label">CUSTOMER <span className="text-red-500">*</span></label>
            <input className="inp" placeholder="Customer / Company name" value={party} onChange={e=>setParty(e.target.value)}/>
          </div>
          <div>
            <label className="form-label">DELIVERY LOCATION</label>
            <input className="inp" placeholder="Full address with city & pin" value={deliveryLoc} onChange={e=>setDeliveryLoc(e.target.value)}/>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <span className="font-semibold text-sm text-gray-700">Item Details</span>
          <span className="text-xs text-gray-400">Type flower name to auto-fill (e.g. Anthurium Medium)</span>
        </div>
        <div className="overflow-x-auto">
          <table style={{width:'100%', borderCollapse:'collapse', minWidth:760}}>
            <thead>
              <tr style={{background:'#fdf2f8'}}>
                {['Particulars','Ord Qty','Avl Qty','Unit','Unit Price (₹)','Total',''].map(h=>(
                  <th key={h} style={{textAlign:'left',padding:'8px 12px',fontSize:11,fontWeight:700,color:'#6b7280',borderBottom:'1px solid #f3d9e8',whiteSpace:'nowrap'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((it)=>{
                const { total } = calcItem(it);
                return (
                  <tr key={it.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                    <td style={{padding:'6px 8px', minWidth:220}}>
                      <input className="inp py-1 text-xs w-full" placeholder="Particulars (e.g. Anthurium Medium)" value={it.desc}
                        onChange={e=>autoFill(it.id,e.target.value)} list="flower-catalog" style={{minWidth:200}}/>
                    </td>
                    <td style={{padding:'6px 8px', width:70}}>
                      <input className="inp py-1 text-xs w-full text-center" type="number" value={it.ordQty} onChange={e=>updateItem(it.id,'ordQty',parseFloat(e.target.value)||0)} style={{minWidth:60}}/>
                    </td>
                    <td style={{padding:'6px 8px', width:70}}>
                      <input className="inp py-1 text-xs w-full text-center" type="number" value={it.avlQty} onChange={e=>updateItem(it.id,'avlQty',parseFloat(e.target.value)||0)} style={{minWidth:60}}/>
                    </td>
                    <td style={{padding:'6px 8px', width:80}}>
                      <select className="sel py-1 text-xs" value={it.unit} onChange={e=>updateItem(it.id,'unit',e.target.value)} style={{minWidth:70,fontSize:11}}>
                        {['Nos','Kg','Stems','Mtrs','Bunch','Dozen','Pc','Job'].map(u=><option key={u}>{u}</option>)}
                      </select>
                    </td>
                    <td style={{padding:'6px 8px', width:90}}>
                      <input className="inp py-1 text-xs w-full text-right" type="number" value={it.rate} onChange={e=>updateItem(it.id,'rate',parseFloat(e.target.value)||0)} style={{minWidth:80}}/>
                    </td>
                    <td style={{padding:'6px 12px', fontWeight:700, color:'#16a34a', whiteSpace:'nowrap', fontSize:13}}>
                      ₹{fmt(Math.round(total))}
                    </td>
                    <td style={{padding:'6px 8px'}}>
                      {items.length>1 && <button onClick={()=>delItem(it.id)} style={{color:'#ef4444',background:'none',border:'none',cursor:'pointer',padding:4}}><Trash2 size={13}/></button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <datalist id="flower-catalog">
            {Object.keys(PRODUCTS).map(n=><option key={n} value={n}/>)}
          </datalist>
        </div>
        <div className="px-5 py-3 border-t border-gray-50">
          <button onClick={addItem} className="btn-outline flex items-center gap-2 text-xs">
            <Plus size={12}/> Add Item
          </button>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex justify-end">
            <div style={{minWidth:280}}>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-sm text-gray-500 font-medium">Items Total</span>
                <span className="text-sm font-semibold text-gray-700">₹{fmt(Math.round(itemsTotal))}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-sm text-gray-500 font-medium">Transport Charges</span>
                <input className="inp py-1 text-xs text-right" type="number" style={{width:110}} value={transport} onChange={e=>setTransport(parseFloat(e.target.value)||0)}/>
              </div>
              <div className="flex items-center justify-between pt-3">
                <span className="font-bold text-gray-800 text-base">Grand Total</span>
                <span style={{fontSize:22, fontWeight:900, color:'#be185d'}}>₹{fmt(Math.round(grandTotal))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{position:'fixed', bottom:0, left:240, right:0, background:'#fff', borderTop:'1px solid #e5e7eb', padding:'12px 24px', display:'flex', alignItems:'center', gap:12, zIndex:50, boxShadow:'0 -2px 12px rgba(0,0,0,0.06)'}}>
        <button className="btn-outline" onClick={clearForm}>Clear</button>
        <div style={{flex:1}}/>
        <button onClick={openPDF} style={{background:'#be185d',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
          <Download size={14}/> Preview &amp; Download PDF
        </button>
        <button onClick={saveInvoice} style={{background:'#d97706',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
          <FileText size={14}/> Save Invoice
        </button>
        <button onClick={sendWhatsApp} style={{background:'#25d366',color:'#fff',border:'none',borderRadius:8,padding:'8px 20px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:8}}>
          <MessageCircle size={14}/> WhatsApp
        </button>
      </div>
    </div>
  );
}
