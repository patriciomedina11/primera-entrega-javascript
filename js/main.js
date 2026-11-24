// PRE-ENTREGA 5 - SIMULADOR DE PRESUPUESTOS DE MUEBLES
// Incorporación de clases, objetos y métodos de instancia

// PASO 1 - CLASE MUEBLE

class Mueble {
    constructor(id, nombre, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    // Calcula el precio total según la cantidad
    calcularPrecio(cantidad) {
        return this.precio * cantidad;
    }

    // Calcula el precio con descuento
    aplicarDescuento(porcentaje) {
        return this.precio - (this.precio * porcentaje / 100);
    }
}
// PASO 2 - CREACIÓN DE OBJETOS

// Creamos cinco muebles utilizando la clase Mueble

const mesa = new Mueble(1, "Mesa", 250000, "Comedor", 10);

const silla = new Mueble(2, "Silla", 50000, "Comedor", 20);

const escritorio = new Mueble(3, "Escritorio", 180000, "Oficina", 8);

const placard = new Mueble(4, "Placard", 450000, "Dormitorio", 5);

const biblioteca = new Mueble(5, "Biblioteca modular", 200000, "Living", 6);

// Guardamos los objetos en un array
const catalogoMuebles = [
    mesa,
    silla,
    escritorio,
    placard,
    biblioteca
];
// Mostramos los objetos en la consola

console.log("Catálogo de muebles con objetos:");
console.log(catalogoMuebles);

// Probamos los métodos de la clase

console.log("Precio de 2 mesas: $" + mesa.calcularPrecio(2));

console.log("Precio de una silla con 10% de descuento: $" + silla.aplicarDescuento(10));
// Catálogo inicial de muebles disponibles

// Creamos un listado de nombres a partir de los objetos
let mueblesDisponibles = catalogoMuebles.map(mueble => mueble.nombre);

// Creamos una copia para practicar los métodos de arrays
let catalogoPractica = [...mueblesDisponibles];
console.log("Catálogo inicial de muebles:");
console.log(mueblesDisponibles);

// PASO 2 - MANIPULACIÓN DE ARRAYS

// Agregamos un mueble al final del catálogo
catalogoPractica.push("Cama");

console.log("Se agregó una cama al catálogo.");

// Agregamos un mueble prioritario al principio
catalogoPractica.unshift("Mesa de luz");

console.log("Se agregó una mesa de luz al principio.");

// Eliminamos el último mueble del catálogo
let muebleEliminado = catalogoPractica.pop();

console.log("Se ha eliminado el mueble: " + muebleEliminado);

// Mostramos el catálogo actualizado
console.log("Catálogo actualizado:");
console.log(catalogoPractica);

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
let indiceBiblioteca = catalogoPractica.indexOf("Biblioteca modular");

// Verificamos que exista antes de modificarla
if (indiceBiblioteca !== -1) {

   // Reemplazamos Biblioteca modular por Biblioteca personalizada
   catalogoPractica.splice(indiceBiblioteca, 1, "Biblioteca personalizada");

 console.log("Se reemplazó Biblioteca modular por Biblioteca personalizada.");

}

// Mostramos el catálogo después de la modificación
console.log("Catálogo después de utilizar splice:");
console.log(catalogoPractica);

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
// Solicitamos el mueble que desea presupuestar
let producto = prompt("¿Qué mueble querés presupuestar?");

// Buscamos el mueble dentro del catálogo de objetos
let muebleSeleccionado = null;

if (producto !== null) {
    muebleSeleccionado = catalogoMuebles.find(
        mueble => mueble.nombre.toLowerCase() === producto.trim().toLowerCase()
    ) || null;
}

// Solicitamos la cantidad
let cantidad = Number(prompt("¿Cuántas unidades querés presupuestar?"));

// Obtenemos el precio directamente del objeto
let precio = muebleSeleccionado ? muebleSeleccionado.precio : 0;

if (
    muebleSeleccionado !== null &&
    Number.isInteger(cantidad) &&
    cantidad > 0 &&
    cantidad <= muebleSeleccionado.stock
) {
    console.log("Los datos ingresados son correctos.");

 let total = muebleSeleccionado.calcularPrecio(cantidad);
    let anticipo = calcularAnticipo(total);

    clasificarPresupuesto(total);

    console.log("Total del presupuesto: $" + total);
    console.log("Anticipo del 50%: $" + anticipo);

let mensaje = "Hola " + nombre +
    ", solicitaste " + cantidad +
    " unidades de " + producto +
    ".\n\nTotal del presupuesto: $" + total +
    "\nAnticipo del 50%: $" + anticipo;

    alert(mensaje);

} else {

   if (muebleSeleccionado === null) {

        console.log("El mueble solicitado no está disponible.");

        alert("El mueble solicitado no está disponible en nuestro catálogo.");

    } else {

        console.log("El precio o la cantidad ingresados no son válidos.");

    alert("Error: ingresá una cantidad entera positiva que no supere el stock disponible.");

    }

}
continuar = prompt("¿Querés realizar otro presupuesto? Escribí si o no");

if (continuar === null) {
    continuar = "no";
} else {
    continuar = continuar.trim().toLowerCase();
}

}