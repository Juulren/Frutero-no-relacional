import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { C, fmt } from "../../utils/constants";
import { Screen, CorteCaja } from "../../models/types";
import { useSales } from "../../context/SalesContext";
import { useAuth } from "../../context/AuthContext";

export function HacerCorteScreen({ goTo, onGuardarCorte }:{ goTo:(s:Screen)=>void; onGuardarCorte:(corte:CorteCaja)=>void }) {
  const { orders } = useSales();
  const { userRole } = useAuth();
  
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
