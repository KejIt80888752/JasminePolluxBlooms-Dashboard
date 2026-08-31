import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Vendor {
  id: string;
  code: string;
  name: string;
  mobile: string;
  address: string;
  gst: string;
  pan: string;
  email: string;
  bankDetails: string;
}

type Row = {
  id: string; code: string; name: string; mobile: string | null; address: string | null;
  gst: string | null; pan: string | null; email: string | null; bank_details: string | null;
};

const fromRow = (r: Row): Vendor => ({
  id: r.id, code: r.code, name: r.name, mobile: r.mobile ?? '', address: r.address ?? '',
  gst: r.gst ?? '', pan: r.pan ?? '', email: r.email ?? '', bankDetails: r.bank_details ?? '',
});

interface VendorContextType {
  vendors: Vendor[];
  loading: boolean;
  addVendor: (v: Omit<Vendor,'id'|'code'>) => Promise<void>;
  updateVendor: (id: string, v: Omit<Vendor,'id'|'code'>) => Promise<void>;
  deleteVendor: (id: string) => Promise<void>;
  nextCode: () => string;
}

const VendorContext = createContext<VendorContextType | null>(null);

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data, error } = await supabase.from('vendors').select('*').order('created_at', { ascending: true });
    if (!error && data) setVendors((data as Row[]).map(fromRow));
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const nextCode = () => `JPB${String(vendors.length + 1).padStart(5, '0')}`;

  const addVendor = async (v: Omit<Vendor,'id'|'code'>) => {
    const code = nextCode();
    const { error } = await supabase.from('vendors').insert({
      code, name: v.name, mobile: v.mobile, address: v.address, gst: v.gst, pan: v.pan, email: v.email, bank_details: v.bankDetails,
    });
    if (error) { alert(`Could not save vendor: ${error.message}`); return; }
    await refresh();
  };

  const updateVendor = async (id: string, v: Omit<Vendor,'id'|'code'>) => {
    const { error } = await supabase.from('vendors').update({
      name: v.name, mobile: v.mobile, address: v.address, gst: v.gst, pan: v.pan, email: v.email, bank_details: v.bankDetails,
    }).eq('id', id);
    if (error) { alert(`Could not update vendor: ${error.message}`); return; }
    await refresh();
  };

  const deleteVendor = async (id: string) => {
    const { error } = await supabase.from('vendors').delete().eq('id', id);
    if (error) { alert(`Could not delete vendor: ${error.message}`); return; }
    await refresh();
  };

  return (
    <VendorContext.Provider value={{ vendors, loading, addVendor, updateVendor, deleteVendor, nextCode }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendors = () => {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error('useVendors must be inside VendorProvider');
  return ctx;
};
