// =================== Cargar productos desde el servidor =================== //
fetch('http://localhost:3000/productos')
  .then(response => response.json())
  .then(data => {
    // Convertimos todos los IDs de los productos a string para evitar problemas de tipo
    productos = data.map(productoDelServidor => ({
      ...productoDelServidor,
      id: String(productoDelServidor.id)
    }));
    reconstruirSetsYMaps();
    renderTabla();
    renderCategorias();
    renderTotales();
  })
  .catch(error => console.error("Error al obtener productos:", error));

// =================== Variables y estructuras auxiliares =================== //

let productos = []; // Lista principal de productos
let setIds;         // Set para IDs únicos
let mapCategorias;  // Mapa de categorías a productos
let idCounter = 1;  // Contador global para IDs únicos

/**
 * Reconstruye los sets y mapas auxiliares a partir de la lista de productos.
 * También actualiza el contador de IDs.
 */
function reconstruirSetsYMaps() {
  // Creamos un Set con todos los IDs de los productos (como string) para asegurar unicidad
  setIds = new Set(productos.map(producto => String(producto.id)));

  // Buscamos el ID más alto y sumamos 1 para el próximo producto
  if (productos.length > 0) {
    idCounter = Math.max(...productos.map(producto => Number(producto.id))) + 1;
  } else {
    idCounter = 1;
  }

  // Creamos un Map donde la clave es la categoría y el valor es un array de productos de esa categoría
  mapCategorias = new Map();
  for (const { nombre, precio, cantidad, categoria } of productos) {
    if (!mapCategorias.has(categoria)) mapCategorias.set(categoria, []);
    mapCategorias.get(categoria).push({ nombre, precio, cantidad });
  }
}

// =================== Renderizar tabla de productos =================== //
function renderTabla() {
  // Seleccionamos el cuerpo de la tabla donde se mostrarán los productos
  const cuerpoTabla = document.querySelector("#tabla-productos tbody");
  // Limpiamos el contenido anterior de la tabla
  cuerpoTabla.innerHTML = "";
  // Ordenamos los productos por ID y los mostramos en la tabla
  productos
    .sort((productoA, productoB) => Number(productoA.id) - Number(productoB.id))
    .forEach(({ id, nombre, precio, cantidad, categoria }) => {
      // Creamos la fila HTML para cada producto
      const filaHTML = `
        <tr>
          <td>${nombre}</td>
          <td>$${precio.toFixed(2)}</td>
          <td>${cantidad}</td>
          <td>${categoria}</td>
          <td>
            <button class="btn-editar" data-id="${id}">Editar</button>
            <button class="btn-eliminar" data-id="${id}">Eliminar</button>
          </td>
        </tr>`;
      // Insertamos la fila en la tabla
      cuerpoTabla.insertAdjacentHTML("beforeend", filaHTML);
    });
}

// =================== Manejar botones Editar y Eliminar =================== //
// Variable global para almacenar el producto actualmente en edición
let productoEditando = null;

// Delegamos el manejo de los botones Editar y Eliminar a la tabla de productos
// para aprovechar el event bubbling y no tener que asignar listeners a cada botón individualmente

document.querySelector("#tabla-productos").addEventListener("click", evento => {
  // Si se hace clic en el botón Editar
  if (evento.target.matches(".btn-editar")) {
    const idProducto = String(evento.target.dataset.id);
    // Buscamos el producto a editar por su ID (como string)
    const productoSeleccionado = productos.find(producto => String(producto.id) === idProducto);
    if (productoSeleccionado) {
      // Cargamos los datos del producto en el formulario para editar
      const formulario = document.querySelector("#form-producto");
      formulario.nombre.value = productoSeleccionado.nombre;
      formulario.precio.value = productoSeleccionado.precio;
      formulario.cantidad.value = productoSeleccionado.cantidad;
      formulario.categoria.value = productoSeleccionado.categoria;
      productoEditando = productoSeleccionado;
      formulario.querySelector('button[type="submit"]').textContent = "Guardar cambios";
    }
    return;
  }
  // Si se hace clic en el botón Eliminar
  if (evento.target.matches(".btn-eliminar")) {
    const idProducto = String(evento.target.dataset.id);
    eliminarProducto(idProducto);
  }
});

// =================== Eliminar producto =================== //
/**
 * Elimina un producto por su ID y actualiza la vista.
 * @param {string} idProducto - El ID del producto a eliminar
 */
function eliminarProducto(idProducto) {
  fetch(`http://localhost:3000/productos/${idProducto}`, { method: 'DELETE' })
    .then(respuesta => {
      if (!respuesta.ok) throw new Error("No se pudo eliminar en el servidor");
      // Tras eliminar, volvemos a pedir la lista actualizada de productos
      return fetch('http://localhost:3000/productos');
    })
    .then(respuesta => respuesta.json())
    .then(productosActualizados => {
      // Convertimos todos los IDs de los productos a string para evitar problemas de tipo
      productos = productosActualizados.map(productoDelServidor => ({
        ...productoDelServidor,
        id: String(productoDelServidor.id)
      }));
      reconstruirSetsYMaps();
      renderTabla();
      renderCategorias();
      renderTotales();
    })
    .catch(error => {
      alert("Error al eliminar producto: " + error.message);
      console.error("Error al eliminar producto:", error);
    });
}

