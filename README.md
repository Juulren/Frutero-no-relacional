# Frutería del Hogar

This is a code bundle for Frutería del Hogar. The original project is available at https://www.figma.com/design/bbSHOPNabJTok8OWcVR359/Fruter%C3%ADa-del-Hogar.

## Instrucciones para ejecutar el proyecto

Este proyecto está dividido en un Backend (.NET + LiteDB) y un Frontend (React + Vite).

### 1. Ejecutar el Backend y la Base de Datos

El backend utiliza **LiteDB**, una base de datos NoSQL embebida. No necesitas instalar ningún motor de base de datos como SQL Server o Postgres.

*Nota sobre los datos de prueba:* Por diseño, el archivo de la base de datos (`Fruteria.db`) es ignorado en Git. Cuando arranques el servidor por primera vez, el sistema detectará que la base de datos está vacía y **generará automáticamente 10,000 productos aleatorios realistas y 100 movimientos de venta**.

Abre una terminal y ejecuta:
```bash
cd Backend/FruteriaDelHogar.API
dotnet run
```
El servidor se levantará en `http://localhost:5071`.

### 2. Ejecutar el Frontend

Abre **otra** pestaña de la terminal en la raíz del proyecto y ejecuta:

```bash
npm i
npm run dev
```

Esto instalará las dependencias y levantará tu servidor de desarrollo (usualmente en `http://localhost:5173`). ¡Abre esa URL y disfruta del sistema!