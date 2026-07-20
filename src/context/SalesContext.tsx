import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SaleRecord, CorteCaja, CartItem, PayModal } from '../models/types';
import { api } from '../services/api';
import { useInventory } from './InventoryContext';

interface SalesContextType {
  orders: SaleRecord[];
  cortes: CorteCaja[];
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  addCorte: (c: CorteCaja) => void;
  confirmSale: (payModal: PayModal, onComplete: (total: number, method: string, cartCopy: CartItem[], id: string) => void) => Promise<void>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider = ({ children }: { children: ReactNode }) => {
  const { setProducts } = useInventory();
  const [orders, setOrders] = useState<SaleRecord[]>([]);
  const [cortes, setCortes] = useState<CorteCaja[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    api.getVentas().then(res => {
      // Ensure all loaded orders have a valid date grouping for the prototype
      const formatted = res.map(o => ({ ...o, date: o.date || 'hoy', time: o.time || o.hora || '12:00 PM' }));
      setOrders(formatted);
    }).catch(console.error);
  }, []);

  const addCorte = (c: CorteCaja) => setCortes(prev => [c, ...prev]);

  const confirmSale = async (payModal: PayModal, onComplete: (total: number, method: string, cartCopy: CartItem[], id: string) => void) => {
    const total = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
    const id = `#F-${String(orders.length + 40).padStart(4, "0")}`;
    
    const payload = {
      IdVenta: id,
      Detalles: cart.map(c => ({
        IdProducto: Number(c.product.id),
        Cantidad: c.qty,
        PrecioUnitario: c.product.price
      })),
      Total: total,
      MontoEntregado: payModal === "efectivo" ? total : 0
    };

    const applyStockDeduction = () => {
      setProducts(prev => prev.map(p => {
        const item = cart.find(c => c.product.id === p.id);
        return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
      }));
    };

    try {
      const endpoint = payModal === "efectivo" ? "efectivo" : "tarjeta";
      const newOrder = await api.registrarVenta(endpoint, payload);
      
      const completeOrder: SaleRecord = { ...newOrder, date: newOrder.date || "hoy", time: newOrder.time || new Date().toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'}), items: newOrder.items || cart.length };
      setOrders(prev => [...prev, completeOrder]);
      
      const method = payModal === "efectivo" ? "Efectivo" : "Tarjeta";
      applyStockDeduction();
      onComplete(total, method, [...cart], id);
      setCart([]);
    } catch (e) {
      console.error(e);
      // Fallback local for testing
      const method = payModal === "efectivo" ? "Efectivo" : "Tarjeta";
      const localOrder: SaleRecord = { id, time: new Date().toLocaleTimeString('es-MX', {hour:'2-digit', minute:'2-digit'}), items: cart.length, total, method: method === "Efectivo" ? "EFECTIVO" : "TARJETA", date: "hoy" };
      setOrders(prev => [...prev, localOrder]);
      
      applyStockDeduction();
      onComplete(total, method, [...cart], id);
      setCart([]);
    }
  };

  return (
    <SalesContext.Provider value={{ orders, cortes, cart, setCart, addCorte, confirmSale }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) throw new Error('useSales must be used within a SalesProvider');
  return context;
};
