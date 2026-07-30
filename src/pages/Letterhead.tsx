import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import LetterheadPDF from '../components/LetterheadPDF';

export default function Letterhead() {
  const [body, setBody] = useState('');
  const [showPDF, setShowPDF] = useState(false);

  if (showPDF) return <LetterheadPDF body={body} onClose={()=>setShowPDF(false)}/>;

  return (
    <div className="page-enter">
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', margin: 0 }}>Letterhead</h2>
        <p style={{ color: 'var(--muted)', margin: '4px 0 0' }}>Write a letter on the official Jasmine Pollux Blooms letterhead.</p>
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between px-0 py-0 mb-3">
          <span className="font-semibold text-sm text-gray-700 flex items-center gap-2"><FileText size={14}/> Letter Content</span>
        </div>
        <textarea
          className="inp"
          style={{ minHeight:420, resize:'vertical', fontFamily:'Arial, sans-serif', fontSize:13, lineHeight:1.7 }}
          placeholder={"To,\n[Recipient Name]\n[Address]\n\nSubject: ...\n\nDear Sir/Madam,\n\nType your letter content here..."}
          value={body}
          onChange={e=>setBody(e.target.value)}
        />
        <div className="flex justify-end mt-4">
          <button onClick={()=>setShowPDF(true)} className="btn-brand flex items-center gap-2">
            <Download size={14}/> Preview &amp; Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
