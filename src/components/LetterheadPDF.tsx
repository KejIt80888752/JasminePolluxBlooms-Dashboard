import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, Printer, X, MapPin, Phone, Mail } from 'lucide-react';
import jpbMark from '../assets/jpb-mark.png';
import { COMPANY, BRAND } from '../lib/brand';

interface Props {
  body: string;
  onClose: () => void;
}

const PAGE_W = 794; /* A4 @ 96dpi */
const PAGE_H = 1123;

export default function LetterheadPDF({ body, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 2.5, useCORS: true, backgroundColor: '#fff' });
    const img = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    pdf.addImage(img, 'PNG', 0, 0, pdfW, pdfH);
    pdf.save('JPB-Letterhead.pdf');
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, overflow:'auto', padding:'16px 12px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:14, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={downloadPDF} style={{ background:BRAND.green, color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Download size={16}/> Download PDF</button>
        <button onClick={()=>window.print()} style={{ background:'#2563eb', color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Printer size={16}/> Print</button>
        <button onClick={onClose} style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><X size={16}/> Close</button>
      </div>

      <div ref={ref} className="printable" style={{ width:PAGE_W, height:PAGE_H, margin:'0 auto', background:'#fff', fontFamily:'Georgia, serif', color:BRAND.dark, position:'relative', boxSizing:'border-box', overflow:'hidden' }}>

        {/* Watermark */}
        <img src={jpbMark} alt="" aria-hidden="true"
          style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:420, opacity:0.05, pointerEvents:'none' }}/>

        {/* Header */}
        <div style={{ padding:'40px 50px 16px', display:'flex', alignItems:'center', gap:16, borderBottom:`2px solid ${BRAND.green}` }}>
          <img src={jpbMark} alt="JPB" style={{ width:64, height:64, objectFit:'contain' }} crossOrigin="anonymous"/>
          <div style={{ fontSize:28, fontWeight:700, letterSpacing:1 }}>{COMPANY.name}</div>
        </div>

        {/* Body */}
        <div style={{ padding:'32px 50px', fontSize:13, lineHeight:1.8, fontFamily:'Arial, sans-serif', whiteSpace:'pre-wrap', position:'relative', minHeight:700 }}>
          {body}
        </div>

        {/* Footer */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, borderTop:`2px solid ${BRAND.green}`, padding:'14px 50px', textAlign:'center', fontFamily:'Arial, sans-serif' }}>
          <div style={{ fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <MapPin size={11} color={BRAND.gold}/> <strong>{COMPANY.name},</strong> {COMPANY.addr1} {COMPANY.addr2} {COMPANY.addr3}
          </div>
          <div style={{ fontSize:11, display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginTop:4 }}>
            <span style={{display:'flex',alignItems:'center',gap:5}}><Phone size={11} color={BRAND.gold}/> <strong>{COMPANY.phone}</strong></span>
            <span style={{display:'flex',alignItems:'center',gap:5}}><Mail size={11} color={BRAND.gold}/> <strong>{COMPANY.email}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
