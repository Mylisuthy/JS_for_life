//datos primitivos: son los datos inmutables con los que se fundamenta la interaccion con el codigo

// cadena de texto (strings) se definen con comillas ("y texto dentro") tambien pueden representarse con "" '' ``  
let myname = "lolaso"
let alias = 'lolson'
let ema = `loluWu`

// numeros (number) puede trabajar con los 2 tipos de numeros
let age = 30 // entero
let heigth = 1.25 // decimal

// booleanos (boolean)
let isStudent = true
let isTeacher = false

// Undefined se entiende como la variable que no tiene un valor en concreto pero que puede darsele valor a lo largo del proceso
let undefinedValue
console.log(undefinedValue)

// null esto representa la ausencia de valor de forma intencionado
let nullvalue = null //este es un tipo de dato que tambien puede ser obgeto

// Symbol este representa un valor unico que puede indentificar una propiedad, se puede utiizar para evitar coliciones
let mySymbol = Symbol("mySymbol") // esto es unico

//bigInt este se utiliza cuando deseas representar un numero extremada mente grande, el cual no puede ser representado con el identificador Number
// este se puede representar de 2 formas
// tener en cuanta que deben ser numeros enteros de proporciones exageradas
let myBigInt = BigInt(123333333333333333333333333333)
let myBigInt2 = 2311111111111111111111111111111111111111111n // con la n al final

// mostrar los tipos de datos
// se utiliza typeof + el dato
console.log(typeof isStudent)
console.log(typeof etec)
//otros tipos de datos mas adelante