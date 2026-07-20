import React, { useState, useMemo, useEffect, useRef } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users, Plus, Search, X, Check, ArrowLeft, ChevronRight, Filter, SlidersHorizontal, ClipboardList, Bell, Truck, AlertTriangle, Scale, LogOut, Camera, Sun, Moon, Database } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { C, fmt, DEFAULT_FILTER, DEFAULT_HFILT } from "../utils/constants";
import { Screen, PayModal, SortBy, Category, UserRole, Product, CartItem, Supplier, SaleRecord, SupplierOrder, CorteCaja, FilterState, HistorialFilter } from "../models/types";
import { api } from "../services/api";

export function LoginScreen({ onLogin }: { onLogin: (role: "admin" | "cajero") => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = () => {
    if (user === "admin" && pass === "admin123") onLogin("admin");
    else if (user === "cajero" && pass === "cajero123") onLogin("cajero");
    else setErr("Credenciales incorrectas");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-8" style={{ background: C.bg }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: C.green2 }}><span className="text-4xl">🌿</span></div>
      <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: C.green }}>Frutería del Hogar</h1>
      <p className="text-sm mb-8 text-center" style={{ color: C.txt2 }}>Ingresa tus credenciales para continuar</p>
      
      <div className="w-full flex flex-col gap-4 mb-6">
        <input placeholder="Usuario (admin o cajero)" value={user} onChange={e=>setUser(e.target.value)} className="w-full h-12 rounded-xl px-4 border outline-none" style={{ background: "#fff", borderColor: C.border, color: C.txt1 }} />
        <input type="password" placeholder="Contraseña" value={pass} onChange={e=>setPass(e.target.value)} className="w-full h-12 rounded-xl px-4 border outline-none" style={{ background: "#fff", borderColor: C.border, color: C.txt1 }} />
      </div>
      {err && <p className="text-sm font-bold text-red-500 mb-4">{err}</p>}
      
      <button onClick={handleLogin} className="w-full h-14 rounded-full text-white font-bold text-lg active:scale-95 transition-transform" style={{ background: C.green }}>Entrar</button>
    </div>
  );
}

// ─── Seed data ────────────────────────────────────────────────────────────
const SEED_PRODUCTS:Product[] = [
  { id:1,  name:"Manzana",   price:35, cost:20, unit:"kg",    category:"Frutas",    stock:50  },
  { id:2,  name:"Plátano",   price:18, cost:10, unit:"kg",    category:"Frutas",    stock:3   },
  { id:3,  name:"Tomate",    price:22, cost:12, unit:"kg",    category:"Verduras",  stock:2   },
  { id:4,  name:"Sandía",    price:12, cost:7,  unit:"kg",    category:"Frutas",    stock:20  },
  { id:5,  name:"Naranja",   price:20, cost:11, unit:"kg",    category:"Frutas",    stock:40  },
  { id:6,  name:"Cebolla",   price:15, cost:8,  unit:"kg",    category:"Verduras",  stock:4   },
  { id:7,  name:"Limón",     price:20, cost:11, unit:"kg",    category:"Frutas",    stock:60  },
  { id:8,  name:"Zanahoria", price:12, cost:6,  unit:"kg",    category:"Verduras",  stock:35  },
  { id:9,  name:"Aguacate",  price:35, cost:20, unit:"kg",    category:"Frutas",    stock:18  },
  { id:10, name:"Frijol",    price:28, cost:16, unit:"kg",    category:"Abarrotes", stock:80  },
  { id:11, name:"Arroz",     price:22, cost:12, unit:"kg",    category:"Abarrotes", stock:100 },
  { id:12, name:"Aceite",    price:55, cost:32, unit:"litro", category:"Abarrotes", stock:30  },
];

const SEED_SUPPLIERS:Supplier[] = [
  { id:1, name:"Distribuidora Frutas del Valle", phone:"555-123-4567", category:"Frutas y Verduras", address:"Av. Mercado 45, Centro", notes:"Entrega martes y jueves", deliveryDays:["Martes","Jueves"]    },
  { id:2, name:"Abarrotes Hernández",           phone:"555-987-6543", category:"Abarrotes",         address:"Calle 5 de Mayo 12",     notes:"Pago a 30 días",          deliveryDays:["Lunes","Viernes"]    },
  { id:3, name:"Rancho Los Naranjos",           phone:"555-456-7890", category:"Cítricos",          address:"Carretera Km 4.5",       notes:"Producto de temporada",   deliveryDays:["Miércoles","Sábado"] },
];

const SEED_SALES:SaleRecord[] = [
  { id:"#F-0042", time:"14:30", items:3,  total:145.50, method:"EFECTIVO", date:"hoy"  },
  { id:"#F-0041", time:"12:15", items:12, total:890.00, method:"TARJETA",  date:"hoy"  },
  { id:"#F-0040", time:"18:45", items:5,  total:320.25, method:"EFECTIVO", date:"ayer" },
];

// ─── Chart seed (for semanal/mensual shape) ───────────────────────────────
const CHART_SEED:Record<string,{label:string;value:number}[]> = {
  Semanal: [{label:"Lun",value:1200},{label:"Mar",value:980},{label:"Mié",value:1450},{label:"Jue",value:890},{label:"Vie",value:2100},{label:"Sáb",value:2800},{label:"Dom",value:1650}],
  Mensual: [{label:"Sem 1",value:8500},{label:"Sem 2",value:9200},{label:"Sem 3",value:7800},{label:"Sem 4",value:11200}],
};

// ─── Helpers ──────────────────────────────────────────────────────────────
const getNextDelivery = (days:string[]) => {
  if(!days.length) return "No programado";
  const MAP:Record<string,number> = {"Domingo":0,"Lunes":1,"Martes":2,"Miércoles":3,"Jueves":4,"Viernes":5,"Sábado":6};
  const todayNum = new Date().getDay();
  const nums = days.map(d=>MAP[d]??0).sort((a,b)=>a-b);
  const next = nums.find(d=>d>=todayNum)??nums[0];
  const diff = next>=todayNum ? next-todayNum : 7-todayNum+next;
  const name = Object.entries(MAP).find(([,n])=>n===next)?.[0]??"";
  if(diff===0) return `Hoy (${name})`; if(diff===1) return `Mañana (${name})`;
  return `${name} (en ${diff} días)`;
};
