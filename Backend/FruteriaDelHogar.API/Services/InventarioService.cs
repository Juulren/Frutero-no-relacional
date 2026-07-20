using System.Collections.Generic;
using System.Linq;
using FruteriaDelHogar.API.Models;
using FruteriaDelHogar.API.Data;

namespace FruteriaDelHogar.API.Services
{
    public class InventarioService
    {
        private readonly LiteDbContext _context;
        private ProductoService _productoService;

        public InventarioService(LiteDbContext context, ProductoService productoService)
        {
            _context = context;
            _productoService = productoService;
        }

        public void ActualizarStock(int idProducto, int cantidad, string tipoMovimiento, string observacion)
        {
            var producto = _productoService.BuscarProductoPorId(idProducto);
            if (producto != null)
            {
                MovimientoInventario movimiento = null;

                if (tipoMovimiento == "ENTRADA")
                {
                    producto.Stock += cantidad;
                    movimiento = new EntradaInventario(cantidad, idProducto, 0, producto.Costo, "N/A");
                }
                else if (tipoMovimiento == "SALIDA")
                {
                    producto.Stock -= cantidad;
                    movimiento = new SalidaInventario(cantidad, idProducto, "N/A", observacion);
                }
                else if (tipoMovimiento == "MERMA")
                {
                    producto.Stock -= cantidad;
                    movimiento = new MermaInventario(cantidad, idProducto, "Defecto", "Sistema", observacion);
                }

                if (movimiento != null)
                {
                    movimiento.RegistrarMovimiento();
                    var collection = _context.Database.GetCollection<MovimientoInventario>("movimientos");
                    collection.Insert(movimiento);
                    _productoService.EditarProducto(producto); // Save the stock changes in Producto
                }
            }
        }

        public bool VerificarDisponibilidad(int idProducto, int cantidadRequerida)
        {
            var producto = _productoService.ListarProductos().FirstOrDefault(p => p.IdProducto == idProducto);
            return producto != null && producto.Stock >= cantidadRequerida;
        }

        public List<MovimientoInventario> ListarMovimientos()
        {
            var collection = _context.Database.GetCollection<MovimientoInventario>("movimientos");
            return collection.FindAll().ToList();
        }
    }
}
