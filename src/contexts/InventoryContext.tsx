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

const INITIAL_DATA: InventoryItem[] = [
  { id:1, code:'ANT-MED', colour:'Green', category:'Anthurium', variety:'Local', qty:120, unit:'Nos', rate:50, location:'Warehouse - 1', billNo:'JPB-2026-101', vendorName:'Black Tulip Flowers Intl', status:'OK' },
  { id:2, code:'ANT-SML', colour:'Pink', category:'Anthurium', variety:'Local', qty:80, unit:'Nos', rate:40, location:'Warehouse - 1', billNo:'JPB-2026-101', vendorName:'Black Tulip Flowers Intl', status:'OK' },
  { id:3, code:'ANT-MIN', colour:'Red', category:'Anthurium', variety:'Local', qty:18, unit:'Nos', rate:30, location:'Warehouse - 1', billNo:'JPB-2026-102', vendorName:'Misty Blooms', status:'Low Stock' },
  { id:4, code:'ROSE-RED', colour:'Red', category:'Rose', variety:'Bangalore Rose', qty:300, unit:'Nos', rate:12, location:'Warehouse - 2', billNo:'JPB-2026-103', vendorName:'Misty Blooms', status:'OK' },
  { id:5, code:'ROSE-WHT', colour:'White', category:'Rose', variety:'Dutch', qty:45, unit:'Nos', rate:18, location:'Warehouse - 2', billNo:'JPB-2026-103', vendorName:'Misty Blooms', status:'OK' },
  { id:6, code:'MARI-YEL', colour:'Yellow', category:'Marigold', variety:'Local', qty:0, unit:'Kg', rate:80, location:'Warehouse - 3', billNo:'JPB-2026-104', vendorName:'Amazis Flora', status:'Out of Stock' },
  { id:7, code:'JASMINE', colour:'White', category:'Jasmine', variety:'Mysore Mallige', qty:35, unit:'Kg', rate:600, location:'Warehouse - 1', billNo:'JPB-2026-105', vendorName:'Amazis Flora', status:'OK' },
  { id:8, code:'LILY-WHT', colour:'White', category:'Lily', variety:'Asiatic', qty:24, unit:'Stems', rate:45, location:'Warehouse - 2', billNo:'JPB-2026-106', vendorName:'Black Tulip Flowers Intl', status:'OK' },
  { id:9, code:'ORCHID', colour:'Purple', category:'Orchid', variety:'Thai', qty:60, unit:'Stems', rate:65, location:'Hyderabad', billNo:'JPB-2026-107', vendorName:'Black Tulip Flowers Intl', status:'OK' },
  { id:10, code:'RIBBON-DEC', colour:'Gold', category:'Accessory', variety:'Satin', qty:200, unit:'Mtrs', rate:8, location:'Warehouse - 3', billNo:'JPB-2026-108', vendorName:'Amazis Flora', status:'OK' },
];

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
