namespace FruteriaDelHogar.API.Models
{
    public class Proveedor
    {
        private int _id;
        private string _nombre = string.Empty;
        private string _telefono = string.Empty;
        private string _direccion = string.Empty;
        private string _email = string.Empty;
        private string _ruta = string.Empty;

        public int Id { get => _id; set => _id = value; }
        public string Nombre { get => _nombre; set => _nombre = value; }
        public string Telefono { get => _telefono; set => _telefono = value; }
        public string Direccion { get => _direccion; set => _direccion = value; }
        public string Email { get => _email; set => _email = value; }
        public string Ruta { get => _ruta; set => _ruta = value; }

        public Proveedor() { }

        public Proveedor(int id, string nombre, string telefono, string direccion, string email, string ruta)
        {
            _id = id;
            _nombre = nombre;
            _telefono = telefono;
            _direccion = direccion;
            _email = email;
            _ruta = ruta;
        }

        public void ActualizarDatos(string telefono, string direccion, string email)
        {
            _telefono = telefono;
            _direccion = direccion;
            _email = email;
        }

        public string ObtenerContacto()
        {
            return $"{_nombre}: {_telefono} - {_email}";
        }
    }
}
