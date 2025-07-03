// ------------------- Cargar productos desde JSON ------------------- //
fetch('http://localhost:3000/productos')
  .then(response => response.json())
  .then(data => {
    productos = data;
    reconstruirSetsYMaps();
    renderTabla();
    renderCategorias();
    cantidadTotal();
  })
  .catch(error => console.error("Error al obtener productos:", error));

// ------------------- Variables y estructuras auxiliares ------------------- //
let productos = [];
let setIds, mapCategorias;

function reconstruirSetsYMaps() {
  setIds = new Set(productos.map(producto => producto.id));

  mapCategorias = new Map();
  for (const { nombre, precio, cantidad, categoria } of productos) {
    if (!mapCategorias.has(categoria)) mapCategorias.set(categoria, []);
    mapCategorias.get(categoria).push({ nombre, precio, cantidad });
  }
}

// ------------------- Renderizar tabla ------------------- //
function renderTabla() {
  const tbody = document.querySelector("#tabla-productos tbody");
  tbody.innerHTML = "";
  productos.sort((a, b) => a.id - b.id).forEach(({ id, nombre, precio, cantidad, categoria }) => {
    const fila = `
      <tr>
        <td>${nombre}</td>
        <td>$${precio.toFixed(2)}</td>
        <td>${cantidad}</td>
        <td>${categoria}</td>
        <td><button class="btn-eliminar" data-id="${id}">Eliminar</button></td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", fila);
  });
}

// ------------------- Renderizar categorías ------------------- //
function renderCategorias() {
  const cont = document.querySelector("#lista-categorias");
  cont.innerHTML = "";
  mapCategorias.forEach((arr, categoria) => {
    const lista = arr
      .map(p => `<li>${p.nombre} — $${p.precio.toFixed(2)} — x${p.cantidad}</li>`)
      .join("");
    cont.insertAdjacentHTML("beforeend",
      `<article class="categoria">
         <h3>${categoria}</h3>
         <ul>${lista}</ul>
       </article>`);
  });
}

// ------------------- Generar ID ------------------- //
const generarId = () => productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;

// ------------------- Agregar producto ------------------- //
document.querySelector("#form-producto").addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.target);

  const nuevoProducto = {
    id:        generarId(),
    nombre:    data.get("nombre").trim(),
    precio:    Number(data.get("precio")),
    cantidad:  Number(data.get("cantidad")),
    categoria: data.get("categoria")
  };

  try {
    validarProducto(nuevoProducto);
    if (productos.some(p => p.nombre.toLowerCase() === nuevoProducto.nombre.toLowerCase()))
      throw new Error("Ya existe un producto con ese nombre");

    fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProducto)
    })
      .then(response => response.json())
      .then(data => {
        productos.push(data);
        reconstruirSetsYMaps();
        renderTabla();
        renderCategorias();
        cantidadTotal();
      })
      .catch(error => console.error("Error al agregar producto:", error));

    e.target.reset();
    e.target.nombre.focus();
  } catch (err) { alert(err.message); }
});

// ------------------- Actualizar producto ------------------- //
function actualizarProducto(productoActualizado) {
  fetch(`http://localhost:3000/productos/${productoActualizado.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productoActualizado)
  })
    .then(response => response.json())
    .then(data => {
      const index = productos.findIndex(p => p.id === productoActualizado.id);
      if (index !== -1) productos[index] = data;
      reconstruirSetsYMaps();
      renderTabla();
      renderCategorias();
      cantidadTotal();
    })
    .catch(error => console.error("Error al actualizar producto:", error));
}

// ------------------- Eliminar producto ------------------- //
document.querySelector("#tabla-productos").addEventListener("click", e => {
  if (!e.target.matches(".btn-eliminar")) return;

  const id = Number(e.target.dataset.id);

  fetch(`http://localhost:3000/productos/${id}`, { method: 'DELETE' })
    .then(() => {
      productos = productos.filter(p => p.id !== id);
      reconstruirSetsYMaps();
      renderTabla();
      renderCategorias();
    })
    .catch(error => console.error("Error al eliminar producto:", error));
});

// ------------------- Validar producto ------------------- //
function validarProducto(producto) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  if (!producto.nombre || !regexNombre.test(producto.nombre)) throw new Error("Nombre vacío o con caracteres no permitidos");
  if (typeof producto.precio !== 'number' || producto.precio <= 0) throw new Error("Precio inválido");
  if (!Number.isInteger(producto.cantidad) || producto.cantidad <= 0) throw new Error("Cantidad inválida");
}

// ------------------- Renderizar tabla de totales ------------------- //
function cantidadTotal() {
  const tbody = document.querySelector("#tabla-preciosTotales tbody");
  tbody.innerHTML = "";

  productos
    .sort((a, b) => a.id - b.id)
    .forEach(({ nombre, precio, cantidad }) => {
      const total = precio * cantidad;
      const fila = `
        <tr>
          <td>${nombre}</td>
          <td>$${precio.toFixed(2)}</td>
          <td>$${total.toFixed(2)}</td>
        </tr>`;
      tbody.insertAdjacentHTML("beforeend", fila);
    });
}

// ------------------- Inicialización ------------------- //
fetch('http://localhost:3000/productos')
  .then(response => response.json())
  .then(data => {
    productos = data;
    reconstruirSetsYMaps();
    renderTabla();
    renderCategorias();
    cantidadTotal();
  })
  .catch(error => console.error("Error al cargar productos:", error));
