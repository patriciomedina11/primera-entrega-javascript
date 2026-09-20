let nombre = prompt("¿Cuál es tu nombre?");
let producto = prompt("¿Qué mueble querés presupuestar?");
let precio = Number(prompt("¿Cuál es el precio del mueble?"));
let cantidad = Number(prompt("¿Cuántas unidades querés presupuestar?"));
let total = precio * cantidad;
let anticipo = total * 0.5;

console.log("Total del presupuesto: $" + total);
console.log("Anticipo del 50%: $" + anticipo);

let mensaje = "Hola " + nombre + ", solicitaste " + cantidad + " unidades de " + producto + ". El total del presupuesto es $" + total+ ". El anticipo del 50% es $" + anticipo
alert(mensaje);
