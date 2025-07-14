import { get } from './services.js';

// router structure
const app = document.getElementById('spa-content');

// definir las vistas
const routes = {
  '/': './pages/login.html',
  '/catalogo': './pages/catalogo.html',
  '/register': './pages/register.html',
  '/iniciar-sesion': './pages/iniciar-sesion.html',
  '/registrar-libro': './pages/registrar-libro.html',
  '/libros': './pages/libros.html'
};

// funcion para conectar vistas
function router() {
    const hash = window.location.hash || '#/';
    const route = hash.slice(1);

    fetch(routes[route])
    .then(res => res.text())
    .then(data => {
      app.innerHTML = data; 
      setlisteners(route);
    })
};

function setlisteners(route) {
  // LOGIN
  if (route === '/') {
    const formLogin = document.getElementById('loginForm');
    if (formLogin) {
      formLogin.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginError = document.getElementById('loginError');
        loginError.style.display = 'none';
        const users = await get('usuarios');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
          loginError.textContent = 'Correo o contraseña incorrectos';
          loginError.style.display = 'block';
          return;
        }
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        window.location.hash = '/catalogo';
      });
      // Ir a registro
      const goRegister = document.querySelector('a[href="register.html"]');
      if (goRegister) {
        goRegister.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.hash = '/register';
        });
      }
    }
  }
  // REGISTRO
  if (route === '/register') {
    const formRegister = document.getElementById('register-form');
    if (formRegister) {
      formRegister.addEventListener('submit', async (event) => {
        event.preventDefault();
        const nombre = document.getElementById('reg-nombre').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const errorDiv = document.getElementById('register-error');
        errorDiv.textContent = '';
        if (!nombre || nombre.length < 3) {
          errorDiv.textContent = 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
          return;
        }
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
          errorDiv.textContent = 'Correo electrónico inválido.';
          return;
        }
        if (!password || password.length < 6) {
          errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres.';
          return;
        }
        // Validar email único
        const users = await get('usuarios');
        if (users.some(u => u.email === email)) {
          errorDiv.textContent = 'El correo ya está registrado.';
          return;
        }
        // Por defecto, todos son usuarios normales
        const nuevoUsuario = {
          nombre: nombre,
          apellido: '',
          email: email,
          password: password,
          es_Bibliotecario: false
        };
        try {
          await import('./services.js').then(({ post }) => post('usuarios', nuevoUsuario));
          alert('Registro exitoso. Ahora puedes iniciar sesión.');
          window.location.hash = '/';
        } catch (err) {
          errorDiv.textContent = 'Error al registrar usuario.';
        }
      });
      // Ir a login
      const goLogin = document.getElementById('go-login');
      if (goLogin) {
        goLogin.addEventListener('click', function(e) {
          e.preventDefault();
          window.location.hash = '/';
        });
      }
    }
  }
  // CATÁLOGO
  if (route === '/catalogo') {
    renderCatalogo();
  }
}

// Helper: obtener usuario logueado
function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}


