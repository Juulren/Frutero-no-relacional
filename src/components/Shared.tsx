import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

export function AppHeader({ back, title, onBell, notifCount=0, onLogout }:{ back?:()=>void; title?:string; onBell?:()=>void; notifCount?:number; onLogout?:()=>void }) {
  return (
    <div className="shrink-0 w-full z-[2] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]" style={{ background:C.bg }}>
      <div className="flex items-center justify-between px-5 py-4">
        {back ? (
          <button onClick={back} className="flex items-center gap-2 -ml-1">
            <ArrowLeft size={20} style={{ color:C.txt1 }} />
            {title && <span className="text-xs font-semibold tracking-widest uppercase" style={{ color:C.green }}>{title}</span>}
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background:C.green2 }}><span className="text-lg">🌿</span></div>
            <p className="font-bold text-[22px] leading-tight" style={{ color:C.green }}>Frutería del Hogar</p>
          </div>
        )}
        <div className="flex gap-1 items-center">
          <button onClick={onBell} className="relative w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100">
            <Bell size={20} style={{ color:C.txt2 }} />
            {notifCount>0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:C.amber, color:"#fff" }}>{notifCount}</span>}
          </button>
          {onLogout && (
            <button onClick={onLogout} className="relative w-10 h-10 flex items-center justify-center rounded-full active:bg-gray-100">
              <LogOut size={20} style={{ color:"#d4183d" }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Consistent "Ver Detalles" ────────────────────────────────────────────
export function VerDetallesBtn({ id, expanded, onToggle }:{ id:string|number; expanded:string|number|null; onToggle:(id:string|number)=>void }) {
  const open = expanded===id;
  return (
    <button onClick={()=>onToggle(id)} className="flex items-center gap-1 text-xs font-semibold tracking-wide" style={{ color:C.green }}>
      {open?"Ocultar":"Ver Detalles"}
      <ChevronRight size={11} color={C.green} style={{ transform:open?"rotate(90deg)":"none", transition:"transform 0.2s" }} />
    </button>
  );
}

// ─── Product Filter Modal ─────────────────────────────────────────────────
export function FilterModal({ filter, onApply, onClose }:{ filter:FilterState; onApply:(f:FilterState)=>void; onClose:()=>void }) {
  const [local,setLocal]=useState<FilterState>({...filter});
  const toggleCat=(c:Category)=>setLocal(p=>({...p,cats:p.cats.includes(c)?p.cats.filter(x=>x!==c):[...p.cats,c]}));
  const FCATS:Category[]=["Frutas","Verduras","Abarrotes","Lácteos"];
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background:"rgba(46,49,50,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="rounded-tl-xl rounded-tr-xl flex flex-col drop-shadow-[0px_-8px_15px_rgba(15,82,56,0.1)]" style={{ background:"#fff", maxHeight:"85%" }}>
        <div className="rounded-tl-xl rounded-tr-xl border-b shrink-0" style={{ borderColor:C.border }}>
          <div className="flex flex-col items-center pt-2 pb-4 px-5 gap-4">
            <div className="w-12 h-1.5 rounded-full" style={{ background:C.border }} />
            <div className="flex items-center justify-between w-full">
              <span className="text-xl font-semibold" style={{ color:C.txt1 }}>Filtros</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:C.chip }}><X size={14} color={C.txt2} /></button>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto flex flex-col gap-7 px-5 pt-5 pb-4">
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold" style={{ color:C.txt1 }}>Categorías</p>
            <div className="flex flex-wrap gap-2">
              {FCATS.map(c=>{ const active=local.cats.includes(c); return (
                <button key={c} onClick={()=>toggleCat(c)} className="flex items-center gap-1 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide transition-all"
                  style={{ background:active?C.green2:"#fff", borderColor:active?C.green:"#707973", color:active?C.greenTxt:C.txt2 }}>
                  {active&&<Check size={10} color={C.greenTxt} strokeWidth={3} />}{c}
                </button>
              );})}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold" style={{ color:C.txt1 }}>Ordenar por</p>
            {([["az","A - Z"],["priceAsc","Precio: Menor a Mayor"],["priceDesc","Precio: Mayor a Menor"]] as [SortBy,string][]).map(([val,label])=>(
              <button key={val} onClick={()=>setLocal(p=>({...p,sortBy:val}))} className="flex items-center gap-4 px-2 py-1.5 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all" style={{ borderColor:local.sortBy===val?C.green:"#707973", background:local.sortBy===val?C.green:"#fff" }}>
                  {local.sortBy===val&&<div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <span className="text-sm" style={{ color:C.txt1 }}>{label}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold" style={{ color:C.txt1 }}>Rango de Precio</p>
              <span className="text-xs font-semibold" style={{ color:C.green }}>$0 - ${local.maxPrice===500?"500+":local.maxPrice}</span>
            </div>
            <div className="px-2 pb-5">
              <div className="relative h-4 flex items-center">
                <div className="w-full h-1 rounded-full" style={{ background:C.border }}><div className="h-full rounded-full" style={{ background:C.green, width:`${(local.maxPrice/500)*100}%` }} /></div>
                <input type="range" min={0} max={500} step={10} value={local.maxPrice} onChange={e=>setLocal(p=>({...p,maxPrice:Number(e.target.value)}))} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                <div className="absolute w-5 h-5 rounded-full shadow-md border-2 border-white" style={{ background:C.green, left:`calc(${(local.maxPrice/500)*100}% - 10px)` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs font-semibold" style={{ color:C.txt2 }}><span>Min</span><span>Max</span></div>
            </div>
          </div>
          <div className="flex items-center justify-between pb-2">
            <div><p className="text-base font-semibold" style={{ color:C.txt1 }}>Solo en stock</p><p className="text-xs" style={{ color:C.txt2 }}>Ocultar productos agotados</p></div>
            <button onClick={()=>setLocal(p=>({...p,onlyInStock:!p.onlyInStock}))} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background:local.onlyInStock?C.green:C.muted }}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${local.onlyInStock?"left-6":"left-1"}`} />
            </button>
          </div>
        </div>
        <div className="shrink-0 border-t px-5 pt-4 pb-5" style={{ background:"#fff", borderColor:C.border }}>
          <div className="grid gap-3" style={{ gridTemplateColumns:"1fr 2fr" }}>
            <button onClick={()=>setLocal(DEFAULT_FILTER)} className="h-[52px] rounded-lg border text-xs font-semibold tracking-wide" style={{ borderColor:C.green, color:C.green }}>Limpiar todo</button>
            <button onClick={()=>onApply(local)} className="h-[52px] rounded-lg flex items-center justify-center gap-2 text-xs font-semibold tracking-wide text-white" style={{ background:C.green }}>Aplicar Filtros <SlidersHorizontal size={11} color="#fff" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Historial Filter Modal ───────────────────────────────────────────────
export function HistorialFilterModal({ filter, products, onApply, onClose }:{ filter:HistorialFilter; products:Product[]; onApply:(f:HistorialFilter)=>void; onClose:()=>void }) {
  const [local,setLocal]=useState<HistorialFilter>({...filter});
  const set=(k:keyof HistorialFilter,v:string)=>setLocal(p=>({...p,[k]:v}));
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background:"rgba(46,49,50,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="rounded-tl-xl rounded-tr-xl flex flex-col drop-shadow-[0px_-8px_15px_rgba(15,82,56,0.1)]" style={{ background:"#fff", maxHeight:"90%" }}>
        <div className="rounded-tl-xl rounded-tr-xl border-b shrink-0" style={{ borderColor:C.border }}>
          <div className="flex flex-col items-center pt-2 pb-4 px-5 gap-4">
            <div className="w-12 h-1.5 rounded-full" style={{ background:C.border }} />
            <div className="flex items-center justify-between w-full">
              <span className="text-xl font-semibold" style={{ color:C.txt1 }}>Buscar en historial</span>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background:C.chip }}><X size={14} color={C.txt2} /></button>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto flex flex-col gap-6 px-5 pt-5 pb-4">
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold" style={{ color:C.txt1 }}>Día</p>
            <div className="flex gap-2 flex-wrap">
              {[["todos","Todos"],["hoy","Hoy"],["ayer","Ayer"]].map(([val,label])=>(
                <button key={val} onClick={()=>set("day",val)} className="px-4 py-2 rounded-full border text-xs font-semibold transition-all"
                  style={{ background:local.day===val?C.green:"#fff", borderColor:local.day===val?C.green:C.muted, color:local.day===val?"#fff":C.txt2 }}>{label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-base font-semibold" style={{ color:C.txt1 }}>Método de pago</p>
            <div className="flex gap-2">
              {[["todos","Todos"],["EFECTIVO","💵 Efectivo"],["TARJETA","💳 Tarjeta"]].map(([val,label])=>(
                <button key={val} onClick={()=>set("method",val)} className="flex-1 py-2 rounded-full border text-xs font-semibold transition-all"
                  style={{ background:local.method===val?C.green:"#fff", borderColor:local.method===val?C.green:C.muted, color:local.method===val?"#fff":C.txt2 }}>{label}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold" style={{ color:C.txt1 }}>Artículo</p>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} />
              <input value={local.product} onChange={e=>set("product",e.target.value)} placeholder="Ej: Manzana, Plátano..."
                className="w-full h-11 rounded-xl pl-9 pr-4 text-sm border outline-none" style={{ background:C.bg, borderColor:C.muted, color:C.txt1 }} />
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {products.slice(0,6).map(p=>(
                <button key={p.id} onClick={()=>set("product",local.product===p.name?"":p.name)} className="px-3 py-1 rounded-full border text-xs font-medium transition-all"
                  style={{ background:local.product===p.name?C.green2:"#fff", borderColor:local.product===p.name?C.green:C.muted, color:local.product===p.name?C.greenTxt:C.txt2 }}>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-base font-semibold" style={{ color:C.txt1 }}>Cantidad mínima de artículos</p>
            <input type="number" inputMode="numeric" value={local.minItems} onChange={e=>set("minItems",e.target.value)} placeholder="Ej: 3 (ventas con 3+ artículos)"
              className="w-full h-11 rounded-xl px-4 text-sm border outline-none" style={{ background:C.bg, borderColor:C.muted, color:C.txt1 }} />
          </div>
          <div className="h-2" />
        </div>
        <div className="shrink-0 border-t px-5 pt-4 pb-5" style={{ background:"#fff", borderColor:C.border }}>
          <div className="grid gap-3" style={{ gridTemplateColumns:"1fr 2fr" }}>
            <button onClick={()=>setLocal(DEFAULT_HFILT)} className="h-[52px] rounded-lg border text-xs font-semibold" style={{ borderColor:C.green, color:C.green }}>Limpiar</button>
            <button onClick={()=>onApply(local)} className="h-[52px] rounded-lg flex items-center justify-center gap-2 text-xs font-semibold text-white" style={{ background:C.green }}>Aplicar <SlidersHorizontal size={11} color="#fff" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
