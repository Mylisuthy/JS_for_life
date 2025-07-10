# Manual Técnico - E-Commerce SPA

## Estructura del Proyecto

- `index.html`: Entrada principal de la SPA.
- `style.css`: Estilos globales y responsivos.
- `/components/`: Fragmentos HTML para vistas y paneles.
- `/utils/`: Módulos JS para autenticación, validación, API, carrito y ruteo.
- `/data/db.json`: Base de datos simulada para JSON Server.
- `/assets/`: Recursos gráficos.
- `/docs/`: Documentación técnica.

## Instalación y Ejecución

### 1. Instalar dependencias (si usas JSON Server):
```bash
npm install -g json-server
```

### 2. Iniciar el backend simulado:
```bash
json-server --watch data/db.json --port 3000
```

### 3. Servir la SPA (ejemplo con Python):
```bash
cd spa-inventario
python3 -m http.server 8080
```

Abre en tu navegador: http://localhost:8080

## Módulos y Funcionalidad

- **auth.js**: Maneja login, registro y sesión.
- **validator.js**: Validaciones robustas de usuario y producto.
- **router.js**: Navegación SPA por hash.
- **cart.js**: Lógica de carrito y persistencia.
- **api.js**: Abstracción de llamadas a JSON Server.

## Consideraciones
- El sistema es escalable y modular.
- Cumple buenas prácticas de accesibilidad y UX.
- Listo para migrar a backend real (Node.js, Firebase, etc).

## Futuras Mejoras
- Dark mode, reportes CSV, modo offline, notificaciones.
