import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, X } from 'lucide-react';
import jpbMark from '../assets/jpb-mark.png';
import { COMPANY, BRAND } from '../lib/brand';

export interface VoucherRow {
  ref: string;
  desc: string;
  col3: string;
  amount: number;
}

export interface VoucherData {
  title: 'CASH PAYMENT VOUCHER' | 'RECEIPT';
  vNo: string;
  date: string;
  partyLabel: string;
  partyName: string;
  col3Label: string;
  rows: VoucherRow[];
}

interface Props {
  data: VoucherData;
  onClose: () => void;
}

const PAGE_W = 559; /* A5 @ 96dpi */

export default function VoucherPDF({ data, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const total = data.rows.reduce((s, r) => s + (r.amount || 0), 0);
  const fmt = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const downloadPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#fff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(img, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save(`${data.title.replace(/\s+/g,'-')}-${data.vNo || 'draft'}.pdf`);
  };

  const td: React.CSSProperties = { padding:'6px 8px', borderRight:'1px solid #1a1a1a', borderBottom:'1px solid #1a1a1a', fontSize:9.5, boxSizing:'border-box' };
  const th: React.CSSProperties = { ...td, fontWeight:700, background:'#fff' };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, overflow:'auto', padding:'16px 12px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:14, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={downloadPDF} style={{ background:BRAND.green, color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Download size={16}/> Download PDF</button>
        <button onClick={()=>window.print()} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Printer size={16}/> Print</button>
        <button onClick={onClose} style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><X size={16}/> Close</button>
      </div>

      <div ref={ref} className="printable" style={{ width:PAGE_W*1.42, margin:'0 auto', background:'#fff', fontFamily:'Arial, sans-serif', color:BRAND.dark, padding:'20px 26px', boxSizing:'border-box' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <img src={jpbMark} alt="JPB" style={{ width:50, height:50, objectFit:'contain' }} crossOrigin="anonymous"/>
            <div>
              <div style={{ fontSize:13, fontWeight:800 }}>{COMPANY.name}</div>
              <div style={{ fontSize:9, lineHeight:1.5 }}>{COMPANY.addr1}<br/>{COMPANY.addr2}<br/>{COMPANY.addr3}</div>
            </div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:22, fontWeight:800, letterSpacing:.5 }}>{data.title}</div>
            <div style={{ height:3, width:180, background:BRAND.gold, marginTop:4, marginLeft:'auto' }}/>
          </div>
        </div>

        <div style={{ fontSize:11, fontWeight:700, marginBottom:6 }}>V.No: {data.vNo}</div>

        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #1a1a1a' }}>
          <tbody>
            <tr>
              <td style={{ ...th, width:'70%' }}>{data.partyLabel}: <span style={{ fontWeight:400 }}>{data.partyName}</span></td>
              <td style={{ ...th, borderRight:'none' }}>Date: <span style={{ fontWeight:400 }}>{data.date}</span></td>
            </tr>
          </tbody>
        </table>
        <table style={{ width:'100%', borderCollapse:'collapse', border:'1px solid #1a1a1a', borderTop:'none', tableLayout:'fixed' }}>
          <colgroup><col style={{width:'12%'}}/><col style={{width:'43%'}}/><col style={{width:'22%'}}/><col style={{width:'23%'}}/></colgroup>
          <thead>
            <tr>
              <th style={th}>Ref.</th>
              <th style={th}>Description</th>
              <th style={th}>{data.col3Label}</th>
              <th style={{ ...th, borderRight:'none', textAlign:'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r,i)=>(
              <tr key={i}>
                <td style={td}>{r.ref}</td>
                <td style={td}>{r.desc}</td>
                <td style={td}>{r.col3}</td>
                <td style={{ ...td, borderRight:'none', textAlign:'right' }}>{r.amount ? fmt(r.amount) : ''}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 5 - data.rows.length) }).map((_,i)=>(
              <tr key={`e${i}`}><td style={{...td,height:22}}></td><td style={td}></td><td style={td}></td><td style={{...td,borderRight:'none'}}></td></tr>
            ))}
            <tr>
              <td style={{ ...td, width:'12%' }}>INR:</td>
              <td style={{ ...td }}></td>
              <td style={{ ...td, fontWeight:700, textAlign:'right' }}>TOTAL</td>
              <td style={{ ...td, borderRight:'none', fontWeight:800, textAlign:'right' }}>₹{fmt(total)}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:44 }}>
          {['Prepared by','Authorised by',"Payee's Sign"].map(l=>(
            <div key={l} style={{ textAlign:'center', flex:1 }}>
              <div style={{ borderTop:'1px dashed #1a1a1a', width:'80%', margin:'0 auto', paddingTop:5, fontSize:9.5, fontWeight:700 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