// Renderizar libros reales en cartas con grid y estilos
async function renderCatalogo() {
  // Mensaje flotante (notificación)
  let notif = document.getElementById('catalogo-notif');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'catalogo-notif';
    notif.style.position = 'fixed';
    notif.style.top = '32px';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.zIndex = '2000';
    notif.style.background = '#1976d2';
    notif.style.color = '#fff';
    notif.style.padding = '0.9rem 2.1rem';
    notif.style.borderRadius = '7px';
    notif.style.boxShadow = '0 2px 16px rgba(25,118,210,0.12)';
    notif.style.fontWeight = '500';
    notif.style.fontSize = '1.06rem';
    notif.style.display = 'none';
    notif.style.transition = 'opacity 0.18s';
    document.body.appendChild(notif);
  }
  function showNotif(msg, ok=true) {
    notif.textContent = msg;
    notif.style.background = ok ? '#1976d2' : '#d32f2f';
    notif.style.display = 'block';
    notif.style.opacity = '1';
    setTimeout(()=>{
      notif.style.opacity = '0';
      setTimeout(()=>{notif.style.display='none';}, 350);
    }, 1800);
  }

  const contenedor = document.getElementById('catalogo-lista');
  if (!contenedor) return;
  contenedor.innerHTML = '<div style="text-align:center;">Cargando libros...</div>';
  try {
    const libros = await get('libros');
    if (!libros || libros.length === 0) {
      contenedor.innerHTML = '<div style="text-align:center;">No hay libros disponibles.</div>';
      return;
    }
    const user = getUser();
    // Inyectar modal si es bibliotecario
    if (user && user.es_Bibliotecario && !document.getElementById('modal-libro')) {
      fetch('./pages/modal-libro.html').then(r => r.text()).then(modalHtml => {
        document.body.insertAdjacentHTML('beforeend', modalHtml);
      });
    }
    let html = '';
    // Botón agregar libro
    if (user && user.es_Bibliotecario) {
      html += '<button id="agregar-libro-btn" class="catalog-card-btn" style="margin-bottom:1.5rem;">Agregar libro</button>';
    }
    html += '<div class="catalogo-grid">';
    for (const libro of libros) {
      html += `
        <div class="catalog-card">
          <img class="catalog-card-img" src="${libro.imagen}" alt="${libro.nombre}" />
          <div class="catalog-card-body">
            <div class="catalog-card-title">${libro.nombre}</div>
            <div class="catalog-card-author"><b>Autor:</b> ${libro.autor ? libro.autor : 'Desconocido'}</div>
            <div class="catalog-card-desc">${libro.descripcion}</div>
            <div class="catalog-card-price">$${libro.precio}</div>
            <button class="catalog-card-btn">Ver más</button>
            ${user && user.es_Bibliotecario ? `
              <button class="catalog-card-btn editar-libro-btn" data-id="${libro.id}" style="background:#1976d2;margin-top:0.5rem;">Editar</button>
              <button class="catalog-card-btn eliminar-libro-btn" data-id="${libro.id}" style="background:#d32f2f;margin-top:0.5rem;">Eliminar</button>
            ` : ''}
          </div>
        </div>
      `;
    }
    html += '</div>';
    contenedor.innerHTML = html;
    // Listeners CRUD para bibliotecario
    if (user && user.es_Bibliotecario) {
      // Mostrar modal agregar
      const openModal = async (modo, libroData = null) => {
        // Espera a que el modal esté en el DOM
        let modal = document.getElementById('modal-libro');
        if (!modal) {
          const modalHtml = await fetch('./pages/modal-libro.html').then(r => r.text());
          document.body.insertAdjacentHTML('beforeend', modalHtml);
          modal = document.getElementById('modal-libro');
        }
        modal.style.display = 'flex';
        const form = document.getElementById('form-libro');
        const title = document.getElementById('modal-libro-title');
        const errorDiv = document.getElementById('libro-error');
        errorDiv.textContent = '';
        // Reset form
        form.reset();
        if (modo === 'editar' && libroData) {
          title.textContent = 'Editar libro';
          document.getElementById('libro-nombre').value = libroData.nombre;
          document.getElementById('libro-autor').value = libroData.autor;
          document.getElementById('libro-descripcion').value = libroData.descripcion;
          document.getElementById('libro-precio').value = libroData.precio;
          document.getElementById('libro-imagen').value = libroData.imagen;
        } else {
          title.textContent = 'Agregar libro';
        }
        // Cancelar
        document.getElementById('libro-cancel').onclick = () => { modal.style.display = 'none'; };
        // Submit
        form.onsubmit = async (e) => {
          e.preventDefault();
          const nombre = document.getElementById('libro-nombre').value.trim();
          const autor = document.getElementById('libro-autor').value.trim();
          const descripcion = document.getElementById('libro-descripcion').value.trim();
          const precio = Number(document.getElementById('libro-precio').value);
          const imagen = document.getElementById('libro-imagen').value.trim();
          // Validaciones estrictas
          if (!nombre || !autor || !descripcion || !precio || !imagen) {
            errorDiv.textContent = 'Todos los campos son obligatorios.';
            return;
          }
          if (nombre.length < 2) {
            errorDiv.textContent = 'El título debe tener al menos 2 caracteres.';
            return;
          }
          if (autor.length < 2) {
            errorDiv.textContent = 'El autor debe tener al menos 2 caracteres.';
            return;
          }
          if (descripcion.length < 10) {
            errorDiv.textContent = 'La descripción debe tener al menos 10 caracteres.';
            return;
          }
          if (isNaN(precio) || precio <= 0) {
            errorDiv.textContent = 'El precio debe ser mayor que 0.';
            return;
          }
          if (!/^https?:\/\//.test(imagen)) {
            errorDiv.textContent = 'La URL de la imagen debe ser válida.';
            return;
          }
          try {
            const { post, put, get } = await import('./services.js');
            const libros = await get('libros');
            // Validación de título duplicado (ignorando el propio libro en edición)
            const tituloNormalizado = nombre.trim().toLowerCase().replace(/\s+/g, ' ');
            const existeDuplicado = libros.some(l => {
              if (modo === 'editar' && libroData && Number(l.id) === Number(libroData.id)) return false;
              return l.nombre.trim().toLowerCase().replace(/\s+/g, ' ') === tituloNormalizado;
            });
            if (existeDuplicado) {
              errorDiv.textContent = 'Ya existe un libro con ese título.';
              return;
            }
            if (modo === 'editar' && libroData) {
              // Buscar libro original por id
              const libros = await get('libros');
              const libroOriginal = libros.find(l => l.id === libroData.id);
              if (!libroOriginal) throw new Error('Libro no encontrado');
              await put('/libros', libroOriginal.id, { id: libroOriginal.id, nombre, autor, descripcion, precio, imagen });
            } else {
              // Generar id incremental automáticamente
              const libros = await get('libros');
              let maxId = 0;
              libros.forEach(l => { if (typeof l.id === 'number' && l.id > maxId) maxId = l.id; });
              const nuevoLibro = { id: Number(maxId + 1), nombre, autor, descripcion, precio, imagen };
              await post('libros', nuevoLibro);
            }
            modal.style.display = 'none';
            renderCatalogo();
          } catch (err) {
            errorDiv.textContent = 'Error al guardar libro.';
          }
        };

      };
      // Botón agregar
      const agregarBtn = document.getElementById('agregar-libro-btn');
      if (agregarBtn) {
        agregarBtn.onclick = () => openModal('agregar');
      }
      // Botones editar
      document.querySelectorAll('.editar-libro-btn').forEach(btn => {
        btn.onclick = async () => {
          const idLibro = Number(btn.getAttribute('data-id'));
          const libros = await get('libros');
          const libro = libros.find(l => Number(l.id) === idLibro);
          if (libro) openModal('editar', libro);
        };
      });
      // Botones eliminar
      document.querySelectorAll('.eliminar-libro-btn').forEach(btn => {
        btn.onclick = async () => {
          const idLibro = Number(btn.getAttribute('data-id'));
          const { deletes, get } = await import('./services.js');
          const libros = await get('libros');
          // Fuerza comparación numérica para ids
          const libro = libros.find(l => Number(l.id) === idLibro);
          if (!libro) {
            showNotif('Libro no encontrado.', false);
            return;
          }
          if (!libro.id) {
            showNotif('Este libro no tiene un ID único. No se puede eliminar de forma segura.', false);
            return;
          }
          if (confirm('¿Seguro que deseas eliminar el libro "'+libro.nombre+'"?')) {
            try {
              await deletes('libros', libro.id);
              showNotif('Libro eliminado correctamente.', true);
              renderCatalogo(); // Actualiza inmediatamente
            } catch (err) {
              if (err && err.message) {
  showNotif('Error al eliminar el libro: ' + err.message, false);
} else {
  showNotif('Error al eliminar el libro.', false);
}
            }
          }
        };
      });
    }
  } catch (err) {
    contenedor.innerHTML = '<div style="text-align:center;color:red;">Error al cargar los libros.</div>';
  }
}


