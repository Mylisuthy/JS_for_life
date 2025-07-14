// src/services/auth.js
// Lógica de autenticación: login, registro, logout, protección de rutas
import { saveUserSession, getUserSession, clearUserSession } from '../utils/storage.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

const API_URL = 'http://localhost:3000/users';

export async function login(email, password) {
  if (!validateEmail(email) || !validatePassword(password)) {
    throw new Error('Credenciales inválidas');
  }
  const res = await fetch(`${API_URL}?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  const users = await res.json();
  if (users.length === 1) {
    saveUserSession(users[0]);
    return users[0];
  } else {
    throw new Error('Correo o contraseña incorrectos');
  }
}

export async function register(userData) {
  // userData: {name, email, password, phone}
  // Validar campos mínimos
  if (!validateEmail(userData.email) || !validatePassword(userData.password) || !userData.name || !userData.phone) {
    throw new Error('Datos inválidos');
  }
  // Verificar si ya existe el email
  const res = await fetch(`${API_URL}?email=${encodeURIComponent(userData.email)}`);
  const users = await res.json();
  if (users.length > 0) {
    throw new Error('El correo ya está registrado');
  }
  // Generar datos adicionales
  const newUser = {
    ...userData,
    role: 'visitor',
    enrollNumber: Date.now().toString(),
    dateOfAdmission: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  };
  const createRes = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser)
  });
  if (!createRes.ok) throw new Error('Error al registrar usuario');
  const created = await createRes.json();
  saveUserSession(created);
  return created;
}

export function logout() {
  clearUserSession();
  window.location.href = './login.html';
}

export function requireAuth(role = null) {
  const session = getUserSession();
  if (!session) {
    window.location.href = './login.html';
    return false;
  }
  if (role && session.role !== role) {
    // Redirigir según rol
    window.location.href = session.role === 'admin' ? './dashboard.html' : './public.html';
    return false;
  }
  return true;
}

export function getCurrentUser() {
  return getUserSession();
}
