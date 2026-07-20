import { Product, Supplier, SaleRecord } from '../models/types';

const API_BASE = 'http://localhost:5071/api';

export const api = {
  getProductos: async (): Promise<Product[]> => {
    const res = await fetch(`${API_BASE}/productos`);
    if (!res.ok) throw new Error('Error al cargar productos');
    const data = await res.json();
    return data.map((p: any) => ({
      id: p.idProducto,
      name: p.nombre,
      price: p.precio,
      cost: p.costo,
      unit: p.unidad,
      category: p.categoria,
      stock: p.stock
    }));
  },
  
  getVentas: async (): Promise<SaleRecord[]> => {
    const res = await fetch(`${API_BASE}/ventas`);
    if (!res.ok) throw new Error('Error al cargar ventas');
    const data = await res.json();
    return data.map((v: any) => ({
      id: v.idVenta,
      fecha: v.fecha,
      hora: v.hora,
      total: v.total,
      method: "EFECTIVO", // Default for dummy
      items: v.listaDetalles ? v.listaDetalles.reduce((sum: number, d: any) => sum + d.cantidad, 0) : 0,
      listaDetalles: v.listaDetalles
    }));
  },

  registrarVenta: async (endpoint: 'efectivo' | 'tarjeta', payload: any): Promise<SaleRecord> => {
    const res = await fetch(`${API_BASE}/ventas/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Error al registrar venta');
    return res.json();
  }
};