// procesos de muestra 
window.addEventListener('load', () => {
  mostrarLogoutBtn();
  router();
});
window.addEventListener('hashchange', () => {
  mostrarLogoutBtn();
  router();
});

function mostrarLogoutBtn() {
  const logoutBtn = document.getElementById('logout-btn');
  const addBookBtn = document.getElementById('add-book-btn');
  const inicioBtn = document.querySelector('a.header-btn[href="#/"]');
  let user = localStorage.getItem('user');
  let esBibliotecario = false;
  if (user) {
    try {
      user = JSON.parse(user);
      esBibliotecario = !!user.es_Bibliotecario;
    } catch (e) { user = null; }
  }
  if (logoutBtn) {
    if (user) {
      logoutBtn.style.display = 'inline-block';
      logoutBtn.onclick = function() {
        localStorage.removeItem('user');
        window.location.hash = '/';
        mostrarLogoutBtn();
      };
    } else {
      logoutBtn.style.display = 'none';
      logoutBtn.onclick = null;
    }
  }
  if (addBookBtn) {
    if (user && esBibliotecario) {
      addBookBtn.style.display = 'inline-block';
    } else {
      addBookBtn.style.display = 'none';
    }
  }
  if (inicioBtn) {
    if (user) {
      inicioBtn.style.display = 'none';
    } else {
      inicioBtn.style.display = 'inline-block';
    }
  }
}