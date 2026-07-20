import React, { useState } from "react";
import { Plus, Search, Truck, ClipboardList } from "lucide-react";
import { C } from "../../utils/constants";
import { Screen } from "../../models/types";
import { AppHeader, VerDetallesBtn } from "../../components/Shared";
import { getNextDelivery } from "../../utils/constants";
import { useSuppliers } from "../../context/SuppliersContext";
import { useAuth } from "../../context/AuthContext";

export function ProveedoresScreen({ goTo, onBell, notifCount }:{ goTo:(s:Screen)=>void; onBell:()=>void; notifCount:number; }) {
  const { suppliers } = useSuppliers();
  const { userRole, logout } = useAuth();
  
  const [search,setSearch]=useState(""); 
  const [expanded,setExpanded]=useState<number|null>(null);
  const filtered=suppliers.filter(s=>s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <AppHeader onBell={onBell} notifCount={notifCount} onLogout={logout} />
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
