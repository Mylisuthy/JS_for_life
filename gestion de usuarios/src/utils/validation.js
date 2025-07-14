// src/utils/validation.js
// Funciones de validación de formularios

export function validateEmail(email) {
  // Validación básica de email
  return /^\S+@\S+\.\S+$/.test(email);
}

export function validatePassword(password) {
  // Al menos 6 caracteres
  return typeof password === 'string' && password.length >= 6;
}

export function validatePhone(phone) {
  // 10 dígitos numéricos
  return /^[0-9]{10}$/.test(phone);
}

export function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
}

export function hideError(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = '';
    el.style.display = 'none';
  }
}
