using System;
using System.Collections.Generic;
using FruteriaDelHogar.API.Models;

namespace FruteriaDelHogar.API.Data
{
    public static class DatabaseSeeder
    {
        public static void Seed(LiteDbContext context)
        {
            if (context.Productos.Count() == 0)
            {
                var productos = new List<Producto>();
                var random = new Random();

                var frutas = new[] { "Manzana Gala", "Manzana Roja", "Manzana Verde", "Plátano Tabasco", "Plátano Dominico", "Naranja Jugo", "Naranja Ombligo", "Pera Anjou", "Pera Bosc", "Uva Verde", "Uva Roja", "Sandía", "Melón Chino", "Papaya Maradol", "Mango Ataulfo", "Mango Petacón", "Piña Miel", "Fresa", "Limón Colima", "Limón Persa", "Durazno", "Ciruela", "Kiwi" };
                var verduras = new[] { "Tomate Saladette", "Tomate Bola", "Cebolla Blanca", "Cebolla Morada", "Papa Blanca", "Papa Cambray", "Zanahoria", "Lechuga Romana", "Lechuga Orejona", "Brócoli", "Coliflor", "Espinaca", "Calabaza Italiana", "Chayote", "Chile Jalapeño", "Chile Serrano", "Chile Poblano", "Ajo", "Pepino", "Cilantro", "Perejil", "Apio", "Aguacate Hass" };
                var abarrotes = new[] { "Arroz Super Extra", "Arroz Integral", "Frijol Pinto", "Frijol Negro", "Frijol Peruano", "Azúcar Estándar", "Azúcar Refinada", "Aceite Vegetal 1L", "Aceite de Oliva 500ml", "Sal Fina 1kg", "Pasta Espagueti 200g", "Pasta Codito 200g", "Atún en Agua 140g", "Atún en Aceite 140g", "Mayonesa 390g", "Café Soluble 100g", "Café Molido 400g", "Cereal de Maíz 500g", "Galletas Marias 170g", "Harina de Trigo 1kg", "Harina para Hotcakes 500g", "Puré de Tomate 210g" };
                var carnes = new[] { "Pollo Entero", "Pechuga de Pollo s/h", "Pierna y Muslo", "Bistec de Res", "Carne Molida de Res", "Carne Molida de Cerdo", "Chuleta de Cerdo Ahumada", "Costilla de Cerdo", "Arrachera Marinada", "Milanesa de Res", "Milanesa de Cerdo", "Salchicha de Pavo", "Salchicha Viena", "Chorizo de Cerdo", "Jamón de Pavo", "Jamón de Pierna", "Tocino Ahumado" };
                var lacteos = new[] { "Leche Entera 1L", "Leche Deslactosada 1L", "Leche Light 1L", "Queso Panela 400g", "Queso Oaxaca a granel", "Queso Manchego 200g", "Queso Chihuahua 200g", "Yogurt Natural 1kg", "Yogurt de Fresa 1kg", "Yogurt para Beber 220g", "Mantequilla sin sal 90g", "Crema Alpina 450g", "Huevo Blanco 12pzas", "Huevo San Juan 30pzas" };
                var limpieza = new[] { "Detergente en Polvo 1kg", "Detergente Líquido 1L", "Suavizante de Telas 1L", "Jabón de Tocador 150g", "Jabón de Lavandería 400g", "Papel Higiénico 4 rollos", "Servilletas 500pzas", "Limpiador Multiusos 1L", "Cloro 1L", "Fibras Esponja", "Bolsas para Basura" };

                var categorias = new[] { 
                    new { Nombre = "Frutas", Items = frutas, Unidad = "kg" },
                    new { Nombre = "Verduras", Items = verduras, Unidad = "kg" },
                    new { Nombre = "Abarrotes", Items = abarrotes, Unidad = "pza" },
                    new { Nombre = "Carnes", Items = carnes, Unidad = "kg" },
                    new { Nombre = "Lácteos", Items = lacteos, Unidad = "pza" },
                    new { Nombre = "Limpieza", Items = limpieza, Unidad = "pza" }
                };

                var marcas = new[] { "Premium", "Local", "Extra", "Primera", "Económico", "Selecto", "Importado", "Nacional", "Orgánico", "Artesanal" };

                for (int i = 1; i <= 10000; i++)
                {
                    var catIndex = random.Next(categorias.Length);
                    var categoria = categorias[catIndex];
                    var baseName = categoria.Items[random.Next(categoria.Items.Length)];
                    
                    // Añadir variedad al nombre para que parezcan diferentes (ej: por lote, marca o proveedor)
                    var marca = random.NextDouble() > 0.4 ? $" {marcas[random.Next(marcas.Length)]}" : "";
                    
                    // Asegurar unicidad total añadiendo un número de SKU o lote único para cada iteración
                    var sku = $" (SKU-{i:D5})";
                    var fullName = $"{baseName}{marca}{sku}";

                    // Precios realistas según categoría
                    decimal costoBase = 0m;
                    if (categoria.Nombre == "Carnes") costoBase = random.Next(60, 200);
                    else if (categoria.Nombre == "Lácteos") costoBase = random.Next(15, 80);
                    else if (categoria.Nombre == "Limpieza") costoBase = random.Next(10, 60);
                    else costoBase = random.Next(5, 50);

                    decimal costo = costoBase + (decimal)random.NextDouble() * 5m;
                    decimal precio = costo * (1m + (decimal)(random.Next(20, 60) / 100.0)); // 20% a 60% ganancia
                    
                    int stock = random.Next(0, 500);

                    productos.Add(new Producto(
                        i, 
                        fullName, 
                        Math.Round(precio, 2), 
                        Math.Round(costo, 2), 
                        categoria.Unidad, 
                        categoria.Nombre == "Limpieza" ? "Abarrotes" : categoria.Nombre, // Agrupamos Limpieza en Abarrotes si no está en la UI
                        stock
                    ));
                }
                
                // LiteDB soporta inserción en lote (Bulk)
                context.Productos.InsertBulk(productos);
            }

            if (context.Proveedores.Count() == 0)
            {
                var proveedores = new List<Proveedor>
                {
                    new Proveedor(1, "Distribuidora Central", "555-123-4567", "Centro 123", "contacto@distcentral.com", "Norte"),
                    new Proveedor(2, "Granja Verde", "555-987-6543", "Afueras 45", "ventas@granjaverde.com", "Sur")
                };
                context.Proveedores.Insert(proveedores);
            }

            if (context.Ventas.Count() == 0)
            {
                var ventas = new List<Venta>();
                var random = new Random();
                var todosProductos = context.Productos.FindAll().ToList();

                if (todosProductos.Count > 0)
                {
                    for (int i = 1; i <= 100; i++)
                    {
                        string idVenta = $"V-{DateTime.Now.Ticks.ToString().Substring(8, 6)}-{i:D4}";
                        var venta = new Venta(idVenta);
                        
                        // Fecha aleatoria últimos 30 días
                        var diasRestar = random.Next(0, 30);
                        var horaRandom = random.Next(8, 20); // 8 AM a 8 PM
                        var minutoRandom = random.Next(0, 59);
                        var fechaVenta = DateTime.Now.AddDays(-diasRestar).Date.AddHours(horaRandom).AddMinutes(minutoRandom);
                        
                        venta.Fecha = fechaVenta.ToString("yyyy-MM-dd");
                        venta.Hora = fechaVenta.ToString("HH:mm");

                        int numItems = random.Next(1, 6); // 1 a 5 productos distintos por venta
                        for (int j = 0; j < numItems; j++)
                        {
                            var prod = todosProductos[random.Next(todosProductos.Count)];
                            int qty = random.Next(1, 6); // 1 a 5 unidades de ese producto
                            var idDetalle = $"{idVenta}-D{j+1}";
                            var detalle = new DetalleVenta(idDetalle, idVenta, prod.IdProducto, qty, prod.Precio);
                            venta.ListaDetalles.Add(detalle);
                        }

                        venta.RegistrarVenta(); // Calcula el total basado en los detalles
                        ventas.Add(venta);
                    }
                    context.Ventas.InsertBulk(ventas);
                }
            }
        }
    }
}
