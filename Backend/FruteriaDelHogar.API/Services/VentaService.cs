using System.Collections.Generic;
using System.Linq;
using FruteriaDelHogar.API.Models;
using FruteriaDelHogar.API.Data;

namespace FruteriaDelHogar.API.Services
{
    public class VentaService
    {
        private readonly LiteDbContext _context;

        public VentaService(LiteDbContext context)
        {
            _context = context;
        }

        public bool RegistrarVenta(Venta venta, Pago pago)
        {
            if (pago.ProcesarPago())
            {
                venta.RegistrarVenta();
                _context.Ventas.Insert(venta);
                // Aquí se actualizaría el inventario
                return true;
            }
            venta.CancelarVenta();
            return false;
        }

        public Venta BuscarVenta(string idVenta)
        {
            return _context.Ventas.FindOne(v => v.IdVenta == idVenta);
        }

        public List<Venta> ListarVentasPorFecha(string fecha)
        {
            return _context.Ventas.Find(v => v.Fecha == fecha).ToList();
        }

        public List<Venta> ListarTodasLasVentas()
        {
            return _context.Ventas.FindAll().ToList();
        }

        public void AnularVenta(string idVenta)
        {
            var venta = BuscarVenta(idVenta);
            if (venta != null)
            {
                venta.CancelarVenta();
                _context.Ventas.Update(venta);
                // Aquí se revertiría el inventario (Entrada por devolución)
            }
        }
    }
}
