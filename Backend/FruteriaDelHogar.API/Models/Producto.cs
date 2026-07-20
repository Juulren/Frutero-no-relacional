namespace FruteriaDelHogar.API.Models
{
    public class Producto
    {
        private int _idProducto;
        private string _nombre = string.Empty;
        private decimal _precio;
        private decimal _costo;
        private string _unidad = string.Empty;
        private string _categoria = string.Empty;
        private int _stock;

        // Propiedades para acceso encapsulado
        public int IdProducto { get => _idProducto; set => _idProducto = value; }
        public string Nombre { get => _nombre; set => _nombre = value; }
        public decimal Precio { get => _precio; private set => _precio = value; }
        public decimal Costo { get => _costo; set => _costo = value; }
        public string Unidad { get => _unidad; set => _unidad = value; }
        public string Categoria { get => _categoria; set => _categoria = value; }
        public int Stock { get => _stock; set => _stock = value; }

        public Producto() { }

        public Producto(int idProducto, string nombre, decimal precio, decimal costo, string unidad, string categoria, int stock)
        {
            _idProducto = idProducto;
            _nombre = nombre;
            _precio = precio;
            _costo = costo;
            _unidad = unidad;
            _categoria = categoria;
            _stock = stock;
        }

        public void ActualizarPrecio(decimal nuevoPrecio)
        {
            if (nuevoPrecio >= 0)
                _precio = nuevoPrecio;
        }

        public bool VerificarStockBajo(int umbral = 5)
        {
            return _stock <= umbral;
        }

        public string ObtenerInformacion()
        {
            return $"{_nombre} - ${_precio} (Stock: {_stock})";
        }
    }
}
