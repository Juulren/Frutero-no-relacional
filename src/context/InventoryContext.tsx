import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../models/types';
import { api } from '../services/api';

interface InventoryContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProductos().then(setProducts).catch(console.error);
  }, []);

  const addProduct = (p: Product) => setProducts(prev => [...prev, p]);
  
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <InventoryContext.Provider value={{ products, setProducts, addProduct, updateProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) throw new Error('useInventory must be used within an InventoryProvider');
  return context;
};
