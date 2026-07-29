import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Vendor {
  id: number;
  code: string;
  name: string;
  mobile: string;
  address: string;
  gst: string;
  pan: string;
  email: string;
  bankDetails: string;
}

const INITIAL_VENDORS: Vendor[] = [
  { id:1, code:'JPB00001', name:'Black Tulip Flowers Intl', mobile:'+91 89706 36427', address:'#2&3, Shree AMM Residency, Dr. Marigowda Road, Hosur Main Road, Bengaluru', gst:'29XXXXXXXXXXXXX', pan:'AAXXX0000X', email:'sales.btfi@btfgroup.com', bankDetails:'ICICI Bank — A/c 000000000000' },
  { id:2, code:'JPB00002', name:'Misty Blooms', mobile:'+91 94833 96546', address:'230/4, 12th Cross Road, Wilson Garden, Bangalore', gst:'29XXXXXXXXXXXXX', pan:'AAXXX0000X', email:'accounts@mistybloom.in', bankDetails:'ICICI Bank — A/c 343605000393' },
  { id:3, code:'JPB00003', name:'Amazis Flora', mobile:'+91 93431 78474', address:'Hosur Main Road, Bengaluru', gst:'29XXXXXXXXXXXXX', pan:'AAXXX0000X', email:'amazisflora@example.com', bankDetails:'—' },
];

interface VendorContextType {
  vendors: Vendor[];
  addVendor: (v: Omit<Vendor,'id'|'code'>) => void;
  nextCode: () => string;
}

const VendorContext = createContext<VendorContextType | null>(null);

export const VendorProvider = ({ children }: { children: ReactNode }) => {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);

  const nextCode = () => `JPB${String(vendors.length + 1).padStart(5, '0')}`;

  const addVendor = (v: Omit<Vendor,'id'|'code'>) => {
    setVendors(prev => [...prev, { ...v, id: Date.now(), code: `JPB${String(prev.length + 1).padStart(5, '0')}` }]);
  };

  return (
    <VendorContext.Provider value={{ vendors, addVendor, nextCode }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendors = () => {
  const ctx = useContext(VendorContext);
  if (!ctx) throw new Error('useVendors must be inside VendorProvider');
  return ctx;
};
