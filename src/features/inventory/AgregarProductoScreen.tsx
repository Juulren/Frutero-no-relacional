import React, { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { C } from "../../utils/constants";
import { Screen, Product } from "../../models/types";
import { useInventory } from "../../context/InventoryContext";

export function AgregarProductoScreen({ goTo }:{ goTo:(s:Screen)=>void }) {
  const { addProduct } = useInventory();
  
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
    addProduct(newProduct);
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
