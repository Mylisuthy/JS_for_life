// src/utils/storage.js
// Funciones para manejar la sesión en localStorage

const SESSION_KEY = 'spa-gestion-usuario-session';

export function saveUserSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getUserSession() {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearUserSession() {
  localStorage.removeItem(SESSION_KEY);
}
