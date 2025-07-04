# Sistema de Gestión de Inventario

## Descripción técnica

Este proyecto es una aplicación web desarrollada en JavaScript puro (sin frameworks) para la gestión de inventario de productos. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos, con las siguientes características:

- **IDs únicos** para cada producto (string, generados automáticamente).
- **Validaciones robustas** para nombre, precio y cantidad.
- **Fecha y hora de ingreso** automática para cada producto.
- **Edición y eliminación** de productos con confirmación visual.
- **Botón Cancelar** visible solo al editar.
- **Menú desplegable** para acciones por producto (Editar/Eliminar).
- **Visualización por categorías** y tabla de totales.
- **Persistencia** mediante un backend simulado con JSON Server (`db.json`).

## Estructura de archivos

- `index.html`: Interfaz principal de la aplicación.
- `style.css`: Estilos modernos y responsivos.
- `gestion_api.js`: Lógica principal de la gestión de productos y renderizado.
- `db.json`: Base de datos simulada para productos (usada por JSON Server).

## Requisitos previos

- [Node.js](https://nodejs.org/) instalado.
- [JSON Server](https://github.com/typicode/json-server) instalado globalmente:
  ```sh
  npm install -g json-server
  ```

## Ejecución del proyecto

1. **Iniciar el backend (JSON Server):**

   - Abre una terminal en la carpeta del proyecto.
   - Ejecuta:
     ```sh
     json-server --watch db.json --port 3000
     ```
   - Esto levantará una API REST en `http://localhost:3000/productos`.

2. **Abrir la aplicación web:**
   - Abre el archivo `index.html` en tu navegador (doble clic o arrástralo).
   - La aplicación se conectará automáticamente al backend y mostrará los productos.

## Guía de uso

- **Agregar producto:** Completa el formulario y haz clic en "Agregar". El producto se añadirá con fecha y hora actual.
- **Editar producto:** Haz clic en el menú (⋮) de la fila y selecciona "Editar". Modifica los datos y haz clic en "Guardar cambios". Puedes cancelar la edición con el botón "Cancelar".
- **Eliminar producto:** Haz clic en el menú (⋮) y selecciona "Eliminar". Se pedirá confirmación antes de borrar.
- **Ver por categorías:** Los productos se agrupan y muestran por categoría en la sección correspondiente.
- **Ver totales:** Consulta el valor total de cada producto (precio x cantidad) en la tabla de totales.

## Notas

- El sistema requiere que el backend (JSON Server) esté corriendo para funcionar correctamente.
- Los cambios se guardan en `db.json` y se reflejan en la interfaz al instante.
- El diseño es responsivo y amigable para escritorio y dispositivos móviles.
