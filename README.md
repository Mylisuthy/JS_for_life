
# 📋 Task Manager - Gestión de Tareas con LocalStorage y JavaScript

Este proyecto es una aplicación simple de gestión de tareas que permite al usuario:
- Añadir tareas con validación de entrada.
- Guardarlas en `localStorage`.
- Mostrar tareas creadas en las últimas 24 horas.
- Visualizar y ocultar todas las tareas agregadas.

## 🧠 ¿Qué conocimientos demuestra este proyecto?

- Manipulación del DOM con JavaScript
- Almacenamiento persistente con `localStorage`
- Uso de `Date.now()` y timestamps para validación de tiempo
- Manejo de eventos (`addEventListener`)
- Buenas prácticas con funciones reutilizables
- Separación de lógica, estructura y estilo (si usas CSS aparte)

## 📂 Estructura del Código

### 1. Inicialización de datos

```javascript
let listaTareas = JSON.parse(localStorage.getItem("tareas")) || [];
```

Carga las tareas guardadas en el navegador desde `localStorage`.  
Si no hay tareas, se crea una lista inicial con sugerencias predeterminadas.

```javascript
if (!Array.isArray(listaTareas) || listaTareas.length === 0) {
  listaTareas = [ { texto: "Ejemplo", timestamp: Date.now() }, ... ];
  localStorage.setItem("tareas", JSON.stringify(listaTareas));
}
```

### 2. Referencias a elementos del DOM

```javascript
const btnValidar = document.getElementById("btnValidar");
const inputTarea = document.getElementById("inputTarea");
const mensaje = document.getElementById("mensajeValidacion");
```

### 3. Filtrar tareas de las últimas 24 horas

```javascript
function getRecentTasks() {
  const now = Date.now();
  return listaTareas.filter(t => now - t.timestamp < 86400000);
}
```

### 4. Mostrar tareas recientes

```javascript
function showRecentTasks() {
  const recentTasks = getRecentTasks();
  const taskContainer = document.getElementById("tareaReciente");

  if (recentTasks.length === 0) {
    taskContainer.style.display = "none";
    return;
  }

  taskContainer.innerHTML = "<ul>...</ul>";
  taskContainer.style.display = "block";
}
```

### 5. Añadir nueva tarea (evento de botón)

```javascript
btnValidar.addEventListener("click", (event) => {
  event.preventDefault();
  const value = inputTarea.value.trim();

  if (!value) {
    mensaje.textContent = "*Por favor, introduzca una tarea antes de añadir.";
    mensaje.className = "error";
  } else {
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

    mensaje.textContent = "¡Tarea añadida con éxito!";
    mensaje.className = "ok";

    setTimeout(() => {
      mensaje.textContent = "";
      mensaje.className = "";
    }, 2000);
  }
});
```

### 6. Mostrar/Ocultar todas las tareas

```javascript
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
```

### 7. Cargar tareas al iniciar

```javascript
document.addEventListener("DOMContentLoaded", () => {
  mostrarTareasRecientes();
});
```

## ❓ Posibles preguntas técnicas (y respuestas)

| Pregunta | Respuesta |
|---------|-----------|
| ¿Qué es `localStorage` y por qué lo usas? | Es una API del navegador para almacenar datos persistentes. Se usa aquí para guardar las tareas incluso si el usuario recarga la página. |
| ¿Qué hace `Date.now()`? | Devuelve la fecha actual en milisegundos desde el 1 de enero de 1970 (Unix epoch). Se usa para calcular si una tarea es reciente. |
| ¿Cómo filtras las tareas de las últimas 24 horas? | Restando `Date.now()` - `timestamp` y verificando si es menor que `86400000` (24 horas en milisegundos). |
| ¿Qué pasa si el usuario intenta añadir una tarea vacía? | Se muestra un mensaje de error y no se guarda nada. |
| ¿Cómo se limpia el campo de texto después de añadir? | Con `inputTarea.value = "";` |
| ¿Qué pasaría si no actualizas el `localStorage`? | Las tareas nuevas se perderían al recargar la página. |
| ¿Dónde se actualiza visualmente la lista? | En `showRecentTasks()` y `mostrarTodasLasTareas()`, que manipulan el DOM. |

## 💡 Siguientes mejoras sugeridas

- Permitir eliminar tareas individualmente.
- Añadir un sistema de categorías o etiquetas.
- Agregar persistencia con `indexedDB` o un backend real.
- Mostrar fecha completa además de la hora.
