import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Supplier, SupplierOrder } from '../models/types';

interface SuppliersContextType {
  suppliers: Supplier[];
  supplierOrders: SupplierOrder[];
  addSupplier: (s: Supplier) => void;
  addOrder: (o: SupplierOrder) => void;
  updateOrder: (o: SupplierOrder) => void;
}

const SuppliersContext = createContext<SuppliersContextType | undefined>(undefined);

export const SuppliersProvider = ({ children }: { children: ReactNode }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierOrders, setSupplierOrders] = useState<SupplierOrder[]>([]);

  const addSupplier = (s: Supplier) => setSuppliers(prev => [...prev, s]);
  const addOrder = (o: SupplierOrder) => setSupplierOrders(prev => [o, ...prev]);
  const updateOrder = (updated: SupplierOrder) => {
    setSupplierOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  return (
    <SuppliersContext.Provider value={{ suppliers, supplierOrders, addSupplier, addOrder, updateOrder }}>
      {children}
    </SuppliersContext.Provider>
  );
};

export const useSuppliers = () => {
  const context = useContext(SuppliersContext);
  if (!context) throw new Error('useSuppliers must be used within a SuppliersProvider');
  return context;
};
