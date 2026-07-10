import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, X } from 'lucide-react';
import jpbMark from '../assets/jpb-mark.png';

interface InvoiceItem {
  desc: string;
  ordQty: number;
  avlQty: number;
  unit: string;
  rate: number;
}

interface InvoiceData {
  billNo: string;
  date: string;
  dDate: string;
  reference?: string;
  buyerName: string;
  deliveryLocation?: string;
  items: InvoiceItem[];
  transport?: number;
}

interface Props {
  data: InvoiceData;
  onClose: () => void;
}

/* ── Company details — Jasmine Pollux Blooms ── */
const COMPANY = {
  name: 'JASMINE POLLUX BLOOMS',
  tagline: 'Flowers With Care',
  addr1: 'Old No: 24, New No: 22/18, Shilpa Building, 12th Cross',
  addr2: 'Near R.K Electricals since 1985, 2nd Main, Lakkasandra',
  addr3: 'Wilson Garden, Bangalore — 560030, Karnataka',
  phone: '+91 97403 24378 / +91 99669 60816',
  email: 'jasminepolluxblooms@gmail.com',
  gstin: '29AAXFJ0042J1ZZ',
};

export default function InvoicePDF({ data, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rows = data.items.map(it => {
    const total = it.avlQty > 0 ? it.avlQty * it.rate : 0;
    return { ...it, total };
  });

  const itemsTotal = rows.reduce((s, r) => s + r.total, 0);
  const transport = data.transport || 0;
  const grandTotal = itemsTotal + transport;

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const downloadPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true, backgroundColor: '#fff' });
    const img    = canvas.toDataURL('image/png');
    const pdf    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW   = pdf.internal.pageSize.getWidth();
    const pdfH   = (canvas.height * pdfW) / canvas.width;
    let position = 0, remaining = pdfH;
    const pageH  = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, 'PNG', 0, position, pdfW, pdfH);
    remaining -= pageH;
    while(remaining > 0) {
      position -= pageH;
      pdf.addPage();
      pdf.addImage(img, 'PNG', 0, position, pdfW, pdfH);
      remaining -= pageH;
    }
    pdf.save(`${data.billNo.replace(/\//g, '-')}.pdf`);
  };

  const td: React.CSSProperties = { padding:'6px 8px', borderRight:'1px solid #9ca3af', fontSize:10.5, verticalAlign:'top' };
  const th: React.CSSProperties = { padding:'7px 8px', borderRight:'1px solid #9ca3af', fontSize:10, fontWeight:700, textAlign:'center', borderBottom:'1px solid #9ca3af', background:'#fce7f3' };
  const meta: React.CSSProperties = { padding:'4px 0', fontSize:10.5 };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, overflow:'auto', padding:'16px 12px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:14, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={downloadPDF} style={{ background:'#be185d', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Download size={16}/> Download PDF</button>
        <button onClick={()=>window.print()} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Printer size={16}/> Print</button>
        <button onClick={onClose} style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><X size={16}/> Close</button>
      </div>

      {/* Order Form — A4, matching Black Tulip Flowers reference layout */}
      <div ref={ref} id="invoice-print" className="printable" style={{ width:794, margin:'0 auto', background:'#fff', fontFamily:'Arial, sans-serif', color:'#1a1a1a', border:'1px solid #9ca3af', padding:'18px 22px' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid #be185d', paddingBottom:12, marginBottom:10 }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <img src={jpbMark} alt="JPB" style={{ width:56, height:56, objectFit:'contain' }} crossOrigin="anonymous"/>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:'#2d5016', letterSpacing:.3 }}>{COMPANY.name}</div>
              <div style={{ fontSize:9.5, color:'#6b7280', fontStyle:'italic' }}>{COMPANY.tagline}</div>
            </div>
          </div>
          <div style={{ fontSize:20, fontWeight:700, letterSpacing:1, color:'#1a1a1a', alignSelf:'center' }}>ORDER FORM</div>
          <div style={{ fontSize:9, color:'#374151', textAlign:'right', lineHeight:1.5 }}>
            {COMPANY.addr1}<br/>{COMPANY.addr2}<br/>{COMPANY.addr3}<br/>
            {COMPANY.phone}<br/>{COMPANY.email}<br/>
            GSTIN: {COMPANY.gstin}
          </div>
        </div>

        {/* Meta */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', marginBottom:0 }}>
          <tbody>
            <tr>
              <td style={{ padding:'6px 10px', width:'55%', borderRight:'1px solid #9ca3af', verticalAlign:'top' }}>
                <div style={meta}><span style={{ color:'#6b7280' }}>Customer</span> : <strong>{data.buyerName || '—'}</strong></div>
                <div style={meta}><span style={{ color:'#6b7280' }}>Delivery Location</span> : {data.deliveryLocation || '—'}</div>
              </td>
              <td style={{ padding:'6px 10px', verticalAlign:'top' }}>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:80 }}>Bill No</span> : <strong>{data.billNo}</strong></div>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:80 }}>Date</span> : {data.date}</div>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:80 }}>D-Date</span> : {data.dDate}</div>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:80 }}>Reference</span> : {data.reference || '—'}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items table */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', borderTop:'none' }}>
          <thead>
            <tr>
              <th style={{ ...th, width:36 }}>S.NO</th>
              <th style={{ ...th, textAlign:'left', minWidth:200 }}>PARTICULARS</th>
              <th style={{ ...th, width:70 }}>ORD QTY</th>
              <th style={{ ...th, width:70 }}>AVL QTY</th>
              <th style={{ ...th, width:80 }}>UNIT PRICE</th>
              <th style={{ ...th, width:90, borderRight:'none' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, textAlign:'center' }}>{i+1}</td>
                <td style={td}>{r.desc}</td>
                <td style={{ ...td, textAlign:'center' }}>{r.ordQty} {r.unit}</td>
                <td style={{ ...td, textAlign:'center' }}>{r.avlQty > 0 ? `${r.avlQty} ${r.unit}` : '—'}</td>
                <td style={{ ...td, textAlign:'right' }}>{r.avlQty > 0 ? fmt(r.rate) : '—'}</td>
                <td style={{ ...td, textAlign:'right', fontWeight:600, borderRight:'none' }}>{r.avlQty > 0 ? fmt(r.total) : '—'}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 3 - rows.length) }).map((_, i) => (
              <tr key={`e${i}`}>
                <td style={{ ...td, height:24 }}></td><td style={td}></td><td style={td}></td><td style={td}></td><td style={td}></td>
                <td style={{ ...td, borderRight:'none' }}></td>
              </tr>
            ))}
            {transport > 0 && (
              <tr>
                <td style={td} colSpan={5}>Transport Charges</td>
                <td style={{ ...td, textAlign:'right', fontWeight:600, borderRight:'none' }}>{fmt(transport)}</td>
              </tr>
            )}
            <tr>
              <td style={{ ...td, fontWeight:700, textAlign:'right', borderTop:'1px solid #9ca3af' }} colSpan={5}>TOTAL</td>
              <td style={{ ...td, fontWeight:800, textAlign:'right', borderRight:'none', borderTop:'1px solid #9ca3af', fontSize:12 }}>₹{fmt(grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Signature / Contact / Seal */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:36 }}>
          <div style={{ fontSize:10.5 }}>
            <div style={{ marginBottom:22 }}>Receiver's Signature: <span style={{ display:'inline-block', width:160, borderBottom:'1px solid #9ca3af' }}>&nbsp;</span></div>
            <div>Contact Number: <span style={{ display:'inline-block', width:160, borderBottom:'1px solid #9ca3af' }}>&nbsp;</span></div>
          </div>
          <div style={{ fontSize:10.5, textAlign:'center' }}>
            <div style={{ marginBottom:30, fontWeight:600 }}>For {COMPANY.name}</div>
            <div style={{ borderTop:'1px solid #374151', paddingTop:4, fontWeight:600 }}>Authorised Signatory</div>
          </div>
        </div>

        <div style={{ textAlign:'center', fontSize:9.5, color:'#6b7280', marginTop:20, fontStyle:'italic' }}>
          (Note: Flowers once sold cannot be taken back)
        </div>
      </div>
    </div>
  );
}
