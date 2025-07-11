/*
Clase 21 - Strings
Vídeo: https://youtu.be/1glVfFxj8a4?t=6565
*/

// Strings (cadenas de texto)

// Concatenación

let myName = "david"
let greeting = "Hola, " + myName + "!"
console.log(greeting)
console.log(typeof greeting)

// Longitud

console.log(greeting.length)

// Acceso a caracteres

console.log(greeting[0])
console.log(greeting[11])

// Métodos comunes

console.log(greeting.toUpperCase()) // Mayúsculas
console.log(greeting.toLowerCase()) // Minúsculas
console.log(greeting.indexOf("Hola")) // Índice
console.log(greeting.indexOf("Brais"))
console.log(greeting.indexOf("juanch0"))
console.log(greeting.includes("Hola")) // Incluye
console.log(greeting.includes("Brais"))
console.log(greeting.includes("juanch0"))
console.log(greeting.slice(0, 10)) // Sección
console.log(greeting.replace("Brais", "juanch0")) // Reemplazo

// Template literals (plantillas literales)

// Strings en varias líneas
let message = `Hola, este
es mi
comienzo con
JavaScript`
console.log(message)

// Interpolación de valores
let email = "juanch052048gmail.com"
console.log(`Hola, ${myName}! Tu email es ${email}.`)