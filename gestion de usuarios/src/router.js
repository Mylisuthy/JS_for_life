// router.js - Router SPA sencillo para cargar vistas en <main id="spa-content">

// Vistas: puedes agregar más rutas fácilmente
const routes = {
  '/': {
    render: () => `
      <section class="home-section">
        <h1>Bienvenido a Gestión de Usuarios</h1>
        <p class="mt-2">Esta plataforma te permite administrar usuarios, cursos y más, de forma sencilla y segura.</p>
        <div class="mt-2">
          <button class="header-btn" onclick="window.location.hash = '#/login'">Iniciar sesión</button>
          <button class="header-btn" onclick="window.location.hash = '#/quienes-somos'">Quiénes somos</button>
        </div>
      </section>
    `
  },
  '/login': {
    render: () => {
      // Carga solo el formulario de login desde login.html
      return fetch('pages/login.html')
        .then(res => res.text())
        .then(html => {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          const form = temp.querySelector('form#loginForm');
          // Si el form existe, lo devolvemos envuelto en el contenedor adecuado
          return form ? `<section class="auth-container">${form.outerHTML}</section>` : '<p>Error cargando login.</p>';
        });
    }
  },
  '/register': {
    render: () => {
      // Carga solo el formulario de registro desde register.html
      return fetch('pages/register.html')
        .then(res => res.text())
        .then(html => {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          const form = temp.querySelector('form#registerForm');
          return form ? `<section class="auth-container">${form.outerHTML}</section>` : '<p>Error cargando registro.</p>';
        });
    }
  },
  '/quienes-somos': {
    render: () => `
      <section class="about-section">
        <h1>Quiénes somos</h1>
        <p>Somos un equipo dedicado a la gestión eficiente de usuarios y cursos, comprometidos con la innovación y la seguridad.</p>
        <ul>
          <li>Plataforma moderna y escalable</li>
          <li>Soporte profesional</li>
          <li>Fácil de usar</li>
        </ul>
      </section>
    `
  }
};

// Renderiza la vista según la ruta actual
export async function renderRoute() {
  const main = document.getElementById('spa-content');
  if (!main) return;
  let hash = window.location.hash.replace('#', '') || '/';
  if (!routes[hash]) hash = '/';
  const route = routes[hash];
  // Si la vista es asíncrona (por ejemplo, fetch), espera el resultado
  let content = typeof route.render === 'function' ? route.render() : '';
  if (content instanceof Promise) content = await content;
  main.innerHTML = content;

  // Re-inicializa los eventos de formularios dinámicos después de insertar el contenido
  if (hash === '/login') {
    if (window.initLoginForm) window.initLoginForm();
  }
  if (hash === '/register') {
    if (window.initRegisterForm) window.initRegisterForm();
  }
}

// Inicializa el router
export function initRouter() {
  window.addEventListener('hashchange', renderRoute);
  renderRoute();
}
