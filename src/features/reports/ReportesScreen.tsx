import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { ClipboardList } from "lucide-react";
import { C, fmt } from "../../utils/constants";
import { Screen } from "../../models/types";
import { AppHeader } from "../../components/Shared";
import { useSales } from "../../context/SalesContext";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";
import { AnalyticsService } from "../../services/AnalyticsService";

export function ReportesScreen({ goTo, onBell, notifCount }:{ goTo:(s:Screen)=>void; onBell:()=>void; notifCount:number; }) {
  const { orders, cortes } = useSales();
  const { products } = useInventory();
  const { userRole, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"ventas"|"cortes">(userRole==="cajero"?"cortes":"ventas");
  const [period,setPeriod]=useState("Diario");

  const totalVentas   = orders.reduce((s,o)=>s+o.total,0);
  const gananciaEst   = totalVentas*0.28;
  const mermaEst      = totalVentas*0.04;
  
  const prodEstrella = useMemo(() => AnalyticsService.getProductoEstrella(orders, products), [orders, products]);
  const diarioData = useMemo(() => AnalyticsService.getDiarioData(orders), [orders]);
  const semanalData = useMemo(() => AnalyticsService.getSemanalData(totalVentas), [totalVentas]);
  const mensualData = useMemo(() => AnalyticsService.getMensualData(totalVentas), [totalVentas]);

  const chartData = period==="Diario" ? diarioData : period==="Semanal" ? semanalData : mensualData;
  const maxVal    = chartData.length > 0 ? Math.max(...chartData.map(d=>d.value)) : 0;

  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <AppHeader onBell={onBell} notifCount={notifCount} onLogout={logout} />
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
