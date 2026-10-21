// PRE-ENTREGA 4 - SIMULADOR DE PRESUPUESTOS DE MUEBLES
// Incorporación de Arrays

// Catálogo inicial de muebles disponibles

let mueblesDisponibles = [
    "Mesa",
    "Silla",
    "Escritorio",
    "Placard",
    "Biblioteca"
];

console.log("Catálogo inicial de muebles:");
console.log(mueblesDisponibles);

// PASO 2 - MANIPULACIÓN DE ARRAYS

// Agregamos un mueble al final del catálogo
mueblesDisponibles.push("Cama");

console.log("Se agregó una cama al catálogo.");

// Agregamos un mueble prioritario al principio
mueblesDisponibles.unshift("Mesa de luz");

console.log("Se agregó una mesa de luz al principio.");

// Eliminamos el último mueble del catálogo
let muebleEliminado = mueblesDisponibles.pop();

console.log("Se ha eliminado el mueble: " + muebleEliminado);

// Mostramos el catálogo actualizado
console.log("Catálogo actualizado:");
console.log(mueblesDisponibles);

// PASO 3 - BÚSQUEDA Y VALIDACIÓN DE MUEBLES

// Solicitamos al usuario el nombre del mueble que desea buscar
let muebleBuscado = prompt(
    "¿Qué mueble querés buscar en nuestro catálogo?"
);

if (muebleBuscado !== null) {
    muebleBuscado = muebleBuscado.trim().toLowerCase();
}

// Verificamos si el mueble existe en el array
// Convertimos el catálogo a minúsculas para realizar la búsqueda
let catalogoBusqueda = mueblesDisponibles.map(mueble => mueble.toLowerCase());

if (muebleBuscado !== null && catalogoBusqueda.includes(muebleBuscado)) {

    let posicion = catalogoBusqueda.indexOf(muebleBuscado);

    console.log("El mueble " + mueblesDisponibles[posicion] + " está disponible.");

    console.log("Se encuentra en la posición: " + posicion);

    alert("El mueble " + mueblesDisponibles[posicion] + " está disponible.");

} else if (muebleBuscado !== null) {

    console.log("El mueble " + muebleBuscado + " no está disponible.");

    alert("Lo sentimos, ese mueble no está en nuestro catálogo.");

}
// PASO 4 - ACTUALIZACIÓN DEL CATÁLOGO CON SPLICE

// Buscamos la posición de Biblioteca
let indiceBiblioteca = mueblesDisponibles.indexOf("Biblioteca");

// Verificamos que exista antes de modificarla
if (indiceBiblioteca !== -1) {

    // Reemplazamos Biblioteca por Biblioteca modular
    mueblesDisponibles.splice(indiceBiblioteca, 1, "Biblioteca modular");

    console.log("Se reemplazó Biblioteca por Biblioteca modular.");

}

// Mostramos el catálogo después de la modificación
console.log("Catálogo después de utilizar splice:");
console.log(mueblesDisponibles);

// PASO 5 - FUNCIÓN PARA RECORRER EL CATÁLOGO

function mostrarCatalogo() {

    console.log("Listado completo de muebles disponibles:");

    for (let mueble of mueblesDisponibles) {

        console.log("Mueble disponible: " + mueble);

    }

}
// Ejecutamos la función
mostrarCatalogo();
// Actualizamos el catálogo para validar presupuestos
catalogoBusqueda = mueblesDisponibles.map(mueble => mueble.toLowerCase());

function calcularTotal(precio, cantidad) {
    let total = precio * cantidad;
    return total;
}
const calcularAnticipo = (total) => {
    return total * 0.5;
};
function clasificarPresupuesto(total) {
    if (total >= 1000000) {
        console.log("Es un presupuesto grande.");
    } else if (total >= 500000) {
        console.log("Es un presupuesto mediano.");
    } else {
        console.log("Es un presupuesto pequeño.");
    }
}
const nombre = prompt("¿Cuál es tu nombre?");
let continuar = "si";

while (continuar === "si") {
let producto = prompt("¿Qué mueble querés presupuestar?");
let precio = Number(prompt("¿Cuál es el precio del mueble?"));
let cantidad = Number(prompt("¿Cuántas unidades querés presupuestar?"));

if (
    producto !== null &&
    catalogoBusqueda.includes(producto.trim().toLowerCase()) &&
    Number.isFinite(precio) &&
    Number.isInteger(cantidad) &&
    precio > 0 &&
    cantidad > 0
) {
    console.log("Los datos ingresados son correctos.");

    let total = calcularTotal(precio, cantidad);
    let anticipo = calcularAnticipo(total);

    clasificarPresupuesto(total);

    console.log("Total del presupuesto: $" + total);
    console.log("Anticipo del 50%: $" + anticipo);

    let mensaje = "Hola " + nombre +
        ", solicitaste " + cantidad +
        " unidades de " + producto +
        ". El total del presupuesto es $" + total;

    alert(mensaje);

} else {

    if (
        producto === null ||
        !catalogoBusqueda.includes(producto.trim().toLowerCase())
    ) {

        console.log("El mueble solicitado no está disponible.");

        alert("El mueble solicitado no está disponible en nuestro catálogo.");

    } else {

        console.log("El precio o la cantidad ingresados no son válidos.");

        alert("Error: ingresá un precio mayor a cero y una cantidad entera positiva.");

    }

}
continuar = prompt("¿Querés realizar otro presupuesto? Escribí si o no");

if (continuar === null) {
    continuar = "no";
} else {
    continuar = continuar.trim().toLowerCase();
}

}