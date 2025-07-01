// ------------------- Inicialización ------------------- //
let productos = [
  { id: 1, nombre: "Laptop",  precio: 1500, cantidad: 5,  categoria: "Electrónica" },
  { id: 2, nombre: "Mouse",   precio: 25,   cantidad: 20, categoria: "Accesorios"  },
  { id: 3, nombre: "Teclado", precio: 50,   cantidad: 15, categoria: "Accesorios"  }
];

// ------------------- Validación ------------------- //
function validarProductos({ nombre, precio, cantidad }) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  if (!nombre || !regexNombre.test(nombre))                     throw new Error("Nombre vacío o con caracteres no permitidos");
  if (typeof precio !== "number" || precio <= 0)                throw new Error("Precio inválido");
  if (!Number.isInteger(cantidad) || cantidad <= 0)             throw new Error("Cantidad inválida");
}

// ------------------- Estructuras auxiliares ------------------- //
let setIds, mapCategorias;
function reconstruirSetsYMaps() {
  setIds = new Set(productos.map(producto => producto.id));

  mapCategorias = new Map();
  for (const { nombre, precio, cantidad, categoria } of productos) {
    if (!mapCategorias.has(categoria)) mapCategorias.set(categoria, []);
    mapCategorias.get(categoria).push({ nombre, precio, cantidad });
  }
}
reconstruirSetsYMaps();

// ------------------- Render tabla ------------------- //
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

// ------------------- Render categorías ------------------- //
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

  const nuevo = {
    id:        generarId(),
    nombre:    data.get("nombre").trim(),
    precio:    Number(data.get("precio")),
    cantidad:  Number(data.get("cantidad")),
    categoria: data.get("categoria")
  };

  try {
    validarProductos(nuevo);
    if (productos.some(p => p.nombre.toLowerCase() === nuevo.nombre.toLowerCase()))
      throw new Error("Ya existe un producto con ese nombre");

    productos.push(nuevo);
    reconstruirSetsYMaps();
    renderTabla();
    renderCategorias();
    cantidadTotal();

    e.target.reset();
    e.target.nombre.focus();
  } catch (err) { alert(err.message); }
});

// ------------------- Eliminar producto ------------------- //
document.querySelector("#tabla-productos").addEventListener("click", e => {
  if (!e.target.matches(".btn-eliminar")) return;

  const id = Number(e.target.dataset.id);
  productos = productos.filter(p => p.id !== id);
  reconstruirSetsYMaps();
  renderTabla();
  renderCategorias();
});

// ---------- Render tabla (Nombre, Precio, Valor total) ----------
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

// ------------------- Arranque ------------------- //
productos.forEach(validarProductos);
renderTabla();
renderCategorias();
cantidadTotal();
