import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, X } from 'lucide-react';

interface InvoiceItem {
  desc: string;
  qty: number;
  unit: string;
  rate: number;
  gst: number;
}

interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  buyerName: string;
  buyerAddress?: string;
  buyerGstin?: string;
  items: InvoiceItem[];
  notes?: string;
}

interface Props {
  data: InvoiceData;
  onClose: () => void;
}

/* ── Company details — Jasmine Pollux Blooms ── */
const COMPANY = {
  name: 'JASMINE POLLUX BLOOMS',
  addr1: 'Old No: 24, New No: 22/18, Shilpa Building, 12th Cross',
  addr2: 'Near R.K Electricals since 1985, 2nd Main, Lakkasandra',
  addr3: 'Wilson Garden, Bangalore — 560030, Karnataka, India',
  phone: '+91 97403 24378 / +91 99669 60816',
  email: 'jasminepolluxblooms@gmail.com',
  gstin: '29AAXFJ0042J1ZZ',
  pan: 'AAXFJ0042J',
  bankName: 'ICICI Bank',
  branch: 'Wilson Garden',
  ifsc: 'ICIC0003436',
};

export default function InvoicePDF({ data, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rows = data.items.map(it => {
    const base = it.qty * it.rate;
    const gstAmt = base * it.gst / 100;
    return { ...it, base, gstAmt, total: base + gstAmt };
  });

  const totalQty  = rows.reduce((s, r) => s + r.qty, 0);
  const subtotal  = rows.reduce((s, r) => s + r.base, 0);
  const totalGst  = rows.reduce((s, r) => s + r.gstAmt, 0);
  const grandTotal = subtotal + totalGst;

  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function w(n: number): string {
    if(n===0) return '';
    if(n<20) return ones[n];
    if(n<100) return tens[Math.floor(n/10)] + (n%10?' '+ones[n%10]:'');
    if(n<1000) return ones[Math.floor(n/100)]+' Hundred'+(n%100?' '+w(n%100):'');
    if(n<100000) return w(Math.floor(n/1000))+' Thousand'+(n%1000?' '+w(n%1000):'');
    if(n<10000000) return w(Math.floor(n/100000))+' Lakh'+(n%100000?' '+w(n%100000):'');
    return w(Math.floor(n/10000000))+' Crore'+(n%10000000?' '+w(n%10000000):'');
  }
  const rupees = Math.floor(grandTotal);
  const amtWords = `INR ${w(rupees)} Only`;

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
    pdf.save(`${data.invoiceNo.replace(/\//g, '-')}.pdf`);
  };

  const td: React.CSSProperties = { padding:'5px 8px', borderRight:'1px solid #9ca3af', fontSize:10.5, verticalAlign:'top' };
  const th: React.CSSProperties = { padding:'6px 8px', borderRight:'1px solid #9ca3af', fontSize:10, fontWeight:700, textAlign:'left', borderBottom:'1px solid #9ca3af' };
  const meta: React.CSSProperties = { padding:'5px 10px', fontSize:10, borderBottom:'1px solid #9ca3af' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, overflow:'auto', padding:'16px 12px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:14, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={downloadPDF} style={{ background:'#be185d', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Download size={16}/> Download PDF</button>
        <button onClick={()=>window.print()} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Printer size={16}/> Print</button>
        <button onClick={onClose} style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><X size={16}/> Close</button>
      </div>

      {/* Invoice — A4, Tally style matching Misty Blooms reference layout */}
      <div ref={ref} id="invoice-print" className="printable" style={{ width:794, margin:'0 auto', background:'#fff', fontFamily:'Arial, sans-serif', color:'#1a1a1a', border:'1px solid #9ca3af', padding:20 }}>

        <div style={{ textAlign:'center', fontSize:16, fontWeight:700, letterSpacing:1, marginBottom:12 }}>INVOICE</div>

        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af' }}>
          <tbody>
            <tr>
              <td style={{ ...meta, width:'55%', borderRight:'1px solid #9ca3af', verticalAlign:'top' }} rowSpan={2}>
                <div style={{ fontWeight:700, fontSize:12 }}>{COMPANY.name}</div>
                <div style={{ marginTop:3, lineHeight:1.5 }}>{COMPANY.addr1}<br/>{COMPANY.addr2}<br/>{COMPANY.addr3}</div>
                <div style={{ marginTop:3 }}>Contact: {COMPANY.phone}</div>
                <div>E-Mail: {COMPANY.email}</div>
                <div style={{ marginTop:6 }}>GSTIN: {COMPANY.gstin} &nbsp;|&nbsp; PAN: {COMPANY.pan}</div>
                <div style={{ marginTop:10 }}>
                  <div style={{ color:'#374151', fontWeight:600 }}>Buyer (Bill to)</div>
                  <div style={{ fontWeight:700 }}>{data.buyerName || '—'}</div>
                  {data.buyerAddress && <div>{data.buyerAddress}</div>}
                  {data.buyerGstin && <div>GSTIN: {data.buyerGstin}</div>}
                </div>
              </td>
              <td style={meta}><span style={{ color:'#374151' }}>Invoice No.</span><br/><strong>{data.invoiceNo}</strong></td>
            </tr>
            <tr>
              <td style={meta}><span style={{ color:'#374151' }}>Dated</span><br/><strong>{data.invoiceDate}</strong></td>
            </tr>
          </tbody>
        </table>

        {/* Items table */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', borderTop:'none', marginTop:0 }}>
          <thead>
            <tr>
              <th style={{ ...th, width:32 }}>SI No.</th>
              <th style={{ ...th, minWidth:220 }}>Description of Goods</th>
              <th style={{ ...th, width:70, textAlign:'right' }}>Quantity</th>
              <th style={{ ...th, width:60, textAlign:'right' }}>Rate</th>
              <th style={{ ...th, width:40, textAlign:'center' }}>per</th>
              <th style={{ ...th, width:90, textAlign:'right', borderRight:'none' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, textAlign:'center' }}>{i+1}</td>
                <td style={td}>{r.desc}</td>
                <td style={{ ...td, textAlign:'right' }}>{r.qty} {r.unit}</td>
                <td style={{ ...td, textAlign:'right' }}>{fmt(r.rate)}</td>
                <td style={{ ...td, textAlign:'center' }}>{r.unit}</td>
                <td style={{ ...td, textAlign:'right', borderRight:'none' }}>{fmt(r.base)}</td>
              </tr>
            ))}
            {totalGst > 0 && (
              <tr>
                <td style={td} colSpan={5}>GST</td>
                <td style={{ ...td, textAlign:'right', borderRight:'none' }}>{fmt(totalGst)}</td>
              </tr>
            )}
            {/* pad empty rows for a clean look */}
            {Array.from({ length: Math.max(0, 4 - rows.length) }).map((_, i) => (
              <tr key={`e${i}`}>
                <td style={{ ...td, height:22 }}></td><td style={td}></td><td style={td}></td><td style={td}></td><td style={td}></td>
                <td style={{ ...td, borderRight:'none' }}></td>
              </tr>
            ))}
            <tr>
              <td style={{ ...td, fontWeight:700, textAlign:'right', borderTop:'1px solid #9ca3af' }} colSpan={2}>Total</td>
              <td style={{ ...td, fontWeight:700, textAlign:'right', borderTop:'1px solid #9ca3af' }}>{totalQty} {rows[0]?.unit || 'Nos'}</td>
              <td style={{ ...td, borderTop:'1px solid #9ca3af' }}></td>
              <td style={{ ...td, borderTop:'1px solid #9ca3af' }}></td>
              <td style={{ ...td, fontWeight:700, textAlign:'right', borderRight:'none', borderTop:'1px solid #9ca3af' }}>₹ {fmt(grandTotal)}</td>
            </tr>
          </tbody>
        </table>

        {/* Amount in words + Bank */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', borderTop:'none' }}>
          <tbody>
            <tr>
              <td style={{ padding:'8px 10px', fontSize:10, borderRight:'1px solid #9ca3af', width:'55%', verticalAlign:'top' }}>
                <div style={{ color:'#374151' }}>Amount Chargeable (in words)</div>
                <div style={{ fontStyle:'italic', fontWeight:700, marginTop:2 }}>{amtWords}</div>
              </td>
              <td style={{ padding:'8px 10px', fontSize:10, verticalAlign:'top' }}>
                <div style={{ fontWeight:700, marginBottom:3 }}>Company's Bank Details</div>
                <div>A/c Holder's Name: <strong>{COMPANY.name}</strong></div>
                <div>Bank Name: <strong>{COMPANY.bankName}</strong></div>
                <div>Branch &amp; IFS Code: <strong>{COMPANY.branch} &amp; {COMPANY.ifsc}</strong></div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Declaration + Signature */}
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #9ca3af', borderTop:'none' }}>
          <tbody>
            <tr>
              <td style={{ padding:'10px', fontSize:9.5, borderRight:'1px solid #9ca3af', width:'60%', verticalAlign:'top', lineHeight:1.5 }}>
                <div style={{ fontWeight:700, marginBottom:3, textDecoration:'underline' }}>Declaration</div>
                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
              </td>
              <td style={{ padding:'10px', fontSize:10, textAlign:'center', verticalAlign:'bottom' }}>
                <div style={{ marginBottom:30 }}>for {COMPANY.name}</div>
                <div style={{ borderTop:'1px solid #374151', paddingTop:4, fontWeight:600 }}>Authorised Signatory</div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ textAlign:'center', fontSize:9, color:'#6b7280', marginTop:10 }}>This is a Computer Generated Invoice</div>
      </div>
    </div>
  );
}
