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