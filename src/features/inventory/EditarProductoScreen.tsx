import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { C } from "../../utils/constants";
import { Screen, Product } from "../../models/types";
import { useInventory } from "../../context/InventoryContext";

export function EditarProductoScreen({ product, goTo }:{ product:Product; goTo:(s:Screen)=>void }) {
  const { updateProduct } = useInventory();

  const [form,setForm]=useState({ name:product.name, price:String(product.price), cost:String(product.cost), unit:product.unit, category:product.category as string, stock:String(product.stock), activo:true });
  const set=(k:string,v:string|boolean)=>setForm(p=>({...p,[k]:v}));

  const save=()=>{
    updateProduct({
      ...product,
      name:form.name,
      price:Number(form.price)||product.price,
      cost:Number(form.cost)||product.cost,
      unit:form.unit,
      category:form.category as Product["category"],
      stock:Number(form.stock)??product.stock,
    });
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
