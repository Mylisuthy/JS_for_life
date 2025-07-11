# Gestor de Inventario "san patricio Garden"

¡Hola! Esta es la versión mejorada y profesional de mi gestor de inventario, ahora con lógica CRUD real, agrupación por categorías, edición, eliminación y visualización de totales, todo en vanilla JS y usando un backend simulado con JSON Server. El enfoque es práctico, visual y pensado para una tienda de alimentos/vegetales.

---

## ¿Cómo se usa?

- Usas el formulario para registrar productos. El sistema valida todo antes de guardar (nombre, precio, cantidad, etc).
- Al agregar, los productos aparecen al instante en la tabla y en el acordeón de categorías, sin recargar la página.
- Puedes editar o eliminar cualquier producto desde el menú ( ⋮ ) de cada fila.
- El botón "Cancelar" solo aparece cuando editas, para que no te confundas.
- El valor total del inventario se muestra siempre actualizado y bien visible.
- Todo se guarda y sincroniza con el backend (JSON Server), así que nada se pierde.

---

## ¿Por qué cada parte?

| bloque                        | para qué sirve y por qué está ahí                                      |
| ----------------------------- | ---------------------------------------------------------------------- |
| **array `productos`**         | almacén en memoria, fácil de mapear, filtrar y sincronizar con backend |
| **Set de IDs**                | asegura que no se repitan los IDs, rápido y seguro                     |
| **agrupación por categoría**  | renderiza acordeones por categoría, sin filtrar mil veces              |
| **validarProducto()**         | higiene de datos: nombres válidos, precios y cantidades correctas      |
| **renderUltimosIngresados()** | muestra los últimos productos agregados, ordenados por fecha           |
| **renderInventario()**        | pinta el inventario agrupado, menú de acciones y totales               |
| **Delegación de eventos**     | un solo listener para todos los menús y botones                        |
| **toFixed(2)**                | los precios y totales siempre con dos decimales, más pro               |
| **persistencia de mensajes**  | los mensajes de éxito/error se mantienen aunque recargues la página    |

---

## Story time del script (versión pro)

1. **Arranca**: carga productos desde el backend y sincroniza todo.
2. Llama a `reconstruirSetsYMaps()` para mantener IDs únicos.
3. Renderiza últimos ingresados, inventario por categorías y el total global.
4. **Agregar producto**: valida, genera ID, guarda en backend y repinta todo.
5. **Editar producto**: carga datos en el form, guarda cambios en backend y repinta.
6. **Eliminar producto**: pide confirmación, borra en backend y repinta.
7. **Totales**: siempre actualizados y visibles.
8. **Mensajes**: éxito/error persisten 10 segundos o hasta que edites algo.

---

## Cosas nuevas y mejoras

- Backend real con JSON Server (`db.json`), no solo memoria.
- Edición y eliminación de productos con menú flotante.
- Visualización profesional: acordeones, popovers, totales y diseño "food store".
- Persistencia de mensajes usando localStorage.

---

## ¿Qué falta o podría mejorar?

- Login para usuarios (¡reto futuro!).
- Filtros avanzados y búsqueda.
- Exportar inventario a Excel o PDF.
- Más animaciones y detalles visuales.

---

## Cómo lo corres

1. Instala Node.js y JSON Server si no los tienes:
   ```sh
   npm install -g json-server
   ```
2. En la carpeta del proyecto, ejecuta:
   ```sh
   json-server --watch db.json --port 3000
   ```
3. Abre `index.html` en tu navegador. ¡Listo!

---

## Archivos principales

- `index.html`: la interfaz principal.
- `style.css`: estilos modernos y compactos.
- `gestion_api.js`: toda la lógica, validaciones y renderizado.
- `db.json`: base de datos simulada (JSON Server).

---

¡Gracias por leer! Si llegaste hasta aquí, seguro eres tan friki por la programacion como yo. Sigue aprendiendo, toma café y nunca dejes de mejorar tu código
