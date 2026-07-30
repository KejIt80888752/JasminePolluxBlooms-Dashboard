import { useState } from 'react';
import { Download, CreditCard, Phone, Mail } from 'lucide-react';
import BusinessCardPDF from '../components/BusinessCardPDF';
import jpbMark from '../assets/jpb-mark.png';
import { COMPANY, BRAND } from '../lib/brand';

export default function BusinessCard() {
  const [showPDF, setShowPDF] = useState(false);

  if (showPDF) return <BusinessCardPDF onClose={()=>setShowPDF(false)}/>;

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Business Card</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Official Jasmine Pollux Blooms business card.</p>
      </div>

      <div className="card p-8 flex flex-col items-center">
        <div style={{ width:'100%', maxWidth:640, aspectRatio:'16/9', background:'#fff', border:'1px solid #e5e7eb', borderRadius:8, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Georgia, serif', color:BRAND.dark, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
          <img src={jpbMark} alt="JPB" style={{ width:'18%', objectFit:'contain' }}/>
          <div style={{ fontSize:'clamp(16px,3vw,28px)', fontWeight:700, letterSpacing:1, marginTop:8 }}>{COMPANY.name}</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:4 }}>
            <div style={{ height:1, width:40, background:BRAND.gold }}/>
            <div style={{ fontSize:'clamp(9px,1.2vw,13px)', color:BRAND.gold, fontWeight:700 }}>EST. 2026</div>
            <div style={{ height:1, width:40, background:BRAND.gold }}/>
          </div>
          <div style={{ fontSize:'clamp(8px,1.1vw,12px)', fontFamily:'Arial, sans-serif', textAlign:'center', marginTop:10 }}>
            {COMPANY.addr1} {COMPANY.addr2}<br/>{COMPANY.addr3}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:8, fontFamily:'Arial, sans-serif', fontSize:'clamp(8px,1.1vw,12px)', fontWeight:700 }}>
            <span style={{display:'flex',alignItems:'center',gap:4}}><Phone size={12} color={BRAND.gold}/> {COMPANY.phone}</span>
            <span style={{display:'flex',alignItems:'center',gap:4}}><Mail size={12} color={BRAND.gold}/> {COMPANY.email}</span>
          </div>
        </div>

        <button onClick={()=>setShowPDF(true)} className="btn-brand flex items-center gap-2 mt-6">
          <Download size={14}/> Download Business Card PDF
        </button>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><CreditCard size={12}/> Standard 89mm × 51mm print size</p>
      </div>
    </div>
  );
}
