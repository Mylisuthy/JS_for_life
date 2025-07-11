// 1. Escribe un comentario en una línea

// esto es un comentario para una linea

// 2. Escribe un comentario en varias líneas

/*este es un comentario
para barias lineas*/

// 3. Declara variables con valores asociados a todos los datos de tipo primitivos

let variable = "esto es una bariable"
var lolaso = "esto se usa muy especifica mente"
const estoEs = "una constante"

// 4. Imprime por consola el valor de todas las variables

console.log (variable, lolaso, estoEs)

// 5. Imprime por consola el tipo de todas las variables

console.log(typeof variable, lolaso, estoEs)

// 6. A continuación, modifica los valores de las variables por otros del mismo tipo

variable = "ahora es esto"
lolaso = 5
estoEs //no se le puede rre asignar
console.log(variable, lolaso)

// 7. A continuación, modifica los valores de las variables por otros de distinto tipo

variable = lolaso
console.log(variable)

// 8. Declara constantes con valores asociados a todos los tipos de datos primitivos

let myname = "lolaso"
let alias = 'lolson'
let ema = `loluWu`
let age = 30
let heigth = 1.25
let isStudent = true
let isTeacher = false
let undefinedValue
let nullvalue = null
let mySymbol = Symbol("mySymbol")
let myBigInt = BigInt(123333333333333333333333333333)
let myBigInt2 = 2311111111111111111111111111111111111111111n
console.log(typeof isStudent)
console.log(typeof etec)

// 9. A continuación, modifica los valores de las constantes

// en JavaScript no se puede modificar los valores de las constante directa mente

/* const pi = 3.14159;
   pi = 3.14; // Esto causará un error */

//Pero se pueden modificar los valores de los objetos/arrays que contiene la constante
const miObjeto = { nombre: "Juan", edad: 30 };
miObjeto.edad = 31; // Esto es válido
console.log(miObjeto.edad); // Salida: 31

const miArray = [1, 2, 3];
miArray[0] = 4; // Esto es válido
console.log(miArray[0]); // Salida: 4

// 10. Comenta las líneas que produzcan algún tipo de error al ejecutarse

// Error de sintaxis: falta un paréntesis
function miFuncion(parametro) {
  return parametro * 2; // SyntaxError: missing ) after argument list
}

// Error de referencia: acceder a una variable no definida
console.log(miVariable); // ReferenceError: miVariable is not defined

// Error de tipo: intentar multiplicar una cadena
let resultado = "hola" * 2; // TypeError: Cannot convert 'hola' to number

// Error de rango: usar un número negativo en una operación donde solo se permiten positivos
let array = [1, 2, 3];
console.log(array[-1]); // Index is out of bounds

// Error lógico: intentar dividir por cero
let resultado = 10 / 0; // Infinity

//los errores se pueden manejar con try...catch
/*
El bloque try contiene el código que podría generar un error,
y el bloque catch maneja el error si ocurre
*/
try {
  // Código que podría generar un error
  let resultado = 10 / 0;
  console.log("Este código no se ejecutará");
} catch (error) {
  // Código para manejar el error
  console.log("Error: " + error.message);
}
