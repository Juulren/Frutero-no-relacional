import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT, TODAY_ES } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

export function NotificationPanel({ lowStock, suppToday, onClose, goTo }:{
  lowStock:Product[]; suppToday:Supplier[]; onClose:()=>void; goTo:(s:Screen)=>void;
}) {
  const count = lowStock.length + suppToday.length;
  return (
    <>
      <div className="absolute inset-0 z-[58]" onClick={onClose} />
      <div className="absolute right-4 top-[62px] z-[59] w-[310px] rounded-2xl shadow-[0px_8px_24px_rgba(0,0,0,0.15)] overflow-hidden border" style={{ background:"#fff", borderColor:C.border }}>
        <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b" style={{ borderColor:C.border }}>
          <div className="flex items-center gap-1.5">
            <Bell size={14} style={{ color:C.green }} />
            <span className="text-sm font-bold" style={{ color:C.txt1 }}>Notificaciones</span>
            {count>0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background:C.amber, color:"#fff" }}>{count}</span>}
          </div>
          <button onClick={onClose} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background:C.chip }}><X size={11} color={C.txt2} /></button>
        </div>
        <div className="px-4 py-3 flex flex-col gap-3 max-h-[300px] overflow-y-auto">
          {count===0 ? (
            <div className="flex items-center gap-2 py-2"><Check size={15} style={{ color:C.green }} /><p className="text-sm font-medium" style={{ color:C.txt2 }}>Todo en orden, sin alertas</p></div>
          ) : (
            <>
              {lowStock.length>0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2"><AlertTriangle size={13} style={{ color:C.amber }} /><p className="text-xs font-bold uppercase tracking-widest" style={{ color:C.amber }}>Stock bajo</p></div>
                  {lowStock.map(p=>(
                    <div key={p.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor:C.border }}>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold" style={{ color:C.txt1 }}>{p.name}</p>
                        <p className="text-xs font-medium" style={{ color:C.amber }}>Solo {p.stock} {p.unit} restantes</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5 mb-2"><Truck size={13} style={{ color:C.green }} /><p className="text-xs font-bold uppercase tracking-widest" style={{ color:C.green }}>Proveedores hoy</p></div>
                {suppToday.length===0 ? (
                  <p className="text-sm py-1" style={{ color:C.muted }}>Sin entregas hoy ({TODAY_ES})</p>
                ) : suppToday.map(s=>(
                  <div key={s.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor:C.border }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background:C.green2 }}>{s.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color:C.txt1 }}>{s.name.split(" ").slice(0,3).join(" ")}</p>
                      <p className="text-xs font-medium" style={{ color:C.green }}>🚚 Entrega hoy ({TODAY_ES})</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Full Notification Modal (Ver todas) ─────────────────────────────────
export function AllNotificationsModal({ lowStock, suppToday, onClose, goTo }:{
  lowStock:Product[]; suppToday:Supplier[]; onClose:()=>void; goTo:(s:Screen)=>void;
}) {
  const count = lowStock.length + suppToday.length;
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background:"rgba(46,49,50,0.4)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="rounded-tl-3xl rounded-tr-3xl flex flex-col drop-shadow-[0px_-8px_20px_rgba(15,82,56,0.15)]" style={{ background:"#fff", maxHeight:"85%" }}>
        <div className="flex justify-center pt-3 pb-1 shrink-0"><div className="w-10 h-1.5 rounded-full" style={{ background:C.muted }} /></div>
        <div className="flex items-center justify-between px-5 pb-3 pt-2 shrink-0 border-b" style={{ borderColor:C.border }}>
          <div className="flex items-center gap-2">
            <Bell size={18} style={{ color:C.green }} />
            <span className="text-xl font-bold" style={{ color:C.txt1 }}>Todas las Notificaciones</span>
            {count>0 && <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background:C.amber, color:"#fff" }}>{count}</span>}
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background:C.chip }}><X size={16} color={C.txt2} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {count===0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ background:"rgba(15,82,56,0.1)" }}>
                <Check size={28} style={{ color:C.green }} />
              </div>
              <p className="text-lg font-semibold mb-1" style={{ color:C.txt1 }}>Todo en orden</p>
              <p className="text-sm" style={{ color:C.txt2 }}>No hay alertas pendientes</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {lowStock.length>0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor:C.border }}>
                    <AlertTriangle size={16} style={{ color:C.amber }} />
                    <p className="text-base font-bold" style={{ color:C.amber }}>STOCK BAJO</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background:C.amber, color:"#fff" }}>{lowStock.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {lowStock.map(p=>(
                      <div key={p.id} className="rounded-xl px-4 py-4 border" style={{ background:C.bg, borderColor:C.border }}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="text-lg font-bold leading-tight mb-1" style={{ color:C.txt1 }}>{p.name}</p>
                            <p className="text-sm" style={{ color:C.txt2 }}>{p.category} · {p.unit}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold mb-0.5" style={{ color:C.amber }}>Solo quedan</p>
                            <p className="text-2xl font-bold" style={{ color:C.amber }}>{p.stock} {p.unit}</p>
                          </div>
                        </div>
                        <button onClick={()=>{ onClose(); goTo("inventario"); }} className="mt-3 w-full h-11 rounded-xl text-sm font-bold text-white" style={{ background:C.green }}>Reponer Stock</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b" style={{ borderColor:C.border }}>
                  <Truck size={16} style={{ color:C.green }} />
                  <p className="text-base font-bold" style={{ color:C.green }}>ENTREGAS HOY ({TODAY_ES})</p>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background:C.green, color:"#fff" }}>{suppToday.length}</span>
                </div>
                {suppToday.length===0 ? (
                  <p className="text-sm text-center py-4" style={{ color:C.muted }}>Sin entregas programadas para hoy</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {suppToday.map(s=>(
                      <div key={s.id} className="rounded-xl px-4 py-4 border" style={{ background:C.bg, borderColor:C.border }}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0" style={{ background:C.green2 }}>{s.name.charAt(0)}</div>
                          <div className="flex-1">
                            <p className="text-lg font-bold leading-tight" style={{ color:C.txt1 }}>{s.name}</p>
                            <p className="text-sm" style={{ color:C.txt2 }}>{s.category}</p>
                          </div>
                        </div>
                        <div className="rounded-lg px-3 py-2 mb-2" style={{ background:"rgba(45,106,79,0.08)" }}>
                          <p className="text-xs font-semibold mb-1" style={{ color:C.txt2 }}>📞 {s.phone}</p>
                          <p className="text-xs" style={{ color:C.txt2 }}>📍 {s.address}</p>
                        </div>
                        <button onClick={()=>{ onClose(); goTo("generar-pedido"); }} className="w-full h-11 rounded-xl text-sm font-bold text-white" style={{ background:C.green2 }}>Generar Pedido</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
