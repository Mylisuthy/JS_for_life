
// if, else if, else

// if (si) si pasa esto as esto (ejecuta una linea de codigo si una condicion es verdadera)

let age = 20

if (age == 20) {
    console.log("la edad es 20")
}

// else (si no)

if (age == 20) {
    console.log("La edad es 20")
} else {
    console.log("La edad no es 20")
}

// else if (si no, si)

if (age == 20) {
    console.log("La edad es 20")
} else if (age < 18) {
    console.log("Es menor de edad")
} else {
    console.log("La edad no es 20 ni es menor de edad")
}

// Operador ternario (condicionales en una sola linea)

const message = age == 37 ? "La edad es 37" : "La edad no es 37"
console.log(message)

// switch

let day = 3
let dayName

switch (day) {
    case 0:
        dayName = "Lunes"
        break
    case 1:
        dayName = "Martes"
        break
    case 2:
        dayName = "Miércoles"
        break
    case 3:
        dayName = "Jueves"
        break
    case 4:
        dayName = "Viernes"
        break
    case 5:
        dayName = "Sábado"
        break
    case 6:
        dayName = "Domingo"
        break
    default:
        dayName = "Número de día incorrecto"
}

console.log(dayName)