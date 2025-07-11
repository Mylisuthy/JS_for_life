## Descripción del proyecto

Este proyecto es una aplicación de consola escrita en JavaScript (Node.js) que interactúa con el usuario para solicitar su nombre y edad, validando cuidadosamente cada entrada. La lógica está diseñada para:

- **Reutilización de código** mediante funciones auxiliares.
- **Validación robusta** de entradas (nombre y edad) usando expresiones regulares y comprobaciones numéricas.
- **Bucles de repetición** hasta que se ingresen datos válidos, garantizando una experiencia de usuario fluida.
- **Mensajes personalizados** según el rango de edad.

Este enfoque es adaptable a escenarios reales como formularios web, validación de datos y flujo de interacción en aplicaciones de consola.

---

## Estructura del repositorio

```
/ (directorio raíz)
├── sistema_interactivo.js   # Script principal de interacción en consola
└── README.md                # Documentación técnica (este archivo)
```

---

## Tecnologías y recursos utilizados

- **Node.js**: Entorno de ejecución para JavaScript fuera del navegador.
- \*\*Módulo \*\*\`\`: Permite manejar entrada y salida por consola.
- \*\*Promesas y \*\*\`\`: Facilitan la lectura secuencial de preguntas y respuestas.
- **Expresiones regulares (RegEx)**: Validan patrones de texto (nombre).

---

## Desglose del código y justificación de cada parte

A continuación explicamos por qué y cómo se usa cada sección del código.

### 1. Importación y configuración de `readline`

```js
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
```

- **Propósito**: `readline` es un módulo nativo de Node.js que permite leer líneas de texto desde la entrada estándar (teclado) y escribir en la salida estándar (consola).
- **Justificación**: Reemplaza la función `prompt()` del navegador, haciendo posible la interacción en un entorno de consola.

### 2. Función auxiliar `preguntar(texto)`

```js
function preguntar(texto) {
  return new Promise((resolve) => rl.question(texto, resolve));
}
```

- **Propósito**: Envuelve `rl.question()` en una Promesa para poder usar `await` y mantener un flujo de código secuencial claro.
- **Justificación**: Facilita la lectura y escritura de preguntas-respuestas de forma sincrónica aparente, mejorando la legibilidad.

### 3. Validación de nombre con `esNombreValido(nombre)`

```js
function esNombreValido(nombre) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  return regexNombre.test(nombre.trim());
}
```

- **Propósito**: Asegurar que el nombre contenga únicamente letras (incluyendo tildes y ñ) y espacios, con una longitud mínima de 2 caracteres.
- **Justificación**: Previene caracteres especiales o números en el nombre, ofreciendo una validación más profesional.

### 4. Validación de edad con `esEdadValida(edad)`

```js
function esEdadValida(edad) {
  const numeroEdad = Number(edad);
  return (
    !isNaN(numeroEdad) &&
    Number.isInteger(numeroEdad) &&
    numeroEdad >= 1 &&
    numeroEdad <= 80
  );
}
```

- **Propósito**: Convertir la entrada a número y verificar que sea un entero entre 1 y 80.
- **Justificación**: Garantiza que la edad tenga sentido lógico y evita valores atípicos o decimales.

### 5. Función principal `solicitarDatos()`

```js
async function solicitarDatos() {
  let nombre;
  do {
    nombre = await preguntar(
      "Por favor, ingresa tu nombre (solo letras y espacios): "
    );
    if (!esNombreValido(nombre)) {
      console.error(
        "Error: nombre inválido. Usa solo letras, espacios y al menos 2 caracteres.\n"
      );
    }
  } while (!esNombreValido(nombre));

  let edad;
  do {
    edad = await preguntar(`Hola ${nombre}, ingresa tu edad (1-80): `);
    if (!esEdadValida(edad)) {
      console.error(
        "Error: edad inválida. Debe ser un número entero entre 1 y 80.\n"
      );
    }
  } while (!esEdadValida(edad));

  edad = Number(edad);
  console.log("");

  if (edad < 18) {
    console.log(
      `Hola ${nombre}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`
    );
  } else if (edad <= 34) {
    console.log(
      `Hola ${nombre}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`
    );
  } else {
    console.log(
      `Buenos días ${nombre}, con ${edad} años, la experiencia es tu mejor aliada en el aprendizaje.`
    );
  }

  rl.close();
}
```

- **Validación separada**: Dos bucles `do…while` independientes para nombre y edad, de modo que un error en uno no obliga a reingresar el otro.
- **Mensajes de error específicos**: Informa de manera precisa sobre la causa del fallo.
- **Mensajes personalizados**: Tramos de edad diferenciados para mayor empatía y claridad.
- **Cierre de la interfaz**: `rl.close()` garantiza que el proceso de Node.js termine correctamente.

### 6. Ejecución del programa

```js
solicitarDatos();
```

- **Propósito**: Invoca la función principal para iniciar la interacción.
- **Justificación**: Mantiene el flujo del programa claro y modular.

---

## Cómo ejecutar

1. Asegúrate de tener **Node.js** instalado.

2. Clona o descarga este repositorio.

3. En la terminal, navega a la carpeta y ejecuta:

   ```bash
   node sistema_interactivo.js
   ```

4. Sigue las instrucciones en pantalla.

---

## Posibles extensiones

- Transformar esta lógica en un **módulo web** usando `export`/`import`.
- Integrar validaciones adicionales (correo, teléfono).
- Adaptar para un formulario HTML con eventos del DOM.

---

este trabajo fue echo con la finalidad de aprender la corecta ejecucion del codigo en ambientes reales, se tuvieron diversos problemas tanto en la implementacion de la correcta entrada de datos asi como la correcta utilisacion de los bucles y funciones.
la informacion para la correcta implementacion de este codigo se obtubo tanto de sitios oficiales (https://nodejs.org/en/docs o https://developer.mozilla.org/) como de ia (chatGPT) para explicaciones personalizadas que me encaminaran a una solucion correcta y escalable.

- **trabajo hecho por:** Juan David Gonzalez Hincapie **developer de Riwi**
- **clan:** lunus
- **mi repo en GitHub:** https://github.com/Mylisuthy/JS_for_life/tree/main/entrenamiento_M3W1
