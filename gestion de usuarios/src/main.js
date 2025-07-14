// main.js - Punto de entrada de la SPA
import { login, register, getCurrentUser } from './services/auth.js';
import { validateEmail, validatePassword, validatePhone, showError, hideError } from './utils/validation.js';
import { initRouter, renderRoute } from './router.js';
import { getEnrollmentsByUser, enrollUserToCourse, removeEnrollment } from './services/enrollments.js';
import { renderSidebar } from './components/sidebar.js';
import { getUsers, createUser, updateUser, deleteUser } from './services/users.js';
import { getCourses, createCourse, updateCourse, deleteCourse } from './services/courses.js';
import { showModal, closeModal } from './components/modal.js';


// --- LOGIN SPA ---
window.initLoginForm = function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError('loginError');
      const email = loginForm.email.value.trim();
      const password = loginForm.password.value;
      if (!validateEmail(email)) {
        showError('loginError', 'Correo inválido');
        return;
      }
      if (!validatePassword(password)) {
        showError('loginError', 'Contraseña inválida (mínimo 6 caracteres)');
        return;
      }
      try {
        const user = await login(email, password);
        // Redirige según rol
        window.location.href = user.role === 'admin' ? './dashboard.html' : './public.html';
      } catch (err) {
        showError('loginError', err.message);
      }
    });
  }
};

// --- REGISTRO SPA ---
window.initRegisterForm = function() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideError('registerError');
      const name = registerForm.name.value.trim();
    const email = registerForm.email.value.trim();
    const password = registerForm.password.value;
    const phone = registerForm.phone.value.trim();
    if (!name) {
      showError('registerError', 'El nombre es obligatorio');
      return;
    }
    if (!validateEmail(email)) {
      showError('registerError', 'Correo inválido');
      return;
    }
    if (!validatePassword(password)) {
      showError('registerError', 'Contraseña inválida (mínimo 6 caracteres)');
      return;
    }
    if (!validatePhone(phone)) {
      showError('registerError', 'Teléfono inválido (10 dígitos)');
      return;
    }
    try {
      const user = await register({ name, email, password, phone });
      window.location.href = './public.html';
    } catch (err) {
      showError('registerError', err.message);
    }
  });
}

// --- Redirección automática si ya hay sesión ---
const currentUser = getCurrentUser();
const currentPath = window.location.pathname;
if (currentUser) {
  if (currentPath.endsWith('login.html') || currentPath.endsWith('register.html')) {
    window.location.href = currentUser.role === 'admin' ? './dashboard.html' : './public.html';
  }
}

// --- Inyección de header y sidebar, y protección de rutas ---
import { renderHeader } from './components/header.js';

function isDashboard() {
  return currentPath.endsWith('dashboard.html');
}
function isPublic() {
  return currentPath.endsWith('public.html');
}

if (isDashboard()) {
  // Solo admin puede ver dashboard
  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = './login.html';
  } else {
    renderHeader();
    renderSidebar();
  }
}


// --- DASHBOARD: Renderizado de usuarios y cursos ---
if (isDashboard() && currentUser && currentUser.role === 'admin') {
  renderUsersTable();
  renderCoursesTable();

  // Botón agregar usuario
  document.getElementById('addUserBtn').onclick = () => openUserForm();
  // Botón agregar curso
  document.getElementById('addCourseBtn').onclick = () => openCourseForm();
}

