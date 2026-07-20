using System;

namespace FruteriaDelHogar.API.Models
{
    public abstract class MovimientoInventario
    {
        protected string _idMovimiento = string.Empty;
        protected DateTime _fecha;
        protected int _cantidad;
        protected int _idProducto;
        protected string _tipo = string.Empty;

        public string IdMovimiento { get => _idMovimiento; set => _idMovimiento = value; }
        public DateTime Fecha { get => _fecha; set => _fecha = value; }
        public int Cantidad { get => _cantidad; set => _cantidad = value; }
        public int IdProducto { get => _idProducto; set => _idProducto = value; }
        public string Tipo { get => _tipo; set => _tipo = value; }

        protected MovimientoInventario() { }

        protected MovimientoInventario(int cantidad, int idProducto, string tipo)
        {
            _idMovimiento = "MOV-" + Guid.NewGuid().ToString().Substring(0, 8);
            _fecha = DateTime.Now;
            _cantidad = cantidad;
            _idProducto = idProducto;
            _tipo = tipo;
        }

        public abstract void RegistrarMovimiento();
        public abstract string DescribirMovimiento();

        public string ObtenerFecha()
        {
            return _fecha.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }

    public class EntradaInventario : MovimientoInventario
    {
        private int _idProveedor;
        private decimal _costoUnitario;
        private string _numeroFactura = string.Empty;

        public int IdProveedor { get => _idProveedor; set => _idProveedor = value; }
        public decimal CostoUnitario { get => _costoUnitario; set => _costoUnitario = value; }
        public string NumeroFactura { get => _numeroFactura; set => _numeroFactura = value; }

        public EntradaInventario() { }

        public EntradaInventario(int cantidad, int idProducto, int idProveedor, decimal costoUnitario, string numeroFactura)
            : base(cantidad, idProducto, "ENTRADA")
        {
            _idProveedor = idProveedor;
            _costoUnitario = costoUnitario;
            _numeroFactura = numeroFactura;
        }

        public decimal CalcularCostoTotal()
        {
            return _cantidad * _costoUnitario;
        }

        public void RegistrarEntrada()
        {
            RegistrarMovimiento();
        }

        public override void RegistrarMovimiento()
        {
            // Logic handled by service
        }

        public override string DescribirMovimiento()
        {
            return $"Entrada de {_cantidad} uds. Prov: {_idProveedor}, Total: ${CalcularCostoTotal()}";
        }
    }

    public class SalidaInventario : MovimientoInventario
    {
        private string _idVenta = string.Empty;
        private string _motivoSalida = string.Empty;

        public string IdVenta { get => _idVenta; set => _idVenta = value; }
        public string MotivoSalida { get => _motivoSalida; set => _motivoSalida = value; }

        public SalidaInventario() { }

        public SalidaInventario(int cantidad, int idProducto, string idVenta, string motivo)
            : base(cantidad, idProducto, "SALIDA")
        {
            _idVenta = idVenta;
            _motivoSalida = motivo;
        }

        public void RegistrarSalida()
        {
            RegistrarMovimiento();
        }

        public void VincularVenta(string idVenta)
        {
            _idVenta = idVenta;
        }

        public override void RegistrarMovimiento() { }

        public override string DescribirMovimiento()
        {
            return $"Salida de {_cantidad} uds. Venta: {_idVenta} - Motivo: {_motivoSalida}";
        }
    }

    public class MermaInventario : MovimientoInventario
    {
        private string _motivoMerma = string.Empty;
        private string _responsable = string.Empty;
        private string _observacion = string.Empty;

        public string MotivoMerma { get => _motivoMerma; set => _motivoMerma = value; }
        public string Responsable { get => _responsable; set => _responsable = value; }
        public string Observacion { get => _observacion; set => _observacion = value; }

        public MermaInventario() { }

        public MermaInventario(int cantidad, int idProducto, string motivo, string responsable, string observacion)
            : base(cantidad, idProducto, "MERMA")
        {
            _motivoMerma = motivo;
            _responsable = responsable;
            _observacion = observacion;
        }

        public void RegistrarMerma()
        {
            RegistrarMovimiento();
        }

        public string JustificarMerma()
        {
            return $"{_motivoMerma}: {_observacion} (Por: {_responsable})";
        }

        public override void RegistrarMovimiento() { }

        public override string DescribirMovimiento()
        {
            return $"Merma de {_cantidad} uds. Razón: {JustificarMerma()}";
        }
    }
}
