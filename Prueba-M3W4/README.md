# README – Escuelita Riwi

> **Propósito**  
> Este proyecto es una práctica de manipulación del DOM y persistencia de datos en el navegador, organizada paso a paso para demostrar:
>
> 1. **Selección y modificación** de elementos en la página (DOM).
> 2. **Validación** de formularios.
> 3. **Almacenamiento** con LocalStorage (persistente) y SessionStorage (por sesión).
> 4. **Buenas prácticas**: modularidad, comentarios y estructuras reutilizables.

---

## 📁 Estructura de archivos

```
/ (raíz)
├── index.html       # Formulario y contenedor de resultados
└── script.js        # Lógica JavaScript comentada y modular
```

---

## 🔍 index.html explicado

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Escuelita Riwi</title>
</head>
<body>

  <!-- 1. Formulario de entrada -->
  <form id="userForm">
    <label for="name">nombre:</label>
    <input type="text" id="name" name="name" required>

    <label for="age">edad:</label>
    <input type="number" id="age" name="age" required>

    <button type="button" id="saveButton">Guardar Datos</button>
    <button type="button" id="clearButton">Limpiar Datos</button>
  </form>

  <!-- 2. Contenedor de salida -->
  <div id="output"></div>

  <!-- 3. Enlace al script principal -->
  <script src="script.js"></script>
</body>
</html>
```

| Línea | Descripción                                                                                             |
|-------|---------------------------------------------------------------------------------------------------------|
| 1     | `<!DOCTYPE html>`: indica HTML5.                                                                        |
| 2     | `<html lang="es">`: define el idioma para accesibilidad y SEO.                                           |
| 6–14  | `<form id="userForm">…</form>`: agrupa campos de entrada.                                               |
| 7–8   | `<input id="name">`, `<input id="age">`: recolectan nombre y edad, ambos obligatorios.                 |
| 10–11 | Botones con `type="button"` para manejar eventos sin recargar la página.                                |
| 14    | `<div id="output">`: contenedor donde inyectamos mensajes con JavaScript.                                |
| 16    | `<script src="script.js">`: enlaza el archivo con toda la lógica JS.                                    |

---

## 🛠 script.js explicado línea a línea

```js
// —————————————————————————————————————————————————————————————
// Escuelita Riwi: DOM + LocalStorage + SessionStorage
// Versión mejorada: modular, comentada y validada.
// —————————————————————————————————————————————————————————————

/**
 * 1) Inicialización:
 *    - Espera a que el DOM esté cargado.
 *    - Pinta datos existentes.
 *    - Prepara contador en sesión.
 *    - Registra manejadores de clic.
 */
