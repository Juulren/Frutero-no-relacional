const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app', 'App.tsx');
const content = fs.readFileSync(srcApp, 'utf8');

// Ensure directories
['src/models', 'src/services', 'src/forms', 'src/components', 'src/utils'].forEach(dir => {
  fs.mkdirSync(path.join(__dirname, dir), { recursive: true });
});

// 1. types.ts
const typesCode = `
export type Screen = "dashboard"|"venta"|"inventario"|"reportes"|"historial"|"proveedores"|"nuevo-proveedor"|"agregar-producto"|"editar-producto"|"generar-pedido"|"recibir-pedidos"|"detalle-recibo"|"hacer-corte"|"ticket-corte";
export type PayModal = null|"efectivo"|"tarjeta";
export type SortBy   = "az"|"priceAsc"|"priceDesc";
export type Category = "Todos"|"Frutas"|"Verduras"|"Abarrotes"|"Lácteos";
export type UserRole = "admin" | "cajero" | null;

export interface Product  { id:number; name:string; price:number; cost:number; unit:string; category:Exclude<Category,"Todos"|"Lácteos">; stock:number; }
export interface CartItem { product:Product; qty:number; }
export interface Supplier { id:number; name:string; phone:string; category:string; address:string; notes:string; deliveryDays:string[]; }
export interface SaleRecord { id:string; time?:string; hora?:string; items:number; total:number; method:"EFECTIVO"|"TARJETA"; date?:string; fecha?:string; corteId?: string; listaDetalles?:any[]; }
export interface SupplierOrder { id:string; supplierId:number; date:string; status:"PENDIENTE"|"RECIBIDO"; items:{product:Product, expectedQty:number, receivedQty:number, cost:number}[]; total:number; }
export interface CorteCaja { id:string; fecha:string; fondoInicial:number; ventasEfectivo:number; ventasTarjeta:number; retiros:number; efectivoEsperado:number; efectivoDeclarado:number; diferencia:number; cajero:string; }
export interface FilterState { cats:Category[]; sortBy:SortBy; maxPrice:number; onlyInStock:boolean; }
export interface HistorialFilter { day:"todos"|"hoy"|"ayer"; method:"todos"|"EFECTIVO"|"TARJETA"; minItems:string; product:string; }
`;
fs.writeFileSync(path.join(__dirname, 'src', 'models', 'types.ts'), typesCode.trim());

// 2. constants.ts
const constantsCode = `
import { FilterState, HistorialFilter } from '../models/types';

export const C = {
  green:    "#0f5238", green2:"#2d6a4f", greenTxt:"#a8e7c5",
  bg:"#f8f9fa", border:"#e1e3e4", txt1:"#191c1d", txt2:"#404943",
  muted:"#bfc9c1", inp:"#f3f4f5", chip:"#edeeef", amber:"#fd9d1a",
};

export const DEFAULT_FILTER:FilterState   = { cats:[], sortBy:"az", maxPrice:500, onlyInStock:false };
export const DEFAULT_HFILT:HistorialFilter = { day:"todos", method:"todos", minItems:"", product:"" };

export const fmt = (n:number) => \`$\${n.toFixed(2)}\`;
`;
fs.writeFileSync(path.join(__dirname, 'src', 'utils', 'constants.ts'), constantsCode.trim());

console.log("types and constants created.");
