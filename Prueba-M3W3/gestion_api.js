// =================== Cargar productos desde el servidor ===================
// Descarga los productos del backend, inicializa estructuras y renderiza la UI principal
fetch('http://localhost:3000/productos')
  .then(response => response.json())
  .then(data => {
    productos = data.map(productoDelServidor => ({
      ...productoDelServidor,
      id: String(productoDelServidor.id)
    }));
    reconstruirSetsYMaps();
    renderUltimosIngresados();
    renderInventario();
    inicializarAccordion();
  })
  .catch(error => console.error("Error al obtener productos:", error));

// Variables globales para productos y control de IDs
let productos = [];
let setIds;
let idCounter = 1;

// Reconstruye el set de IDs y el contador de IDs a partir del array de productos
function reconstruirSetsYMaps() {
  setIds = new Set(productos.map(producto => String(producto.id)));
  if (productos.length > 0) {
    idCounter = Math.max(...productos.map(producto => Number(producto.id))) + 1;
  } else {
    idCounter = 1;
  }
}

// Renderiza la tabla de "últimos ingresados" ordenando por fecha de ingreso
function renderUltimosIngresados() {
  const cuerpoTabla = document.querySelector("#tabla-productos tbody");
  cuerpoTabla.innerHTML = "";
  productos
    .slice()
    .sort((a, b) => new Date(b.fechaIngreso) - new Date(a.fechaIngreso))
    .forEach(({ nombre, cantidad, tipoCantidad, categoria, fechaIngreso }) => {
      let cantidadStr = tipoCantidad === 'kilogramos' ? `${cantidad} kg` : `${cantidad} u.`;
      const filaHTML = `
        <tr>
          <td>${nombre}</td>
          <td>${cantidadStr}</td>
          <td>${categoria}</td>
          <td>${fechaIngreso ? fechaIngreso : '-'}</td>
        </tr>`;
      cuerpoTabla.insertAdjacentHTML("beforeend", filaHTML);
    });
}

// Renderiza el inventario agrupado por categorías en acordeones, con menú de acciones y popover de fechas
function renderInventario() {
  const cont = document.getElementById("inventario-acordeon-categorias");
  if (!cont) return;
  cont.innerHTML = "";
  const categorias = {};
  productos.forEach(prod => {
    if (!categorias[prod.categoria]) categorias[prod.categoria] = [];
    categorias[prod.categoria].push(prod);
  });
  let totalGlobal = 0;
  Object.entries(categorias).forEach(([categoria, arr], idx) => {
    let filas = arr.map(prod => {
      let cantidadStr = prod.tipoCantidad === 'kilogramos' ? `${prod.cantidad} kg` : `${prod.cantidad} u.`;
      const valorTotal = prod.precio * prod.cantidad;
      totalGlobal += valorTotal;
      const menuAcciones = `
        <div class=\"menu-acciones\">
          <button class=\"btn-menu\" data-id=\"${prod.id}\">⋮</button>
          <div class=\"menu-dropdown\">
            <button class=\"btn-editar\" data-id=\"${prod.id}\">Editar</button>
            <button class=\"btn-eliminar\" data-id=\"${prod.id}\">Eliminar</button>
          </div>
        </div>`;
      const fechaIngresoBtn = `<button class=\"fecha-ingreso-btn\" tabindex=\"0\">${prod.fechaIngreso ? prod.fechaIngreso.split(',')[0] : '-'}</button>`;
      const fechaEdicionPop = `<span class=\"fecha-edicion-pop\">${prod.fechaEdicion ? 'Última edición: ' + prod.fechaEdicion : 'Sin ediciones'}</span>`;
      return `<tr>
        <td>${prod.nombre}</td>
        <td>$${prod.precio.toFixed(2)}</td>
        <td>${cantidadStr}</td>
        <td>$${valorTotal.toFixed(2)}</td>
        <td>${menuAcciones}</td>
        <td style=\"position:relative\">${fechaIngresoBtn}${fechaEdicionPop}</td>
      </tr>`;
    }).join('');
    cont.insertAdjacentHTML('beforeend', `
      <div class=\"inventario-categoria\">
        <button class=\"inventario-categoria-header\" type=\"button\" aria-expanded=\"${idx===0?'true':'false'}\">${categoria}</button>
        <div class=\"inventario-categoria-content\" style=\"display:${idx===0?'block':'none'}\">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Valor total</th>
                <th>Acciones</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </div>
    `);
  });
  // Actualiza el total global
  let totalDiv = document.getElementById('valor-total-global');
  if (totalDiv) totalDiv.textContent = `$${totalGlobal.toFixed(2)}`;
  // Listeners para acordeones de categorías
  cont.querySelectorAll('.inventario-categoria-header').forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      cont.querySelectorAll('.inventario-categoria').forEach((item, i) => {
        if (i === idx) {
          item.classList.toggle('active');
          btn.setAttribute('aria-expanded', item.classList.contains('active'));
          item.querySelector('.inventario-categoria-content').style.display = item.classList.contains('active') ? 'block' : 'none';
        } else {
          item.classList.remove('active');
          item.querySelector('.inventario-categoria-header').setAttribute('aria-expanded', 'false');
          item.querySelector('.inventario-categoria-content').style.display = 'none';
        }
      });
    });
  });
  // Listeners para menú de acciones de cada producto
  cont.querySelectorAll('.btn-menu').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      cont.querySelectorAll('.menu-dropdown').forEach(drop => drop.style.display = 'none');
      const menu = this.nextElementSibling;
      if (menu) {
        // Posicionar el menú de forma fija respecto al botón
        const rect = this.getBoundingClientRect();
        menu.style.display = 'block';
        menu.style.position = 'fixed';
        menu.style.left = (rect.left + rect.width/2 - menu.offsetWidth/2) + 'px';
        menu.style.top = (rect.bottom + 6) + 'px';
        menu.style.zIndex = 99999;
      }
    });
  });
  // Oculta menús al hacer click fuera
  document.addEventListener('click', function() {
    cont.querySelectorAll('.menu-dropdown').forEach(drop => drop.style.display = 'none');
  });
}