document.addEventListener('DOMContentLoaded', () => {
  displayData();            // A
  initInteractionCount();   // B
  document.getElementById('saveButton')
          .addEventListener('click', onSave);   // C
  document.getElementById('clearButton')
          .addEventListener('click', onClear);  // D
});
```

- **A – `displayData()`**  
  > Muestra en pantalla lo almacenado en LocalStorage.  
  > *Antes*: la versión inicial usaba `textContent` directo.  
  > *Ahora*: construimos nodos con `createElement`/`appendChild`, logrando un DOM dinámico y demostrando manipulación de nodos.

- **B – `initInteractionCount()`**  
  > Inicializa `interactionCount` en SessionStorage si no existe.  
  > *Antes*: se usaba un typo y `localStorage.clear()`.  
  > *Ahora*: clave correcta, solo afecta a la métrica de clics.

- **C/D – Registro de eventos**  
  > Vincula `onSave` y `onClear` a los botones, garantizando separación de responsabilidades.

---

### Función `onSave()`

```js
function onSave() {
  const nameInput = document.getElementById('name');
  const ageInput  = document.getElementById('age');

  const name = nameInput.value.trim();         // 1
  const age  = parseInt(ageInput.value, 10);   // 2

  // 3) Validación de nombre
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  if (!regexNombre.test(name)) {
    alert('❌ Nombre inválido…');
    console.error('Validación nombre fallida:', name);
    return;
  }

  // 4) Validación de edad
  if (isNaN(age) || age < 1 || age > 120) {
    alert('❌ Edad inválida…');
    console.error('Validación edad fallida:', ageInput.value);
    return;
  }

  // 5) Guardar en LocalStorage
  const user = { name, age };
  localStorage.setItem('user', JSON.stringify(user));
  console.log('Guardado en LS →', user);

  incrementInteraction();  // 6) Cuenta clics
  displayData();           // 7) Refresca UI
}
```

| Paso | Qué hace                                                                                                        |
|------|------------------------------------------------------------------------------------------------------------------|
| 1    | `trim()`: quita espacios antes/después; evita entradas vacías.                                                    |
| 2    | `parseInt(…,10)`: convierte cadena a entero decimal.                                                             |
| 3    | Regex para permitir solo letras (con tildes), ñ y espacios, mínimo 2 caracteres.                                  |
| 4    | Comprueba que `age` sea un número entero dentro del rango lógico 1–120.                                         |
| 5    | Serializa `{name, age}` a JSON y lo guarda bajo la clave `"user"`.                                               |
| 6    | Llama a función que actualiza contador en SessionStorage.                                                        |
| 7    | Vuelve a ejecutar `displayData()` para que el usuario vea el resultado inmediatamente sin recargar la página.    |

---

### Función `onClear()`

```js
function onClear() {
  localStorage.removeItem('user');   // 8
  console.log('LocalStorage: clave "user" eliminada');
  incrementInteraction();            // 9
  displayData();                     // 10
}
```

| Línea | Descripción                                                                                   |
|-------|-----------------------------------------------------------------------------------------------|
| 8     | Utiliza `removeItem('user')` para borrar solo esa clave, en lugar de `clear()` total.       |
| 9     | Incrementa contador de clics en SessionStorage.                                              |
| 10    | Actualiza la vista para reflejar que no hay datos almacenados.                                |

> **Antes**: se borraba todo el LocalStorage.  
> **Ahora**: manejamos sólo lo necesario y preservamos posibles otras claves importantes.

---

### Función `displayData()`

```js
function displayData() {
  const output = document.getElementById('output');

  // 11) Limpiar contenido previo
  while (output.firstChild) {
    output.removeChild(output.firstChild);
  }

  // 12) Leer LocalStorage
  const raw = localStorage.getItem('user');
  if (raw) {
    const { name, age } = JSON.parse(raw);  // 13
    const p = document.createElement('p');  // 14
    p.textContent = `¡Hola ${name}! Tenés ${age} años.`;
    output.appendChild(p);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No hay datos almacenados.';
    output.appendChild(p);
  }

  console.log('Display actualizado: ', localStorage.getItem('user'));
}
```

- **11**: Remueve nodos secretos para evitar duplicar contenido.  
- **12**: Obtiene string JSON, puede ser `null` o valor anterior.  
- **13**: `JSON.parse` deserializa datos.  
- **14**: Creación de `<p>` para demostración de DOM puro.

---

### SessionStorage – gestión de interacciones

```js
function initInteractionCount() {
  if (!sessionStorage.getItem('interactionCount')) {
    sessionStorage.setItem('interactionCount', '0');
  }
  console.log('SS inicial:', sessionStorage.getItem('interactionCount'));
}

function incrementInteraction() {
  let count = parseInt(sessionStorage.getItem('interactionCount'), 10) || 0;
  count++;
  sessionStorage.setItem('interactionCount', String(count));
  console.log(`Interacciones en esta sesión: ${count}`);
}
```

| Función               | Propósito                                                                                  |
|-----------------------|---------------------------------------------------------------------------------------------|
| `initInteractionCount`| Garantiza que la clave exista con valor `"0"` en la primera carga de la página de la sesión |
| `incrementInteraction`| Suma 1 al contador por cada clic en “Guardar” o “Limpiar”.                                  |

---

## 🔄 Adaptaciones a otros casos

1. **Múltiples usuarios**  
   - Cambia `user` por `users` (array) en LS, luego itera y muestra lista.  
2. **Campos adicionales**  
   - Agrega más inputs en el form; extiende `getAndValidateInput` y el objeto JSON.  
3. **Historial de interacciones**  
   - Guarda cada acción con timestamp en un array dentro de SessionStorage.  
4. **Integración con backend**  
   - En `onSave`, envía `fetch('/api/user', { method:'POST', body:JSON.stringify(user) })` y usa proxy para proteger API key.

---

## ✔️ Balance: antes vs ahora

| Aspecto              | Versión original                                   | Versión mejorada                                                                                |
|----------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------------|
| DOM                  | `textContent` directo                              | `createElement` + `appendChild` + `removeChild` para DOM dinámico                              |
| LocalStorage         | Claves separadas (`userName`, `userAge`)           | Clave única `user` con JSON, facilita limpieza y gestión                                       |
| Limpieza de datos    | `localStorage.clear()` (borraba todo)              | `removeItem('user')` (borra solo lo necesario)                                                 |
| Validación           | Básica (no bloqueaba malas entradas)               | Regex de nombre, rango numérico, mensajes `alert` y `console.error`                             |
| SessionStorage       | Typos y uso crudo                                 | Funciones `initInteractionCount` e `incrementInteraction`, clave consistente                    |
| Comentarios y estilo | No había                                         | JSDoc y comentarios en cada bloque explicando intención y decisiones                           |

---

Con este **README** tienes una **guía detallada**, técnica y mental, que explica el **por qué** y el **cómo** de cada decisión, además de cómo adaptar este patrón a otros escenarios. ¡Listo para descargar y estudiar!