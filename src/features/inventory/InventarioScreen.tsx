import React, { useState, useMemo } from "react";
import { ArrowLeft, Plus, Search, Filter, ChevronRight } from "lucide-react";
import { C, fmt, DEFAULT_FILTER, LOW_THR } from "../../utils/constants";
import { Screen, Category, FilterState, Product } from "../../models/types";
import { AppHeader, FilterModal } from "../../components/Shared";
import { useInventory } from "../../context/InventoryContext";
import { useAuth } from "../../context/AuthContext";

export function InventarioScreen({ goTo, onEdit, onBell, notifCount }:{
  goTo:(s:Screen)=>void; onEdit:(p:Product)=>void; onBell:()=>void; notifCount:number;
}) {
  const { products } = useInventory();
  const { userRole, logout } = useAuth();
  
  const [search,setSearch]=useState(""); 
  const [filter,setFilter]=useState<FilterState>(DEFAULT_FILTER); 
  const [showFilter,setShowFilter]=useState(false);
  const [page,setPage]=useState(1);
  const ITEMS_PER_PAGE = 50;

  const activeFilters=filter.cats.length+(filter.sortBy!=="az"?1:0)+(filter.onlyInStock?1:0)+(filter.maxPrice<500?1:0);
  const filtered=useMemo(()=>{
    let list=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())&&(filter.cats.length===0||filter.cats.includes(p.category as Category))&&p.price<=filter.maxPrice&&(!filter.onlyInStock||p.stock>0));
    if(filter.sortBy==="priceAsc")  list=[...list].sort((a,b)=>a.price-b.price);
    if(filter.sortBy==="priceDesc") list=[...list].sort((a,b)=>b.price-a.price);
    if(filter.sortBy==="az")        list=[...list].sort((a,b)=>a.name.localeCompare(b.name));
    return list;
  },[products,search,filter]);

  // Reset page when search or filter changes
  React.useEffect(() => { setPage(1); }, [search, filter]);

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col h-full relative" style={{ background:C.bg }}>
      <AppHeader onBell={onBell} notifCount={notifCount} onLogout={logout} />
      <div className="px-5 pt-3 pb-3 flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2"><button onClick={()=>goTo("dashboard")}><ArrowLeft size={18} style={{ color:C.txt2 }} /></button><span className="text-2xl font-semibold" style={{ color:C.green2 }}>Inventario</span></div>
        {userRole==="admin" && <button onClick={()=>goTo("agregar-producto")} className="w-full h-[48px] rounded-full flex items-center justify-center gap-2 text-xs font-semibold tracking-widest uppercase text-white active:scale-95 transition-transform" style={{ background:C.green }}><Plus size={13} /> AGREGAR PRODUCTO</button>}
        <div className="flex gap-2">
          <div className="flex-1 relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#707973" }} /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar producto" className="w-full h-11 rounded-xl pl-9 pr-4 text-sm border outline-none" style={{ background:C.bg, borderColor:C.muted, color:C.txt1 }} /></div>
          <button onClick={()=>setShowFilter(true)} className="relative w-11 h-11 rounded-xl border flex items-center justify-center" style={{ background:activeFilters>0?C.green:C.bg, borderColor:activeFilters>0?C.green:C.muted }}>
            <Filter size={15} style={{ color:activeFilters>0?"#fff":C.green }} />
            {activeFilters>0&&<span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background:C.amber, color:"#fff" }}>{activeFilters}</span>}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4 md:max-w-6xl md:mx-auto md:w-full md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:content-start md:pt-4">
        {filtered.length===0 && <p className="text-center text-sm py-8 md:col-span-full" style={{ color:C.muted }}>Sin productos que coincidan</p>}
        {paginated.map(p=>(
          <div key={p.id} className="bg-white rounded-xl flex items-center gap-3 px-4 py-3 border mb-1 md:mb-0 drop-shadow-[0px_1px_2px_rgba(0,0,0,0.04)]" style={{ borderColor:C.border }}>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight" style={{ color:C.txt1 }}>{p.name}</p>
              <p className="text-sm" style={{ color:C.txt2 }}>{p.category} · Stock: {p.stock} {p.unit}</p>
              {p.stock<=LOW_THR&&p.stock>0 && <p className="text-xs font-bold" style={{ color:C.amber }}>⚠ Stock bajo</p>}
              {p.stock===0 && <p className="text-xs font-bold" style={{ color:"#d4183d" }}>✗ Agotado</p>}
            </div>
            <div className="text-right shrink-0"><p className="font-bold text-base" style={{ color:C.green }}>{fmt(p.price)}</p><p className="text-xs" style={{ color:C.txt2 }}>/{p.unit}</p></div>
            {userRole==="admin" && <button onClick={()=>onEdit(p)} className="ml-1 w-8 h-8 flex items-center justify-center rounded-full active:bg-gray-100"><ChevronRight size={16} color={C.muted} /></button>}
          </div>
        ))}
        {page * ITEMS_PER_PAGE < filtered.length && (
          <div className="md:col-span-full flex justify-center mt-4">
            <button onClick={() => setPage(p => p + 1)} className="px-6 py-2 rounded-full text-sm font-bold text-white shadow-sm" style={{ background:C.green }}>
              Cargar más
            </button>
          </div>
        )}
      </div>
      {showFilter&&<FilterModal filter={filter} onApply={f=>{setFilter(f);setShowFilter(false);}} onClose={()=>setShowFilter(false)} />}
    </div>
  );
}