let productoEditando = null;

// Listener principal para acciones de editar y eliminar productos desde el inventario
document.getElementById("inventario-acordeon-categorias").addEventListener("click", evento => {
  // --- Edición de producto ---
  if (evento.target.matches(".btn-editar")) {
    const idProducto = String(evento.target.dataset.id);
    const productoSeleccionado = productos.find(producto => String(producto.id) === idProducto);
    if (productoSeleccionado) {
      const formulario = document.querySelector("#form-producto");
      formulario.nombre.value = productoSeleccionado.nombre;
      formulario.precio.value = productoSeleccionado.precio;
      formulario.categoria.value = productoSeleccionado.categoria;
      formulario.tipoCantidad.value = productoSeleccionado.tipoCantidad || 'unidades';
      if (productoSeleccionado.tipoCantidad === 'kilogramos') {
        document.getElementById('tipoCantidad').value = 'kilogramos';
        document.getElementById('label-cantidad-unidades').style.display = 'none';
        document.getElementById('label-cantidad-kilos').style.display = '';
        formulario.cantidadKilos.value = productoSeleccionado.cantidad;
        formulario.cantidadUnidades.value = '';
      } else {
        document.getElementById('tipoCantidad').value = 'unidades';
        document.getElementById('label-cantidad-unidades').style.display = '';
        document.getElementById('label-cantidad-kilos').style.display = 'none';
        formulario.cantidadUnidades.value = productoSeleccionado.cantidad;
        formulario.cantidadKilos.value = '';
      }
      productoEditando = productoSeleccionado;
      formulario.querySelector('button[type="submit"]').textContent = "Guardar cambios";
      btnCancelar.style.display = 'inline-block';
    }
    // Oculta el menú de acciones tras editar
    if (evento.target.closest('.menu-dropdown')) evento.target.closest('.menu-dropdown').style.display = 'none';
    return;
  }
  // --- Eliminación de producto ---
  if (evento.target.matches(".btn-eliminar")) {
    const idProducto = String(evento.target.dataset.id);
    const productoAEliminar = productos.find(producto => String(producto.id) === idProducto);
    if (productoAEliminar) {
      const confirmar = confirm(`¿Estás seguro que deseas eliminar el producto "${productoAEliminar.nombre}"?`);
      if (!confirmar) return;
    }
    eliminarProducto(idProducto);
    if (evento.target.closest('.menu-dropdown')) evento.target.closest('.menu-dropdown').style.display = 'none';
  }
});

