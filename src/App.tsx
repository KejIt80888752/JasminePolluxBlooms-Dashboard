import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { InventoryProvider } from './contexts/InventoryContext';
import { VendorProvider } from './contexts/VendorContext';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Overview from './pages/Overview';
import Inventory from './pages/Inventory';
import StockTransfer from './pages/StockTransfer';
import DamageStock from './pages/DamageStock';
import Vendors from './pages/Vendors';
import BillingInvoice from './pages/BillingInvoice';
import Quotation from './pages/Quotation';
import Leads from './pages/Leads';
import Users from './pages/Users';
import './index.css';

const PAGES: Record<string, React.ComponentType> = {
  overview:  Overview,
  inventory: Inventory,
  'stock-transfer': StockTransfer,
  'damage-stock': DamageStock,
  vendors: Vendors,
  billing:   BillingInvoice,
  quotation: Quotation,
  leads:     Leads,
  users:     Users,
};

function Dashboard() {
  const [page, setPage] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const PageComponent = PAGES[page] ?? Overview;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar page={page} setPage={setPage} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg)' }}>
        <Topbar page={page} onMenuClick={() => { if(window.innerWidth < 1024) setSidebarOpen(o => !o); }} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <PageComponent />
        </main>
      </div>
    </div>
  );
}

function AppInner() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Dashboard /> : <Login />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InventoryProvider>
          <VendorProvider>
            <AppInner />
          </VendorProvider>
        </InventoryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
