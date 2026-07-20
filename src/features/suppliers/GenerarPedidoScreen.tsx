import React, { useState } from "react";
import { ArrowLeft, Check, Search, ClipboardList } from "lucide-react";
import { C, fmt, getNextDelivery } from "../../utils/constants";
import { Screen, Product, Supplier, SupplierOrder } from "../../models/types";
import { useInventory } from "../../context/InventoryContext";
import { useSuppliers } from "../../context/SuppliersContext";

export function GenerarPedidoScreen({ goTo }:{ goTo:(s:Screen)=>void }) {
  const { products } = useInventory();
  const { suppliers, addOrder } = useSuppliers();

  const [selected,setSelected]=useState<Supplier|null>(null); 
  const [pedido,setPedido]=useState<{product:Product;qty:string}[]>([]);
  const [search,setSearch]=useState(""); 
  const [confirmed,setConfirmed]=useState(false);

  const total=pedido.reduce((s,i)=>s+i.product.cost*(parseFloat(i.qty)||0),0);
  const setQty=(p:Product,val:string)=>setPedido(prev=>{ const ex=prev.find(i=>i.product.id===p.id); if(!ex) return [...prev,{product:p,qty:val}]; if(val===""||parseFloat(val)<=0) return prev.filter(i=>i.product.id!==p.id); return prev.map(i=>i.product.id===p.id?{...i,qty:val}:i); });
  const getQty=(id:number)=>pedido.find(i=>i.product.id===id)?.qty??"";
  const filteredProds=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));

  const handleConfirm = () => {
    if(pedido.length===0 || !selected) return;
    const newOrder: SupplierOrder = {
      id: `#P-${String(Math.floor(Math.random()*10000)).padStart(4,"0")}`,
      supplierId: selected.id,
      date: new Date().toLocaleDateString("es-MX"),
      status: "PENDIENTE",
      items: pedido.map(i=>({ product:i.product, expectedQty:parseFloat(i.qty), receivedQty:0, cost:i.product.cost })),
      total
    };
    addOrder(newOrder);
    setConfirmed(true);
  };

  if(confirmed) return (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center" style={{ background:C.bg }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background:C.green }}><Check size={36} color="#fff" strokeWidth={2.5} /></div>
      <h2 className="text-2xl font-bold mb-1" style={{ color:C.txt1 }}>¡Pedido generado!</h2>
      <p className="text-sm mb-5" style={{ color:C.txt2 }}>{selected?.name}</p>
      <div className="w-full rounded-2xl border mb-6 overflow-hidden" style={{ background:"#fff", borderColor:C.border }}>
        <div className="flex justify-between items-center px-5 py-4 border-b" style={{ borderColor:C.border }}><span className="text-sm font-semibold" style={{ color:C.txt2 }}>Costo total al distribuidor</span><span className="text-2xl font-bold" style={{ color:C.green }}>{fmt(total)}</span></div>
        <div className="flex justify-between items-center px-5 py-4 border-b" style={{ borderColor:C.border }}><span className="text-sm font-semibold" style={{ color:C.txt2 }}>Productos en el pedido</span><span className="text-sm font-bold" style={{ color:C.txt1 }}>{pedido.length} productos</span></div>
        <div className="flex items-center gap-3 px-5 py-4" style={{ background:"rgba(45,106,79,0.05)" }}>
          <span className="text-2xl">🚚</span>
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color:C.txt2 }}>Próxima entrega del proveedor</p>
            <p className="text-base font-bold" style={{ color:C.green }}>{selected?getNextDelivery(selected.deliveryDays):"—"}</p>
            <p className="text-xs" style={{ color:C.muted }}>Días: {selected?.deliveryDays.join(", ")||"No definidos"}</p>
          </div>
        </div>
      </div>
      <button onClick={()=>{ setConfirmed(false); setPedido([]); setSelected(null); }} className="w-full h-14 rounded-full text-white text-base font-semibold mb-3 active:scale-95" style={{ background:C.green }}>Nuevo Pedido</button>
      <button onClick={()=>goTo("proveedores")} className="w-full h-14 rounded-full text-base font-semibold active:scale-95" style={{ background:C.chip, color:C.green }}>Volver a Proveedores</button>
    </div>
  );

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 border-b flex items-center px-5 py-4" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("proveedores")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-xl font-semibold ml-2" style={{ color:C.green }}>Generar Pedido</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 pb-4 flex flex-col gap-5 md:max-w-6xl md:mx-auto md:w-full">
        <div>
          <p className="text-sm font-bold mb-3" style={{ color:C.txt1 }}>1. Selecciona el proveedor</p>
          <div className="flex flex-col gap-2">{suppliers.map(s=>(<button key={s.id} onClick={()=>setSelected(s)} className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left" style={{ background:selected?.id===s.id?C.green2:"#fff", borderColor:selected?.id===s.id?C.green:C.border }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shrink-0" style={{ background:selected?.id===s.id?"rgba(255,255,255,0.2)":C.green2, color:"#fff" }}>{s.name.charAt(0)}</div>
            <div className="flex-1 min-w-0"><p className="font-semibold text-sm leading-tight" style={{ color:selected?.id===s.id?C.greenTxt:C.txt1 }}>{s.name}</p><p className="text-xs" style={{ color:selected?.id===s.id?"rgba(168,231,197,0.7)":C.txt2 }}>{s.category}{s.deliveryDays.length?` · Entrega: ${s.deliveryDays.join(", ")}`:""}  </p></div>
            {selected?.id===s.id&&<Check size={18} color={C.greenTxt} strokeWidth={2.5} />}
          </button>))}</div>
        </div>
        <div>
          <p className="text-sm font-bold mb-1" style={{ color:C.txt1 }}>2. Agrega productos y cantidades</p>
          <p className="text-xs mb-3" style={{ color:C.txt2 }}>Precios al distribuidor (costo de compra)</p>
          <div className="relative mb-3"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="w-full h-10 rounded-xl pl-9 pr-4 text-sm border outline-none" style={{ background:"#fff", borderColor:C.muted, color:C.txt1 }} /></div>
          <div className="flex flex-col gap-2">{filteredProds.map(p=>{ const qty=getQty(p.id); const inPedido=!!qty&&parseFloat(qty)>0; return (
            <div key={p.id} className="rounded-xl px-3 py-3 border transition-all" style={{ background:inPedido?"rgba(45,106,79,0.06)":"#fff", borderColor:inPedido?C.green:C.border }}>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0"><p className="text-base font-bold" style={{ color:C.txt1 }}>{p.name}</p><div className="flex items-center gap-2"><span className="text-xs font-semibold" style={{ color:C.green }}>Costo: {fmt(p.cost)}/{p.unit}</span><span className="text-[10px]" style={{ color:C.muted }}>Venta: {fmt(p.price)}</span></div></div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={()=>setQty(p,String(Math.max(0,(parseFloat(qty)||0)-1)))} className="w-8 h-8 rounded-full flex items-center justify-center border text-lg font-light" style={{ background:"#fff", borderColor:C.muted, color:C.txt2 }}>−</button>
                  <input type="number" step="0.1" min="0" value={qty} onChange={e=>setQty(p,e.target.value)} placeholder="0" className="w-14 h-8 rounded-lg text-center text-sm font-bold border outline-none" style={{ background:"#fff", borderColor:inPedido?C.green:C.muted, color:C.txt1 }} />
                  <span className="text-xs w-6" style={{ color:C.txt2 }}>{p.unit}</span>
                  <button onClick={()=>setQty(p,String((parseFloat(qty)||0)+1))} className="w-8 h-8 rounded-full flex items-center justify-center border text-lg font-light" style={{ background:C.green, borderColor:C.green, color:"#fff" }}>+</button>
                </div>
              </div>
              {inPedido&&<div className="mt-2 flex justify-end"><span className="text-xs font-semibold" style={{ color:C.green }}>Subtotal: {fmt(p.cost*(parseFloat(qty)||0))}</span></div>}
            </div>
          );})}
          </div>
        </div>
      </div>
      <div className="shrink-0 w-full px-3 md:px-0 md:max-w-6xl md:mx-auto pb-4 md:pb-6 pt-2" style={{ background:C.bg }}>
        <div className="w-full rounded-2xl shadow-2xl overflow-hidden border p-4" style={{ background:"#fff", borderColor:C.border }}>
          {!selected?(<p className="text-sm text-center py-1" style={{ color:C.muted }}>Selecciona un proveedor para continuar</p>):(
            <>
              <div className="flex items-center justify-between mb-3">
                <div><p className="text-xs" style={{ color:C.txt2 }}>Proveedor: <span className="font-semibold" style={{ color:C.txt1 }}>{selected.name.split(" ").slice(0,2).join(" ")}</span></p><p className="text-xs" style={{ color:C.txt2 }}>{pedido.length} productos seleccionados</p></div>
                <div className="text-right"><p className="text-[10px] font-semibold tracking-widest" style={{ color:C.txt2 }}>COSTO TOTAL</p><p className="text-2xl font-bold" style={{ color:C.green }}>{fmt(total)}</p></div>
              </div>
              <button onClick={handleConfirm} disabled={pedido.length===0} className="w-full h-11 rounded-full text-sm font-semibold text-white disabled:opacity-40 active:scale-95 transition-transform flex items-center justify-center gap-2" style={{ background:C.green }}>
                <ClipboardList size={14} /> Confirmar Pedido
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
