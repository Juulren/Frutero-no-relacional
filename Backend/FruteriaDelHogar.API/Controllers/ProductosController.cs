using Microsoft.AspNetCore.Mvc;
using FruteriaDelHogar.API.Models;
using FruteriaDelHogar.API.Services;
using System.Collections.Generic;

namespace FruteriaDelHogar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly ProductoService _productoService;

        public ProductosController(ProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Producto>> GetProductos()
        {
            return Ok(_productoService.ListarProductos());
        }

        [HttpGet("buscar/{termino}")]
        public ActionResult<IEnumerable<Producto>> Buscar(string termino)
        {
            return Ok(_productoService.BuscarProducto(termino));
        }

        [HttpPost]
        public ActionResult AgregarProducto(Producto producto)
        {
            _productoService.AgregarProducto(producto);
            return Ok();
        }

        [HttpPut("{id}")]
        public ActionResult EditarProducto(int id, Producto producto)
        {
            if (id != producto.IdProducto) return BadRequest();
            _productoService.EditarProducto(producto);
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult EliminarProducto(int id)
        {
            _productoService.EliminarProducto(id);
            return Ok();
        }
    }
}
