import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

import { AppHeader, VerDetallesBtn } from '../components/Shared';
export function ProveedoresScreen({ suppliers, goTo, onBell, notifCount, userRole }:{ suppliers:Supplier[]; goTo:(s:Screen)=>void; onBell:()=>void; notifCount:number; userRole:UserRole }) {
  const [search,setSearch]=useState(""); const [expanded,setExpanded]=useState<number|null>(null);
  const filtered=suppliers.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <AppHeader onBell={onBell} notifCount={notifCount} />
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-[130px] md:max-w-5xl mx-auto w-full md:pb-32">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold" style={{ color:C.txt1 }}>Proveedores</h2>
            {userRole==="admin" && <button onClick={()=>goTo("nuevo-proveedor")} className="flex items-center gap-1.5 h-10 px-4 rounded-full text-white text-xs font-semibold active:scale-95 transition-transform" style={{ background:C.green }}><Plus size={13} /> Agregar proveedor</button>}
          </div>
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar proveedor..." className="w-full h-11 rounded-xl pl-10 pr-4 text-sm border outline-none" style={{ background:"#fff", borderColor:C.muted, color:C.txt1 }} /></div>
          <div className="flex gap-2">
            <button onClick={()=>goTo("recibir-pedidos")} className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-transform active:scale-95 shadow-sm" style={{ background:"#fff", borderColor:C.muted, color:C.green, border:"1px solid" }}>
              <Truck size={15} /> Recibir Pedidos
            </button>
            {userRole==="admin" && (
              <button onClick={()=>goTo("generar-pedido")} className="flex-1 h-10 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-white transition-transform active:scale-95 shadow-sm" style={{ background:C.green }}>
                <ClipboardList size={15} /> Generar Pedido
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-4 md:items-start">
            {filtered.length===0 && <p className="text-sm text-center py-6" style={{ color:C.muted }}>Sin proveedores registrados</p>}
            {filtered.map(s=>(
              <div key={s.id} className="bg-white rounded-xl overflow-hidden border drop-shadow-[0px_1px_2px_rgba(0,0,0,0.05)]" style={{ borderColor:C.border }}>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background:C.green2 }}>{s.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0"><p className="font-semibold text-sm leading-tight" style={{ color:C.txt1 }}>{s.name}</p><p className="text-xs" style={{ color:C.txt2 }}>{s.category}</p></div>
                  <div className="border-l pl-3" style={{ borderColor:C.border }}><VerDetallesBtn id={s.id} expanded={expanded} onToggle={id=>setExpanded(expanded===id?null:id as number)} /></div>
                </div>
                {expanded===s.id&&(
                  <div className="px-4 pb-4 pt-2 border-t" style={{ borderColor:C.border, background:C.inp }}>
                    <div className="flex flex-col gap-3 text-sm">
                      {[["📞","Teléfono",s.phone],["📍","Dirección",s.address],["📝","Notas",s.notes],["🚚","Días de entrega",s.deliveryDays.length?s.deliveryDays.join(", "):"No definidos"]].map(([icon,label,val])=>(
                        <div key={label as string} className="flex items-start gap-2"><span className="text-base mt-0.5">{icon}</span><div><p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color:C.txt2 }}>{label as string}</p><p style={{ color:C.txt1 }}>{val as string}</p></div></div>
                      ))}
                      {s.deliveryDays.length>0&&(
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:"rgba(45,106,79,0.07)" }}>
                          <span className="text-sm font-semibold" style={{ color:C.green }}>📅 Próxima entrega: {getNextDelivery(s.deliveryDays)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Hacer Corte de Caja
export function NuevoProveedorScreen({ setSuppliers, goTo }:{ setSuppliers:React.Dispatch<React.SetStateAction<Supplier[]>>; goTo:(s:Screen)=>void }) {
  const ALL_DAYS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const [form,setForm]=useState({ nombre:"", telefono:"", categoria:"Frutas y Verduras", direccion:"", notas:"", activo:true, deliveryDays:[] as string[] });
  const set=(k:string,v:string|boolean)=>setForm(p=>({...p,[k]:v}));
  const toggleDay=(d:string)=>setForm(p=>({ ...p, deliveryDays:p.deliveryDays.includes(d)?p.deliveryDays.filter(x=>x!==d):[...p.deliveryDays,d] }));

  const save=()=>{
    if(!form.nombre) return;
    const newSupplier:Supplier = {
      id: Date.now(),
      name: form.nombre.trim(),
      phone: form.telefono,
      category: form.categoria,
      address: form.direccion,
      notes: form.notas,
      deliveryDays: form.deliveryDays,
    };
    setSuppliers(prev=>[...prev, newSupplier]);
    goTo("proveedores");
  };

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 h-16 border-b flex items-center px-5" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("proveedores")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-[22px] font-semibold ml-2" style={{ color:C.txt1 }}>Agregar proveedor</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {[{label:"Nombre del proveedor",key:"nombre",type:"text",ph:"Ej: Distribuidora Hernández"},{label:"Teléfono",key:"telefono",type:"tel",ph:"555-123-4567"},{label:"Dirección",key:"direccion",type:"text",ph:"Calle, número, colonia"},{label:"Notas",key:"notas",type:"text",ph:"Notas adicionales..."}].map(f=>(
          <div key={f.key}><label className="text-sm font-semibold block mb-1.5" style={{ color:C.txt1 }}>{f.label}</label><input type={f.type} value={form[f.key as keyof typeof form] as string} onChange={e=>set(f.key,e.target.value)} placeholder={f.ph} className="w-full rounded-xl px-4 py-3.5 text-base border outline-none" style={{ background:"#fff", borderColor:C.muted, color:C.txt1 }} /></div>
        ))}
        <div><label className="text-sm font-semibold block mb-2" style={{ color:C.txt1 }}>Categoría</label><div className="grid grid-cols-2 gap-2">{["Frutas y Verduras","Abarrotes","Cítricos","Otro"].map(c=>(<button key={c} onClick={()=>set("categoria",c)} className="py-3 rounded-xl border text-sm font-semibold transition-colors" style={{ background:form.categoria===c?C.green:"#fff", borderColor:form.categoria===c?C.green:C.muted, color:form.categoria===c?"#fff":C.txt2 }}>{c}</button>))}</div></div>
        <div>
          <label className="text-sm font-semibold block mb-1" style={{ color:C.txt1 }}>Días de despacho</label>
          <p className="text-xs mb-3" style={{ color:C.txt2 }}>Selecciona los días que viene a entregar</p>
          <div className="grid grid-cols-4 gap-2">{ALL_DAYS.map(d=>{ const sel=form.deliveryDays.includes(d); return (<button key={d} onClick={()=>toggleDay(d)} className="py-2.5 rounded-xl border text-xs font-bold transition-all" style={{ background:sel?C.green:"#fff", borderColor:sel?C.green:C.muted, color:sel?"#fff":C.txt2 }}>{d.slice(0,3)}</button>); })}</div>
          {form.deliveryDays.length>0&&(<div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:"rgba(45,106,79,0.07)" }}><span className="text-base">🚚</span><p className="text-xs font-semibold" style={{ color:C.green }}>Entrega: {form.deliveryDays.join(", ")}</p></div>)}
        </div>
        <div className="flex items-center justify-between py-3 border-t border-b" style={{ borderColor:C.border }}><div><p className="text-sm font-semibold" style={{ color:C.txt1 }}>Proveedor activo</p><p className="text-xs" style={{ color:C.txt2 }}>Visible en la lista de proveedores</p></div><button onClick={()=>set("activo",!form.activo)} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background:form.activo?C.green:C.muted }}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.activo?"left-6":"left-1"}`} /></button></div>
        <div className="flex gap-2 pt-1"><button onClick={()=>goTo("proveedores")} className="flex-1 h-[52px] rounded-full border text-base font-semibold" style={{ borderColor:C.green, color:C.green }}>Cancelar</button><button onClick={save} disabled={!form.nombre} className="flex-1 h-[52px] rounded-full text-white text-base font-semibold disabled:opacity-40 active:scale-95" style={{ background:C.green }}>Guardar</button></div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Generar Pedido
// ══════════════════════════════════════════════════════════════════════════
export function GenerarPedidoScreen({ products, suppliers, goTo, onSavePedido }:{ products:Product[]; suppliers:Supplier[]; goTo:(s:Screen)=>void; onSavePedido:(order:SupplierOrder)=>void; }) {
  const [selected,setSelected]=useState<Supplier|null>(null); const [pedido,setPedido]=useState<{product:Product;qty:string}[]>([]);
  const [search,setSearch]=useState(""); const [confirmed,setConfirmed]=useState(false);
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
    onSavePedido(newOrder);
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

// ══════════════════════════════════════════════════════════════════════════
// Recibir Proveedores (Lista)
// ══════════════════════════════════════════════════════════════════════════
export function ListaPedidosScreen({ orders, suppliers, goTo, onSelectOrder }:{ orders:SupplierOrder[]; suppliers:Supplier[]; goTo:(s:Screen)=>void; onSelectOrder:(o:SupplierOrder)=>void }) {
  const pending = orders.filter(o=>o.status==="PENDIENTE");
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

// ══════════════════════════════════════════════════════════════════════════
// Detalle Recibo (OXXO Style)
// ══════════════════════════════════════════════════════════════════════════
export function DetalleReciboScreen({ order, suppliers, products, goTo, onCloseOrder }:{ order:SupplierOrder; suppliers:Supplier[]; products:Product[]; goTo:(s:Screen)=>void; onCloseOrder:(updatedOrder:SupplierOrder)=>void }) {
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
    onCloseOrder({...order, status:"RECIBIDO", items, total});
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

// ══════════════════════════════════════════════════════════════════════════
// Venta Confirmada