// Elimina un producto del backend y actualiza la UI
function eliminarProducto(idProducto) {
  fetch(`http://localhost:3000/productos/${idProducto}`, { method: 'DELETE' })
    .then(respuesta => {
      if (!respuesta.ok) throw new Error("No se pudo eliminar en el servidor");
      return fetch('http://localhost:3000/productos');
    })
    .then(respuesta => respuesta.json())
    .then(productosActualizados => {
      productos = productosActualizados.map(productoDelServidor => ({
        ...productoDelServidor,
        id: String(productoDelServidor.id)
      }));
      reconstruirSetsYMaps();
      renderUltimosIngresados();
      renderInventario();
    })
    .catch(error => {
      alert("Error al eliminar producto: " + error.message);
      console.error("Error al eliminar producto:", error);
    });
}

// =================== Helpers y validación ===================
// Genera un ID único para nuevos productos
function generarId() {
  return String(Date.now()) + String(Math.floor(Math.random() * 100000));
}

// Busca un producto por su ID
function buscarProductoPorId(idBuscado) {
  return productos.find(producto => String(producto.id) === String(idBuscado));
}

// =================== Lógica del formulario de productos ===================
const formProducto = document.querySelector("#form-producto");
let btnCancelar = formProducto.querySelector('.btn-cancelar');
if (!btnCancelar) {
  btnCancelar = document.createElement('button');
  btnCancelar.type = 'button';
  btnCancelar.textContent = 'Cancelar';
  btnCancelar.className = 'btn-cancelar';
  btnCancelar.style.display = 'none';
  // Insertar debajo del contenedor de botones
  const contenedorBotones = formProducto.querySelector('.form-botones');
  if (contenedorBotones) {
    contenedorBotones.appendChild(btnCancelar);
  } else {
    formProducto.appendChild(btnCancelar);
  }
  // Listener para cancelar edición
  btnCancelar.addEventListener('click', () => {
    formProducto.reset();
    formProducto.nombre.focus();
    window.productoEditando = null;
    formProducto.querySelector('button[type="submit"]').textContent = "Agregar";
    btnCancelar.style.display = 'none';
    localStorage.removeItem('mensajeFormulario');
    const mensajeDiv = document.getElementById('mensaje-formulario');
    if (mensajeDiv) {
      mensajeDiv.textContent = '';
      mensajeDiv.className = '';
      if (mensajeDiv._timeout) clearTimeout(mensajeDiv._timeout);
    }
  });
}

// Cambia el campo de cantidad según el tipo seleccionado (unidades/kilogramos)
document.getElementById('tipoCantidad').addEventListener('change', function() {
  if (this.value === 'kilogramos') {
    document.getElementById('label-cantidad-unidades').style.display = 'none';
    document.getElementById('label-cantidad-kilos').style.display = '';
  } else {
    document.getElementById('label-cantidad-unidades').style.display = '';
    document.getElementById('label-cantidad-kilos').style.display = 'none';
  }
});

