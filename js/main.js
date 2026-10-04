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

let total = calcularTotal(precio, cantidad);
let anticipo = calcularAnticipo(total);
if (precio > 0 && cantidad > 0) {
    console.log("Los datos ingresados son correctos.");
} else {
    console.log("El precio o la cantidad ingresada no son válidos.");
}
clasificarPresupuesto(total);
console.log("Total del presupuesto: $" + total);
console.log("Anticipo del 50%: $" + anticipo);

let mensaje = "Hola " + nombre + ", solicitaste " + cantidad + " unidades de " + producto + ". El total del presupuesto es $" + total;
alert(mensaje);
continuar = prompt("¿Querés realizar otro presupuesto? Escribí si o no");
}
