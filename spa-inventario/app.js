// ElectriksAPPK - SPA Inventario Electrónica
// Modularización principal
const SPA = (() => {
  // --- Datos simulados de usuarios ---
  const USERS = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { username: 'user', password: 'user123', role: 'user', name: 'Usuario' }
  ];

  // --- Estado global ---
  let state = {
    user: null,
    inventory: [],
    cart: [],
    loading: false,
    filter: { name: '', category: '' }
  };

  // --- Utilidades ---
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);
  const show = (el) => el && (el.style.display = '');
  const hide = (el) => el && (el.style.display = 'none');
  const setLoading = (loading) => {
    state.loading = loading;
    const root = $('#spa-root');
    if (loading) root.innerHTML = '<div class="loader" aria-label="Cargando"></div>';
  };
  const saveSession = () => localStorage.setItem('electriksappk_session', JSON.stringify(state.user));
  const loadSession = () => {
    const u = localStorage.getItem('electriksappk_session');
    if (u) state.user = JSON.parse(u);
  };
  const clearSession = () => localStorage.removeItem('electriksappk_session');

  // --- Renderizado SPA ---
  function render() {
    if (state.loading) return;
    if (!state.user) return renderLogin();
    if (state.user.role === 'admin') return renderAdmin();
    if (state.user.role === 'user') return renderUser();
    return renderGuest();
  }

  // --- Login ---
  function renderLogin() {
    $('#nav-cart').style.display = 'none';
    $('#nav-logout').style.display = 'none';
    $('#main-nav').style.display = '';
    $('#spa-root').innerHTML = `
      <form class="form" id="login-form" autocomplete="on">
        <h2>Iniciar Sesión</h2>
        <label for="username">Usuario</label>
        <input class="input" id="username" name="username" required autofocus autocomplete="username" />
        <label for="password">Contraseña</label>
        <input class="input" id="password" name="password" type="password" required autocomplete="current-password" />
        <button class="btn" type="submit">Entrar</button>
        <div class="form-error" id="login-error" aria-live="polite"></div>
        <p>¿Solo quieres ver productos? <a href="#" id="guest-link">Entrar como invitado</a></p>
      </form>
    `;
    $('#login-form').onsubmit = async (e) => {
      e.preventDefault();
      const username = $('#username').value.trim();
      const password = $('#password').value;
      const user = USERS.find(u => u.username === username && u.password === password);
      if (user) {
        state.user = { ...user };
        saveSession();
        await loadInventory();
        render();
      } else {
        $('#login-error').textContent = 'Credenciales incorrectas.';
      }
    };
    $('#guest-link').onclick = (e) => {
      e.preventDefault();
      state.user = { role: 'guest', name: 'Invitado' };
      saveSession();
      loadInventory().then(render);
    };
  }

  // --- Cargar inventario ---
  async function loadInventory() {
    setLoading(true);
    try {
      const res = await fetch('data/inventory.json');
      state.inventory = await res.json();
    } catch (e) {
      state.inventory = [];
      showModal('Error al cargar inventario.');
    } finally {
      setLoading(false);
    }
  }

  // --- Render Admin ---
  function renderAdmin() {
    $('#nav-cart').style.display = 'none';
    $('#nav-logout').style.display = '';
    $('#spa-root').innerHTML = `
      <h2>Panel de Administración</h2>
      <button class="btn" id="add-product-btn">Nuevo Producto</button>
      <div id="admin-list"></div>
    `;
    renderProductList('admin-list', state.inventory, true);
    $('#add-product-btn').onclick = () => showProductForm();
  }

  // --- Render User ---
  function renderUser() {
    $('#nav-cart').style.display = '';
    $('#nav-logout').style.display = '';
    $('#spa-root').innerHTML = `
      <h2>Catálogo ElectriksAPPK</h2>
      <div class="form" id="user-filters">
        <input class="input" id="search-name" placeholder="Buscar por nombre..." />
        <select id="search-category"><option value="">Todas las categorías</option></select>
      </div>
      <div id="user-list"></div>
    `;
    fillCategoryOptions('search-category');
    $('#search-name').oninput = () => {
      state.filter.name = $('#search-name').value;
      renderProductList('user-list', filterInventory(), false);
    };
    $('#search-category').onchange = () => {
      state.filter.category = $('#search-category').value;
      renderProductList('user-list', filterInventory(), false);
    };
    renderProductList('user-list', filterInventory(), false);
  }

  // --- Render Guest ---
  function renderGuest() {
    $('#nav-cart').style.display = 'none';
    $('#nav-logout').style.display = '';
    $('#spa-root').innerHTML = `
      <h2>Catálogo ElectriksAPPK (Invitado)</h2>
      <div class="form" id="guest-filters">
        <input class="input" id="search-name" placeholder="Buscar por nombre..." />
        <select id="search-category"><option value="">Todas las categorías</option></select>
      </div>
      <div id="guest-list"></div>
    `;
    fillCategoryOptions('search-category');
    $('#search-name').oninput = () => {
      state.filter.name = $('#search-name').value;
      renderProductList('guest-list', filterInventory(), false);
    };
    $('#search-category').onchange = () => {
      state.filter.category = $('#search-category').value;
      renderProductList('guest-list', filterInventory(), false);
    };
    renderProductList('guest-list', filterInventory(), false);
  }

  // --- Filtros ---
  function filterInventory() {
    let inv = [...state.inventory];
    if (state.filter.name) {
      inv = inv.filter(p => p.name.toLowerCase().includes(state.filter.name.toLowerCase()));
    }
    if (state.filter.category) {
      inv = inv.filter(p => p.category === state.filter.category);
    }
    return inv;
  }
  function fillCategoryOptions(selId) {
    const sel = $('#' + selId);
    const cats = [...new Set(state.inventory.map(p => p.category))];
    sel.innerHTML = '<option value="">Todas las categorías</option>' + cats.map(c => `<option>${c}</option>`).join('');
  }

  // --- Render lista de productos ---
  function renderProductList(containerId, products, adminMode) {
    const cont = $('#' + containerId);
    if (!products.length) {
      cont.innerHTML = '<p>No hay productos.</p>';
      return;
    }
    cont.innerHTML = products.map(p => `
      <div class="card">
        <div class="card-title">${p.name}</div>
        <div class="card-category">${p.category}</div>
        <div class="card-price">$${p.price.toFixed(2)}</div>
        <div>${p.description || ''}</div>
        <div class="card-actions">
          ${adminMode ? `
            <button class="btn secondary" onclick="SPA.editProduct('${p.id}')">Editar</button>
            <button class="btn danger" onclick="SPA.deleteProduct('${p.id}')">Eliminar</button>
          ` : ''}
        </div>
      </div>
    `).join('');
  }

  // --- CRUD Admin ---
  function showProductForm(product = null) {
    const isEdit = !!product;
    const modal = $('#modal');
    modal.innerHTML = `
      <div class="modal-content">
        <form id="product-form">
          <h3>${isEdit ? 'Editar' : 'Nuevo'} Producto</h3>
          <label>Nombre<input class="input" name="name" required value="${product?.name || ''}" /></label>
          <label>Categoría<input class="input" name="category" required value="${product?.category || ''}" /></label>
          <label>Precio<input class="input" name="price" type="number" min="0" step="0.01" required value="${product?.price || ''}" /></label>
          <label>Descripción<textarea class="input" name="description">${product?.description || ''}</textarea></label>
          <div class="form-error" id="form-error"></div>
          <button class="btn" type="submit">${isEdit ? 'Guardar' : 'Crear'}</button>
          <button class="btn secondary" type="button" id="cancel-btn">Cancelar</button>
        </form>
      </div>
    `;
    show(modal);
    $('#cancel-btn').onclick = () => hide(modal);
    $('#product-form').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const data = Object.fromEntries(fd.entries());
      if (!data.name || !data.category || !data.price) {
        $('#form-error').textContent = 'Todos los campos son obligatorios.';
        return;
      }
      data.price = parseFloat(data.price);
      if (isNaN(data.price) || data.price < 0) {
        $('#form-error').textContent = 'Precio inválido.';
        return;
      }
      if (isEdit) {
        updateProduct(product.id, data);
      } else {
        createProduct(data);
      }
      hide(modal);
    };
  }
  function createProduct(data) {
    const id = 'p' + Date.now();
    state.inventory.push({ id, ...data });
    saveInventory();
    render();
  }
  function updateProduct(id, data) {
    const idx = state.inventory.findIndex(p => p.id === id);
    if (idx >= 0) {
      state.inventory[idx] = { ...state.inventory[idx], ...data };
      saveInventory();
      render();
    }
  }
  function deleteProduct(id) {
    if (!confirm('¿Eliminar producto?')) return;
    state.inventory = state.inventory.filter(p => p.id !== id);
    saveInventory();
    render();
  }
  // Exponer para onclick
  window.SPA = {
    editProduct: (id) => {
      const p = state.inventory.find(p => p.id === id);
      if (p) showProductForm(p);
    },
    deleteProduct: (id) => {
      if (state.user.role !== 'admin') {
        showModal('No tienes permisos para eliminar.');
        return;
      }
      deleteProduct(id);
    }
  };

  // --- Guardar inventario (simulado en localStorage) ---
  function saveInventory() {
    localStorage.setItem('electriksappk_inventory', JSON.stringify(state.inventory));
  }
  function loadInventoryFromLocal() {
    const inv = localStorage.getItem('electriksappk_inventory');
    if (inv) state.inventory = JSON.parse(inv);
  }

  // --- Modal ---
  function showModal(msg) {
    const modal = $('#modal');
    modal.innerHTML = `<div class="modal-content"><p>${msg}</p><button class="btn" id="close-modal">Cerrar</button></div>`;
    show(modal);
    $('#close-modal').onclick = () => hide(modal);
  }

  // --- Navegación ---
  $('#nav-logout').onclick = () => {
    state.user = null;
    clearSession();
    render();
  };
  $('#nav-inventory').onclick = () => render();
  $('#nav-cart').onclick = () => showModal('Funcionalidad de carrito próximamente.');

  // --- Inicialización ---
  function init() {
    loadSession();
    loadInventoryFromLocal();
    if (state.user) loadInventory().then(render);
    else render();
  }
  window.addEventListener('DOMContentLoaded', init);

  // --- Accesibilidad: cerrar modal con ESC ---
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide($('#modal'));
  });

  // --- Exponer para pruebas ---
  return {};
})();
