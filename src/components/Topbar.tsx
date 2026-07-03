import { useTheme } from '../contexts/ThemeContext';
import { Menu, Download, Bell, Sun, Moon } from 'lucide-react';

const PAGE_META: Record<string, { title:string; sub:string }> = {
  overview:  { title:'Dashboard',  sub:'Jasmine Pollux Blooms — Overview' },
  inventory: { title:'Inventory',  sub:'Flower stock & material management' },
  billing:   { title:'Billing',    sub:'Invoice and payment management' },
  quotation: { title:'Quotation',  sub:'Manage client quotations' },
  leads:     { title:'Leads',      sub:'Track and convert new leads' },
  users:     { title:'Users',      sub:'Staff accounts & access control' },
};

interface Props { page:string; onMenuClick:()=>void; }

export default function Topbar({ page, onMenuClick }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const meta = PAGE_META[page] ?? PAGE_META.overview;

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-5 flex items-center justify-between gap-4 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <Menu size={18} />
        </button>
        <div>
          <p className="text-[15px] font-bold text-gray-800 leading-tight">{meta.title}</p>
          <p className="text-[11px] text-gray-400">{meta.sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-brand btn-sm">
          <Download size={13} /> Export
        </button>
        <div className="relative">
          <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Bell size={16} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-100 border border-brand-200 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white text-[10px] font-bold">J</div>
          <span className="text-[13px] font-semibold text-gray-700">Jasmine</span>
        </div>
      </div>
    </header>
  );
}
