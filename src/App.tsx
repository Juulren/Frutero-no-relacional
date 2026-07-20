import React, { useState } from "react";
import { Home, ShoppingCart, Package, BarChart2, Users } from "lucide-react";
import { Screen, Product, SupplierOrder, CorteCaja, CartItem } from "./models/types";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { InventoryProvider, useInventory } from "./context/InventoryContext";
import { SalesProvider } from "./context/SalesContext";
import { SuppliersProvider, useSuppliers } from "./context/SuppliersContext";

// Screens (Feature Modules)
import { AuthScreen } from "./features/auth/AuthScreen";
import { DashboardScreen } from "./features/dashboard/DashboardScreen";
import { VentaScreen } from "./features/sales/VentaScreen";
import { VentaConfirmadaScreen } from "./features/sales/VentaConfirmadaScreen";
import { HistorialScreen } from "./features/sales/HistorialVentasScreen";
import { InventarioScreen } from "./features/inventory/InventarioScreen";
import { AgregarProductoScreen } from "./features/inventory/AgregarProductoScreen";
import { EditarProductoScreen } from "./features/inventory/EditarProductoScreen";
import { ReportesScreen } from "./features/reports/ReportesScreen";
import { HacerCorteScreen } from "./features/reports/HacerCorteScreen";
import { TicketCorteScreen } from "./features/reports/TicketCorteScreen";
import { ProveedoresScreen } from "./features/suppliers/ProveedoresScreen";
import { NuevoProveedorScreen } from "./features/suppliers/NuevoProveedorScreen";
import { GenerarPedidoScreen } from "./features/suppliers/GenerarPedidoScreen";
import { ListaPedidosScreen } from "./features/suppliers/ListaPedidosScreen";
import { DetalleReciboScreen } from "./features/suppliers/DetalleReciboScreen";

import { C, TODAY_ES, LOW_THR } from "./utils/constants";
import { NotificationPanel, AllNotificationsModal } from "./components/Notifications";

const NAV = [
  { id: "dashboard" as Screen, label: "Inicio", Icon: Home },
  { id: "venta" as Screen, label: "Venta", Icon: ShoppingCart },
  { id: "inventario" as Screen, label: "Inventario", Icon: Package },
  { id: "reportes" as Screen, label: "Reportes", Icon: BarChart2 },
  { id: "proveedores" as Screen, label: "Proveedores", Icon: Users }
] as const;

