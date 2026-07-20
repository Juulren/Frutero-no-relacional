using System;
using System.Collections.Generic;
using System.Linq;

namespace FruteriaDelHogar.API.Models
{
    public class Venta
    {
        private string _idVenta = string.Empty;
        private string _fecha = string.Empty;
        private string _hora = string.Empty;
        private decimal _total;
        private string _estado = string.Empty;
        private List<DetalleVenta> _listaDetalles = new List<DetalleVenta>();

        public string IdVenta { get => _idVenta; set => _idVenta = value; }
        public string Fecha { get => _fecha; set => _fecha = value; }
        public string Hora { get => _hora; set => _hora = value; }
        public decimal Total { get => _total; private set => _total = value; }
        public string Estado { get => _estado; set => _estado = value; }
        public List<DetalleVenta> ListaDetalles { get => _listaDetalles; set => _listaDetalles = value; }

        public Venta() { }

        public Venta(string idVenta)
        {
            _idVenta = idVenta;
            _fecha = DateTime.Now.ToString("yyyy-MM-dd");
            _hora = DateTime.Now.ToString("HH:mm");
            _estado = "COMPLETADA";
        }

        public void RegistrarVenta()
        {
            _total = CalcularTotal();
        }

        public decimal CalcularTotal()
        {
            return _listaDetalles.Sum(d => d.Subtotal);
        }

        public void CancelarVenta()
        {
            _estado = "CANCELADA";
        }

        public string ObtenerResumen()
        {
            return $"Venta {_idVenta} - Total: ${_total} ({_estado})";
        }
    }

    public class DetalleVenta
    {
        private string _idDetalle = string.Empty;
        private string _idVenta = string.Empty;
        private int _idProducto;
        private int _cantidad;
        private decimal _precioUnitario;
        private decimal _subtotal;

        public string IdDetalle { get => _idDetalle; set => _idDetalle = value; }
        public string IdVenta { get => _idVenta; set => _idVenta = value; }
        public int IdProducto { get => _idProducto; set => _idProducto = value; }
        public int Cantidad { get => _cantidad; set => _cantidad = value; }
        public decimal PrecioUnitario { get => _precioUnitario; set => _precioUnitario = value; }
        public decimal Subtotal { get => _subtotal; private set => _subtotal = value; }

        public DetalleVenta() { }

        public DetalleVenta(string idDetalle, string idVenta, int idProducto, int cantidad, decimal precioUnitario)
        {
            _idDetalle = idDetalle;
            _idVenta = idVenta;
            _idProducto = idProducto;
            _cantidad = cantidad;
            _precioUnitario = precioUnitario;
            CalcularSubtotal();
        }

        public void CalcularSubtotal()
        {
            _subtotal = _cantidad * _precioUnitario;
        }

        public void AgregarProducto(int cantidadExtra)
        {
            _cantidad += cantidadExtra;
            CalcularSubtotal();
        }

        public void EliminarProducto(int cantidadRestar)
        {
            _cantidad = Math.Max(0, _cantidad - cantidadRestar);
            CalcularSubtotal();
        }
    }
}
