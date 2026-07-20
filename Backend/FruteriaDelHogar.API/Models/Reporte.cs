using System;

namespace FruteriaDelHogar.API.Models
{
    public abstract class Reporte
    {
        protected string _idReporte = string.Empty;
        protected DateTime _fechaGeneracion;
        protected string _titulo = string.Empty;
        protected string _contenido = string.Empty; // Podría ser JSON o HTML

        public string IdReporte { get => _idReporte; set => _idReporte = value; }
        public DateTime FechaGeneracion { get => _fechaGeneracion; set => _fechaGeneracion = value; }
        public string Titulo { get => _titulo; set => _titulo = value; }
        public string Contenido { get => _contenido; set => _contenido = value; }

        protected Reporte() { }

        protected Reporte(string titulo, string contenido)
        {
            _idReporte = "REP-" + Guid.NewGuid().ToString().Substring(0, 8);
            _fechaGeneracion = DateTime.Now;
            _titulo = titulo;
            _contenido = contenido;
        }

        public abstract void GenerarReporte();
        public abstract string Exportar();
        public abstract string ObtenerResumen();
    }

    public class ReporteDiario : Reporte
    {
        private DateTime _periodoInicio;
        private DateTime _periodoFin;
        private int _totalVentas;
        private decimal _totalIngresos;

        public DateTime PeriodoInicio { get => _periodoInicio; set => _periodoInicio = value; }
        public DateTime PeriodoFin { get => _periodoFin; set => _periodoFin = value; }
        public int TotalVentas { get => _totalVentas; set => _totalVentas = value; }
        public decimal TotalIngresos { get => _totalIngresos; set => _totalIngresos = value; }

        public ReporteDiario() { }

        public ReporteDiario(string contenido, int totalVentas, decimal totalIngresos) 
            : base("Reporte Diario", contenido)
        {
            CalcularPeriodo();
            _totalVentas = totalVentas;
            _totalIngresos = totalIngresos;
        }

        public void CalcularPeriodo()
        {
            _periodoInicio = DateTime.Today;
            _periodoFin = DateTime.Today.AddDays(1).AddTicks(-1);
        }

        public string CompararPeriodoAnterior()
        {
            return "Comparación con día anterior: +15% (Simulado)";
        }

        public string GenerarGrafico()
        {
            return "URL_GRAFICO_DIARIO";
        }

        public override void GenerarReporte()
        {
            // Lógica
        }

        public override string Exportar()
        {
            return $"EXPORT_{_idReporte}.pdf";
        }

        public override string ObtenerResumen()
        {
            return $"{_titulo}: {_totalVentas} ventas, Total: ${_totalIngresos}";
        }
    }

    public class DashboardResumen
    {
        private int _ventasHoy;
        private int _productosConStockBajo;
        private int _alertasPendientes;
        private decimal _ingresosMes;

        public int VentasHoy { get => _ventasHoy; set => _ventasHoy = value; }
        public int ProductosConStockBajo { get => _productosConStockBajo; set => _productosConStockBajo = value; }
        public int AlertasPendientes { get => _alertasPendientes; set => _alertasPendientes = value; }
        public decimal IngresosMes { get => _ingresosMes; set => _ingresosMes = value; }

        public DashboardResumen() { }

        public void ActualizarDatos(int ventas, int stockBajo, int alertas, decimal ingresos)
        {
            _ventasHoy = ventas;
            _productosConStockBajo = stockBajo;
            _alertasPendientes = alertas;
            _ingresosMes = ingresos;
        }

        public object ObtenerIndicadores()
        {
            return new
            {
                VentasHoy = _ventasHoy,
                StockBajo = _productosConStockBajo,
                Alertas = _alertasPendientes,
                Ingresos = _ingresosMes
            };
        }

        public bool MostrarAlertas()
        {
            return _alertasPendientes > 0 || _productosConStockBajo > 0;
        }
    }
}
