import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { C } from "../../utils/constants";
import { Screen, Supplier } from "../../models/types";
import { useSuppliers } from "../../context/SuppliersContext";

export function NuevoProveedorScreen({ goTo }:{ goTo:(s:Screen)=>void }) {
  const { addSupplier } = useSuppliers();

  const ALL_DAYS=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const [form,setForm]=useState({ nombre:"", telefono:"", categoria:"Frutas y Verduras", direccion:"", notas:"", activo:true, deliveryDays:[] as string[] });
  const set=(k:string,v:string|boolean)=>setForm(p=>({...p,[k]:v}));
  const toggleDay=(d:string)=>setForm(p=>({ ...p, deliveryDays:p.deliveryDays.includes(d)?p.deliveryDays.filter(x=>x!==d):[...p.deliveryDays,d] }));

  const save=()=>{
    if(!form.nombre) return;
    const newSupplier:Supplier = {
      id: Date.now(),
      name: form.nombre.trim(),
      phone: form.telefono,
      category: form.categoria,
      address: form.direccion,
      notes: form.notas,
      deliveryDays: form.deliveryDays,
    };
    addSupplier(newSupplier);
    goTo("proveedores");
  };

  return (
    <div className="flex flex-col h-full" style={{ background:C.bg }}>
      <div className="shrink-0 h-16 border-b flex items-center px-5" style={{ background:C.bg, borderColor:C.border }}>
        <button onClick={()=>goTo("proveedores")} className="w-8 h-8 flex items-center justify-center -ml-2"><ArrowLeft size={18} style={{ color:C.txt1 }} /></button>
        <span className="text-[22px] font-semibold ml-2" style={{ color:C.txt1 }}>Agregar proveedor</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {[{label:"Nombre del proveedor",key:"nombre",type:"text",ph:"Ej: Distribuidora Hernández"},{label:"Teléfono",key:"telefono",type:"tel",ph:"555-123-4567"},{label:"Dirección",key:"direccion",type:"text",ph:"Calle, número, colonia"},{label:"Notas",key:"notas",type:"text",ph:"Notas adicionales..."}].map(f=>(
          <div key={f.key}><label className="text-sm font-semibold block mb-1.5" style={{ color:C.txt1 }}>{f.label}</label><input type={f.type} value={form[f.key as keyof typeof form] as string} onChange={e=>set(f.key,e.target.value)} placeholder={f.ph} className="w-full rounded-xl px-4 py-3.5 text-base border outline-none" style={{ background:"#fff", borderColor:C.muted, color:C.txt1 }} /></div>
        ))}
        <div><label className="text-sm font-semibold block mb-2" style={{ color:C.txt1 }}>Categoría</label><div className="grid grid-cols-2 gap-2">{["Frutas y Verduras","Abarrotes","Cítricos","Otro"].map(c=>(<button key={c} onClick={()=>set("categoria",c)} className="py-3 rounded-xl border text-sm font-semibold transition-colors" style={{ background:form.categoria===c?C.green:"#fff", borderColor:form.categoria===c?C.green:C.muted, color:form.categoria===c?"#fff":C.txt2 }}>{c}</button>))}</div></div>
        <div>
          <label className="text-sm font-semibold block mb-1" style={{ color:C.txt1 }}>Días de despacho</label>
          <p className="text-xs mb-3" style={{ color:C.txt2 }}>Selecciona los días que viene a entregar</p>
          <div className="grid grid-cols-4 gap-2">{ALL_DAYS.map(d=>{ const sel=form.deliveryDays.includes(d); return (<button key={d} onClick={()=>toggleDay(d)} className="py-2.5 rounded-xl border text-xs font-bold transition-all" style={{ background:sel?C.green:"#fff", borderColor:sel?C.green:C.muted, color:sel?"#fff":C.txt2 }}>{d.slice(0,3)}</button>); })}</div>
          {form.deliveryDays.length>0&&(<div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:"rgba(45,106,79,0.07)" }}><span className="text-base">🚚</span><p className="text-xs font-semibold" style={{ color:C.green }}>Entrega: {form.deliveryDays.join(", ")}</p></div>)}
        </div>
        <div className="flex items-center justify-between py-3 border-t border-b" style={{ borderColor:C.border }}><div><p className="text-sm font-semibold" style={{ color:C.txt1 }}>Proveedor activo</p><p className="text-xs" style={{ color:C.txt2 }}>Visible en la lista de proveedores</p></div><button onClick={()=>set("activo",!form.activo)} className="w-11 h-6 rounded-full relative transition-colors shrink-0" style={{ background:form.activo?C.green:C.muted }}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.activo?"left-6":"left-1"}`} /></button></div>
        <div className="flex gap-2 pt-1"><button onClick={()=>goTo("proveedores")} className="flex-1 h-[52px] rounded-full border text-base font-semibold" style={{ borderColor:C.green, color:C.green }}>Cancelar</button><button onClick={save} disabled={!form.nombre} className="flex-1 h-[52px] rounded-full text-white text-base font-semibold disabled:opacity-40 active:scale-95" style={{ background:C.green }}>Guardar</button></div>
        <div className="h-4" />
      </div>
    </div>
  );
}
