import { SaleRecord, Product } from "../models/types";

export class AnalyticsService {
  static getProductoEstrella(orders: SaleRecord[], products: Product[]): string {
    if (orders.length === 0) return "Ninguno";
    const counts: Record<number, number> = {};
    orders.forEach(o => {
      const details = o.listaDetalles || [];
      details.forEach((d: any) => {
        counts[d.idProducto] = (counts[d.idProducto] || 0) + d.cantidad;
      });
    });
    const keys = Object.keys(counts);
    if (keys.length === 0) return "N/A";
    const bestId = keys.reduce((a, b) => counts[Number(a)] > counts[Number(b)] ? a : b, keys[0]);
    const bestProd = products.find(p => p.id === Number(bestId));
    return bestProd ? bestProd.name : "N/A";
  }

  static getAcumuladoDiario(orders: SaleRecord[]) {
    const efectivoTotal = orders.filter(o => o.method === "EFECTIVO").reduce((s, o) => s + o.total, 0);
    const tarjetaTotal  = orders.filter(o => o.method === "TARJETA").reduce((s, o) => s + o.total, 0);
    return { efectivoTotal, tarjetaTotal, total: efectivoTotal + tarjetaTotal };
  }

  static getDiarioData(orders: SaleRecord[]) {
    const buckets = [
      { label: "8am", min: 8, max: 9 },
      { label: "10am", min: 10, max: 11 },
      { label: "12pm", min: 12, max: 13 },
      { label: "2pm", min: 14, max: 15 },
      { label: "4pm", min: 16, max: 17 },
      { label: "6pm", min: 18, max: 23 }
    ];
    return buckets.map(b => {
      const val = orders.filter(o => {
        const hStr = o.time || o.hora || "00";
        const h = parseInt(hStr.split(":")[0]);
        return h >= b.min && h <= b.max;
      }).reduce((s, o) => s + o.total, 0);
      return { label: b.label, value: val };
    });
  }

  static getSemanalData(totalVentas: number) {
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'short' });
    const labels = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    return labels.map(l => ({
      label: l.charAt(0).toUpperCase() + l.slice(1),
      value: l === today.substring(0, 3).toLowerCase() ? totalVentas : 0
    }));
  }

  static getMensualData(totalVentas: number) {
    return [
      { label: "Sem 1", value: 0 },
      { label: "Sem 2", value: 0 },
      { label: "Sem 3", value: 0 },
      { label: "Sem 4", value: totalVentas }
    ];
  }
}
