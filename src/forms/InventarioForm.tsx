import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT, LOW_THR } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

import { AppHeader, FilterModal } from '../components/Shared';
export function InventarioScreen({ products, goTo, onEdit, onBell, notifCount, userRole }:{
  products:Product[]; goTo:(s:Screen)=>void; onEdit:(p:Product)=>void; onBell:()=>void; notifCount:number; userRole:UserRole;
}) {
  const [search,setSearch]=useState(""); const [filter,setFilter]=useState<FilterState>(DEFAULT_FILTER); const [showFilter,setShowFilter]=useState(false);
  const activeFilters=filter.cats.length+(filter.sortBy!=="az"?1:0)+(filter.onlyInStock?1:0)+(filter.maxPrice<500?1:0);
  const filtered=useMemo(()=>{
    let list=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())&&(filter.cats.length===0||filter.cats.includes(p.category as Category))&&p.price<=filter.maxPrice&&(!filter.onlyInStock||p.stock>0));
    if(filter.sortBy==="priceAsc")  list=[...list].sort((a,b)=>a.price-b.price);
    if(filter.sortBy==="priceDesc") list=[...list].sort((a,b)=>b.price-a.price);
    if(filter.sortBy==="az")        list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  },[products,search,filter]);
  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <AppHeader onBell={onBell} notifCount={notifCount} />
      <div className="px-5 pt-3 pb-3 flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2"><button onClick={()=>goTo("dashboard")}><ArrowLeft size={18} style={{ color:C.txt2 }} /></button><span className="text-2xl font-semibold" style={{ color:C.green2 }}>Inventario</span></div>
        {userRole==="admin" && <button onClick={()=>goTo("agregar-producto")} className="w-full h-[48px] rounded-full flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-white active:scale-95 transition-transform" style={{ background:C.green }}><Plus size={13} /> AGREGAR PRODUCTO</button>}
        <div className="flex gap-2">
          <div className="flex-1 relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto" className="w-full h-11 rounded-xl pl-9 pr-4 text-sm border outline-none" style={{ background:C.bg, borderColor:C.muted, color:C.txt1 }} /></div>
          <button onClick={()=>setShowFilter(true)} className="relative w-11 h-11 rounded-xl border flex items-center justify-center" style={{ background:activeFilters>0?C.green:C.bg, borderColor:activeFilters>0?C.green:C.muted }}>
            <Filter size={15} style={{ color:activeFilters>0?"#fff":C.green }} />
            {activeFilters>0&&<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:C.amber, color:"#fff" }}>{activeFilters}</span>}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4 md:max-w-6xl md:mx-auto md:w-full md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:content-start md:pt-4">
        {filtered.length===0 && <p className="text-center text-sm py-8 md:col-span-full" style={{ color:C.muted }}>Sin productos que coincidan</p>}
        {filtered.map(p=>(
          <div key={p.id} className="bg-white rounded-xl flex items-center gap-3 px-4 py-3 border mb-1 md:mb-0 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.04)]" style={{ borderColor:C.border }}>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight" style={{ color:C.txt1 }}>{p.name}</p>
              <p className="text-sm" style={{ color:C.txt2 }}>{p.category} · Stock: {p.stock} {p.unit}</p>
              {p.stock<=LOW_THR&&p.stock>0 && <p className="text-xs font-bold" style={{ color:C.amber }}>⚠ Stock bajo</p>}
              {p.stock===0 && <p className="text-xs font-bold" style={{ color:"#d4183d" }}>✗ Agotado</p>}
            </div>
            <div className="text-right shrink-0"><p className="font-bold text-base" style={{ color:C.green }}>{fmt(p.price)}</p><p className="text-xs" style={{ color:C.txt2 }}>/{p.unit}</p></div>
            {userRole==="admin" && <button onClick={()=>onEdit(p)} className="ml-1 w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100"><ChevronRight size={16} color={C.muted} /></button>}
          </div>
        ))}
      </div>
      {showFilter&&<FilterModal filter={filter} onApply={f=>{setFilter(f);setShowFilter(false);}} onClose={()=>setShowFilter(false)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Editar Producto — saves back to products state
// ══════════════════════════════════════════════════════════════════════════
export function EditarProductoScreen({ product, setProducts, goTo }:{ product:Product; setProducts:React.Dispatch<React.SetStateAction<Product[]>>; goTo:(s:Screen)=>void }) {
  const [form,setForm]=useState({ name:product.name, price:String(product.price), cost:String(product.cost), unit:product.unit, category:product.category as string, stock:String(product.stock), activo:true });
  const set=(k:string,v:string|boolean)=>setForm(p=>({...p,[k]:v}));

  const save=()=>{
    setProducts(prev=>prev.map(p=>p.id===product.id ? {
      ...p, name:form.name, price:Number(form.price)||p.price, cost:Number(form.cost)||p.cost,
      unit:form.unit, category:form.category as Product["category"],
      stock:Number(form.stock)??p.stock,
    } : p));
    goTo("inventario");
  };

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 h-16 border-b flex items-center px-5" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("inventario")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-[22px] font-semibold ml-2" style={{ color:C.txt1 }}>Editar producto</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        <div className="rounded-xl flex items-center gap-4 p-4 border" style={{ background:"#fff", borderColor:C.border }}>
          <div><p className="font-bold text-xl" style={{ color:C.txt1 }}>{form.name||"Nombre"}</p><p className="text-sm" style={{ color:C.txt2 }}>{form.category} · ${form.price||"0"}/{form.unit}</p></div>
        </div>
        {[{label:"Nombre",key:"name",type:"text",ph:"Ej: Fresa orgánica"},{label:"Precio de venta ($)",key:"price",type:"number",ph:"Ej: 45"},{label:"Costo al distribuidor ($)",key:"cost",type:"number",ph:"Ej: 25"},{label:"Stock disponible",key:"stock",type:"number",ph:"Ej: 30"}].map(f=>(
          <div key={f.key}><label className="text-xs font-semibold block mb-1.5" style={{ color:C.txt2 }}>{f.label}</label><input type={f.type} inputMode={f.type==="number"?"numeric":"text"} placeholder={f.ph} value={form[f.key as keyof typeof form] as string} onChange={e=>set(f.key,e.target.value)} className="w-full rounded-xl px-4 py-3.5 text-base border outline-none" style={{ background:"#fff", borderColor:C.border, color:C.txt1 }} /></div>
        ))}
        <div><label className="text-xs font-semibold block mb-1.5" style={{ color:C.txt2 }}>Unidad</label><div className="flex flex-wrap gap-2">{["kg","pieza","charola","litro","caja","manojo"].map(u=>(<button key={u} onClick={()=>set("unit",u)} className="px-4 py-2 rounded-full border text-sm font-semibold transition-colors" style={{ background:form.unit===u?C.green:"#fff", borderColor:form.unit===u?C.green:C.muted, color:form.unit===u?"#fff":C.txt2 }}>{u}</button>))}</div></div>
        <div><label className="text-xs font-semibold block mb-1.5" style={{ color:C.txt2 }}>Categoría</label><div className="grid grid-cols-2 gap-2">{["Frutas","Verduras","Abarrotes"].map(c=>(<button key={c} onClick={()=>set("category",c)} className="py-3 rounded-xl border text-sm font-semibold transition-colors" style={{ background:form.category===c?C.green:"#fff", borderColor:form.category===c?C.green:C.muted, color:form.category===c?"#fff":C.txt2 }}>{c}</button>))}</div></div>
        <div className="flex gap-2 pt-1">
          <button onClick={()=>goTo("inventario")} className="flex-1 h-[52px] rounded-full border text-base font-semibold" style={{ borderColor:C.green, color:C.green }}>Cancelar</button>
          <button onClick={save} disabled={!form.name||!form.price} className="flex-[2] h-[52px] rounded-full text-white text-base font-semibold disabled:opacity-40 active:scale-95 transition-transform" style={{ background:C.green }}>Guardar cambios</button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Agregar Producto — actually saves to state
// ══════════════════════════════════════════════════════════════════════════
export function AgregarProductoScreen({ setProducts, goTo }:{ setProducts:React.Dispatch<React.SetStateAction<Product[]>>; goTo:(s:Screen)=>void }) {
  const [form,setForm]=useState({ name:"", price:"", cost:"", unit:"kg", category:"Frutas" as Product["category"], stock:"", activo:true });
  const set=(k:string,v:string|boolean)=>setForm(p=>({...p,[k]:v}));

  const save=()=>{
    if(!form.name||!form.price) return;
    const price=Number(form.price);
    const newProduct:Product = {
      id: Date.now(),
      name: form.name.trim(),
      price,
      cost: Number(form.cost)||Math.round(price*0.6),
      unit: form.unit,
      category: form.category,
      stock: Number(form.stock)||0,
    };
    setProducts(prev=>[...prev, newProduct]);
    goTo("inventario");
  };

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 h-16 border-b flex items-center px-5" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("inventario")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-[22px] font-semibold ml-2" style={{ color:C.txt1 }}>Agregar producto</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-2">
          <button onClick={()=>goTo("inventario")} className="h-[52px] rounded-full border text-base font-semibold" style={{ borderColor:C.green, color:C.green }}>Cancelar</button>
          <button onClick={save} disabled={!form.name||!form.price} className="h-[52px] rounded-full text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 active:scale-95" style={{ background:C.green }}><Check size={14} color={C.greenTxt} /> Guardar producto</button>
        </div>
        {[{label:"Nombre del producto *",key:"name",type:"text",ph:"Ej: Fresa orgánica"},{label:"Precio de venta ($) *",key:"price",type:"number",ph:"Ej: 45"},{label:"Costo al distribuidor ($)",key:"cost",type:"number",ph:"Se calcula automáticamente si se deja vacío"},{label:"Stock inicial",key:"stock",type:"number",ph:"Ej: 30"}].map(f=>(
          <div key={f.key}><label className="text-xs font-semibold block mb-1.5" style={{ color:C.txt2 }}>{f.label}</label><input type={f.type} inputMode={f.type==="number"?"numeric":"text"} placeholder={f.ph} value={form[f.key as keyof typeof form] as string} onChange={e=>set(f.key,e.target.value)} className="w-full rounded-xl px-4 py-3.5 text-base border outline-none" style={{ background:"#fff", borderColor:C.border, color:C.txt1 }} /></div>
        ))}
        <div><label className="text-xs font-semibold block mb-1.5" style={{ color:C.txt2 }}>Unidad</label><div className="flex flex-wrap gap-2">{["kg","pieza","charola","litro","caja","manojo"].map(u=>(<button key={u} onClick={()=>set("unit",u)} className="px-4 py-2 rounded-full border text-sm font-semibold transition-colors" style={{ background:form.unit===u?C.green:"#fff", borderColor:form.unit===u?C.green:C.muted, color:form.unit===u?"#fff":C.txt2 }}>{u}</button>))}</div></div>
        <div><label className="text-xs font-semibold block mb-1.5" style={{ color:C.txt2 }}>Categoría</label><div className="grid grid-cols-2 gap-2">{["Frutas","Verduras","Abarrotes"].map(c=>(<button key={c} onClick={()=>set("category",c as Product["category"])} className="py-3 rounded-xl border text-sm font-semibold transition-colors" style={{ background:form.category===c?C.green:"#fff", borderColor:form.category===c?C.green:C.muted, color:form.category===c?"#fff":C.txt2 }}>{c}</button>))}</div></div>
        <div className="flex items-center justify-between py-3 border-t border-b" style={{ borderColor:C.border }}><div><p className="text-sm font-semibold" style={{ color:C.txt1 }}>Disponible para venta</p><p className="text-xs" style={{ color:C.txt2 }}>Aparece en Registrar Venta</p></div><button onClick={()=>set("activo",!form.activo)} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background:form.activo?C.green:C.muted }}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.activo?"left-6":"left-1"}`} /></button></div>
        <div className="h-4" />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Reportes — KPIs from real orders