// Maneja el envío del formulario para agregar o editar productos
formProducto.addEventListener("submit", evento => {
  evento.preventDefault();
  const datosFormulario = new FormData(evento.target);
  const tipoCantidad = datosFormulario.get("tipoCantidad");
  let cantidad = 0;
  if (tipoCantidad === 'kilogramos') {
    cantidad = parseFloat(datosFormulario.get("cantidadKilos"));
  } else {
    cantidad = parseInt(datosFormulario.get("cantidadUnidades"));
  }
  const mensajeDiv = document.getElementById('mensaje-formulario');

  // --- Edición de producto existente ---
  if (productoEditando) {
    const productoActualizado = {
      ...productoEditando,
      nombre: datosFormulario.get("nombre").trim(),
      precio: Number(datosFormulario.get("precio")),
      cantidad: cantidad,
      tipoCantidad: tipoCantidad,
      categoria: datosFormulario.get("categoria"),
      fechaEdicion: new Date().toLocaleString()
    };
    try {
      validarProducto(productoActualizado);
      actualizarProducto(productoActualizado, true, mensajeDiv);
      productoEditando = null;
      evento.target.reset();
      evento.target.nombre.focus();
      evento.target.querySelector('button[type="submit"]').textContent = "Agregar";
      btnCancelar.style.display = 'none';
      localStorage.removeItem('mensajeFormulario');
      // No limpiar mensajeDiv aquí, dejar que el mensaje persista según lógica de mostrarMensajePersistente
      if (mensajeDiv._timeout) clearTimeout(mensajeDiv._timeout);
    } catch (error) {
      const mensajePersistente = {
        texto: error.message,
        clase: 'error',
        timestamp: Date.now()
      };
      localStorage.setItem('mensajeFormulario', JSON.stringify(mensajePersistente));
      mostrarMensajePersistente();
    }
    return;
  }

  // --- Alta de nuevo producto ---
  const nuevoProducto = {
    id:        generarId(),
    nombre:    datosFormulario.get("nombre").trim(),
    precio:    Number(datosFormulario.get("precio")),
    cantidad:  cantidad,
    tipoCantidad: tipoCantidad,
    categoria: datosFormulario.get("categoria"),
    fechaIngreso: new Date().toLocaleString()
  };

  try {
    validarProducto(nuevoProducto);
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
        renderUltimosIngresados();
        renderInventario();
        const mensajePersistente = {
          texto: 'Producto agregado correctamente',
          clase: 'success',
          timestamp: Date.now()
        };
        localStorage.setItem('mensajeFormulario', JSON.stringify(mensajePersistente));
        mostrarMensajePersistente();
      })
      .catch(error => {
        const mensajePersistente = {
          texto: 'Error al agregar producto: ' + error.message,
          clase: 'error',
          timestamp: Date.now()
        };
        localStorage.setItem('mensajeFormulario', JSON.stringify(mensajePersistente));
        mostrarMensajePersistente();
      });
  } catch (error) {
    const mensajePersistente = {
      texto: error.message,
      clase: 'error',
      timestamp: Date.now()
    };
    localStorage.setItem('mensajeFormulario', JSON.stringify(mensajePersistente));
    mostrarMensajePersistente();
  }
});

// Muestra mensajes persistentes del formulario (éxito/error) y los limpia tras 10s
function mostrarMensajePersistente() {
  const mensajeDiv = document.getElementById('mensaje-formulario');
  const data = localStorage.getItem('mensajeFormulario');
  if (!data) return;
  const { texto, clase, timestamp } = JSON.parse(data);
  mensajeDiv.textContent = texto;
  mensajeDiv.className = clase;
  if (mensajeDiv._timeout) clearTimeout(mensajeDiv._timeout);
  const msPasados = Date.now() - timestamp;
  const msRestantes = Math.max(0, 10000 - msPasados);
  if (msRestantes > 0) {
    mensajeDiv._timeout = setTimeout(() => {
      // Solo limpiar si el usuario no está editando (productoEditando == null)
      if (!window.productoEditando) {
        mensajeDiv.textContent = '';
        mensajeDiv.className = '';
        localStorage.removeItem('mensajeFormulario');
      }
    }, msRestantes);
  } else {
    if (!window.productoEditando) {
      mensajeDiv.textContent = '';
      mensajeDiv.className = '';
      localStorage.removeItem('mensajeFormulario');
    }
  }
}
// Inicializa la visualización de mensajes persistentes al cargar la página
window.addEventListener('DOMContentLoaded', mostrarMensajePersistente);

