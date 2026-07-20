using Microsoft.AspNetCore.Mvc;
using FruteriaDelHogar.API.Models;
using FruteriaDelHogar.API.Services;
using System.Collections.Generic;

namespace FruteriaDelHogar.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VentasController : ControllerBase
    {
        private readonly VentaService _ventaService;

        public VentasController(VentaService ventaService)
        {
            _ventaService = ventaService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Venta>> GetVentas()
        {
            return Ok(_ventaService.ListarTodasLasVentas());
        }

        [HttpGet("{fecha}")]
        public ActionResult<IEnumerable<Venta>> GetVentasPorFecha(string fecha)
        {
            return Ok(_ventaService.ListarVentasPorFecha(fecha));
        }

        [HttpPost("efectivo")]
        public ActionResult RegistrarVentaEfectivo([FromBody] VentaRequest request)
        {
            var venta = new Venta(request.IdVenta);
            venta.ListaDetalles = request.Detalles;
            var pago = new PagoEfectivo(request.Total, request.MontoEntregado);

            bool exito = _ventaService.RegistrarVenta(venta, pago);
            if (exito) return Ok(venta);
            return BadRequest("El pago en efectivo fue rechazado (monto insuficiente).");
        }

        [HttpPost("tarjeta")]
        public ActionResult RegistrarVentaTarjeta([FromBody] VentaRequest request)
        {
            var venta = new Venta(request.IdVenta);
            venta.ListaDetalles = request.Detalles;
            var pago = new PagoTarjeta(request.Total, "1234123412341234", "Banco", "Visa");

            bool exito = _ventaService.RegistrarVenta(venta, pago);
            if (exito) return Ok(venta);
            return BadRequest("El pago con tarjeta fue rechazado.");
        }
    }

    public class VentaRequest
    {
        public string IdVenta { get; set; } = string.Empty;
        public List<DetalleVenta> Detalles { get; set; } = new List<DetalleVenta>();
        public decimal Total { get; set; }
        public decimal MontoEntregado { get; set; }
    }
}
