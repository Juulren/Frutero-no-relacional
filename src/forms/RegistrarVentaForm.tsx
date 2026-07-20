import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

import { AppHeader } from '../components/Shared';
export function PaySheet({ icon, title, subtitle, total, cart, onConfirm, onCancel, children }:{
  icon:string; title:string; subtitle?:string; total:number; cart:CartItem[];
  onConfirm:()=>void; onCancel:()=>void; children?:React.ReactNode;
}) {
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background:"rgba(0,33,20,0.45)", backdropFilter:"blur(3px)" }}>
      <div className="rounded-tl-3xl rounded-tr-3xl flex flex-col overflow-hidden drop-shadow-[0px_-8px_20px_rgba(15,82,56,0.15)]" style={{ background:"#fff", maxHeight:"92%" }}>
        <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1.5 rounded-full" style={{ background:C.muted }} /></div>
        <div className="flex items-center justify-between px-5 pb-3 pt-1 shrink-0">
          <div className="flex items-center gap-2"><span className="text-2xl">{icon}</span><div><p className="text-lg font-bold" style={{ color:C.txt1 }}>{title}</p>{subtitle&&<p className="text-xs" style={{ color:C.muted }}>{subtitle}</p>}</div></div>
          <button onClick={onCancel} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:C.chip }}><X size={14} color={C.txt2} /></button>
        </div>
        <div className="mx-5 mb-4 rounded-2xl flex flex-col items-center py-5 border" style={{ background:C.bg, borderColor:C.border }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color:C.txt2 }}>TOTAL A PAGAR</p>
          <p className="text-[36px] font-bold tracking-tight leading-none" style={{ color:C.green }}>{fmt(total)}</p>
        </div>
        <div className="flex-1 overflow-y-auto px-5 flex flex-col gap-4 pb-2">
          {children}
          <div>
            <p className="text-sm font-bold mb-2" style={{ color:C.txt1 }}>Resumen de artículos</p>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor:"rgba(191,201,193,0.3)", background:"#fff" }}>
              {cart.map((i,idx)=>(
                <div key={i.product.id} className={`flex items-center justify-between px-4 py-3 ${idx<cart.length-1?"border-b":""}`} style={{ borderColor:"rgba(191,201,193,0.2)" }}>
                  <span className="text-sm flex-1" style={{ color:C.txt2 }}>{i.product.name} × {i.qty} {i.product.unit}</span>
                  <span className="text-sm font-semibold shrink-0 ml-2" style={{ color:C.txt1 }}>{fmt(i.product.price*i.qty)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor:C.border }}>
                <span className="text-base font-bold" style={{ color:C.txt1 }}>Total</span>
                <span className="text-lg font-bold" style={{ color:C.green }}>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0 px-5 pt-3 pb-6 flex flex-col gap-2 border-t" style={{ borderColor:C.border }}>
          <button onClick={onConfirm} className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-xl font-bold text-white active:scale-95 transition-transform" style={{ background:C.green }}>
            <Check size={20} color="#fff" strokeWidth={2.5} /> Confirmar Pago
          </button>
          <button onClick={onCancel} className="w-full h-12 rounded-full flex items-center justify-center text-base font-semibold active:scale-95 transition-transform" style={{ color:C.green }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export function PagoEfectivoModal({ cart, onConfirm, onCancel }:{ cart:CartItem[]; onConfirm:()=>void; onCancel:()=>void }) {
  const total=cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  const [amount,setAmount]=useState(total.toFixed(2));
  const cambio=Math.max(0,parseFloat(amount||"0")-total);
  return (
    <PaySheet icon="💵" title="Pago con efectivo" total={total} cart={cart} onConfirm={onConfirm} onCancel={onCancel}>
      <div>
        <label className="text-sm font-bold block mb-2" style={{ color:C.txt1 }}>Monto Recibido</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold" style={{ color:C.txt2 }}>$</span>
          <input value={amount} onChange={e=>setAmount(e.target.value.replace(/[^0-9.]/g,""))}
            className="w-full rounded-xl pl-10 pr-28 py-4 text-2xl font-bold border outline-none" style={{ background:C.bg, borderColor:C.muted, color:C.txt1 }} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {["100","200"].map(v=>(<button key={v} onClick={()=>setAmount(v+".00")} className="text-sm font-semibold px-3 py-2 rounded-xl" style={{ background:C.chip, color:C.txt2 }}>${v}</button>))}
          </div>
        </div>
      </div>
      <div className="rounded-xl flex items-center justify-between px-4 py-4 border" style={{ background:"rgba(148,212,177,0.15)", borderColor:"rgba(148,212,177,0.35)" }}>
        <span className="text-base font-semibold" style={{ color:C.txt1 }}>Cambio a devolver</span>
        <span className="text-2xl font-bold" style={{ color:C.green }}>{fmt(cambio)}</span>
      </div>
    </PaySheet>
  );
}

export function PagoTarjetaModal({ cart, onConfirm, onCancel }:{ cart:CartItem[]; onConfirm:()=>void; onCancel:()=>void }) {
  const total=cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  return <PaySheet icon="💳" title="Pago con tarjeta" subtitle="Presente la terminal al cliente" total={total} cart={cart} onConfirm={onConfirm} onCancel={onCancel} />;
}

// ══════════════════════════════════════════════════════════════════════════
// Dashboard
export function VentaGranelModal({ product, onConfirm, onClose }:{ product:Product; onConfirm:(qty:number)=>void; onClose:()=>void; }) {
  const [monto, setMonto] = useState("");
  const calculo = Number(monto) > 0 ? (Number(monto) / product.price) : 0;
  return (
    <div className="absolute inset-0 z-[60] flex flex-col justify-end" style={{ background:"rgba(46,49,50,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="rounded-tl-xl rounded-tr-xl flex flex-col drop-shadow-[0px_-8px_15px_rgba(15,82,56,0.1)]" style={{ background:"#fff" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor:C.border }}>
          <div className="flex items-center gap-2">
            <Scale size={18} style={{ color:C.green }} />
            <span className="text-xl font-bold" style={{ color:C.txt1 }}>Venta a granel</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:C.chip }}><X size={14} color={C.txt2} /></button>
        </div>
        <div className="px-5 py-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold" style={{ color:C.txt1 }}>{product.name}</p>
              <p className="text-sm" style={{ color:C.txt2 }}>{fmt(product.price)} / {product.unit}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-2" style={{ color:C.txt1 }}>Monto en efectivo ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold" style={{ color:C.txt2 }}>$</span>
              <input type="number" step="0.1" autoFocus value={monto} onChange={e=>setMonto(e.target.value)} placeholder="Ej: 50" className="w-full h-[52px] rounded-xl pl-10 pr-4 text-xl font-bold border outline-none" style={{ background:C.bg, borderColor:C.muted, color:C.txt1 }} />
            </div>
          </div>
          <div className="rounded-xl flex items-center justify-between px-4 py-4 border" style={{ background:"rgba(148,212,177,0.15)", borderColor:"rgba(148,212,177,0.35)" }}>
            <span className="text-sm font-semibold" style={{ color:C.txt1 }}>Equivale a</span>
            <span className="text-2xl font-bold" style={{ color:C.green }}>{calculo > 0 ? calculo.toFixed(3) : "0.000"} <span className="text-sm">{product.unit}</span></span>
          </div>
        </div>
        <div className="shrink-0 border-t px-5 py-4 flex gap-3" style={{ borderColor:C.border }}>
          <button onClick={onClose} className="flex-1 h-[52px] rounded-full border text-base font-semibold" style={{ borderColor:C.green, color:C.green }}>Cancelar</button>
          <button onClick={()=>onConfirm(Number(calculo.toFixed(3)))} disabled={calculo <= 0} className="flex-[2] h-[52px] rounded-full text-white text-base font-semibold disabled:opacity-40 active:scale-95 transition-transform" style={{ background:C.green }}>Agregar al carrito</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Registrar Venta
// ══════════════════════════════════════════════════════════════════════════
export function VentaScreen({ products, goTo, cart, setCart, openPay, onBell, notifCount }:{
  products:Product[]; goTo:(s:Screen)=>void; cart:CartItem[];
  setCart:React.Dispatch<React.SetStateAction<CartItem[]>>;
  openPay:(m:"efectivo"|"tarjeta")=>void; onBell:()=>void; notifCount:number;
}) {
  const [search,setSearch]=useState(""); const [cat,setCat]=useState<Category>("Todos");
  const [payMode,setPayMode]=useState<"efectivo"|"tarjeta">("efectivo");
  const [filter,setFilter]=useState<FilterState>(DEFAULT_FILTER); const [showFilter,setShowFilter]=useState(false);
  const [qtyInputs,setQtyInputs]=useState<Record<number,string>>({});
  const [granelProduct,setGranelProduct]=useState<Product | null>(null);

  const filtered=useMemo(()=>{
    let list=products.filter(p=>(cat==="Todos"||p.category===cat)&&p.name.toLowerCase().includes(search.toLowerCase())&&(filter.cats.length===0||filter.cats.includes(p.category as Category))&&p.price<=filter.maxPrice&&(!filter.onlyInStock||p.stock>0));
    if(filter.sortBy==="priceAsc")  list=[...list].sort((a,b)=>a.price-b.price);
    if(filter.sortBy==="priceDesc") list=[...list].sort((a,b)=>b.price-a.price);
    if(filter.sortBy==="az")        list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  },[products,cat,search,filter]);

  const getQty=(id:number)=>cart.find(i=>i.product.id===id)?.qty??0;
  const setProductQty=(p:Product,val:number)=>{
    const qty=Math.max(0,isNaN(val)?0:val);
    setCart(prev=>{ const ex=prev.find(i=>i.product.id===p.id); if(!ex&&qty>0) return [...prev,{product:p,qty}]; if(qty===0) return prev.filter(i=>i.product.id!==p.id); return prev.map(i=>i.product.id===p.id?{...i,qty}:i); });
  };
  const handleQtyBlur=(p:Product)=>{ const raw=qtyInputs[p.id]; if(raw!==undefined){ setProductQty(p,parseFloat(raw)); setQtyInputs(prev=>{ const n={...prev}; delete n[p.id]; return n; }); } };

  const cartCount=cart.reduce((s,i)=>s+i.qty,0); const subtotal=cart.reduce((s,i)=>s+i.product.price*i.qty,0);
  const activeFilters=filter.cats.length+(filter.sortBy!=="az"?1:0)+(filter.onlyInStock?1:0)+(filter.maxPrice<500?1:0);

  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <div className="shrink-0 z-[2] border-b" style={{ background:C.bg, borderColor:C.border }}>
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-3"><button onClick={()=>goTo("dashboard")}><ArrowLeft size={18} style={{ color:C.txt1 }} /></button><span className="text-xl font-semibold" style={{ color:C.green }}>Registrar venta</span></div>
          <button onClick={onBell} className="relative w-9 h-9 flex items-center justify-center rounded-full">
            <Bell size={18} style={{ color:C.txt2 }} />
            {notifCount>0&&<span className="absolute top-0 right-0 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:C.amber, color:"#fff" }}>{notifCount}</span>}
          </button>
        </div>
        <div className="px-5 pb-3 flex gap-2">
          <div className="flex-1 relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto..." className="w-full h-11 rounded-full pl-9 pr-4 text-sm outline-none border" style={{ background:"#fff", borderColor:C.muted, color:C.txt1 }} /></div>
          <button onClick={()=>setShowFilter(true)} className="relative w-11 h-11 rounded-full border flex items-center justify-center" style={{ background:activeFilters>0?C.green:"#fff", borderColor:activeFilters>0?C.green:C.muted }}>
            <Filter size={15} style={{ color:activeFilters>0?"#fff":C.green }} />
            {activeFilters>0&&<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:C.amber, color:"#fff" }}>{activeFilters}</span>}
          </button>
        </div>
        <div className="px-5 pb-3 flex gap-2 overflow-x-auto" style={{ scrollbarWidth:"none" }}>
          {(["Todos","Frutas","Verduras","Abarrotes"] as Category[]).map(c=>(
            <button key={c} onClick={()=>setCat(c)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors"
              style={{ background:cat===c?C.green:"#fff", color:cat===c?"#fff":C.txt2, borderColor:cat===c?C.green:C.muted }}>{c}</button>
          ))}
        </div>
      </div>
      <div className="shrink-0 px-5 py-1.5" style={{ background:C.bg }}>
        <div className="grid text-[10px] font-semibold tracking-widest uppercase px-2" style={{ color:C.txt2, gridTemplateColumns:"5fr 2.5fr 4.5fr" }}>
          <span>PRODUCTO</span><span className="text-center">PRECIO</span><span className="text-center">CANT.</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 md:max-w-6xl md:mx-auto md:w-full">
        <div className="flex flex-col gap-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:pt-4">
          {filtered.map(p=>{
            const qty=getQty(p.id);
            return (
              <div key={p.id} className="rounded-xl px-3 py-3 border" style={{ background:"#fff", borderColor:"transparent" }}>
                <div className="grid items-center gap-2" style={{ gridTemplateColumns:"5fr 2.5fr 4.5fr" }}>
                  <div className="flex items-center gap-3 min-h-[56px]">
                    <div><p className="text-lg font-bold leading-tight" style={{ color:C.txt1 }}>{p.name}</p><p className="text-xs" style={{ color:C.txt2 }}>{p.unit}</p></div>
                  </div>
                  <div className="text-center"><p className="text-base font-semibold" style={{ color:C.txt2 }}>{fmt(p.price)}</p></div>
                  <div className="flex justify-center">
                    {qty===0?(
                      <div className="flex gap-1.5">
                        <button onClick={()=>setProductQty(p,1)} className="h-12 px-3 rounded-full flex items-center gap-1.5 border text-sm" style={{ background:C.inp, borderColor:C.muted, color:C.green }}>
                          <span className="text-xl font-light">+</span><span>Agregar</span>
                        </button>
                        <button onClick={()=>setGranelProduct(p)} className="h-12 w-12 rounded-full flex items-center justify-center border transition-colors active:scale-95" style={{ background:"#fff", borderColor:C.green, color:C.green }}>
                          <Scale size={16} />
                        </button>
                      </div>
                    ):(
                      <div className="flex gap-1.5 items-center">
                        <div className="flex items-center rounded-full border overflow-hidden h-12" style={{ background:C.inp, borderColor:C.muted }}>
                          <button onClick={()=>setProductQty(p,Math.max(0,(parseFloat(qtyInputs[p.id]??String(qty)))-1))} className="w-10 h-full flex items-center justify-center text-xl font-light shrink-0" style={{ color:C.txt2 }}>−</button>
                          <div className="h-full flex flex-col items-center justify-center border-l border-r px-1 min-w-[48px]" style={{ background:"#fff", borderColor:C.muted }}>
                            <input type="number" step="0.1" min="0"
                              value={qtyInputs[p.id]!==undefined?qtyInputs[p.id]:qty}
                              onChange={e=>setQtyInputs(prev=>({...prev,[p.id]:e.target.value}))}
                              onBlur={()=>handleQtyBlur(p)}
                              onFocus={e=>{ setQtyInputs(prev=>({...prev,[p.id]:String(qty)})); e.target.select(); }}
                              className="w-10 text-center text-sm font-bold outline-none bg-transparent" style={{ color:C.txt1 }} />
                            <span className="text-[9px] leading-none" style={{ color:C.txt2 }}>{p.unit}</span>
                          </div>
                          <button onClick={()=>setProductQty(p,(parseFloat(qtyInputs[p.id]??String(qty)))+1)} className="w-10 h-full flex items-center justify-center text-xl font-light shrink-0" style={{ color:C.green }}>+</button>
                        </div>
                        <button onClick={()=>setGranelProduct(p)} className="h-12 w-12 rounded-full flex items-center justify-center border transition-colors active:scale-95" style={{ background:C.green, borderColor:C.green, color:"#fff" }}>
                          <Scale size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="shrink-0 w-full px-3 md:px-0 md:max-w-6xl md:mx-auto pb-4 md:pb-6 pt-2" style={{ background:C.bg }}>
        <div className="w-full rounded-2xl shadow-2xl overflow-hidden border p-4" style={{ background:"#fff", borderColor:C.border }}>
          <div className="flex items-center justify-between mb-3">
            <div><p className="text-xs" style={{ color:C.txt2 }}>Subtotal ({cartCount} art.)</p><p className="text-sm font-medium" style={{ color:C.txt1 }}>{fmt(subtotal)}</p></div>
            <div className="text-right"><p className="text-[10px] font-semibold tracking-widest" style={{ color:C.txt2 }}>TOTAL</p><p className="text-2xl font-bold tracking-tight" style={{ color:C.green }}>{fmt(subtotal)}</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setPayMode("efectivo")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-full border text-xs font-semibold transition-all"
              style={{ background:payMode==="efectivo"?C.green2:"#fff", borderColor:payMode==="efectivo"?C.green:C.muted, color:payMode==="efectivo"?C.greenTxt:C.txt2 }}>💵 Efectivo</button>
            <button onClick={()=>setPayMode("tarjeta")} className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-full border text-xs font-semibold transition-all"
              style={{ background:payMode==="tarjeta"?C.green2:"#fff", borderColor:payMode==="tarjeta"?C.green:C.muted, color:payMode==="tarjeta"?C.greenTxt:C.txt2 }}>💳 Tarjeta</button>
            <button onClick={()=>subtotal>0&&openPay(payMode)} disabled={subtotal===0} className="flex-[1.5] h-11 rounded-full text-sm font-semibold text-white disabled:opacity-40 active:scale-95 transition-transform ml-1" style={{ background:C.green }}>Finalizar →</button>
          </div>
        </div>
      </div>
      {showFilter&&<FilterModal filter={filter} onApply={f=>{setFilter(f);setShowFilter(false);}} onClose={()=>setShowFilter(false)} />}
      {granelProduct && <VentaGranelModal product={granelProduct} onConfirm={qty=>{ setProductQty(granelProduct, qty); setGranelProduct(null); }} onClose={()=>setGranelProduct(null)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Inventario
export function VentaConfirmadaScreen({ total, method, cart, saleId, goTo }:{ total:number; method:string; cart:CartItem[]; saleId?:string; goTo:(s:Screen)=>void }) {
  const [showTicket, setShowTicket] = useState(false);

  if(showTicket) {
    return (
      <div className="flex flex-col h-full px-5 py-6 items-center" style={{ background:"#e5e7e8" }}>
        <div className="w-full bg-white px-5 py-6 drop-shadow-md relative overflow-hidden flex-1 overflow-y-auto mb-4" style={{ maxHeight: '80%' }}>
          <div className="absolute top-0 left-0 right-0 h-2" style={{ background:"repeating-linear-gradient(45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)" }} />
          <h2 className="text-center font-bold text-lg mb-2" style={{ color:C.txt1 }}>TICKET DE VENTA</h2>
          <p className="text-center text-xs font-semibold mb-1" style={{ color:C.txt2 }}>Frutería del Hogar</p>
          <p className="text-center text-xs mb-4" style={{ color:C.txt2 }}>{new Date().toLocaleString("es-MX")}</p>
          <div className="mb-4 text-xs">
            <p><strong>Folio:</strong> {saleId || "N/A"}</p>
            <p><strong>Método de pago:</strong> {method}</p>
          </div>
          <div className="border-t border-b py-2 mb-4 text-xs" style={{ borderColor:"#ccc" }}>
            <div className="flex font-bold mb-1"><span className="flex-1">Cant.</span><span className="flex-[2]">Producto</span><span className="text-right flex-1">Importe</span></div>
            {cart.map((i,idx)=>(
              <div key={idx} className="flex mb-1"><span className="flex-1">{i.qty}</span><span className="flex-[2] break-words">{i.product.name}</span><span className="text-right flex-1">{fmt(i.product.price*i.qty)}</span></div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-sm mb-6"><span style={{ color:C.txt1 }}>TOTAL:</span><span style={{ color:C.txt1 }}>{fmt(total)}</span></div>
          <div className="text-center border-t pt-4 mb-4" style={{ borderColor:"#ccc" }}>
            <p className="text-xs text-gray-500">¡Gracias por su compra!</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background:"repeating-linear-gradient(-45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)" }} />
        </div>
        <div className="mt-auto w-full flex flex-col gap-2">
          <button onClick={() => window.print()} className="w-full h-12 rounded-full border text-base font-semibold active:scale-95 transition-transform" style={{ borderColor:C.green, color:C.green, background: "#fff" }}>Imprimir / Guardar</button>
          <button onClick={()=>goTo("venta")} className="w-full h-14 rounded-full text-white text-base font-semibold active:scale-95 transition-transform" style={{ background:C.green }}>Nueva Venta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center px-6 text-center" style={{ background:C.bg }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background:C.green }}><Check size={36} color="#fff" strokeWidth={2.5} /></div>
      <h2 className="text-2xl font-bold mb-2" style={{ color:C.txt1 }}>¡Venta completada!</h2>
      <p className="text-base mb-1" style={{ color:C.txt2 }}>Pago con {method}</p>
      <p className="text-4xl font-bold tracking-tight mb-10" style={{ color:C.green }}>{fmt(total)}</p>
      <button onClick={()=>setShowTicket(true)} className="w-full h-12 rounded-full border text-base font-semibold mb-3 active:scale-95 transition-transform flex items-center justify-center gap-2" style={{ borderColor:C.green, color:C.green, background:"#fff" }}><ClipboardList size={16} /> Ver Ticket</button>
      <button onClick={()=>goTo("venta")} className="w-full h-14 rounded-full text-white text-xl font-semibold mb-3 active:scale-95 transition-transform" style={{ background:C.green }}>Nueva Venta</button>
      <button onClick={()=>goTo("dashboard")} className="w-full h-14 rounded-full text-base font-semibold active:scale-95 transition-transform" style={{ background:C.chip, color:C.green }}>Ir al Inicio</button>
    </div>
  );
}

// ─── Bottom nav ────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard" as Screen,label:"Inicio",Icon:Home},{id:"venta" as Screen,label:"Venta",Icon:ShoppingCart},{id:"inventario" as Screen,label:"Inventario",Icon:Package},{id:"reportes" as Screen,label:"Reportes",Icon:BarChart2},{id:"proveedores" as Screen,label:"Proveedores",Icon:Users}] as const;

// ══════════════════════════════════════════════════════════════════════════
// App — single source of truth for all shared state