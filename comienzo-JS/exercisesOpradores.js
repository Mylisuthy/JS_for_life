// algunos ejersicios

// 1. Crea una variable para cada operación aritmética
let a = 11
let p = 2
let l = 3
let g = 11
let b = 5
let i = 6
let x = 7

let pario = ((p +(l *(p + l))) / (p **(l / p)))
console.log(pario)
let modulo = pario % 2
console.log(modulo)

// 2. Crea una variable para cada tipo de operación de asignación,
//    que haga uso de las variables utilizadas para las operaciones aritméticas
l += 5
console.log(p)
p -= 3
console.log(l)
l *= 2
console.log(g)
p /= 1
console.log(b)
l %= 2
console.log(i)
p **= 2
console.log(x)

// 3. Imprime 5 comparaciones verdaderas con diferentes operadores de comparación
console.log(a > p)
console.log(a >= l)
console.log(a == g)
console.log(a === 11)
console.log(a != l)

// 4. Imprime 5 comparaciones falsas con diferentes operadores de comparación

console.log(l > p)
console.log(a <= l)
console.log(p == g)
console.log(x === 11)
console.log(l != l)

// 5. Utiliza el operador lógico and
console.log(3 < 6 && 10 < 20)
console.log(9 < 17 && 12 < 25 && 41 > 25)

// 6. Utiliza el operador lógico or
console.log(5 > 10 || 10 > 20)
console.log(30 < 10 || 10 > 20 || 30 > 40)

// 7. Combina ambos operadores lógicos
console.log(6 < 15 && 8 < 12 || 3 < 5)
console.log(6 > 15 && 8 < 12 || 3 > 5)

// 8. Añade alguna negación
console.log(!(6 > 15 && 8 < 12 || 3 > 5))

// 9. Utiliza el operador ternario
const isRaining = true

isRaining ? console.log("esta lloviendo") : console.log("No esta lloviendo")

// 10. Combina operadores aritméticos, de comparáción y lógicas
//una sola linea
console.log((a + b > 12) && (g < 5))

let q = 10;
let w = 5;
let e = 3;

let suma = q + w // 15

// comparación
let esMayor = suma > 12 // true

// lógica (AND)
let resultado = esMayor && e < 5 // true && true → true

console.log(resultado) // true

let edad = 20
let tieneLicencia = true

// ¿Puede manejar? (mayor de edad Y con licencia)
let puedeManejar = (edad >= 18) && tieneLicencia;

console.log(puedeManejar) // true
