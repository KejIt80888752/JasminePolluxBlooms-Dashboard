import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import raiseLogo from "../assets/the-raise-logo.png";
import jpbMark from "../assets/jpb-mark.png";

const DEMO = [
  { role: "Super Admin", user: "admin" },
  { role: "Owner", user: "jasmine" },
  { role: "Manager", user: "jasminepolluxblooms@gmail.com" },
  { role: "Staff", user: "8147219077" },
];

export default function Login() {
  const { login } = useAuth();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (login(user, pass)) {
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"#fdf2f8", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ display:"flex", width:"100%", maxWidth:920, borderRadius:20, overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,.18)", minHeight:560 }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ flex:1, background:"#3f1d33", padding:"40px 36px", display:"flex", flexDirection:"column", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 80% 10%,rgba(236,72,153,.22) 0%,transparent 55%)", pointerEvents:"none" }}/>
          <img src={jpbMark} alt="" aria-hidden="true"
            style={{ position:"absolute", bottom:-60, right:-60, width:320, opacity:0.06, pointerEvents:"none", filter:"grayscale(1) brightness(3)" }}/>

          {/* Brand */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28, position:"relative" }}>
            <div style={{ width:54, height:54, borderRadius:12, background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, padding:4 }}>
              <img src={jpbMark} alt="JPB" style={{ width:"100%", height:"100%", objectFit:"contain" }}/>
            </div>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:"#fff", lineHeight:1.2 }}>Jasmine Pollux Blooms</div>
              <div style={{ fontSize:10, fontWeight:700, color:"#ec4899", letterSpacing:".1em", textTransform:"uppercase" }}>FLOWERS WITH CARE</div>
            </div>
          </div>

          <div style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.3, marginBottom:10, position:"relative" }}>Flower Business Management<br/>Dashboard</div>
          <div style={{ fontSize:12.5, color:"#d8b4cf", lineHeight:1.7, marginBottom:24, position:"relative" }}>
            Manage billing, inventory, quotations, leads &amp; users for weddings, events and decoration orders — Wilson Garden, Bangalore.
          </div>

          {/* Stats grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:24, position:"relative" }}>
            {[["1985","Since"],["500+","Events"],["24/7","Support"],["GST","Registered"]].map(([val,lbl])=>(
              <div key={lbl} style={{ background:"rgba(255,255,255,.06)", border:"1px solid rgba(255,255,255,.08)", borderRadius:12, padding:"14px 16px" }}>
                <div style={{ fontSize:18, fontWeight:800, color:"#ec4899", lineHeight:1.1 }}>{val}</div>
                <div style={{ fontSize:11, color:"#d8b4cf", marginTop:3 }}>{lbl}</div>
              </div>
            ))}
          </div>

          {/* Address */}
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14, position:"relative" }}>
            {[
              ["fa-location-dot","22/18, Shilpa Building, 12th Cross, Lakkasandra, Wilson Garden, Bangalore 560030"],
              ["fa-phone","+91 97403 24378 / +91 99669 60816"],
              ["fa-envelope","jasminepolluxblooms@gmail.com"],
            ].map(([icon,text])=>(
              <div key={text} style={{ fontSize:11.5, color:"#d8b4cf", display:"flex", alignItems:"flex-start", gap:7 }}>
                <i className={`fa ${icon}`} style={{ color:"#ec4899", fontSize:11, marginTop:2, flexShrink:0 }}/>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:"auto", position:"relative" }}>
            {["Weddings","Bouquets","Event Decor","Garlands","Corporate Events"].map(t=>(
              <span key={t} style={{ fontSize:10, color:"#d8b4cf", background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.08)", borderRadius:6, padding:"3px 8px" }}>{t}</span>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(255,255,255,.08)", position:"relative" }}>
            <div style={{ fontSize:10, color:"#d8b4cf" }}>GSTIN <span style={{ color:"#ec4899" }}>29AAXFJ0042J1ZZ</span></div>
            <div style={{ fontSize:10, color:"#8a6b83", marginTop:2, marginBottom:10 }}>© 2026 Jasmine Pollux Blooms</div>
            <div style={{ fontSize:9, color:"#8a6b83", textTransform:"uppercase", letterSpacing:".08em", marginBottom:4 }}>Powered by</div>
            <img src={raiseLogo} alt="The Raise" style={{ height:18, width:"auto", objectFit:"contain", opacity:.9, display:"block" }}/>
            <div style={{ fontSize:9, color:"#8a6b83", marginTop:4 }}>KEJ IT</div>
          </div>
        </div>

        {/* ── RIGHT WHITE PANEL ── */}
        <div style={{ width:400, background:"#fff", padding:"44px 40px", display:"flex", flexDirection:"column", justifyContent:"center", flexShrink:0, position:"relative", overflow:"hidden" }}>
          <img src={jpbMark} alt="" aria-hidden="true"
            style={{ position:"absolute", top:-40, right:-50, width:200, opacity:0.05, pointerEvents:"none" }}/>
          <div style={{ fontSize:26, fontWeight:800, color:"#3f1d33", marginBottom:4, position:"relative" }}>Sign In</div>
          <div style={{ fontSize:13, color:"#8a6b83", marginBottom:28 }}>Access your dashboard</div>

          {error && (
            <div style={{ background:"rgba(190,24,93,.08)", border:"1px solid rgba(190,24,93,.2)", borderRadius:8, padding:"9px 13px", fontSize:12.5, color:"#be185d", marginBottom:14 }}>
              <i className="fa fa-circle-exclamation"/> &nbsp;Invalid credentials. Please try again.
            </div>
          )}

          <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6 }}>Email Address</label>
          <div style={{ position:"relative", marginBottom:16 }}>
            <input
              value={user} onChange={e=>setUser(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              type="text" placeholder="you@jasminepolluxblooms.in"
              style={{ width:"100%", padding:"11px 14px", border:"1.5px solid #f3d9e8", borderRadius:10, fontSize:14, fontFamily:"inherit", color:"#3f1d33", outline:"none", background:"#fdf2f8" }}
            />
          </div>

          <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#374151", marginBottom:6 }}>Password</label>
          <div style={{ position:"relative", marginBottom:20 }}>
            <input
              value={pass} onChange={e=>setPass(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              type={showPw?"text":"password"} placeholder="••••••••"
              style={{ width:"100%", padding:"11px 40px 11px 14px", border:"1.5px solid #f3d9e8", borderRadius:10, fontSize:14, fontFamily:"inherit", color:"#3f1d33", outline:"none", background:"#fdf2f8" }}
            />
            <span onClick={()=>setShowPw(p=>!p)} style={{ position:"absolute", right:13, top:"50%", transform:"translateY(-50%)", cursor:"pointer", color:"#8a6b83", fontSize:14 }}>
              <i className={`fa ${showPw?"fa-eye-slash":"fa-eye"}`}/>
            </span>
          </div>

          <button onClick={handleLogin} style={{ width:"100%", padding:13, background:"#be185d", color:"#fff", border:"none", borderRadius:10, fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer", boxShadow:"0 4px 14px rgba(190,24,93,.35)", marginBottom:20 }}>
            Sign In
          </button>

          <div style={{ fontSize:10.5, fontWeight:700, color:"#8a6b83", letterSpacing:".08em", textTransform:"uppercase", marginBottom:10 }}>Demo Credentials — click to fill</div>
          {DEMO.map(d=>(
            <div key={d.role} onClick={()=>{setUser(d.user);setPass("bloom@2026");}}
              style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 12px", borderRadius:9, cursor:"pointer", border:"1px solid transparent", marginBottom:4, transition:"all .15s" }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background="#fdf2f8";(e.currentTarget as HTMLElement).style.borderColor="#f3d9e8";}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background="";(e.currentTarget as HTMLElement).style.borderColor="transparent";}}
            >
              <span style={{ fontSize:13, fontWeight:600, color:"#3f1d33" }}>{d.role}</span>
              <span style={{ fontSize:12, color:"#8a6b83" }}>{d.user}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
