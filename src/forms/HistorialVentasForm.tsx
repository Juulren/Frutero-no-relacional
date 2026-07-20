import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

import { AppHeader, HistorialFilterModal, VerDetallesBtn } from '../components/Shared';
export function HistorialScreen({ orders, products, goTo }:{ orders:SaleRecord[]; products:Product[]; goTo:(s:Screen)=>void }) {
  const [search,setSearch]=useState(""); const [expanded,setExpanded]=useState<string|null>(null);
  const [hFilter,setHFilter]=useState<HistorialFilter>(DEFAULT_HFILT); const [showHFilter,setShowHFilter]=useState(false);
  const activeHF=(hFilter.day!=="todos"?1:0)+(hFilter.method!=="todos"?1:0)+(hFilter.minItems?1:0)+(hFilter.product?1:0);
  const filtered=useMemo(()=>orders.filter(s=>
    (hFilter.day==="todos"||s.date===hFilter.day)&&
    (hFilter.method==="todos"||s.method===hFilter.method)&&
    (!hFilter.minItems||s.items>=parseInt(hFilter.minItems))&&
    (!search||s.id.toLowerCase().includes(search.toLowerCase())||String(s.total).includes(search))
  ),[search,hFilter,orders]);
  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <AppHeader back={()=>goTo("reportes")} title="Reportes" />
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-10">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <h2 className="text-xl font-semibold" style={{ color:C.txt1 }}>Historial de Ventas</h2>
            <div className="flex gap-2">
              <div className="flex-1 relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar folio o cantidad..." className="w-full h-12 rounded-lg pl-10 pr-4 text-sm border outline-none" style={{ background:"#fff", borderColor:C.muted, color:"#707973" }} /></div>
              <button onClick={()=>setShowHFilter(true)} className="relative w-12 h-12 rounded-lg flex items-center justify-center" style={{ background:C.green }}>
                <Filter size={16} color="#fff" />
                {activeHF>0&&<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:C.amber, color:"#fff" }}>{activeHF}</span>}
              </button>
            </div>
          </div>
          {filtered.length===0&&<div className="flex flex-col items-center py-12 text-center" style={{ color:C.muted }}><p className="text-4xl mb-3">🔍</p><p className="text-sm font-semibold" style={{ color:C.txt1 }}>Sin resultados</p><p className="text-xs mt-1" style={{ color:C.txt2 }}>Intenta con otros filtros</p></div>}
          {(["hoy","ayer"] as const).map(day=>{ const daySales=filtered.filter(s=>s.date===day); if(daySales.length===0) return null; return (
            <div key={day}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color:C.txt2 }}>{day.toUpperCase()}</p>
              <div className="flex flex-col gap-3">{daySales.map(sale=>(
                <div key={sale.id} className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_0px_rgba(45,106,79,0.08)] relative">
                  <div className="absolute top-0 left-0 bottom-0 w-1 rounded-l-xl" style={{ background:sale.date==="hoy"?C.green:C.muted }} />
                  <div className="px-4 py-4 pl-6 flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2"><span className="text-base font-semibold" style={{ color:C.txt1 }}>{sale.id}</span><span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-full uppercase" style={{ background:sale.method==="EFECTIVO"?C.green2:C.chip, color:sale.method==="EFECTIVO"?C.greenTxt:C.txt1 }}>{sale.method}</span></div>
                        <span className="text-sm" style={{ color:C.txt2 }}>{sale.time} • {sale.items} artículos</span>
                      </div>
                      <span className="text-xl font-semibold" style={{ color:sale.date==="hoy"?C.green:C.txt1 }}>{fmt(sale.total)}</span>
                    </div>
                    <div className="flex justify-end pt-2 border-t" style={{ borderColor:C.border }}>
                      <VerDetallesBtn id={sale.id} expanded={expanded} onToggle={id=>setExpanded(expanded===id?null:id as string)} />
                    </div>
                    {expanded===sale.id&&(
                      <div className="text-sm pt-2 border-t rounded-lg p-3" style={{ borderColor:C.border, background:C.inp }}>
                        <p style={{ color:C.txt2 }}>Folio: <span className="font-semibold" style={{ color:C.txt1 }}>{sale.id}</span></p>
                        <p style={{ color:C.txt2 }}>Método: <span className="font-semibold" style={{ color:C.txt1 }}>{sale.method}</span></p>
                        <p style={{ color:C.txt2 }}>Hora: <span className="font-semibold" style={{ color:C.txt1 }}>{sale.time}</span></p>
                        <p style={{ color:C.txt2 }}>Artículos: <span className="font-semibold" style={{ color:C.txt1 }}>{sale.items}</span></p>
                        <p style={{ color:C.txt2 }}>Total: <span className="font-bold text-base" style={{ color:C.green }}>{fmt(sale.total)}</span></p>
                      </div>
                    )}
                  </div>
                </div>
              ))}</div>
            </div>
          );})}
        </div>
      </div>
      {showHFilter&&<HistorialFilterModal filter={hFilter} products={products} onApply={f=>{setHFilter(f);setShowHFilter(false);}} onClose={()=>setShowHFilter(false)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Proveedores — uses real suppliers state