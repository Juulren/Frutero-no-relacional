import React from "react";
import { C, fmt } from "../../utils/constants";
import { Screen, CorteCaja } from "../../models/types";

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
