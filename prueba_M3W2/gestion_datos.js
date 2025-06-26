// Inicialización del proyecto
console.log("¡Gestión de Datos con Objetos, Sets y Maps!");
console.log("-".repeat(100));

// Objeto Producto
// se utiliza un array para mejorar el manejo de colecciones
const productos = [
    { id: 1, nombre: "Laptop", precio: 1500, categoria: "Electrónica" },
    { id: 2, nombre: "Mouse", precio: 25, categoria: "Accesorios" },
    { id: 3, nombre: "Teclado", precio: 50, categoria: "Accesorios" }
];
console.log("Objeto productos", productos);
console.log("-".repeat(100));

// funcion para validar entrada de productos
function validarProductos({ id, nombre, precio, categoria }) {
    if (typeof id !== "number" || id <= 0) throw new Error("ID invalido");
    if (!nombre || typeof nombre !== "string") throw new Error(" Nombre vacio");
    if (typeof precio !== "number" || precio < 0) throw new Error("precio invalido");
    if (!categoria) throw new Error("categoria requerida");
}
productos.forEach(validarProductos);

// set para las ID de productos
// evita duplicados
const setIds = new Set(productos.map(Producto => Producto.id));
console.log("Set de productos únicos:", setIds);
console.log("-".repeat(100));

// Map para agregar categorias a los productos
// este diseño tiene como ventaja el añadir productos sin colisiones
const mapCategorias = new Map();
for (const { nombre, categoria } of productos) {
    if (!mapCategorias.has(categoria)) mapCategorias.set(categoria, []);
    mapCategorias.get(categoria).push(nombre);
}
console.log("Map de productos y categorías:", mapCategorias);
console.log("-".repeat(100));

// Recorrer el objeto productos
for (const producto of productos) {
    console.log(`producto ID: ${producto.id}, Detalles:`, producto);
};
console.log("-".repeat(100));


// Recorrer Set de productos
for (const id of setIds) {
    console.log("ID único:", id);
};
console.log("-".repeat(100));


// Recorrer el map de productos
mapCategorias.forEach((nombres, categoria) => {
    console.log(`Categoria: ${categoria}, producto: ${nombres.join(", ")}`);
});
console.log("-".repeat(100));

// Pruebas 
console.log("Pruebas completas de gestion de datos:");
console.log("-".repeat(100));
console.log("Lista de productos (Objetos):")
console.table(productos)
console.log("-".repeat(100));
console.log("lista de productos únicos (Set):")
console.table(Array.from(setIds));
console.log("-".repeat(100));
console.log("Categorias y productos (Map):")
console.table(Array.from(mapCategorias.entries()));
console.log("-".repeat(100));
