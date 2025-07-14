// src/components/sidebar.js
// Sidebar contextual según el rol
import { getCurrentUser } from '../services/auth.js';

export function renderSidebar() {
  const user = getCurrentUser();
  const sidebar = document.createElement('aside');
  sidebar.className = 'main-sidebar';
  if (user && user.role === 'admin') {
    sidebar.innerHTML = `
      <nav>
        <ul>
          <li><a href="dashboard.html">Dashboard</a></li>
          <li><a href="dashboard.html#usuarios">Usuarios</a></li>
          <li><a href="dashboard.html#cursos">Cursos</a></li>
        </ul>
      </nav>
    `;
  } else {
    sidebar.innerHTML = `
      <nav>
        <ul>
          <li><a href="public.html">Cursos disponibles</a></li>
          <li><a href="public.html#mis-cursos">Mis cursos</a></li>
        </ul>
      </nav>
    `;
  }
  document.body.prepend(sidebar);
}
