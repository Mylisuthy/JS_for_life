// ——————————————————————————————
// manipulación de DOM y persistencia
// ——————————————————————————————

/**
 * Referencias a elementos del DOM
 */
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const clanInput = document.getElementById('clan');
const output = document.getElementById('output');
const errorsDiv = document.getElementById('errors');
const interactionCounterDiv = document.getElementById('interactionCounter');
const saveButton = document.getElementById('saveButton');
const clearButton = document.getElementById('clearButton');

/**
 * Inicializa la página:
 *  - muestra datos si existen
 *  - inicializa contador en SessionStorage
 *  - registra handlers de botón
 */
document.addEventListener('DOMContentLoaded', () => {
  displayData(); // muestra lo almacenado
  initInteractionCount(); // prepara contador
  updateInteractionCounter(); // muestra contador en DOM

  saveButton.addEventListener('click', onSave);
  clearButton.addEventListener('click', onClear);
});

/**
 * Muestra un mensaje de error en el DOM dentro del div #errors.
 * @param {string} message - Mensaje de error a mostrar.
 */
function showError(message) {
  errorsDiv.textContent = message;
}

/**
 * Inicializa el contador de interacciones en SessionStorage.
 */
function initInteractionCount() {
  if (!sessionStorage.getItem('interactionCount')) {
    sessionStorage.setItem('interactionCount', '0');
  }
  updateInteractionCounter();
  console.log('SessionStorage inicial:', sessionStorage.getItem('interactionCount'));
}

/**
 * Incrementa el contador de interacciones en SessionStorage.
 * Este método se llama cada vez que el usuario interactúa con la página.
 */
function incrementInteraction() {
  let count = parseInt(sessionStorage.getItem('interactionCount'), 10) || 0;
  count++;
  sessionStorage.setItem('interactionCount', String(count));
  updateInteractionCounter();
  console.log(`Interacciones en esta sesión: ${count}`);
}

/**
 * Actualiza el contador de interacciones en el DOM.
 */
function updateInteractionCounter() {
  const count = sessionStorage.getItem('interactionCount') || '0';
  interactionCounterDiv.textContent = `Interacciones en esta sesión: ${count}`;
}

/**
 * Muestra la persistencia de datos en consola.
 */
function showPersistenceInConsole() {
  const user = localStorage.getItem('user');
  const count = sessionStorage.getItem('interactionCount');
  console.table({ user: user ? JSON.parse(user) : null, session: count });
}

/**
 * Muestra un mensaje de error en el DOM junto al campo que causó el error.
 * Si hay múltiples errores, los muestra en sus respectivos campos.
 * @param {Object} errors - Un objeto con claves como IDs de los inputs y valores como mensajes de error.
 */
function showFieldErrors(errors) {
  // Limpiar errores previos
  document.querySelectorAll('.error-message').forEach((errorElement) => {
    errorElement.style.display = 'none';
    const inputGroup = errorElement.closest('.input-group');
    if (inputGroup) {
      inputGroup.style.marginBottom = '20px'; // Restaurar margen normal
    }
  });

  // Mostrar nuevos errores
  Object.entries(errors).forEach(([fieldId, message]) => {
    const errorElement = document.getElementById(`error-${fieldId}`);
    const inputGroup = errorElement.closest('.input-group');
    if (errorElement && inputGroup) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      inputGroup.style.marginBottom = '5px'; // Reducir margen cuando hay error
    }
  });
}

/**
 * Maneja el evento de guardar datos en LocalStorage.
 * Vacía los campos de entrada tras guardar y muestra un mensaje informativo.
 */
function onSave() {
  const name = nameInput.value.trim();
  const clan = clanInput.value.trim();
  const age = parseInt(ageInput.value, 10);

  // Validaciones
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,30}$/;
  const regexClan = /^[A-Za-z0-9 ]{2,30}$/;

  const errors = {};

  if (!regexNombre.test(name)) {
    errors['name'] = 'Nombre inválido (solo letras y espacios, mínimo 2 caracteres y un máximo de 30).';
    console.error('Validación nombre fallida:', name);
  }

  if (!regexClan.test(clan)) {
    errors['clan'] = 'Clan inválido (solo letras, números y espacios, 2-30 caracteres).';
    console.error('Validación clan fallida:', clan);
  }

  if (isNaN(age) || age < 1 || age > 100) {
    errors['age'] = 'Edad inválida (número entero entre 1 y 100).';
    console.error('Validación edad fallida:', ageInput.value);
  }

  if (Object.keys(errors).length > 0) {
    incrementInteraction(); // Incrementar contador por error
    showFieldErrors(errors);
    return;
  }

  // Limpiar errores si todo es válido
  showFieldErrors({});

  // Guardar datos en LocalStorage
  const user = { name, clan, age };
  localStorage.setItem('user', JSON.stringify(user));
  console.log('Guardado en LocalStorage →', user);

  // Vaciar campos de entrada
  nameInput.value = '';
  clanInput.value = '';
  ageInput.value = '';

  // Mostrar mensaje informativo
  showError('Datos guardados correctamente.');

  // Actualizar interacción y DOM
  incrementInteraction();
  displayData();
  updateInteractionCounter();
  showPersistenceInConsole();
}

/**
 * Maneja el evento de limpiar datos en LocalStorage.
 */
function onClear() {
  localStorage.removeItem('user');
  console.log('LocalStorage: clave "user" eliminada');

  incrementInteraction();
  displayData();
  updateInteractionCounter();
  showPersistenceInConsole();
}

/**
 * Muestra los datos almacenados en LocalStorage en el DOM.
 * Si no hay datos, muestra un mensaje por defecto.
 */
function displayData() {
  // Limpiar hijos anteriores
  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  const raw = localStorage.getItem('user');
  if (raw) {
    const { name, clan, age } = JSON.parse(raw);
    const p = document.createElement('p');
    p.textContent = `¡Qué tal ${name}! del clan ${clan}. Tenés ${age} años.`;
    output.appendChild(p);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No hay datos almacenados.';
    output.appendChild(p);
  }

  // Mostrar persistencia en consola
  showPersistenceInConsole();
}