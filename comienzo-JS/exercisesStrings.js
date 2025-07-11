let myName = "juanch0"
let myCadena = "PvP PvP PvP PvP PvP"
let comp1 = "aa"
let comp2 = "bb"
let comp3 = "aa"
// 1. Concatena dos cadenas de texto
let greeting = "hola, " + myName + "!"
console.log(greeting) 

// 2. Muestra la longitud de una cadena de texto
console.log(greeting.length)

// 3. Muestra el primer y último carácter de un string
console.log(greeting[0])
console.log(greeting[13])

// 4. Convierte a mayúsculas y minúsculas un string
console.log(myCadena.toUpperCase())
console.log(myCadena.toLowerCase())

// 5. Crea una cadena de texto en varias líneas
let multiplesLineas = `esto es
un string
en varias
lineas`
console.log(multiplesLineas)
// 6. Interpola el valor de una variable en un string
console.log(`hola papasito ${myName} <3`)

// 7. Reemplaza todos los espacios en blanco de un string por guiones
console.log(myCadena.replaceAll(" ", "-"))

// 8. Comprueba si una cadena de texto contiene una palabra concreta
console.log(greeting.includes("juanch0"))

// 9. Comprueba si dos strings son iguales
console.log(myName === myCadena)
console.log(comp1.localeCompare(comp2))

// 10. Comprueba si dos strings tienen la misma longitud
function compararLongitud(str1, str2) {
  return str1.length === str2.length;
}

let cadena1 = "Hola"
let cadena2 = "Mundo"
let cadena3 = "Mundo"

console.log(compararLongitud(cadena1, cadena2))
console.log(compararLongitud(cadena2, cadena3))

//GG