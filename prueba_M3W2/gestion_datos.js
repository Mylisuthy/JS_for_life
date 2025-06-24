// Inicialización del proyecto
console.log("¡Gestión de Datos con Obgetos, Sets y Maps!");

// Obgeto Producto
const productos = {
    1: { id: 1, nombre: "Laptop", precio: 1500 },
    2: { id: 2, nombre: "Mouse", precio: 25 },
    3: { id: 3, nombre: "Teclado", precio: 50 }
};

console.log("Obgeto productos", productos);
console.log("-".repeat(100));

// set de nombres de productos
const setProductos = new Set(Object.values(productos).map(producto => producto.nombre));
console.log("Set de productos únicos:", setProductos);
console.log("-".repeat(100));

// Map para agregar categorias a los productos
const mapProductos = new Map([
    ["Electronica", "Laptop"],
    ["Accesorios", "Mouse"],
    ["Accesorios", "Teclado"]
]);

console.log("Map de productos y categorías:", mapProductos);
console.log("-".repeat(100));

// Recorrer el objeto productos
for (const id in productos) {
    console.log(`producto ID: ${id}, Detalles:`, productos[id]);
};
console.log("-".repeat(100));


// Recorrer Set de productos
for (const producto of setProductos) {
    console.log("Producto único:", producto);
};
console.log("-".repeat(100));


// Recorrer el map de productos
mapProductos.forEach((producto, categoria) => {
    console.log(`Categoria: ${categoria}, producto: ${producto}`);
});
console.log("-".repeat(100));

// Pruebas 
console.log("Pruebas completas de gestion de datos:");
console.log("-".repeat(100));
console.log("Lista de productos (Obgetos):")
console.table(productos)
console.log("-".repeat(100));
console.log("lista de productos únicos (Set):")
console.table(setProductos)
console.log("-".repeat(100));
console.log("Categorias y productos (Map):")
console.table(mapProductos)
console.log("-".repeat(100));
