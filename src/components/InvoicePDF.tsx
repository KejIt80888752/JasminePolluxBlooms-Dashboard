import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, X } from 'lucide-react';
import jpbMark from '../assets/jpb-mark.png';

interface InvoiceItem {
  desc: string;
  ordQty: number;
  unit: string;
  rate: number;
}

interface InvoiceData {
  docType?: 'orderform' | 'invoice';
  billNo: string;
  date: string;
  dDate: string;
  reference?: string;
  custCode?: string;
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

/* A5 page width @ 96dpi (148mm) */
const PAGE_W = 559;

export default function InvoicePDF({ data, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const title = data.docType === 'invoice' ? 'INVOICE' : 'ORDER FORM';

  const rows = data.items.map(it => ({ ...it, total: it.ordQty * it.rate }));

  const itemsTotal = rows.reduce((s, r) => s + r.total, 0);
  const transport = data.transport || 0;
  const grandTotal = itemsTotal + transport;

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const downloadPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#fff' });
    const img    = canvas.toDataURL('image/png');
    const pdf    = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
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

  const td: React.CSSProperties = { padding:'5px 6px', borderRight:'1px solid #9ca3af', borderBottom:'1px solid #f3f4f6', fontSize:9, verticalAlign:'top', boxSizing:'border-box' };
  const th: React.CSSProperties = { padding:'6px', borderRight:'1px solid #9ca3af', fontSize:8.5, fontWeight:700, textAlign:'center', borderBottom:'1px solid #9ca3af', background:'#fce7f3', boxSizing:'border-box' };
  const meta: React.CSSProperties = { padding:'3px 0', fontSize:9 };

  /* Column widths — sum to 100% so table + header borders line up exactly */
  const colW = { sno:'8%', particulars:'40%', ordQty:'14%', unit:'12%', rate:'13%', total:'13%' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, overflow:'auto', padding:'16px 12px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:14, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={downloadPDF} style={{ background:'#be185d', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Download size={16}/> Download PDF (A5)</button>
        <button onClick={()=>window.print()} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Printer size={16}/> Print</button>
        <button onClick={onClose} style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><X size={16}/> Close</button>
      </div>

      {/* A5 page */}
      <div ref={ref} id="invoice-print" className="printable" style={{ width:PAGE_W, margin:'0 auto', background:'#fff', fontFamily:'Arial, sans-serif', color:'#1a1a1a', border:'1px solid #9ca3af', padding:'14px 16px', boxSizing:'border-box' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', borderBottom:'2px solid #be185d', paddingBottom:8, marginBottom:8, gap:6 }}>
          <div style={{ display:'flex', gap:7, alignItems:'center' }}>
            <img src={jpbMark} alt="JPB" style={{ width:38, height:38, objectFit:'contain', flexShrink:0 }} crossOrigin="anonymous"/>
            <div>
              <div style={{ fontSize:12.5, fontWeight:800, color:'#2d5016', letterSpacing:.2, lineHeight:1.2 }}>{COMPANY.name}</div>
              <div style={{ fontSize:7.5, color:'#6b7280', fontStyle:'italic' }}>{COMPANY.tagline}</div>
            </div>
          </div>
          <div style={{ fontSize:13, fontWeight:700, letterSpacing:.5, color:'#1a1a1a', alignSelf:'center', whiteSpace:'nowrap' }}>{title}</div>
        </div>
        <div style={{ fontSize:7, color:'#374151', textAlign:'left', lineHeight:1.5, marginBottom:8 }}>
          {COMPANY.addr1}, {COMPANY.addr2}, {COMPANY.addr3}<br/>
          {COMPANY.phone} &nbsp;|&nbsp; {COMPANY.email} &nbsp;|&nbsp; GSTIN: {COMPANY.gstin}
        </div>

        {/* Meta */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', marginBottom:0, tableLayout:'fixed' }}>
          <tbody>
            <tr>
              <td style={{ padding:'5px 8px', width:'52%', borderRight:'1px solid #9ca3af', verticalAlign:'top', boxSizing:'border-box' }}>
                {data.custCode && <div style={meta}><span style={{ color:'#6b7280' }}>Customer Code</span> : <strong>{data.custCode}</strong></div>}
                <div style={meta}><span style={{ color:'#6b7280' }}>Customer</span> : <strong>{data.buyerName || '—'}</strong></div>
                <div style={meta}><span style={{ color:'#6b7280' }}>Delivery Location</span> : {data.deliveryLocation || '—'}</div>
              </td>
              <td style={{ padding:'5px 8px', verticalAlign:'top', boxSizing:'border-box' }}>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:62 }}>Bill No</span> : <strong>{data.billNo}</strong></div>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:62 }}>Date</span> : {data.date}</div>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:62 }}>D-Date</span> : {data.dDate}</div>
                <div style={meta}><span style={{ color:'#6b7280', display:'inline-block', width:62 }}>Reference</span> : {data.reference || '—'}</div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Items table */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', borderTop:'none', tableLayout:'fixed' }}>
          <colgroup>
            <col style={{ width:colW.sno }}/><col style={{ width:colW.particulars }}/><col style={{ width:colW.ordQty }}/>
            <col style={{ width:colW.unit }}/><col style={{ width:colW.rate }}/><col style={{ width:colW.total }}/>
          </colgroup>
          <thead>
            <tr>
              <th style={th}>S.NO</th>
              <th style={{ ...th, textAlign:'left' }}>PARTICULARS</th>
              <th style={th}>ORD QTY</th>
              <th style={th}>UNIT</th>
              <th style={th}>RATE (₹)</th>
              <th style={{ ...th, borderRight:'none' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, textAlign:'center' }}>{i+1}</td>
                <td style={{ ...td, wordBreak:'break-word' }}>{r.desc}</td>
                <td style={{ ...td, textAlign:'center' }}>{r.ordQty}</td>
                <td style={{ ...td, textAlign:'center' }}>{r.unit}</td>
                <td style={{ ...td, textAlign:'right' }}>{fmt(r.rate)}</td>
                <td style={{ ...td, textAlign:'right', fontWeight:600, borderRight:'none' }}>{fmt(r.total)}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 3 - rows.length) }).map((_, i) => (
              <tr key={`e${i}`}>
                <td style={{ ...td, height:20 }}></td><td style={td}></td><td style={td}></td><td style={td}></td><td style={td}></td>
                <td style={{ ...td, borderRight:'none' }}></td>
              </tr>
            ))}
            {transport > 0 && (
              <tr>
                <td style={{ ...td, borderBottom:'1px solid #9ca3af' }} colSpan={5}>Transport Charges</td>
                <td style={{ ...td, textAlign:'right', fontWeight:600, borderRight:'none', borderBottom:'1px solid #9ca3af' }}>{fmt(transport)}</td>
              </tr>
            )}
            <tr>
              <td style={{ ...td, fontWeight:700, textAlign:'right', borderBottom:'none' }} colSpan={5}>TOTAL</td>
              <td style={{ ...td, fontWeight:800, textAlign:'right', borderRight:'none', borderBottom:'none', fontSize:10.5 }}>₹{fmt(grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Signature / Contact */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:24, gap:10 }}>
          <div style={{ fontSize:8.5 }}>
            <div style={{ marginBottom:16 }}>Receiver's Signature: <span style={{ display:'inline-block', width:110, borderBottom:'1px solid #9ca3af' }}>&nbsp;</span></div>
            <div>Contact Number: <span style={{ display:'inline-block', width:110, borderBottom:'1px solid #9ca3af' }}>&nbsp;</span></div>
          </div>
          <div style={{ fontSize:8.5, textAlign:'center' }}>
            <div style={{ marginBottom:22, fontWeight:600 }}>For {COMPANY.name}</div>
            <div style={{ borderTop:'1px solid #374151', paddingTop:3, fontWeight:600 }}>Authorised Signatory</div>
          </div>
        </div>

        <div style={{ textAlign:'center', fontSize:7.5, color:'#6b7280', marginTop:12, fontStyle:'italic' }}>
          (Note: Flowers once sold cannot be taken back)
        </div>
      </div>
    </div>
  );
}