// Actualiza un producto existente en el backend y la UI
function actualizarProducto(productoActualizado, mostrarMensaje, mensajeDiv) {
  const idStr = String(productoActualizado.id);
  fetch(`http://localhost:3000/productos/${idStr}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...productoActualizado, id: idStr })
  })
    .then(response => response.json())
    .then(data => {
      const index = productos.findIndex(productoBuscado => String(productoBuscado.id) === idStr);
      if (index !== -1) productos[index] = data;
      reconstruirSetsYMaps();
      renderUltimosIngresados();
      renderInventario();
      if (mostrarMensaje && mensajeDiv) {
        mensajeDiv.textContent = 'Producto actualizado correctamente';
        mensajeDiv.className = 'success';
        if (mensajeDiv._timeout) clearTimeout(mensajeDiv._timeout);
        mensajeDiv._timeout = setTimeout(() => {
          mensajeDiv.textContent = '';
          mensajeDiv.className = '';
          localStorage.removeItem('mensajeFormulario');
        }, 10000);
      }
    })
    .catch(error => {
      if (mostrarMensaje && mensajeDiv) {
        mensajeDiv.textContent = 'Error al actualizar producto: ' + error.message;
        mensajeDiv.className = 'error';
        if (mensajeDiv._timeout) clearTimeout(mensajeDiv._timeout);
        mensajeDiv._timeout = setTimeout(() => {
          mensajeDiv.textContent = '';
          mensajeDiv.className = '';
          localStorage.removeItem('mensajeFormulario');
        }, 10000);
      }
    });
}

// Valida los datos de un producto antes de enviarlo al backend
function validarProducto(producto) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 .,:;\-()\[\]/+]+$/;
  if (!producto.nombre || !regexNombre.test(producto.nombre)) {
    throw new Error("Nombre vacío o con caracteres no permitidos");
  }
  if (typeof producto.precio !== 'number' || producto.precio <= 0) {
    throw new Error("Precio inválido");
  }
  if (producto.tipoCantidad === 'kilogramos') {
    if (typeof producto.cantidad !== 'number' || producto.cantidad <= 0) {
      throw new Error("Cantidad en kilogramos inválida");
    }
  } else {
    if (!Number.isInteger(producto.cantidad) || producto.cantidad <= 0) {
      throw new Error("Cantidad en unidades inválida");
    }
  }
}

// Inicializa el acordeón principal de la UI (no categorías)
function inicializarAccordion() {
  document.querySelectorAll('.accordion-header').forEach((btn, idx) => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.accordion-item').forEach((item, i) => {
        if (i === idx) {
          item.classList.toggle('active');
          btn.setAttribute('aria-expanded', item.classList.contains('active'));
        } else {
          item.classList.remove('active');
          item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
        }
      });
    });
  });
  const first = document.querySelector('.accordion-item');
  if (first) {
    first.classList.add('active');
    first.querySelector('.accordion-header').setAttribute('aria-expanded', 'true');
  }
}

// =================== Popover de fecha de edición y menú de acciones (UI flotante) ===================
// Listeners globales para mostrar/ocultar popover de fecha de edición y menú de acciones flotante
document.addEventListener('DOMContentLoaded', () => {
  // Popover de fecha de edición
  document.body.addEventListener('mouseenter', function(e) {
    if (e.target.classList.contains('fecha-ingreso-btn')) {
      const pop = e.target.nextElementSibling;
      if (pop && pop.classList.contains('fecha-edicion-pop')) {
        const rect = e.target.getBoundingClientRect();
        pop.style.position = 'fixed';
        pop.style.left = (rect.left + rect.width/2) + 'px';
        pop.style.top = (rect.bottom + 6) + 'px';
        pop.style.transform = 'translateX(-50%)';
        pop.style.display = 'block';
        pop.style.zIndex = 100010;
      }
    }
  }, true);
  document.body.addEventListener('mouseleave', function(e) {
    if (e.target.classList.contains('fecha-ingreso-btn')) {
      const pop = e.target.nextElementSibling;
      if (pop && pop.classList.contains('fecha-edicion-pop')) {
        pop.style.display = 'none';
      }
    }
  }, true);
  document.body.addEventListener('focusin', function(e) {
    if (e.target.classList.contains('fecha-ingreso-btn')) {
      const pop = e.target.nextElementSibling;
      if (pop && pop.classList.contains('fecha-edicion-pop')) {
        const rect = e.target.getBoundingClientRect();
        pop.style.position = 'fixed';
        pop.style.left = (rect.left + rect.width/2) + 'px';
        pop.style.top = (rect.bottom + 6) + 'px';
        pop.style.transform = 'translateX(-50%)';
        pop.style.display = 'block';
        pop.style.zIndex = 100010;
      }
    }
  });
  document.body.addEventListener('focusout', function(e) {
    if (e.target.classList.contains('fecha-ingreso-btn')) {
      const pop = e.target.nextElementSibling;
      if (pop && pop.classList.contains('fecha-edicion-pop')) {
        pop.style.display = 'none';
      }
    }
  });

  // Menú de acciones flotante
  document.body.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-menu')) {
      document.querySelectorAll('.menu-dropdown').forEach(drop => drop.style.display = 'none');
      const menu = e.target.nextElementSibling;
      if (menu) {
        const rect = e.target.getBoundingClientRect();
        menu.style.display = 'block';
        menu.style.position = 'fixed';
        menu.style.left = (rect.left + rect.width/2 - menu.offsetWidth/2) + 'px';
        menu.style.top = (rect.bottom + 6) + 'px';
        menu.style.zIndex = 100010;
      }
    } else if (!e.target.closest('.menu-dropdown')) {
      document.querySelectorAll('.menu-dropdown').forEach(drop => {
        drop.style.display = 'none';
      });
    }
  });
});
