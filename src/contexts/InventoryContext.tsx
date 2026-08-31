import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface InventoryItem {
  id: string;
  code: string;
  colour: string;
  category: string;
  variety: string;
  qty: number;
  unit: string;
  rate: number;
  location: string;
  billNo: string;
  vendorName: string;
  status: 'OK' | 'Low Stock' | 'Out of Stock';
}

type Row = {
  id: string; code: string | null; colour: string | null; category: string | null; variety: string | null;
  qty: number; unit: string | null; rate: number; location: string | null; bill_no: string | null;
  vendor_name: string | null; status: string | null;
};

export const LOCATIONS = ['Warehouse - 1', 'Warehouse - 2', 'Warehouse - 3', 'Hyderabad'];

export const computeStatus = (qty: number): InventoryItem['status'] =>
  qty === 0 ? 'Out of Stock' : qty < 20 ? 'Low Stock' : 'OK';

const fromRow = (r: Row): InventoryItem => ({
  id: r.id, code: r.code ?? '', colour: r.colour ?? '', category: r.category ?? '', variety: r.variety ?? '',
  qty: r.qty, unit: r.unit ?? '', rate: r.rate, location: r.location ?? '', billNo: r.bill_no ?? '',
  vendorName: r.vendor_name ?? '', status: (r.status as InventoryItem['status']) ?? computeStatus(r.qty),
});

interface InventoryContextType {
  items: InventoryItem[];
  loading: boolean;
  addItem: (item: Omit<InventoryItem,'id'|'status'>) => Promise<void>;
  addItems: (items: Omit<InventoryItem,'id'|'status'>[]) => Promise<void>;
  findByCodeOrColour: (query: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const { data, error } = await supabase.from('inventory_items').select('*').order('created_at', { ascending: true });
    if (!error && data) setItems((data as Row[]).map(fromRow));
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const addItem = async (item: Omit<InventoryItem,'id'|'status'>) => {
    const { error } = await supabase.from('inventory_items').insert({
      code: item.code, colour: item.colour, category: item.category, variety: item.variety, qty: item.qty,
      unit: item.unit, rate: item.rate, location: item.location, bill_no: item.billNo, vendor_name: item.vendorName,
      status: computeStatus(item.qty),
    });
    if (error) { alert(`Could not save item: ${error.message}`); return; }
    await refresh();
  };

  const addItems = async (newItems: Omit<InventoryItem,'id'|'status'>[]) => {
    const rows = newItems.map(it => ({
      code: it.code, colour: it.colour, category: it.category, variety: it.variety, qty: it.qty,
      unit: it.unit, rate: it.rate, location: it.location, bill_no: it.billNo, vendor_name: it.vendorName,
      status: computeStatus(it.qty),
    }));
    const { error } = await supabase.from('inventory_items').insert(rows);
    if (error) { alert(`Could not import items: ${error.message}`); return; }
    await refresh();
  };

  const findByCodeOrColour = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return items.find(it => it.code.toLowerCase() === q || `${it.category} ${it.colour}`.toLowerCase() === q);
  };

  return (
    <InventoryContext.Provider value={{ items, loading, addItem, addItems, findByCodeOrColour }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be inside InventoryProvider');
  return ctx;
};
