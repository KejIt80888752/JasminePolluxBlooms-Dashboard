import { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, X, Phone, Mail } from 'lucide-react';
import jpbMark from '../assets/jpb-mark.png';
import { COMPANY, BRAND } from '../lib/brand';

interface Props {
  onClose: () => void;
}

const CARD_W = 800;
const CARD_H = 450;

export default function BusinessCardPDF({ onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { scale: 3, useCORS: true, backgroundColor: '#fff' });
    const img = canvas.toDataURL('image/png');
    /* Standard business card 89mm x 51mm, landscape */
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [89, 51] });
    pdf.addImage(img, 'PNG', 0, 0, 89, 51);
    pdf.save('JPB-Business-Card.pdf');
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:200, overflow:'auto', padding:'16px 12px' }}>
      <div style={{ display:'flex', justifyContent:'center', gap:12, marginBottom:14, position:'sticky', top:0, zIndex:10 }}>
        <button onClick={downloadPDF} style={{ background:BRAND.green, color:'#fff', border:'none', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><Download size={16}/> Download PDF</button>
        <button onClick={onClose} style={{ background:'#fff', color:'#374151', border:'1px solid #d1d5db', borderRadius:8, padding:'10px 24px', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}><X size={16}/> Close</button>
      </div>

      <div ref={ref} className="printable" style={{ width:CARD_W, height:CARD_H, margin:'0 auto', background:'#fff', fontFamily:'Georgia, serif', color:BRAND.dark, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', boxSizing:'border-box', border:'1px solid #e5e7eb' }}>
        <img src={jpbMark} alt="JPB" style={{ width:120, height:120, objectFit:'contain' }} crossOrigin="anonymous"/>
        <div style={{ fontSize:32, fontWeight:700, letterSpacing:1, marginTop:10 }}>{COMPANY.name}</div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
          <div style={{ height:1, width:60, background:BRAND.gold }}/>
          <div style={{ fontSize:14, color:BRAND.gold, fontWeight:700 }}>EST. 2026</div>
          <div style={{ height:1, width:60, background:BRAND.gold }}/>
        </div>
        <div style={{ fontSize:13, fontFamily:'Arial, sans-serif', textAlign:'center', marginTop:16, lineHeight:1.5 }}>
          {COMPANY.addr1} {COMPANY.addr2}<br/>{COMPANY.addr3}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:20, marginTop:12, fontFamily:'Arial, sans-serif', fontSize:14, fontWeight:700 }}>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Phone size={14} color={BRAND.gold}/> {COMPANY.phone}</span>
          <span style={{display:'flex',alignItems:'center',gap:6}}><Mail size={14} color={BRAND.gold}/> {COMPANY.email}</span>
        </div>
      </div>
    </div>
  );
}
