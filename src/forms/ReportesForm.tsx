import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

import { AppHeader } from '../components/Shared';
export function ReportesScreen({ orders, products, cortes, goTo, onBell, notifCount, userRole }:{ orders:SaleRecord[]; products:Product[]; cortes:CorteCaja[]; goTo:(s:Screen)=>void; onBell:()=>void; notifCount:number; userRole:UserRole }) {
  const [activeTab, setActiveTab] = useState<"ventas"|"cortes">(userRole==="cajero"?"cortes":"ventas");
  const [period,setPeriod]=useState("Diario");

  const totalVentas   = orders.reduce((s,o)=>s+o.total,0);
  const gananciaEst   = totalVentas*0.28;
  const mermaEst      = totalVentas*0.04;
  
  // Producto Estrella calculation
  const prodEstrella = useMemo(() => {
    if (orders.length === 0) return "Ninguno";
    const counts: Record<number, number> = {};
    orders.forEach(o => {
      const details = (o as any).listaDetalles || [];
      details.forEach((d:any) => {
        counts[d.idProducto] = (counts[d.idProducto] || 0) + d.cantidad;
      });
    });
    const bestId = Object.keys(counts).reduce((a, b) => counts[Number(a)] > counts[Number(b)] ? a : b, "0");
    const bestProd = products.find(p => p.id === bestId);
    return bestProd ? bestProd.name : "N/A";
  }, [orders, products]);

  const diarioData = useMemo(()=>{
    const buckets=[{label:"8am",min:8,max:9},{label:"10am",min:10,max:11},{label:"12pm",min:12,max:13},{label:"2pm",min:14,max:15},{label:"4pm",min:16,max:17},{label:"6pm",min:18,max:23}];
    return buckets.map(b=>{
      const val=orders.filter(o=>{ 
        const hStr = o.time || o.hora || "00";
        const h = parseInt(hStr.split(":")[0]); 
        return h>=b.min&&h<=b.max; 
      }).reduce((s,o)=>s+o.total,0);
      return { label:b.label, value:val };
    });
  },[orders]);

  const semanalData = useMemo(()=>{
    // Para simplificar, todo en 0 y solo llenamos hoy
    const today = new Date().toLocaleDateString('es-ES', { weekday: 'short' });
    const labels = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];
    return labels.map(l => ({
      label: l.charAt(0).toUpperCase() + l.slice(1),
      value: l === today.substring(0,3).toLowerCase() ? totalVentas : 0
    }));
  },[totalVentas]);

  const mensualData = useMemo(()=>{
    return [
      {label: "Sem 1", value: 0},
      {label: "Sem 2", value: 0},
      {label: "Sem 3", value: 0},
      {label: "Sem 4", value: totalVentas} 
    ];
  },[totalVentas]);

  const chartData = period==="Diario" ? diarioData : period==="Semanal" ? semanalData : mensualData;
  const maxVal    = chartData.length > 0 ? Math.max(...chartData.map(d=>d.value)) : 0;

  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <AppHeader onBell={onBell} notifCount={notifCount} />
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 pb-10 md:max-w-5xl mx-auto w-full md:pb-32">
        <div className="flex items-end justify-between">
          <div><h1 className="text-[32px] font-bold tracking-tight leading-tight" style={{ color:C.txt1 }}>Reportes</h1><p className="text-base" style={{ color:C.txt2 }}>Gestión y rendimiento</p></div>
          <button className="h-11 w-11 rounded-full flex items-center justify-center text-xl" style={{ background:C.green2 }}>📊</button>
        </div>
        
        {userRole === "admin" && (
          <div className="rounded-xl p-1.5 flex" style={{ background:C.inp }}>
            <button onClick={()=>setActiveTab("ventas")} className="flex-1 h-10 rounded-lg text-xs font-bold transition-all" style={{ background:activeTab==="ventas"?"#fff":"transparent", color:activeTab==="ventas"?C.green:C.txt2, boxShadow:activeTab==="ventas"?"0 2px 4px rgba(0,0,0,0.05)":"none" }}>Resumen de Ventas</button>
            <button onClick={()=>setActiveTab("cortes")} className="flex-1 h-10 rounded-lg text-xs font-bold transition-all" style={{ background:activeTab==="cortes"?"#fff":"transparent", color:activeTab==="cortes"?C.green:C.txt2, boxShadow:activeTab==="cortes"?"0 2px 4px rgba(0,0,0,0.05)":"none" }}>Cortes de Caja</button>
          </div>
        )}

        {activeTab === "ventas" ? (
          <>
            <div className="rounded-xl p-2 flex mt-2" style={{ background:C.inp }}>
              {["Diario","Semanal","Mensual"].map(p=>(<button key={p} onClick={()=>setPeriod(p)} className="flex-1 h-11 rounded-lg text-xs font-semibold tracking-wide transition-all" style={{ background:period===p?C.bg:"transparent", color:period===p?C.green:C.txt2, boxShadow:period===p?"0 1px 1px rgba(0,0,0,0.05)":"none" }}>{p}</button>))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:"Ventas Totales", value:fmt(totalVentas),    sub:`${orders.length} ventas`},
                {label:"Ganancia Est.",  value:fmt(gananciaEst),    sub:"~28% margen"},
                {label:"Merma Estimada",value:fmt(mermaEst),        sub:"~4% estimado"},
                {label:"Prod. Estrella", value:prodEstrella,         sub:"#1 vendido"},
              ].map(kpi=>(
                <div key={kpi.label} className="h-[100px] rounded-xl flex flex-col justify-between p-4 drop-shadow-[0px_4px_20px_0px_rgba(45,106,79,0.08)]" style={{ background:"rgba(255,255,255,0.95)", border:"1px solid rgba(255,255,255,0.2)" }}>
                  <span className="text-xs" style={{ color:C.txt2 }}>{kpi.label}</span>
                  <div><p className="font-semibold text-lg leading-tight" style={{ color:C.txt1 }}>{kpi.value}</p><p className="text-[10px] font-semibold" style={{ color:C.green }}>{kpi.sub}</p></div>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 drop-shadow-[0px_4px_20px_0px_rgba(45,106,79,0.08)] mb-8" style={{ background:"rgba(255,255,255,0.95)", border:"1px solid rgba(255,255,255,0.2)" }}>
              <div className="flex items-center justify-between mb-4"><p className="text-base font-semibold" style={{ color:C.txt1 }}>{period==="Diario"?"Ventas por Hora":period==="Semanal"?"Ventas por Día":"Ventas por Semana"}</p><button onClick={()=>goTo("historial")} className="text-xs font-semibold" style={{ color:C.green }}>Ver historial →</button></div>
              <ResponsiveContainer width="100%" height={160}><BarChart data={chartData} margin={{ top:4, right:4, bottom:0, left:4 }} barCategoryGap="30%"><XAxis dataKey="label" tick={{ fontSize:10, fill:C.txt2 }} axisLine={false} tickLine={false} /><YAxis hide /><Tooltip cursor={{ fill:"rgba(45,106,79,0.05)" }} itemStyle={{ color: "#fff" }} contentStyle={{ background:"#2e3132", border:"none", borderRadius:4, color:"#fff", fontSize:11, padding:"4px 8px" }} formatter={(v:number)=>[fmt(v),""]} labelStyle={{ display:"none" }} /><Bar dataKey="value" radius={[4,4,0,0]}>{chartData.map((entry,i)=>(<Cell key={i} fill={entry.value===maxVal&&maxVal>0?C.green:"rgba(45,106,79,0.25)"} />))}</Bar></BarChart></ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <button onClick={()=>goTo("hacer-corte")} className="w-full h-14 rounded-full flex items-center justify-center gap-2 text-white font-bold text-base active:scale-95 transition-transform shadow-md mt-2" style={{ background:C.green }}>
              <ClipboardList size={18} color="#fff" /> HACER CORTE DE CAJA
            </button>
            <div>
              <p className="text-base font-bold mt-2 mb-3" style={{ color:C.txt1 }}>Historial de Cortes</p>
              {cortes.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center border rounded-xl border-dashed" style={{ borderColor:C.muted, background:"#fff" }}>
                  <p className="text-sm font-semibold" style={{ color:C.txt2 }}>No hay cortes registrados</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pb-[100px] md:grid md:grid-cols-2 md:gap-4 md:items-start">
                  {cortes.map(c => (
                    <div key={c.id} className="bg-white rounded-xl p-4 border flex flex-col gap-2 drop-shadow-sm" style={{ borderColor:C.border }}>
                      <div className="flex justify-between items-start border-b pb-2" style={{ borderColor:C.border }}>
                        <div><p className="text-xs font-bold" style={{ color:C.txt2 }}>{c.id}</p><p className="text-sm font-semibold" style={{ color:C.txt1 }}>{c.fecha}</p></div>
                        <div className="text-right"><p className="text-[10px] uppercase font-bold" style={{ color:C.txt2 }}>Cajero</p><p className="text-sm font-semibold" style={{ color:C.green }}>{c.cajero}</p></div>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <div>
                          <p className="text-xs" style={{ color:C.txt2 }}>Fondo Inicial: <span className="font-semibold" style={{ color:C.txt1 }}>{fmt(c.fondoInicial)}</span></p>
                          <p className="text-xs" style={{ color:C.txt2 }}>Retiros: <span className="font-semibold" style={{ color:C.txt1 }}>{fmt(c.retiros)}</span></p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold mb-1" style={{ color:C.txt1 }}>Diferencia</p>
                          {c.diferencia === 0 ? (
                            <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background:C.inp, color:C.txt2 }}>Cuadrado</span>
                          ) : c.diferencia > 0 ? (
                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700">+{fmt(c.diferencia)} (Sobró)</span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-red-100 text-red-700">{fmt(c.diferencia)} (Faltó)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Historial — uses real orders state
export function HacerCorteScreen({ orders, userRole, goTo, onGuardarCorte }:{ orders:SaleRecord[]; userRole:string|null; goTo:(s:Screen)=>void; onGuardarCorte:(corte:CorteCaja)=>void }) {
  const [fondo, setFondo] = useState("500");
  const [retiros, setRetiros] = useState("0");
  const [efectivoFisico, setEfectivoFisico] = useState("");

  const unclosedOrders = orders.filter(o => !o.corteId);
  const ventasEfectivo = unclosedOrders.filter(o=>o.method==="EFECTIVO").reduce((sum,o)=>sum+o.total, 0);
  const ventasTarjeta = unclosedOrders.filter(o=>o.method==="TARJETA").reduce((sum,o)=>sum+o.total, 0);

  const numFondo = parseFloat(fondo)||0;
  const numRetiros = parseFloat(retiros)||0;
  const numEfectivoFisico = parseFloat(efectivoFisico)||0;

  const esperado = numFondo + ventasEfectivo - numRetiros;
  const diferencia = numEfectivoFisico - esperado;

  const handleCorte = () => {
    if(!efectivoFisico) return;
    const corte: CorteCaja = {
      id: `#Z-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toLocaleString("es-MX"),
      cajero: userRole==="admin" ? "Administrador" : "Cajero",
      fondoInicial: numFondo,
      ventasEfectivo,
      ventasTarjeta,
      retiros: numRetiros,
      efectivoEsperado: esperado,
      efectivoDeclarado: numEfectivoFisico,
      diferencia
    };
    onGuardarCorte(corte);
  };

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 border-b flex items-center px-5 py-4" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("reportes")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-[22px] font-semibold ml-2" style={{ color:C.txt1 }}>Corte de Caja</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        
        <div className="bg-white p-4 rounded-xl border drop-shadow-sm" style={{ borderColor:C.border }}>
          <p className="text-sm font-bold mb-3" style={{ color:C.txt1 }}>Ventas del Turno (Sin cortar)</p>
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor:C.border }}>
            <span className="text-sm" style={{ color:C.txt2 }}>Ventas en Efectivo</span>
            <span className="text-base font-semibold" style={{ color:C.txt1 }}>{fmt(ventasEfectivo)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm" style={{ color:C.txt2 }}>Ventas con Tarjeta</span>
            <span className="text-base font-semibold" style={{ color:C.txt1 }}>{fmt(ventasTarjeta)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color:C.txt1 }}>Fondo Inicial de Caja</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color:C.txt2 }}>$</span>
              <input type="number" inputMode="numeric" value={fondo} onChange={e=>setFondo(e.target.value)} className="w-full rounded-xl pl-8 pr-4 py-3.5 text-base font-bold border outline-none" style={{ background:"#fff", borderColor:C.border, color:C.txt1 }} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1.5" style={{ color:C.txt1 }}>Retiros / Pagos (Efectivo)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color:C.txt2 }}>$</span>
              <input type="number" inputMode="numeric" value={retiros} onChange={e=>setRetiros(e.target.value)} className="w-full rounded-xl pl-8 pr-4 py-3.5 text-base font-bold border outline-none" style={{ background:"#fff", borderColor:C.border, color:C.txt1 }} />
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background:"rgba(15,82,56,0.05)" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-center mb-1" style={{ color:C.txt2 }}>Efectivo Esperado en Caja</p>
          <p className="text-3xl font-bold text-center" style={{ color:C.green }}>{fmt(esperado)}</p>
        </div>

        <div>
          <label className="text-sm font-bold block mb-1.5" style={{ color:C.txt1 }}>Efectivo Físico Contado</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold" style={{ color:C.txt2 }}>$</span>
            <input type="number" inputMode="numeric" placeholder="0.00" value={efectivoFisico} onChange={e=>setEfectivoFisico(e.target.value)} className="w-full rounded-xl pl-8 pr-4 py-4 text-2xl font-bold border-2 outline-none" style={{ background:"#fff", borderColor:C.green, color:C.txt1 }} />
          </div>
        </div>

        {efectivoFisico !== "" && (
          <div className={`rounded-xl p-4 border flex justify-between items-center ${diferencia === 0 ? 'bg-gray-50 border-gray-200' : diferencia > 0 ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color:C.txt2 }}>Diferencia</p>
              <p className="text-sm font-bold" style={{ color: diferencia === 0 ? C.txt1 : diferencia > 0 ? '#1d4ed8' : '#b91c1c' }}>
                {diferencia === 0 ? "Cuadrado" : diferencia > 0 ? "Sobrante" : "Faltante"}
              </p>
            </div>
            <p className="text-2xl font-bold" style={{ color: diferencia === 0 ? C.txt1 : diferencia > 0 ? '#1d4ed8' : '#b91c1c' }}>
              {diferencia > 0 ? '+' : ''}{fmt(diferencia)}
            </p>
          </div>
        )}

        <div className="mt-auto w-full pt-4">
          <button onClick={handleCorte} disabled={!efectivoFisico} className="w-full h-14 rounded-full text-white text-base font-semibold disabled:opacity-40 active:scale-95 transition-transform" style={{ background:C.green }}>
            Confirmar Corte
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Ticket Corte de Caja
// ══════════════════════════════════════════════════════════════════════════
export function TicketCorteScreen({ corte, goTo }:{ corte:CorteCaja; goTo:(s:Screen)=>void }) {
  return (
    <div className="flex flex-col h-full px-5 py-6 items-center" style={{ background:"#e5e7e8" }}>
      <div className="w-full bg-white px-5 py-6 drop-shadow-md relative overflow-hidden flex-1 overflow-y-auto mb-4" style={{ maxHeight: '85%' }}>
        <div className="absolute top-0 left-0 right-0 h-2" style={{ background:"repeating-linear-gradient(45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)" }} />
        <h2 className="text-center font-bold text-lg mb-2" style={{ color:C.txt1 }}>TICKET CORTE Z</h2>
        <p className="text-center text-xs font-semibold mb-1" style={{ color:C.txt2 }}>Frutería del Hogar</p>
        <p className="text-center text-xs mb-4" style={{ color:C.txt2 }}>{corte.fecha}</p>
        <div className="mb-4 text-xs">
          <p><strong>Corte ID:</strong> {corte.id}</p>
          <p><strong>Cajero:</strong> {corte.cajero}</p>
        </div>
        
        <div className="border-t border-b py-2 mb-4 text-xs flex flex-col gap-1" style={{ borderColor:"#ccc" }}>
          <div className="flex justify-between"><span className="font-bold">Fondo Inicial:</span><span>{fmt(corte.fondoInicial)}</span></div>
          <div className="flex justify-between"><span className="font-bold">Ventas Efectivo:</span><span>{fmt(corte.ventasEfectivo)}</span></div>
          <div className="flex justify-between"><span className="font-bold">Ventas Tarjeta:</span><span>{fmt(corte.ventasTarjeta)}</span></div>
          <div className="flex justify-between"><span className="font-bold">Retiros:</span><span>-{fmt(corte.retiros)}</span></div>
        </div>

        <div className="flex justify-between font-bold text-sm mb-2"><span style={{ color:C.txt1 }}>EFECTIVO ESPERADO:</span><span style={{ color:C.txt1 }}>{fmt(corte.efectivoEsperado)}</span></div>
        <div className="flex justify-between font-bold text-sm mb-4"><span style={{ color:C.txt1 }}>EFECTIVO FÍSICO:</span><span style={{ color:C.txt1 }}>{fmt(corte.efectivoDeclarado)}</span></div>

        <div className="flex justify-between font-bold text-sm mb-6 p-2 rounded" style={{ background: corte.diferencia===0?"#f3f4f6":corte.diferencia>0?"#dbeafe":"#fee2e2", color: corte.diferencia===0?C.txt1:corte.diferencia>0?"#1e3a8a":"#991b1b" }}>
          <span>{corte.diferencia===0?"CUADRADO":corte.diferencia>0?"SOBRANTE":"FALTANTE"}</span>
          <span>{fmt(corte.diferencia)}</span>
        </div>

        <div className="text-center border-t pt-4 mb-4" style={{ borderColor:"#ccc" }}>
          <p className="text-xs text-gray-500 mb-6">Firma del Cajero</p>
          <p className="text-xs text-gray-500">Firma Encargado</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background:"repeating-linear-gradient(-45deg, transparent, transparent 10px, #ccc 10px, #ccc 20px)" }} />
      </div>
      <div className="mt-auto w-full flex flex-col gap-2">
        <button onClick={() => window.print()} className="w-full h-12 rounded-full border text-base font-semibold active:scale-95 transition-transform" style={{ borderColor:C.green, color:C.green, background: "#fff" }}>Imprimir / Guardar</button>
        <button onClick={()=>goTo("reportes")} className="w-full h-14 rounded-full text-white text-base font-semibold active:scale-95 transition-transform" style={{ background:C.green }}>Cerrar</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Nuevo Proveedor — actually saves to suppliers state