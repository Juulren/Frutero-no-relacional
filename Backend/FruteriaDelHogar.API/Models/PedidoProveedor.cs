using System;
using System.Collections.Generic;
using System.Linq;

namespace FruteriaDelHogar.API.Models
{
    public class PedidoProveedor
    {
        private string _idPedido = string.Empty;
        private int _idProveedor;
        private DateTime _fecha;
        private string _estado = string.Empty;
        private decimal _total;
        private List<DetallePedidoProveedor> _detalles = new List<DetallePedidoProveedor>();

        public string IdPedido { get => _idPedido; set => _idPedido = value; }
        public int IdProveedor { get => _idProveedor; set => _idProveedor = value; }
        public DateTime Fecha { get => _fecha; set => _fecha = value; }
        public string Estado { get => _estado; set => _estado = value; }
        public decimal Total { get => _total; private set => _total = value; }
        public List<DetallePedidoProveedor> Detalles { get => _detalles; set => _detalles = value; }

        public PedidoProveedor() { }

        public PedidoProveedor(int idProveedor)
        {
            _idPedido = "PED-" + Guid.NewGuid().ToString().Substring(0, 8);
            _idProveedor = idProveedor;
            _fecha = DateTime.Now;
            _estado = "PENDIENTE";
        }

        public void CrearPedido()
        {
            _total = CalcularTotal();
        }

        public void ConfirmarPedido()
        {
            _estado = "CONFIRMADO";
        }

        public void CancelarPedido()
        {
            _estado = "CANCELADO";
        }

        public decimal CalcularTotal()
        {
            return _detalles.Sum(d => d.Subtotal);
        }
    }

    public class DetallePedidoProveedor
    {
        private string _idDetalle = string.Empty;
        private string _idPedido = string.Empty;
        private int _idProducto;
        private int _cantidad;
        private decimal _precioAcordado;
        private decimal _subtotal;

        public string IdDetalle { get => _idDetalle; set => _idDetalle = value; }
        public string IdPedido { get => _idPedido; set => _idPedido = value; }
        public int IdProducto { get => _idProducto; set => _idProducto = value; }
        public int Cantidad { get => _cantidad; set => _cantidad = value; }
        public decimal PrecioAcordado { get => _precioAcordado; set => _precioAcordado = value; }
        public decimal Subtotal { get => _subtotal; private set => _subtotal = value; }

        public DetallePedidoProveedor() { }

        public DetallePedidoProveedor(string idPedido, int idProducto, int cantidad, decimal precioAcordado)
        {
            _idDetalle = "DPED-" + Guid.NewGuid().ToString().Substring(0, 8);
            _idPedido = idPedido;
            _idProducto = idProducto;
            _cantidad = cantidad;
            _precioAcordado = precioAcordado;
            CalcularSubtotal();
        }

        public void CalcularSubtotal()
        {
            _subtotal = _cantidad * _precioAcordado;
        }

        public void AgregarItem(int cantidadExtra)
        {
            _cantidad += cantidadExtra;
            CalcularSubtotal();
        }

        public void EliminarItem(int cantidadRestar)
        {
            _cantidad = Math.Max(0, _cantidad - cantidadRestar);
            CalcularSubtotal();
        }
    }
}
