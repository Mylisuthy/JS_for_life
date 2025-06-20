// ----- Task Initialization -----
let listaTareas = JSON.parse(localStorage.getItem("tareas")) || [];

if (!Array.isArray(listaTareas) || listaTareas.length === 0) {
  listaTareas = [
    { texto: "Definir metas claras", timestamp: Date.now() },
    { texto: "Identificar prioridades semanales", timestamp: Date.now() },
    { texto: "Elegir una herramienta de organización", timestamp: Date.now() },
    { texto: "Planificar tu día la noche anterior", timestamp: Date.now() },
    { texto: "Priorizar tus tareas en orden de importancia", timestamp: Date.now() },
    { texto: "Eliminar distracciones", timestamp: Date.now() },
    { texto: "Tomar descansos regulares", timestamp: Date.now() },
    { texto: "Completar tareas pequeñas rápidamente", timestamp: Date.now() },
    { texto: "Revisar y reflexionar sobre tu día al final", timestamp: Date.now() }
  ];
  localStorage.setItem("tareas", JSON.stringify(listaTareas));
}

// ----- 1. Conditional Greeting Button -----
function saludar() {
  const hora = new Date().getHours();
  let mensaje = "";

  if (hora < 12) {
    mensaje = "¡Buenos días, princesitas!";
  } else if (hora < 18) {
    mensaje = "¡Buenas tardes, caballeros 😎!";
  } else {
    mensaje = "¡Buenas noches, personas trans! 😴";
  }

  document.getElementById("saludoResultado").textContent = mensaje;
}

// ----- 2. Dark Mode Toggle -----
document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('darkModeToggle');
  const body = document.body;

  // Changes the icon based on the current mode
  const setIcon = (isDarkMode) => {
    toggleButton.textContent = isDarkMode ? '☀️' : '🌙';
  };

  // Changes the icon based on the current mode
  const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
  if (darkModeEnabled) {
    body.classList.add('dark-mode');
  }
  
  setIcon(darkModeEnabled);

  toggleButton.addEventListener('click', function () {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    setIcon(isDark);
  });

  body.classList.add('ready');
});

// ----- 3. Task Management Functions -----

// DOM references
const btnValidar = document.getElementById("btnValidar");
const inputTarea = document.getElementById("inputTarea");
const mensaje = document.getElementById("mensajeValidacion");

// Filter tasks created in the last 24 hours
function getRecentTasks() {
  const now = Date.now();
  return listaTareas.filter(t => now - t.timestamp < 86400000);
}

// Display recent tasks on the screen
function showRecentTasks() {
  const recentTasks = getRecentTasks();
  const taskContainer = document.getElementById("tareaReciente");

  if (recentTasks.length === 0) {
    taskContainer.style.display = "none";
    return;
  }

  taskContainer.innerHTML = "<strong>Tareas recientes (últimas 24h):</strong><ul>" +
    recentTasks.map(t => {
      const time = new Date(t.timestamp).toLocaleTimeString('es-CO', {
        hour: '2-digit', minute: '2-digit'
      });
      return `<li>${t.texto} <span style="color:gray;">(${time})</span></li>`;
    }).join("") +
    "</ul>";

  taskContainer.style.display = "block";
}

// Handle task submission
btnValidar.addEventListener("click", (event) => {
  event.preventDefault();

  const value = inputTarea.value.trim();

  if (!value) {
    mensaje.textContent = "*Por favor, introduzca una tarea antes de añadir.";
    mensaje.className = "error";
  } else {
    mensaje.textContent = "¡Tarea añadida con éxito!";
    mensaje.className = "ok";

    const newTask = {
      texto: value,
      timestamp: Date.now()
    };

    listaTareas.push(newTask);
    localStorage.setItem("tareas", JSON.stringify(listaTareas));
    inputTarea.value = "";

    showRecentTasks();
    mostrarTodasLasTareas();
    limpiarTareasViejas();

    setTimeout(() => {
      mensaje.textContent = "";
      mensaje.className = "";
    }, 2000);
  }
});

// ----- 4. Weekly Task Display -----
const btnMostrarTareas = document.getElementById('mostrarTareas');
const btnOcultarTareas = document.getElementById('ocultarTareas');
const tareas = document.getElementById('listaTareas');

function mostrarTodasLasTareas() {
  tareas.innerHTML = "";

  listaTareas.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t.texto;
    tareas.appendChild(li);
  });

  tareas.style.display = "block";
}

btnMostrarTareas.addEventListener("click", mostrarTodasLasTareas);

btnOcultarTareas.addEventListener('click', () => {
  tareas.style.display = "none";
});

// ----- 5. Task Counter -----
let cont = 0;

const contador = document.getElementById("contador");
const btnIncrementar = document.getElementById("sumar");
const btnDecrementar = document.getElementById("restar");
const btnResetear = document.getElementById("resetear");

btnIncrementar.addEventListener("click", () => {
  cont++;
  contador.innerHTML = cont;
});

btnDecrementar.addEventListener("click", () => {
  if (cont > 0) {
    cont--;
    contador.innerHTML = cont;
  }
});

btnResetear.addEventListener("click", () => {
  cont = 0;
  contador.innerHTML = cont;
});

// ----- 6. Random Productivity Tip -----
const tips = [
  "Organiza tu día en bloques de tiempo.",
  "Tómate pausas activas cada 45 minutos.",
  "Empieza por lo más difícil de tu lista.",
  "Cierra pestañas que no estés usando.",
  "Evita el multitasking, enfócate en una sola cosa.",
  "Usa la regla de los dos minutos para tareas rápidas.",
  "Apaga notificaciones cuando trabajes en algo importante.",
  "Revisa tus pendientes antes de terminar el día."
];

const tipTexto = document.getElementById("tip");
const btnTip = document.getElementById("btnTip");

btnTip.addEventListener("click", () => {
  const indice = Math.floor(Math.random() * tips.length);
  tipTexto.textContent = tips[indice];
});

document.addEventListener("DOMContentLoaded", () => {
  mostrarTareasRecientes();
});