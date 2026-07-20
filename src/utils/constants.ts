import { FilterState, HistorialFilter } from '../models/types';

export const C = {
  green:    "#0f5238", green2:"#2d6a4f", greenTxt:"#a8e7c5",
  bg:"#f8f9fa", border:"#e1e3e4", txt1:"#191c1d", txt2:"#404943",
  muted:"#bfc9c1", inp:"#f3f4f5", chip:"#edeeef", amber:"#fd9d1a",
};

export const DEFAULT_FILTER:FilterState   = { cats:[], sortBy:"az", maxPrice:1000, onlyInStock:false };
export const DEFAULT_HFILT:HistorialFilter = { day:"todos", method:"todos", minItems:"", product:"" };

export const fmt = (n:number) => `$${n.toFixed(2)}`;
export const DAYS_ES = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
export const TODAY_ES = new Date().toLocaleDateString("es-MX",{weekday:"long"}).replace(/^\w/,(c)=>c.toUpperCase());
export const LOW_THR = 10;

export const getNextDelivery = (days:string[]) => {
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