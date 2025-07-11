# Gestor de Inventarios by JuanDGonzalezH

en esta semana para mi entrega creo un **mini–proyecto en vanilla JS** enfocándome en la practica para el manejo de colecciones (arrays, sets y maps) y DOM puro.
la idea es bastante simple: registrar productos, agruparlos por categoría, mostrar precios y la posibilidad de borrarlos.

---

## como se utiliza

- se maneja por medio de un formulario donde ingresas los valores y al darle click a agregar se le verifica su correcta entrada para el guardado en el "almacén".

- una vez que los datos se ingresan estos se muestran inmediata mente sin necesidad de recargar la pagina en los diversos espacios que diseñe par su visualización.

- como añadido extra se implementa la creación de un botón para eliminar los objetos una vez que se visualizan en la tabla principal.

---

## por qué uso cada parte (rápido y al grano)

| bloque                    | por qué está ahí                                                          |
| ------------------------- | ------------------------------------------------------------------------- |
| **array `productos`**     | es mi "almacén" en memoria, fácil de mapear y filtrar.                    |
| **`Set` de IDs**          | me avisa si intento repetir un id en 0,001 s. (rapidito)                  |
| **`Map` de categorías**   | así renderizo “Productos por categoría” sin filtrar n veces.              |
| **`validarProductos()`**  | detiene nombres raros, precios ≤0 o cantidades en coma… higiene de datos. |
| **`renderTabla()`**       | borro el `<tbody>` y lo pinto de cero → simple, cero bugs visuales.       |
| **Delegación de eventos** | un solo listener para todos los botones “Eliminar”.                       |
| **`toFixed(2)`**          | porque $25 se ve feo; prefiero $25.00.                                    |

---

## story time del script (tengo mucho sueño)

1. **Inicializo** un array con 3 productos para no ver la tabla vacía.
2. Llamo a `reconstruirSetsYMaps()` → sincronizo Set y Map.
3. `renderTabla()` + `renderCategorias()` + `cantidadTotal()` → primer render.
4. **Cuando agrego** algo:
   - leo el form con `FormData`, valido, genero id auto.
   - pusheo al array, reconstruyo Set/Map y pinto todo otra vez.
5. **Cuando elimino** algo:
   - capturo el click en el `<tbody>`, saco `data-id`, filtro el array.
   - vuelvo a reconstruir y repintar. **facilito**

## ideas a futuro (el tiempo no es gratis)

- implementar el uso del **localStorage** para que me guarde los cambios en alguna parte.

- agregar una opcion para editar productos.

- implementar un diseño con un login que me valide quien quiere usar mi gestor de inventarios.

---

sin mas gracias por ver, espero tanto café y horas de no dormir suelten buenos frutos.
por mi parte seguiré divirtiéndome escuchando mi música de frikis y aprendiendo cada día mas.
**sueña en grande, enfoca tu aprendizaje y logra tus objetivos.**
