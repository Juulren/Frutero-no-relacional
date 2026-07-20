import React, { useState } from "react";
import { ArrowLeft, Plus, ClipboardList } from "lucide-react";
import { C, fmt } from "../../utils/constants";
import { Screen, SupplierOrder, Product } from "../../models/types";
import { useInventory } from "../../context/InventoryContext";
import { useSuppliers } from "../../context/SuppliersContext";

export function DetalleReciboScreen({ order, goTo, onCloseOrder }:{ order:SupplierOrder; goTo:(s:Screen)=>void; onCloseOrder:()=>void }) {
  const { suppliers, updateOrder } = useSuppliers();
  const { products } = useInventory();
  
  const supp = suppliers.find(s=>s.id===order.supplierId);
  const [items, setItems] = useState(order.items.map(i=>({...i, receivedQty: i.expectedQty})));
  const [showTicket, setShowTicket] = useState(false);
  
  const [search,setSearch]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const filteredProds=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  const total = items.reduce((sum, i)=>sum + (i.cost * (isNaN(i.receivedQty)?0:i.receivedQty)), 0);

  const updateQty = (id:number, val:string) => {
    const num = parseFloat(val);
    setItems(prev=>prev.map(i=>i.product.id===id?{...i, receivedQty: isNaN(num)?0:num}:i));
  };

  const handleAddExtra = (p:Product) => {
    if(items.find(i=>i.product.id===p.id)) return;
    setItems(prev=>[...prev, {product:p, expectedQty:0, receivedQty:1, cost:p.cost}]);
    setShowAdd(false);
  };

  const handleClose = () => {
    setShowTicket(true);
  };

  const handleFinish = () => {
    updateOrder({...order, status:"RECIBIDO", items, total});
    onCloseOrder();
  };

  if(showTicket) {
    return (
      <div className="flex flex-col h-full px-5 py-6 items-center" style={{ background:"#e5e7e8" }}>
        <div className="w-full bg-white px-5 py-6 drop-shadow-md relative overflow-hidden" style={{ minHeight:400 }}>
          <div className="absolute top-0 left-0 right-0 h-2" style={{ background:"repeating-linear-gradient(45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)" }} />
          <h2 className="text-center font-bold text-lg mb-2" style={{ color:C.txt1 }}>TICKET DE RECIBO</h2>
          <p className="text-center text-xs mb-4" style={{ color:C.txt2 }}>{new Date().toLocaleString("es-MX")}</p>
          <div className="mb-4 text-xs">
            <p><strong>Folio:</strong> {order.id}</p>
            <p><strong>Proveedor:</strong> {supp?.name}</p>
          </div>
          <div className="border-t border-b py-2 mb-4 text-xs" style={{ borderColor:"#ccc" }}>
            <div className="flex font-bold mb-1"><span className="flex-1">Cant.</span><span className="flex-[2]">Producto</span><span className="text-right flex-1">Importe</span></div>
            {items.map((i,idx)=>(
              <div key={idx} className="flex mb-1"><span className="flex-1">{i.receivedQty}</span><span className="flex-[2] break-words">{i.product.name}</span><span className="text-right flex-1">{fmt(i.receivedQty*i.cost)}</span></div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-sm mb-8"><span style={{ color:C.txt1 }}>TOTAL RECIBIDO:</span><span style={{ color:C.txt1 }}>{fmt(total)}</span></div>
          <div className="text-center border-t pt-4 mb-4" style={{ borderColor:"#ccc" }}>
            <p className="text-xs text-gray-500">Firma del Cajero</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background:"repeating-linear-gradient(-45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)" }} />
        </div>
        <div className="mt-auto w-full">
          <button onClick={handleFinish} className="w-full h-14 rounded-full text-white text-base font-semibold active:scale-95 transition-transform" style={{ background:C.green }}>Confirmar e Imprimir</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <div className="shrink-0 border-b flex items-center px-5 py-4" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("recibir-pedidos")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-xl font-semibold ml-2" style={{ color:C.green }}>Recibo de Mercancía</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-8">
        <div className="mb-4">
          <p className="text-xs font-bold" style={{ color:C.txt2 }}>Folio: {order.id}</p>
          <p className="text-base font-bold leading-tight" style={{ color:C.txt1 }}>{supp?.name}</p>
        </div>
        <div className="flex flex-col gap-3">
          {items.map(i=>(
            <div key={i.product.id} className="bg-white p-3 rounded-xl border flex flex-col gap-2" style={{ borderColor:C.border }}>
              <div className="flex justify-between">
                <div><p className="text-sm font-bold" style={{ color:C.txt1 }}>{i.product.name}</p><p className="text-xs" style={{ color:C.muted }}>Costo: {fmt(i.cost)}</p></div>
                <div className="text-right"><p className="text-xs" style={{ color:C.txt2 }}>Esperado: {i.expectedQty}</p></div>
              </div>
              <div className="flex items-center justify-between rounded-lg p-2" style={{ background:C.inp }}>
                <span className="text-xs font-semibold text-gray-600">Cant. Recibida:</span>
                <input type="number" step="0.1" min="0" value={i.receivedQty} onChange={e=>updateQty(i.product.id, e.target.value)} className="w-20 h-8 rounded text-center font-bold border outline-none bg-white" style={{ borderColor:C.muted, color:C.txt1 }} />
              </div>
            </div>
          ))}
          <button onClick={()=>setShowAdd(!showAdd)} className="h-10 rounded-xl border border-dashed flex items-center justify-center gap-2 text-sm font-semibold transition-colors" style={{ borderColor:C.green, color:C.green }}><Plus size={16} /> Agregar Producto Extra</button>
          
          {showAdd && (
            <div className="bg-white p-3 rounded-xl border flex flex-col gap-2 mt-2" style={{ borderColor:C.border }}>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="w-full h-10 rounded-xl px-3 text-sm border outline-none" style={{ borderColor:C.muted, background:C.inp }} />
              <div className="max-h-32 overflow-y-auto flex flex-col gap-1">
                {filteredProds.slice(0,10).map(p=>(
                  <button key={p.id} onClick={()=>handleAddExtra(p)} className="text-left text-sm py-2 px-2 rounded" style={{ color:C.txt1, background:C.inp }}>{p.name} - {fmt(p.cost)}</button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-2xl border p-4" style={{ background:"#fff", borderColor:C.border }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold" style={{ color:C.txt2 }}>TOTAL A PAGAR</span>
              <span className="text-xl font-bold" style={{ color:C.green }}>{fmt(total)}</span>
            </div>
            <button onClick={handleClose} className="w-full h-12 rounded-full text-sm font-bold text-white flex items-center justify-center gap-2 active:scale-95 transition-transform" style={{ background:C.green }}><ClipboardList size={16} /> Cerrar y Recibir Pedido</button>
          </div>
        </div>
      </div>
    </div>
  );
}
