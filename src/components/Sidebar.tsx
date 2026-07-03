import {
  LayoutDashboard, Receipt, FileText, Boxes, UserPlus, UserCog, LogOut, X, Flower2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import raiseLogo from '../assets/the-raise-logo.png';

const NAV = [
  { id:'overview',  icon:LayoutDashboard, label:'Dashboard'  },
  { id:'inventory', icon:Boxes,           label:'Inventory'  },
  { id:'billing',   icon:Receipt,         label:'Billing'    },
  { id:'quotation', icon:FileText,        label:'Quotation'  },
  { id:'leads',     icon:UserPlus,        label:'Leads'      },
  { id:'users',     icon:UserCog,         label:'Users'      },
];

interface Props { page:string; setPage:(p:string)=>void; open:boolean; onClose:()=>void; }

export default function Sidebar({ page, setPage, open, onClose }: Props) {
  const { logout } = useAuth();
  const isDesktop = () => window.innerWidth >= 1024;

  return (
    <>
      {open && !isDesktop() && <div onClick={onClose} className="fixed inset-0 bg-black/30 z-20" />}

      <aside
        className="fixed top-0 left-0 h-full w-60 z-30 flex flex-col bg-[#3f1d33] border-r border-white/5 shadow-xl transition-transform duration-300"
        style={{ transform: (open || isDesktop()) ? 'translateX(0)' : 'translateX(-100%)' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/7 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <Flower2 size={19} color="#fff" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Jasmine Pollux</p>
              <p className="text-[10px] text-pink-200/70">Blooms — Admin</p>
            </div>
          </div>
          <button onClick={onClose} className="text-pink-200/60 hover:text-white p-1 lg:hidden"><X size={15} /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
          {NAV.map(({ id, icon:Icon, label }) => {
            const active = page === id;
            return (
              <div
                key={id}
                onClick={() => { setPage(id); if(!isDesktop()) onClose(); }}
                className={`nav-link ${active ? 'active' : ''}`}
                style={active ? { backgroundColor:'#be185d', color:'#fff' } : { color:'#e9c9dd' }}
                onMouseEnter={e => { if(!active)(e.currentTarget as HTMLElement).style.backgroundColor='rgba(255,255,255,0.06)'; }}
                onMouseLeave={e => { if(!active)(e.currentTarget as HTMLElement).style.backgroundColor=''; }}
              >
                <Icon size={15} strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[13px]">{label}</span>
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-2 pb-2 pt-2 border-t border-white/7 shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand/25 border-2 border-brand/40 flex items-center justify-center text-brand-light text-xs font-bold shrink-0">J</div>
            <div>
              <p className="text-sm font-semibold text-white">Jasmine</p>
              <p className="text-[10px] text-pink-200/60">Administrator</p>
            </div>
          </div>
          <div onClick={logout} className="nav-link text-pink-200/60 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={14} /> <span className="text-[13px]">Sign Out</span>
          </div>
        </div>

        <div className="px-4 py-3 border-t border-white/5 shrink-0 text-center">
          <p className="text-[9px] text-pink-200/40 uppercase tracking-widest">Jasmine Pollux Blooms</p>
          <p className="text-[9px] text-pink-200/30 mt-0.5">Bangalore, Karnataka</p>
        </div>
        <div className="px-4 py-3 border-t border-white/5 shrink-0 text-center">
          <p className="text-[9px] text-pink-200/40 uppercase tracking-widest mb-1">Powered by</p>
          <img src={raiseLogo} alt="The Raise" className="h-4 object-contain opacity-70 mx-auto mb-1" />
          <p className="text-[9px] text-pink-200/40">KEJ IT</p>
        </div>
      </aside>

      <div className="w-60 shrink-0 hidden lg:block" />
    </>
  );
}
