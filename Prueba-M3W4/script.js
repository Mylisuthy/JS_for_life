// ——————————————————————————————
// Escuelita Riwi: manipulación de DOM y persistencia
// Requisitos Moodle: getItem/setItem/removeItem, LSS, SS, DOM dinámico.
// ——————————————————————————————

/**
 * Inicializa la página:
 *  - muestra datos si existen
 *  - inicializa contador en SessionStorage
 *  - registra handlers de botón
 */
document.addEventListener('DOMContentLoaded', () => {
  displayData();           // muestra lo almacenado
  initInteractionCount();  // prepara contador
  document.getElementById('saveButton')
          .addEventListener('click', onSave);
  document.getElementById('clearButton')
          .addEventListener('click', onClear);
});

/**
 * Toma inputs, valida y si ok:
 *  - guarda en LocalStorage
 *  - actualiza contador
 *  - refresca DOM
 */
function onSave() {
  const nameInput = document.getElementById('name');
  const ageInput  = document.getElementById('age');

  const name = nameInput.value.trim();
  const age  = parseInt(ageInput.value, 10);

  // validaciones básicas
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  if (!regexNombre.test(name)) {
    alert('Nombre inválido (solo letras y espacios, mínimo 2 caracteres).');
    console.error('Validación nombre fallida:', name);
    return;
  }
  if (isNaN(age) || age < 1 || age > 120) {
    alert('Edad inválida (número entero entre 1 y 120).');
    console.error('Validación edad fallida:', ageInput.value);
    return;
  }

  // guardo solo una clave “user” en LS
  const user = { name, age };
  localStorage.setItem('user', JSON.stringify(user));
  console.log('Guardado en LocalStorage →', user);

  incrementInteraction();
  displayData();
}

/**
 * Limpia solo la clave `user` de LocalStorage,
 * refresca DOM y cuenta en SessionStorage.
 */
function onClear() {
  localStorage.removeItem('user');
  console.log('LocalStorage: clave "user" eliminada');
  incrementInteraction();
  displayData();
}

/**
 * Lee LocalStorage y pinta en DOM usando createElement/appends.
 * Si no hay datos muestra mensaje por defecto.
 */
function displayData() {
  const output = document.getElementById('output');
  // limpio cualquier hijo anterior
  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  const raw = localStorage.getItem('user');
  if (raw) {
    const { name, age } = JSON.parse(raw);
    const p = document.createElement('p');
    p.textContent = `¡Hola ${name}! Tenés ${age} años.`;
    output.appendChild(p);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No hay datos almacenados.';
    output.appendChild(p);
  }

  console.log('Display actualizado. LS =', localStorage.getItem('user'));
}

/**
 * Inicializa contador de interacciones en SessionStorage
 * (clave exacta: "interactionCount")
 */
function initInteractionCount() {
  if (!sessionStorage.getItem('interactionCount')) {
    sessionStorage.setItem('interactionCount', '0');
  }
  console.log('SessionStorage inicial:', sessionStorage.getItem('interactionCount'));
}

/**
 * Incrementa en +1 el contador y lo guarda en SessionStorage.
 */
function incrementInteraction() {
  let count = parseInt(sessionStorage.getItem('interactionCount'), 10) || 0;
  count++;
  sessionStorage.setItem('interactionCount', String(count));
  console.log(`Interacciones en esta sesión: ${count}`);
}
