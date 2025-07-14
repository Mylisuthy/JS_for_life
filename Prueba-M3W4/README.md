# 🧠 Registro Interactivo de Estudiantes — JS + DOM + Web Storage

Este proyecto en JavaScript demuestra cómo manipular el DOM, validar datos de entrada, y guardar información en el almacenamiento web (`localStorage` y `sessionStorage`) para una experiencia de usuario interactiva y persistente. A continuación se explica cada bloque del código con comentarios de la creacion y funcion.

---

## Conexión con el DOM

Al principio se referencian todos los elementos del HTML que interactúan con el usuario:

```js
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const clanInput = document.getElementById("clan");
const output = document.getElementById("output");
const errorsDiv = document.getElementById("errors");
const interactionCounterDiv = document.getElementById("interactionCounter");
const saveButton = document.getElementById("saveButton");
const clearButton = document.getElementById("clearButton");
```

Esto permite que el JS sepa con qué etiquetas HTML tiene que trabajar. Así se enlazan los formularios, botones y secciones visibles.

---

## Inicialización de la página (DOMContentLoaded)

Aquí se hace la magia cuando el HTML termina de cargar. Se muestra información previa, se activa el contador de interacciones y se vinculan los botones:

```js
document.addEventListener("DOMContentLoaded", () => {
  displayData();
  initInteractionCount();
  updateInteractionCounter();
  saveButton.addEventListener("click", onSave);
  clearButton.addEventListener("click", onClear);
});
```

---

## Mostrar errores generales

Una función básica para mostrar mensajes dentro de un `div` llamado `errors`, útil para retroalimentar al usuario de forma clara:

```js
function showError(message) {
  errorsDiv.textContent = message;
}
```

---

## Contador de interacciones

Se usa `sessionStorage` para contar cuántas veces el usuario interactúa en una sola sesión. Muy útil para ver actividad en tiempo real:

- `initInteractionCount()`: inicializa el contador si no existe.
- `incrementInteraction()`: aumenta el contador cuando el usuario hace algo.
- `updateInteractionCounter()`: lo muestra actualizado en el DOM.

Todo esto permite dar retroalimentación dinámica sin necesidad de recargar la página.

---

## Mostrar persistencia en consola

Una forma fácil de revisar desde el navegador qué se ha guardado:

```js
function showPersistenceInConsole() {
  const user = localStorage.getItem("user");
  const count = sessionStorage.getItem("interactionCount");
  console.table({ user: user ? JSON.parse(user) : null, session: count });
}
```

---

## Validación de campos y errores por input

Antes de guardar nada, se valida si los datos cumplen reglas específicas:

- Nombre: solo letras y espacios, entre 2 y 30 caracteres.
- Clan: letras y números, también entre 2 y 30.
- Edad: debe ser número entre 1 y 100.

Si algo falla, se muestra el error justo al lado del campo que falló usando clases dinámicas en el HTML.

```js
function showFieldErrors(errors) {
  // Oculta errores anteriores y muestra los nuevos con estilo
}
```

---

## Guardar datos

Esta es la función principal que ocurre al hacer clic en "Guardar":

1. Valida los campos.
2. Si todo está bien:
   - Guarda los datos en `localStorage`.
   - Limpia los campos.
   - Muestra mensaje de éxito.
   - Incrementa interacción.
   - Actualiza lo que se ve en la pantalla.

```js
function onSave() {
  ...
}
```

---

## Borrar datos

Simple pero funcional. Borra los datos del usuario en `localStorage`, actualiza la vista, y cuenta la acción como una interacción.

```js
function onClear() {
  localStorage.removeItem('user');
  ...
}
```

---

## Mostrar datos en pantalla

Extrae lo que haya en `localStorage` y lo muestra bonito en el DOM. Si no hay nada, avisa que no hay datos.

```js
function displayData() {
  ...
}
```

---

## Conexión con HTML

Este script está pensado para un formulario con inputs `name`, `age`, `clan`, y botones `Guardar` y `Limpiar`. También usa elementos con `id="output"`, `id="errors"` y `id="interactionCounter"` para mostrar resultados y mensajes.

> Así el HTML actúa como la interfaz visual, y este JS como el cerebro que decide qué hacer con cada acción.