async function renderUsersTable() {
  const users = await getUsers();
  const container = document.getElementById('usersTableContainer');
  if (!container) return;
  let html = `<table class="data-table"><thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Teléfono</th><th>Acciones</th></tr></thead><tbody>`;
  users.forEach(user => {
    html += `<tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.phone}</td>
      <td>
        <button class="editUserBtn" data-id="${user.id}">Editar</button>
        <button class="deleteUserBtn" data-id="${user.id}">Eliminar</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  // Eventos editar/eliminar
  container.querySelectorAll('.editUserBtn').forEach(btn => {
    btn.onclick = () => openUserForm(+btn.dataset.id);
  });
  container.querySelectorAll('.deleteUserBtn').forEach(btn => {
    btn.onclick = async () => {
      if (confirm('¿Eliminar usuario?')) {
        await deleteUser(+btn.dataset.id);
        renderUsersTable();
      }
    };
  });
}

function openUserForm(userId = null) {
  let user = { name: '', email: '', password: '', phone: '', role: 'visitor' };
  let isEdit = false;
  if (userId) {
    isEdit = true;
    getUsers().then(users => {
      user = users.find(u => u.id === userId);
      showUserForm(user, isEdit);
    });
  } else {
    showUserForm(user, isEdit);
  }
}

function showUserForm(user, isEdit) {
  showModal(`
    <form id="userForm">
      <h3>${isEdit ? 'Editar' : 'Agregar'} Usuario</h3>
      <label>Nombre<input type="text" name="name" value="${user.name || ''}" required></label>
      <label>Email<input type="email" name="email" value="${user.email || ''}" required></label>
      <label>Contraseña<input type="password" name="password" value="" ${isEdit ? '' : 'required'}></label>
      <label>Teléfono<input type="tel" name="phone" value="${user.phone || ''}" required pattern="[0-9]{10}"></label>
      <label>Rol
        <select name="role">
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="visitor" ${user.role === 'visitor' ? 'selected' : ''}>Visitante</option>
        </select>
      </label>
      <button type="submit">${isEdit ? 'Actualizar' : 'Crear'}</button>
    </form>
  `);
  document.getElementById('userForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      role: form.role.value,
    };
    if (form.password.value) formData.password = form.password.value;
    if (isEdit) {
      await updateUser(user.id, { ...user, ...formData });
    } else {
      formData.enrollNumber = Date.now().toString();
      formData.dateOfAdmission = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
      await createUser(formData);
    }
    closeModal();
    renderUsersTable();
  };
}

async function renderCoursesTable() {
  const courses = await getCourses();
  const container = document.getElementById('coursesTableContainer');
  if (!container) return;
  let html = `<table class="data-table"><thead><tr><th>Título</th><th>Descripción</th><th>Inicio</th><th>Duración</th><th>Acciones</th></tr></thead><tbody>`;
  courses.forEach(course => {
    html += `<tr>
      <td>${course.title}</td>
      <td>${course.description}</td>
      <td>${course.startDate}</td>
      <td>${course.duration}</td>
      <td>
        <button class="editCourseBtn" data-id="${course.id}">Editar</button>
        <button class="deleteCourseBtn" data-id="${course.id}">Eliminar</button>
      </td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
  // Eventos editar/eliminar
  container.querySelectorAll('.editCourseBtn').forEach(btn => {
    btn.onclick = () => openCourseForm(+btn.dataset.id);
  });
  container.querySelectorAll('.deleteCourseBtn').forEach(btn => {
    btn.onclick = async () => {
      if (confirm('¿Eliminar curso?')) {
        await deleteCourse(+btn.dataset.id);
        renderCoursesTable();
      }
    };
  });
}

function openCourseForm(courseId = null) {
  let course = { title: '', description: '', startDate: '', duration: '' };
  let isEdit = false;
  if (courseId) {
    isEdit = true;
    getCourses().then(courses => {
      course = courses.find(c => c.id === courseId);
      showCourseForm(course, isEdit);
    });
  } else {
    showCourseForm(course, isEdit);
  }
}

function showCourseForm(course, isEdit) {
  showModal(`
    <form id="courseForm">
      <h3>${isEdit ? 'Editar' : 'Agregar'} Curso</h3>
      <label>Título<input type="text" name="title" value="${course.title || ''}" required></label>
      <label>Descripción<input type="text" name="description" value="${course.description || ''}" required></label>
      <label>Fecha de Inicio<input type="date" name="startDate" value="${course.startDate || ''}" required></label>
      <label>Duración<input type="text" name="duration" value="${course.duration || ''}" required></label>
      <button type="submit">${isEdit ? 'Actualizar' : 'Crear'}</button>
    </form>
  `);
  document.getElementById('courseForm').onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      startDate: form.startDate.value,
      duration: form.duration.value.trim(),
    };
    if (isEdit) {
      await updateCourse(course.id, { ...course, ...formData });
    } else {
      await createCourse(formData);
    }
    closeModal();
    renderCoursesTable();
  };
}

if (isPublic()) {
  // Solo visitante puede ver public
  if (!currentUser || currentUser.role !== 'visitor') {
    window.location.href = './login.html';
  } else {
    renderHeader();
    renderSidebar();
    renderAvailableCourses();
    renderMyEnrollments();
  }
}


async function renderAvailableCourses() {
  const courses = await getCourses();
  const enrollments = await getEnrollmentsByUser(currentUser.id);
  const enrolledCourseIds = enrollments.map(e => e.courseId);
  const container = document.getElementById('coursesListContainer');
  if (!container) return;
  let html = '<ul class="courses-list">';
  courses.forEach(course => {
    const isEnrolled = enrolledCourseIds.includes(course.id);
    html += `<li class="course-item">
      <h4>${course.title}</h4>
      <p>${course.description}</p>
      <span>Inicio: ${course.startDate} | Duración: ${course.duration}</span><br>
      <button class="enrollBtn" data-id="${course.id}" ${isEnrolled ? 'disabled' : ''}>
        ${isEnrolled ? 'Inscrito' : 'Inscribirse'}
      </button>
    </li>`;
  });

  html += '</ul>';
  container.innerHTML = html;
  container.querySelectorAll('.enrollBtn').forEach(btn => {
    btn.onclick = async () => {
      try {
        await enrollUserToCourse(currentUser.id, +btn.dataset.id);
        renderAvailableCourses();
        renderMyEnrollments();
      } catch (err) {
        alert(err.message);
      }
    };
  });
}

async function renderMyEnrollments() {
  const enrollments = await getEnrollmentsByUser(currentUser.id);
  const courses = await getCourses();
  const container = document.getElementById('myEnrollmentsContainer');
  if (!container) return;
  if (enrollments.length === 0) {
    container.innerHTML = '<p>No estás inscrito en ningún curso.</p>';
    return;
  }
  let html = '<ul class="my-courses-list">';
  enrollments.forEach(enr => {
    const course = courses.find(c => c.id === enr.courseId);
    if (!course) return;
    html += `<li class="my-course-item">
      <h4>${course.title}</h4>
      <span>Inicio: ${course.startDate} | Duración: ${course.duration}</span>
      <button class="unenrollBtn" data-id="${enr.id}">Cancelar inscripción</button>
    </li>`;
  });
  html += '</ul>';
  container.innerHTML = html;
  container.querySelectorAll('.unenrollBtn').forEach(btn => {
    btn.onclick = async () => {
      if (confirm('¿Cancelar inscripción a este curso?')) {
        await removeEnrollment(+btn.dataset.id);
        renderAvailableCourses();
        renderMyEnrollments();
      }
    };
  });
}