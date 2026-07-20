import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { C } from "../../utils/constants";
import { Screen, SupplierOrder } from "../../models/types";
import { useSuppliers } from "../../context/SuppliersContext";

export function ListaPedidosScreen({ goTo, onSelectOrder }:{ goTo:(s:Screen)=>void; onSelectOrder:(o:SupplierOrder)=>void }) {
  const { supplierOrders, suppliers } = useSuppliers();
  const pending = supplierOrders.filter(o=>o.status==="PENDIENTE");

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 border-b flex items-center px-5 py-4" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("proveedores")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-xl font-semibold ml-2" style={{ color:C.green }}>Recibir Pedidos</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {pending.length===0 && <p className="text-sm text-center py-6" style={{ color:C.muted }}>No hay pedidos pendientes por recibir.</p>}
        {pending.map(o=>{
          const supp = suppliers.find(s=>s.id===o.supplierId);
          return (
            <button key={o.id} onClick={()=>onSelectOrder(o)} className="bg-white rounded-xl p-4 border flex items-center justify-between active:scale-95 transition-transform text-left" style={{ borderColor:C.border }}>
              <div>
                <p className="text-xs font-bold mb-0.5" style={{ color:C.txt2 }}>{o.id}</p>
                <p className="text-sm font-semibold leading-tight" style={{ color:C.txt1 }}>{supp?.name}</p>
                <p className="text-xs mt-1" style={{ color:C.muted }}>{o.items.length} productos esperados</p>
              </div>
              <ChevronRight size={20} color={C.muted} />
            </button>
          )
        })}
      </div>
    </div>
  );
}
