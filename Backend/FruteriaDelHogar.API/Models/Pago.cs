using System;

namespace FruteriaDelHogar.API.Models
{
    // Clase Base Abstracta (Abstracción y Herencia)
    public abstract class Pago
    {
        protected string _idPago = string.Empty;
        protected decimal _monto;
        protected DateTime _fecha;
        protected string _estado = string.Empty;

        public string IdPago { get => _idPago; set => _idPago = value; }
        public decimal Monto { get => _monto; set => _monto = value; }
        public DateTime Fecha { get => _fecha; set => _fecha = value; }
        public string Estado { get => _estado; set => _estado = value; }

        protected Pago() { }

        protected Pago(decimal monto)
        {
            _idPago = "P-" + Guid.NewGuid().ToString().Substring(0, 8);
            _monto = monto;
            _fecha = DateTime.Now;
            _estado = "PENDIENTE";
        }

        public abstract bool ProcesarPago(); // Polimorfismo
        public abstract string ObtenerDetalle();

        public void RegistrarPago()
        {
            if (ValidarPago())
            {
                ProcesarPago();
            }
        }

        public bool ValidarPago()
        {
            return _monto > 0;
        }
    }

    public class PagoEfectivo : Pago
    {
        private decimal _montoEntregado;
        private decimal _cambio;

        public decimal MontoEntregado { get => _montoEntregado; set => _montoEntregado = value; }
        public decimal Cambio { get => _cambio; private set => _cambio = value; }

        public PagoEfectivo() { }

        public PagoEfectivo(decimal monto, decimal montoEntregado) : base(monto)
        {
            _montoEntregado = montoEntregado;
            CalcularCambio();
        }

        public void CalcularCambio()
        {
            _cambio = Math.Max(0, _montoEntregado - _monto);
        }

        public override bool ProcesarPago()
        {
            if (_montoEntregado >= _monto)
            {
                _estado = "COMPLETADO";
                return true;
            }
            _estado = "RECHAZADO";
            return false;
        }

        public void ConfirmarPago()
        {
            RegistrarPago();
        }

        public override string ObtenerDetalle()
        {
            return $"Efectivo - Recibido: ${_montoEntregado}, Cambio: ${_cambio}";
        }
    }

    public class PagoTarjeta : Pago
    {
        private string _numeroTarjeta = string.Empty;
        private string _banco = string.Empty;
        private string _tipoTarjeta = string.Empty;
        private string _autorizacion = string.Empty;

        public string NumeroTarjeta { get => _numeroTarjeta; set => _numeroTarjeta = value; }
        public string Banco { get => _banco; set => _banco = value; }
        public string TipoTarjeta { get => _tipoTarjeta; set => _tipoTarjeta = value; }
        public string Autorizacion { get => _autorizacion; set => _autorizacion = value; }

        public PagoTarjeta() { }

        public PagoTarjeta(decimal monto, string numeroTarjeta, string banco, string tipoTarjeta) : base(monto)
        {
            _numeroTarjeta = numeroTarjeta;
            _banco = banco;
            _tipoTarjeta = tipoTarjeta;
        }

        public bool ValidarTarjeta()
        {
            return _numeroTarjeta.Length == 16;
        }

        public override bool ProcesarPago()
        {
            if (ValidarTarjeta())
            {
                _autorizacion = "AUTH-" + new Random().Next(10000, 99999);
                _estado = "COMPLETADO";
                return true;
            }
            _estado = "RECHAZADO";
            return false;
        }

        public string ObtenerComprobante()
        {
            return $"Comprobante de Pago. Auth: {_autorizacion}. Banco: {_banco}";
        }

        public override string ObtenerDetalle()
        {
            return $"Tarjeta {_tipoTarjeta} - Auth: {_autorizacion}";
        }
    }
}
