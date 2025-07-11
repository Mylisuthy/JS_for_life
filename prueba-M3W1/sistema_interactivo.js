/* a continuación muestro la solución para mi ejercicio de la semana, añadiendo factores que reconozco como esenciales 
 para la correcta implementación de un código, implementando el uso de bucles para pedir nueva mente las entradas de 
 datos sin cortar la interacción con el código, funciones para re utilización y validaciones para la correcta entrada 
 de datos.
 mi enfoque con este ejercicio se baso en la re utilización del código y facilitar su adaptación a diversos casos 
 en los que podría usarcé como: la implementación de formularios, verificar entradas de datos y petición 
 de datos asta que sean correcta mente diligenciados.
 decido implementar todas estas mejoras porque lo encuentro mas correcto para su uso en una pagina web ya que se
 asemeja a un problema que podría ocurrir en el día a día como desarrollador */

// Importamos el módulo readline y creamos la interfaz de entrada/salida
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función auxiliar para preguntar en consola y esperar la respuesta
function preguntar(texto) {
  return new Promise(resolve => rl.question(texto, resolve));
}

// Valida que el nombre solo contenga letras (incluye acentos y ñ) y espacios, mínimo 2 caracteres
function esNombreValido(nombre) {
  const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
  return regexNombre.test(nombre.trim());
}

// Valida que la edad sea un número entero entre 1 y 80
function esEdadValida(edad) {
  const numeroEdad = Number(edad);
  return !isNaN(numeroEdad) &&
         Number.isInteger(numeroEdad) &&
         numeroEdad >= 1 &&
         numeroEdad <= 80;
}

// Función principal que solicita los datos al usuario
async function solicitarDatos() {
  let nombre;
  // ————— Validación de NOMBRE —————
  do {
    nombre = await preguntar("Por favor, ingresa tu nombre (solo letras y espacios): ");
    if (!esNombreValido(nombre)) {
      console.error("Error: nombre inválido. Usa solo letras, espacios y al menos 2 caracteres.\n");
    }
  } while (!esNombreValido(nombre));

  let edad;
  // ————— Validación de EDAD —————
  do {
    edad = await preguntar(`Hola ${nombre}, ingresa tu edad (1-80): `);
    if (!esEdadValida(edad)) {
      console.error("Error: edad inválida. Debe ser un número entero entre 1 y 80.\n");
    }
  } while (!esEdadValida(edad));

  // Convertimos la edad a número y mostramos un salto de línea para estética en consola
  edad = Number(edad);
  console.log("");

  // ————— Mensajes personalizados según la edad —————
  if (edad < 18) {
    console.log(`Hola ${nombre}, eres menor de edad. ¡Sigue aprendiendo y disfrutando del código!`);
  } else if (edad <= 34) {
    console.log(`Hola ${nombre}, eres mayor de edad. ¡Prepárate para grandes oportunidades en el mundo de la programación!`);
  } else {
    console.log(`Hola ${nombre}, a tus ${edad} años de edad, la experiencia es tu mejor aliada en el aprendizaje sácale provecho.`);
  }

  // Cerramos la interfaz una vez terminada la interacción
  rl.close();
}

// Ejecutamos la función principal
solicitarDatos();