// =================== Renderizar productos por categoría =================== //
function renderCategorias() {
  const cont = document.querySelector("#lista-categorias");
  cont.innerHTML = "";
  mapCategorias.forEach((arr, categoria) => {
    // Creamos la lista de productos de la categoría
    const lista = arr
      .map(productoCat => `<li>${productoCat.nombre} — $${productoCat.precio.toFixed(2)} — x${productoCat.cantidad}</li>`)
      .join("");
    cont.insertAdjacentHTML("beforeend",
      `<article class="categoria">
         <h3>${categoria}</h3>
         <ul>${lista}</ul>
       </article>`);
  });
}

// =================== Generar ID único =================== //
// Genera un nuevo ID único como string para cada producto nuevo
function generarId() {
  // Usamos timestamp + random para asegurar unicidad incluso en inserciones rápidas
  return String(Date.now()) + String(Math.floor(Math.random() * 100000));
}

// =================== Buscar producto por ID =================== //
function buscarProductoPorId(idBuscado) {
  // Busca un producto en la lista principal por su ID (como string)
  return productos.find(producto => String(producto.id) === String(idBuscado));
}

// =================== Agregar producto =================== //
// Manejamos el envío del formulario para agregar o editar productos
// Si productoEditando es null, se agrega un nuevo producto; si no, se actualiza el existente

document.querySelector("#form-producto").addEventListener("submit", evento => {
  evento.preventDefault();
  const datosFormulario = new FormData(evento.target);

  // Si estamos editando un producto existente
  if (productoEditando) {
    const productoActualizado = {
      ...productoEditando,
      nombre: datosFormulario.get("nombre").trim(),
      precio: Number(datosFormulario.get("precio")),
      cantidad: Number(datosFormulario.get("cantidad")),
      categoria: datosFormulario.get("categoria")
    };
    try {
      validarProducto(productoActualizado);
      actualizarProducto(productoActualizado);
      productoEditando = null;
      evento.target.reset();
      evento.target.nombre.focus();
      evento.target.querySelector('button[type="submit"]').textContent = "Agregar";
    } catch (error) {
      alert(error.message);
    }
    return;
  }

  // Si es un producto nuevo
  const nuevoProducto = {
    id:        generarId(),
    nombre:    datosFormulario.get("nombre").trim(),
    precio:    Number(datosFormulario.get("precio")),
    cantidad:  Number(datosFormulario.get("cantidad")),
    categoria: datosFormulario.get("categoria")
  };

  try {
    validarProducto(nuevoProducto);
    // Verificamos que no exista un producto con el mismo nombre (ignorando mayúsculas/minúsculas)
    if (productos.some(productoExistente => productoExistente.nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase())) {
      throw new Error("Ya existe un producto con ese nombre");
    }
    fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    })
      .then(response => response.json())
      .then(productoAgregado => {
        productos.push(productoAgregado);
        reconstruirSetsYMaps();
        renderTabla();
        renderCategorias();
        renderTotales();
      })
      .catch(error => console.error("Error al agregar producto:", error));
    evento.target.reset();
    evento.target.nombre.focus();
  } catch (error) {
    alert(error.message);
  }
});

// =================== Actualizar producto existente =================== //
function actualizarProducto(productoActualizado) {
  const idStr = String(productoActualizado.id);
  fetch(`http://localhost:3000/productos/${idStr}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...productoActualizado, id: idStr })
  })
    .then(response => response.json())
    .then(data => {
      // Buscamos el índice del producto actualizado en la lista principal
      const index = productos.findIndex(productoBuscado => String(productoBuscado.id) === idStr);
      if (index !== -1) productos[index] = data;
      reconstruirSetsYMaps();
      renderTabla();
      renderCategorias();
      renderTotales();
    })
    .catch(error => console.error("Error al actualizar producto:", error));
}

// =================== Validar producto antes de guardar =================== //
function validarProducto(producto) {
  // Expresión regular para validar nombres permitiendo letras y espacios (incluye acentos y ñ)
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  // Validación de nombre: no vacío y solo caracteres permitidos
  if (!producto.nombre || !regexNombre.test(producto.nombre)) {
    throw new Error("Nombre vacío o con caracteres no permitidos");
  }
  // Validación de precio: debe ser un número mayor a 0
  if (typeof producto.precio !== 'number' || producto.precio <= 0) {
    throw new Error("Precio inválido");
  }
  // Validación de cantidad: debe ser un entero mayor a 0
  if (!Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {
    throw new Error("Cantidad inválida");
  }
}

// =================== Renderizar tabla de totales =================== //
/**
 * Renderiza la tabla que muestra el valor total de cada producto (precio x cantidad).
 */
function renderTotales() {
  // Seleccionamos el cuerpo de la tabla de totales
  const cuerpoTablaTotales = document.querySelector("#tabla-preciosTotales tbody");
  // Limpiamos el contenido anterior de la tabla
  cuerpoTablaTotales.innerHTML = "";
  // Ordenamos los productos por ID y mostramos el total por producto
  productos
    .sort((productoA, productoB) => Number(productoA.id) - Number(productoB.id))
    .forEach(({ nombre, precio, cantidad }) => {
      // Calculamos el valor total del producto
      const valorTotal = precio * cantidad;
      // Creamos la fila HTML para la tabla de totales
      const filaHTML = `
        <tr>
          <td>${nombre}</td>
          <td>$${precio.toFixed(2)}</td>
          <td>$${valorTotal.toFixed(2)}</td>
        </tr>`;
      // Insertamos la fila en la tabla de totales
      cuerpoTablaTotales.insertAdjacentHTML("beforeend", filaHTML);
    });
}
