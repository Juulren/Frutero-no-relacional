using LiteDB;
using FruteriaDelHogar.API.Models;
using Microsoft.Extensions.Configuration;

namespace FruteriaDelHogar.API.Data
{
    public class LiteDbContext
    {
        public LiteDatabase Database { get; }

        public LiteDbContext(IConfiguration configuration)
        {
            var dbPath = configuration.GetConnectionString("LiteDB") ?? "Fruteria.db";
            Database = new LiteDatabase(dbPath);
            
            // Crear índices para optimizar búsquedas comunes
            var productos = Productos;
            productos.EnsureIndex(x => x.IdProducto);
            productos.EnsureIndex(x => x.Nombre);

            var proveedores = Proveedores;
            proveedores.EnsureIndex(x => x.Id);

            var ventas = Ventas;
            ventas.EnsureIndex(x => x.IdVenta);
            ventas.EnsureIndex(x => x.Fecha);
            
            var alertasStock = AlertasStock;
            alertasStock.EnsureIndex(x => x.IdAlerta);
        }

        public ILiteCollection<Producto> Productos => Database.GetCollection<Producto>("productos");
        public ILiteCollection<Proveedor> Proveedores => Database.GetCollection<Proveedor>("proveedores");
        public ILiteCollection<Venta> Ventas => Database.GetCollection<Venta>("ventas");
        public ILiteCollection<AlertaStock> AlertasStock => Database.GetCollection<AlertaStock>("alertasStock");
        public ILiteCollection<PedidoProveedor> PedidosProveedor => Database.GetCollection<PedidoProveedor>("pedidosProveedor");
    }
}
