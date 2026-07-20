import React, { useState } from "react";
import { Check, ClipboardList } from "lucide-react";
import { C, fmt } from "../../utils/constants";
import { CartItem, Screen } from "../../models/types";

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
