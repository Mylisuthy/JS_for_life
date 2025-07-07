// evento para guardar datos en el local storage
document.getElementById('saveButton').addEventListener('click', () =>{
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');

    if (!nameInput || !ageInput) {
        console.error('los elementos del formulario no existen.');
        return;
    }

    const name = nameInput.value.trim();
    const age = parseInt(ageInput.value);

    if (name && !isNaN(age)) {
        localStorage.setItem('userName', name);
        localStorage.setItem('userAge', age);
        displayData();
    } else {
        alert('por favor, ingresa un nombre valido y una edad numerica.');
    }
});

// Funcion para mostrar datos almacenados
function displayData() {
    const name = localStorage.getItem('userName');
    const age = localStorage.getItem('userAge');
    const outputDiv = document.getElementById('output');
    if (name && age) {
        outputDiv.textContent = `hola ${name}, tienes ${age} años.`;
    } else {
        outputDiv.textContent = 'no hay datos almacenados.';
    }
}

// Al cargar la pagina, mostrar los datos almacenados
window.onload = displayData;

// Inicializar contador de interacciones en Session Storage
    if (!sessionStorage.getItem('interactionCount')) {
        sessionStorage.setItem('interationCount', 0);
    }

    // Actualizar contador de interacciones
    function updateInteractionCount() {
        let count = parseInt(sessionStorage.getItem('interactionCount'));
        count++;
        sessionStorage.setItem('interactionCount', count);
        console.log(`interacciones en esta sesion ${count}`);
    }

    // Asignar evento al contador
    document.getElementById('saveButton').addEventListener('click', updateInteractionCount);
    document.getElementById('clearButton').addEventListener('click', updateInteractionCount);

// Evento para limpiar los datos del local storage
document.getElementById('clearButton').addEventListener('click', () => {
    localStorage.clear();
    displayData();
})