using System;

namespace FruteriaDelHogar.API.Models
{
    public class AlertaStock
    {
        private string _idAlerta = string.Empty;
        private int _idProducto;
        private DateTime _fechaAlerta;
        private string _mensaje = string.Empty;
        private string _nivelCritico = string.Empty;
        private bool _atendida;

        public string IdAlerta { get => _idAlerta; set => _idAlerta = value; }
        public int IdProducto { get => _idProducto; set => _idProducto = value; }
        public DateTime FechaAlerta { get => _fechaAlerta; set => _fechaAlerta = value; }
        public string Mensaje { get => _mensaje; set => _mensaje = value; }
        public string NivelCritico { get => _nivelCritico; set => _nivelCritico = value; }
        public bool Atendida { get => _atendida; set => _atendida = value; }

        public AlertaStock() { }

        public AlertaStock(int idProducto, string mensaje, string nivelCritico)
        {
            _idAlerta = "ALR-" + Guid.NewGuid().ToString().Substring(0, 8);
            _idProducto = idProducto;
            _fechaAlerta = DateTime.Now;
            _mensaje = mensaje;
            _nivelCritico = nivelCritico;
            _atendida = false;
        }

        public void GenerarAlerta()
        {
            // Logic handled by service
        }

        public void MarcarAtendida()
        {
            _atendida = true;
        }

        public void EnviarNotificacion()
        {
            // Logic handled by service
        }
    }
}
