// Operadores Aritmeticos

console.log("prueba rapida")

let a = 10
let b = 15

console.log(a + b) //Suma  
console.log(a - b) //Resta  
console.log(a * b) //Multiplicacion 
console.log(a / b) //Division 

// operadores sobrantes y exponentes

console.log(a % b) // Modulo
console.log(a ** b) // Exponente

// Operadores acumulativos

a++ // incremento
console.log(a)

b-- //decremento
console.log(b)

//operadores de asignacion

let varr = 3
console.log(varr)
varr += 4
console.log(varr)

varr -= 4
varr *= 4
varr /= 4
varr %= 4
varr **= 4

// Operadores de comparacion

console.log(a)

console.log(a > b)
console.log(a < b)
console.log(a >= b)
console.log(a <= b)
console.log(a == b)
console.log(a == 11) // igualdad por valor
console.log(a == "11") // igualdad por valor
console.log(a == a)
console.log(a === a) //igualdad de identidad por tipo y valor
console.log(a === 11)
console.log(a === "11")
console.log(a != 11)
console.log(a !== "11")
console.log(0 == false)
console.log(1 == false)
console.log(2 == false)
console.log(0 == "")
console.log(0 == " ")
console.log(0 == '')
console.log(0 == "hola")
console.log(0 === "")
console.log(undefined == null)
console.log(undefined === null)

// truthy values (valores verdaderos)

// todos los numeros positivos y negativoz menos el 0
// todas las cadenas de texto menos las vacias
// el boolean true

// falsy values (valores falsos)

// 0
// 0n
// null
// undefined
// nan
// el boolean false
// cadenas de texto vacias

// operadores logicos

// and (&&)
console.log(5 > 10 && 15 > 20)
console.log(5 < 10 && 15 < 20)
console.log(5 < 10 && 15 > 20)
console.log(5 > 10 && 15 > 20 && 30 > 40)

// or

console.log(5 > 10 || 10 > 20)
console.log(5 < 10 || 10 < 20)
console.log(5 < 10 || 10 > 20)
console.log(5 > 10 || 10 > 20 || 30 > 40)

console.log(5 > 10 && 10 > 20 || 30 > 40)

// not (!)

console.log(!(5 > 10 && 15 > 20))
console.log(!(5 > 10 || 15 > 20))
console.log(!true)
console.log(!false)

// Operadores ternarios

const isRaining = true

isRaining ? console.log("esta lloviendo") : console.log("No esta lloviendo")