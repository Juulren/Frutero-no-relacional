using System.Collections.Generic;
using System.Linq;
using FruteriaDelHogar.API.Models;
using FruteriaDelHogar.API.Data;

namespace FruteriaDelHogar.API.Services
{
    public class ProveedorService
    {
        private readonly LiteDbContext _context;

        public ProveedorService(LiteDbContext context)
        {
            _context = context;
        }

        public void RegistrarProveedor(Proveedor proveedor)
        {
            _context.Proveedores.Insert(proveedor);
        }

        public Proveedor BuscarProveedor(string termino)
        {
            var terminoLower = termino.ToLower();
            return _context.Proveedores.FindOne(p => p.Nombre.ToLower().Contains(terminoLower));
        }

        public List<Proveedor> ListarProveedores()
        {
            return _context.Proveedores.FindAll().ToList();
        }
    }
}
