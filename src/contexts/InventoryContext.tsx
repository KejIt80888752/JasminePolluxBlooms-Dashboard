import { createContext, useContext, useState, type ReactNode } from 'react';

export interface InventoryItem {
  id: number;
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

export const LOCATIONS = ['Warehouse - 1', 'Warehouse - 2', 'Warehouse - 3', 'Hyderabad'];

export const computeStatus = (qty: number): InventoryItem['status'] =>
  qty === 0 ? 'Out of Stock' : qty < 20 ? 'Low Stock' : 'OK';

/* Add real stock via "Add Item" or the Excel bulk upload — no placeholder data. */
const INITIAL_DATA: InventoryItem[] = [];

interface InventoryContextType {
  items: InventoryItem[];
  addItem: (item: Omit<InventoryItem,'id'|'status'>) => void;
  addItems: (items: Omit<InventoryItem,'id'|'status'>[]) => void;
  findByCodeOrColour: (query: string) => InventoryItem | undefined;
}

const InventoryContext = createContext<InventoryContextType | null>(null);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_DATA);

  const addItem = (item: Omit<InventoryItem,'id'|'status'>) => {
    setItems(prev => [...prev, { ...item, id: Date.now()+Math.random(), status: computeStatus(item.qty) }]);
  };

  const addItems = (newItems: Omit<InventoryItem,'id'|'status'>[]) => {
    setItems(prev => [...prev, ...newItems.map((it,i) => ({ ...it, id: Date.now()+Math.random()+i, status: computeStatus(it.qty) }))]);
  };

  const findByCodeOrColour = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return undefined;
    return items.find(it => it.code.toLowerCase() === q || `${it.category} ${it.colour}`.toLowerCase() === q);
  };

  return (
    <InventoryContext.Provider value={{ items, addItem, addItems, findByCodeOrColour }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error('useInventory must be inside InventoryProvider');
  return ctx;
};
