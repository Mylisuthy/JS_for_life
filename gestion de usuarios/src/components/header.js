// src/components/header.js
// Header con sesión activa y botón de logout
import { getCurrentUser, logout } from '../services/auth.js';

export function renderHeader() {
  const user = getCurrentUser();
  const header = document.createElement('header');
  header.className = 'main-header';
  header.innerHTML = `
    <div class="header-content">
      <span class="app-title">Gestión de Usuarios y Cursos</span>
      <div class="header-user">
        <span>${user ? user.name : ''} (${user ? user.role : ''})</span>
        <button id="logoutBtn">Cerrar sesión</button>
      </div>
    </div>
  `;
  document.body.prepend(header);
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = logout;
  }
}
