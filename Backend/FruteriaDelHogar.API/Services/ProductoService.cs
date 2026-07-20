using System.Collections.Generic;
using System.Linq;
using FruteriaDelHogar.API.Models;
using FruteriaDelHogar.API.Data;

namespace FruteriaDelHogar.API.Services
{
    public class ProductoService
    {
        private readonly LiteDbContext _context;

        public ProductoService(LiteDbContext context)
        {
            _context = context;
        }

        public List<Producto> BuscarProducto(string termino)
        {
            var terminoLower = termino.ToLower();
            return _context.Productos.Find(p => p.Nombre.ToLower().Contains(terminoLower)).ToList();
        }

        public Producto BuscarProductoPorId(int idProducto)
        {
            return _context.Productos.FindById(idProducto);
        }

        public List<Producto> ListarProductos()
        {
            return _context.Productos.FindAll().ToList();
        }

        public void AgregarProducto(Producto producto)
        {
            _context.Productos.Insert(producto);
        }

        public void EditarProducto(Producto productoEditado)
        {
            var p = _context.Productos.FindById(productoEditado.IdProducto);
            if (p != null)
            {
                p.Nombre = productoEditado.Nombre;
                p.ActualizarPrecio(productoEditado.Precio);
                p.Costo = productoEditado.Costo;
                p.Categoria = productoEditado.Categoria;
                p.Stock = productoEditado.Stock;
                _context.Productos.Update(p);
            }
        }

        public void EliminarProducto(int idProducto)
        {
            _context.Productos.Delete(idProducto);
        }
    }
}
