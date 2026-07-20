import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT, LOW_THR, TODAY_ES } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

import { NotificationPanel, AllNotificationsModal } from '../components/Notifications';
import { AppHeader } from '../components/Shared';
export function DashboardScreen({ orders, products, suppliers, goTo, onBell, notifCount, onShowAllNotif, userRole, onLogout }:{
  orders:SaleRecord[]; products:Product[]; suppliers:Supplier[];
  goTo:(s:Screen)=>void; onBell:()=>void; notifCount:number; onShowAllNotif:()=>void; userRole:UserRole; onLogout:()=>void;
}) {
  const efectivoTotal = orders.filter(o=>o.method==="EFECTIVO").reduce((s,o)=>s+o.total,0);
  const tarjetaTotal  = orders.filter(o=>o.method==="TARJETA").reduce((s,o)=>s+o.total,0);
  const total         = efectivoTotal+tarjetaTotal;
  const lowStock      = products.filter(p=>p.stock<=LOW_THR&&p.stock>0);
  const suppToday     = suppliers.filter(s=>s.deliveryDays.includes(TODAY_ES));

  return (
    <div className="flex flex-col h-full">
      <AppHeader onBell={onBell} notifCount={notifCount} onLogout={onLogout} />
      <div className="flex-1 overflow-y-auto" style={{ background:C.bg }}>
        <div className="flex flex-col gap-5 px-5 py-4 pb-8 md:max-w-5xl mx-auto w-full">

          {/* Notificaciones */}
          <div className="rounded-xl border drop-shadow-[0px_4px_10px_rgba(45,106,79,0.08)]" style={{ background:C.bg, borderColor:C.border }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b" style={{ borderColor:C.border }}>
              <div className="flex items-center gap-2">
                <Bell size={16} style={{ color:C.amber }} />
                <span className="text-base font-bold" style={{ color:C.txt1 }}>Notificaciones</span>
                {notifCount>0&&<span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background:C.amber, color:"#fff" }}>{notifCount}</span>}
              </div>
              <button onClick={onShowAllNotif} className="text-xs font-semibold" style={{ color:C.green }}>Ver todas →</button>
            </div>
            {lowStock.length>0 && (
              <div className="px-4 pt-3">
                <div className="flex items-center gap-1.5 mb-2"><AlertTriangle size={12} style={{ color:C.amber }} /><p className="text-xs font-bold uppercase tracking-wider" style={{ color:C.amber }}>Stock bajo</p></div>
                <div className="md:grid md:grid-cols-2 md:gap-4">
                {lowStock.map(p=>(
                  <div key={p.id} className="flex items-center justify-between py-2 border-b md:border-b-0 last:border-0" style={{ borderColor:C.border }}>
                    <span className="text-base font-semibold" style={{ color:C.txt1 }}>{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color:C.amber }}>{p.stock} {p.unit}</span>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            )}
            <div className="px-4 pt-3 pb-3">
              <div className="flex items-center gap-1.5 mb-2"><Truck size={12} style={{ color:C.green }} /><p className="text-xs font-bold uppercase tracking-wider" style={{ color:C.green }}>Proveedores hoy ({TODAY_ES})</p></div>
              {suppToday.length===0 ? (
                <p className="text-xs py-1" style={{ color:C.txt2 }}>Sin entregas programadas para hoy</p>
              ) : (
                <div className="md:grid md:grid-cols-2 md:gap-4">
                  {suppToday.map(s=>(
                    <div key={s.id} className="flex items-center justify-between py-2 border-b md:border-b-0 last:border-0" style={{ borderColor:C.border }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background:C.green2 }}>{s.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-semibold leading-tight" style={{ color:C.txt1 }}>{s.name.split(" ").slice(0,3).join(" ")}</p>
                          <p className="text-xs" style={{ color:C.txt2 }}>{s.category}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {[{label:"Registrar venta",s:"venta", roles:["admin","cajero"]},{label:"Inventario",s:"inventario", roles:["admin","cajero"]},{label:"Proveedores",s:"proveedores", roles:["admin","cajero"]},{label:"Reportes",s:"reportes", roles:["admin","cajero"]}].filter(b=>b.roles.includes(userRole as string)).map(btn=>(
              <button key={btn.label} onClick={()=>goTo(btn.s as Screen)}
                className="flex flex-col items-center justify-center gap-2 h-[110px] rounded-xl border active:scale-95 transition-transform drop-shadow-[0px_4px_10px_rgba(45,106,79,0.08)]"
                style={{ background:C.green, borderColor:C.green }}>
                <span className="text-2xl">{btn.s==="venta"?"🛒":btn.s==="inventario"?"📦":btn.s==="proveedores"?"👥":btn.s==="recibir-pedidos"?"🚚":"📊"}</span>
                <span className="text-xs font-semibold tracking-wide text-center text-white">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Acumulado — computed from real orders */}
          <div className="rounded-xl border drop-shadow-[0px_4px_10px_rgba(45,106,79,0.08)]" style={{ background:C.bg, borderColor:C.border }}>
            <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b" style={{ borderColor:C.border }}>
              <div>
                <p className="font-bold text-base" style={{ color:C.txt1 }}>Acumulado de hoy</p>
                <p className="text-xs font-semibold" style={{ color:C.green }}>{orders.length} ventas registradas</p>
              </div>
            </div>
            <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="rounded-xl p-3" style={{ background:C.inp, border:"1px solid rgba(191,201,193,0.2)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color:C.txt2 }}>💵 Efectivo</p>
                <p className="font-bold text-lg" style={{ color:C.txt1 }}>{fmt(efectivoTotal)}</p>
              </div>
              <div className="rounded-xl p-3" style={{ background:C.inp, border:"1px solid rgba(191,201,193,0.2)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color:C.txt2 }}>💳 Tarjeta</p>
                <p className="font-bold text-lg" style={{ color:C.txt1 }}>{fmt(tarjetaTotal)}</p>
              </div>
              <div className="col-span-2 md:col-span-2 rounded-xl p-3" style={{ background:C.green }}>
                <p className="text-xs font-semibold opacity-80 mb-1 text-white">Total del día</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-2xl text-white">{fmt(total)}</p>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full text-white" style={{ background:"rgba(255,255,255,0.2)" }}>{orders.length} ventas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
