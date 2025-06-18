// interactive system

// Welcome message
console.log("welcome to the age validation system for programmers");

// petition for necessary information
let named = prompt("please, write your name and last name");
let age = prompt("please, write your age");

// transform age to number
age = parseInt(age);

if (isNaN(age)) {
    console.error("Error: please, enter a valid age (positive number)")
} else if (edad < 18){
    alert(`hi ${named}, you are a under age. ¡continue with your learning and enjoying of coding!`)
} else if (edad >= 18){
    alert(`hi ${named}, you are a of age. ¡get ready to big oportunities in the world of programing!`)
} else {

}

// implementar validaciones de la entrada con casos realidatas como si un numero es negativo o si un numero sobrepasa una edad estimada (1000 años lo cual es irreal)