using System;
using System.Linq;
using FruteriaDelHogar.API.Models;

namespace FruteriaDelHogar.API.Services
{
    public class DashboardService
    {
        private VentaService _ventaService;
        private ProductoService _productoService;
        private ProveedorService _proveedorService;

        public DashboardService(VentaService ventaService, ProductoService productoService, ProveedorService proveedorService)
        {
            _ventaService = ventaService;
            _productoService = productoService;
            _proveedorService = proveedorService;
        }

        public DashboardResumen CargarResumen()
        {
            var resumen = new DashboardResumen();
            var fechaHoy = DateTime.Now.ToString("yyyy-MM-dd");

            var ventasHoy = _ventaService.ListarVentasPorFecha(fechaHoy);
            int totalVentas = ventasHoy.Count;
            decimal ingresos = ventasHoy.Sum(v => v.Total);

            var productos = _productoService.ListarProductos();
            int stockBajo = productos.Count(p => p.VerificarStockBajo());

            // Alertas (Ej. entregas pendientes, se simulan 0 aquí o se conectan a un servicio real)
            int alertas = 0;

            resumen.ActualizarDatos(totalVentas, stockBajo, alertas, ingresos);
            return resumen;
        }
    }
}