function AppContent() {
  const { userRole } = useAuth();
  const { products } = useInventory();
  const { suppliers } = useSuppliers();

  const [screen, setScreen] = useState<Screen>("dashboard");
  const [showNotif, setShowNotif] = useState(false);
  const [showAllNotif, setShowAllNotif] = useState(false);

  // Transient state for navigation between specific screens
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<SupplierOrder | null>(null);
  const [activeCorte, setActiveCorte] = useState<CorteCaja | null>(null);
  const [lastSaleData, setLastSaleData] = useState<{total:number,method:string,cart:CartItem[],id:string} | null>(null);

  // Notifications logic
  const lowStock = products.filter(p => p.stock <= LOW_THR && p.stock > 0);
  const suppToday = suppliers.filter(s => s.deliveryDays.includes(TODAY_ES));
  const notifCount = lowStock.length + suppToday.length;

  const goTo = (s: Screen) => setScreen(s);
  const onBell = () => setShowNotif(true);

  if (!userRole) return <AuthScreen />;

  return (
    <div className="h-[100dvh] w-full overflow-hidden flex flex-col md:flex-row shadow-2xl relative" style={{ background: C.bg }}>
      <div className="flex-1 overflow-hidden relative md:order-2 w-full flex flex-col">
        {screen === "dashboard" && <DashboardScreen goTo={goTo} onBell={onBell} notifCount={notifCount} onShowAllNotif={() => setShowAllNotif(true)} />}
        
        {screen === "venta" && <VentaScreen goTo={goTo} onBell={onBell} notifCount={notifCount} onSaleConfirmed={(data) => { setLastSaleData(data); goTo("venta-confirmada" as any); }} />}
        {screen === "venta-confirmada" && lastSaleData && <VentaConfirmadaScreen total={lastSaleData.total} method={lastSaleData.method} cart={lastSaleData.cart} goTo={goTo} />}
        {screen === "historial" && <HistorialScreen goTo={goTo} />}

        {screen === "inventario" && <InventarioScreen goTo={goTo} onEdit={(p) => { setEditProduct(p); goTo("editar-producto"); }} onBell={onBell} notifCount={notifCount} />}
        {screen === "editar-producto" && editProduct && <EditarProductoScreen product={editProduct} goTo={goTo} />}
        {screen === "agregar-producto" && <AgregarProductoScreen goTo={goTo} />}

        {screen === "reportes" && <ReportesScreen goTo={goTo} onBell={onBell} notifCount={notifCount} />}
        {screen === "hacer-corte" && <HacerCorteScreen goTo={goTo} onGuardarCorte={c => { setActiveCorte(c); goTo("ticket-corte"); }} />}
        {screen === "ticket-corte" && activeCorte && <TicketCorteScreen corte={activeCorte} goTo={goTo} />}

        {screen === "proveedores" && <ProveedoresScreen goTo={goTo} onBell={onBell} notifCount={notifCount} />}
        {screen === "nuevo-proveedor" && <NuevoProveedorScreen goTo={goTo} />}
        {screen === "generar-pedido" && <GenerarPedidoScreen goTo={goTo} />}
        {screen === "recibir-pedidos" && <ListaPedidosScreen goTo={goTo} onSelectOrder={o => { setSelectedOrder(o); goTo("detalle-recibo"); }} />}
        {screen === "detalle-recibo" && selectedOrder && <DetalleReciboScreen order={selectedOrder} goTo={goTo} onCloseOrder={() => goTo("recibir-pedidos")} />}
      </div>
      
      {showNotif && <NotificationPanel lowStock={lowStock} suppToday={suppToday} onClose={() => setShowNotif(false)} goTo={s => { setShowNotif(false); goTo(s); }} />}
      {showAllNotif && <AllNotificationsModal lowStock={lowStock} suppToday={suppToday} onClose={() => setShowAllNotif(false)} goTo={s => { setShowAllNotif(false); goTo(s); }} />}

      {["dashboard", "venta", "inventario", "reportes", "proveedores"].includes(screen) && (
        <div className="h-[72px] md:h-full md:w-20 lg:w-[220px] shrink-0 flex flex-row md:flex-col items-center md:items-stretch justify-around md:justify-start md:pt-6 px-2 lg:px-4 z-10 border-t md:border-t-0 md:border-r md:order-1 transition-all md:gap-2" style={{ background: "#fff", borderColor: C.border }}>
          {NAV.map(n => {
            const active = screen === n.id;
            return (
              <button key={n.id} onClick={() => goTo(n.id)} className={`flex flex-col lg:flex-row items-center lg:justify-start justify-center gap-1 lg:gap-3 w-16 md:w-full h-full md:h-12 lg:px-4 relative md:rounded-xl transition-colors ${active ? "md:bg-gray-50" : "hover:bg-gray-50"}`}>
                {active && <div className="absolute top-0 md:top-auto md:left-0 w-8 md:w-1 h-1 md:h-8 rounded-b-full md:rounded-b-none md:rounded-r-full" style={{ background: C.green }} />}
                <n.Icon size={22} strokeWidth={active ? 2.5 : 2} style={{ color: active ? C.green : C.muted }} className="shrink-0" />
                <span className="text-[10px] lg:text-sm font-semibold lg:font-bold block md:hidden lg:block" style={{ color: active ? C.green : C.muted }}>{n.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <InventoryProvider>
        <SalesProvider>
          <SuppliersProvider>
            <AppContent />
          </SuppliersProvider>
        </SalesProvider>
      </InventoryProvider>
    </AuthProvider>
  );
}
