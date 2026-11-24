// PRE-ENTREGA 6 - SIMULADOR DE PRESUPUESTOS DE MUEBLES
// Funciones de orden superior: find, filter, map y reduce

// ==========================================
// 1. CLASE MUEBLE
// ==========================================

class Mueble {
    constructor(id, nombre, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
    }

    // Calcula el precio total según la cantidad solicitada
    calcularPrecio(cantidad) {
        return this.precio * cantidad;
    }

    // Calcula el precio aplicando un descuento
    aplicarDescuento(porcentaje) {
        return this.precio - (this.precio * porcentaje / 100);
    }
}

// ==========================================
// 2. CREACIÓN DE OBJETOS
// ==========================================

const mesa = new Mueble(1, "Mesa", 250000, "Comedor", 10);
const silla = new Mueble(2, "Silla", 50000, "Comedor", 20);
const escritorio = new Mueble(3, "Escritorio", 180000, "Oficina", 8);
const placard = new Mueble(4, "Placard", 450000, "Dormitorio", 5);
const biblioteca = new Mueble(5, "Biblioteca modular", 200000, "Living", 6);

// Array de objetos
const catalogoMuebles = [
    mesa,
    silla,
    escritorio,
    placard,
    biblioteca
];

// ==========================================
// 3. FUNCIONES GENERALES
// ==========================================

// Formatear precios en pesos argentinos
function formatoPrecio(valor) {
    return "$" + valor.toLocaleString("es-AR");
}

// Calcular anticipo del 50%
const calcularAnticipo = (total) => {
    return total * 0.5;
};

// Clasificar presupuestos
function clasificarPresupuesto(total) {
    if (total >= 1000000) {
        return "Presupuesto grande";
    } else if (total >= 500000) {
        return "Presupuesto mediano";
    } else {
        return "Presupuesto pequeño";
    }
}

// ==========================================
// 4. MOSTRAR CATÁLOGO - MAP()
// ==========================================

function mostrarCatalogo() {

    const listado = catalogoMuebles.map(mueble => {
        return (
            "ID: " + mueble.id +
            " | " + mueble.nombre +
            " | Precio: " + formatoPrecio(mueble.precio) +
            " | Categoría: " + mueble.categoria +
            " | Stock: " + mueble.stock
        );
    });

    console.log("CATÁLOGO COMPLETO:");
    console.log(listado);

    alert("CATÁLOGO DE MUEBLES\n\n" + listado.join("\n"));
}

// ==========================================
// 5. BUSCAR MUEBLE - FIND()
// ==========================================

function buscarMueble() {

    let nombreBuscado = prompt("Ingresá el nombre del mueble que querés buscar:");

    if (nombreBuscado === null) {
        return;
    }

    nombreBuscado = nombreBuscado.trim().toLowerCase();

    const muebleEncontrado = catalogoMuebles.find(mueble =>
        mueble.nombre.toLowerCase() === nombreBuscado
    );

    if (muebleEncontrado) {

        console.log("Mueble encontrado:", muebleEncontrado);

        alert(
            "MUEBLE ENCONTRADO\n\n" +
            "Nombre: " + muebleEncontrado.nombre +
            "\nPrecio: " + formatoPrecio(muebleEncontrado.precio) +
            "\nCategoría: " + muebleEncontrado.categoria +
            "\nStock: " + muebleEncontrado.stock
        );

    } else {

        console.log("No se encontró el mueble solicitado.");

        alert("El mueble solicitado no existe en nuestro catálogo.");
    }
}

// ==========================================
// 6. FILTRAR POR PRESUPUESTO - FILTER()
// ==========================================

function filtrarPorPresupuesto() {

    let presupuesto = prompt("¿Cuál es tu presupuesto máximo disponible?");

    if (presupuesto === null || presupuesto.trim() === "") {
        return;
    }

    presupuesto = Number(presupuesto);

    if (!Number.isFinite(presupuesto) || presupuesto <= 0) {
        alert("Ingresá un presupuesto válido mayor a cero.");
        return;
    }

    // Filtramos los muebles que no superen el presupuesto
    const mueblesFiltrados = catalogoMuebles.filter(mueble =>
        mueble.precio <= presupuesto && mueble.stock > 0
    );

    console.log("Muebles dentro del presupuesto:", mueblesFiltrados);

    if (mueblesFiltrados.length > 0) {

        const resultado = mueblesFiltrados.map(mueble =>
            mueble.nombre + " - " + formatoPrecio(mueble.precio)
        );

        alert(
            "MUEBLES DENTRO DE TU PRESUPUESTO\n\n" +
            resultado.join("\n")
        );

    } else {

        alert("No encontramos muebles dentro de ese presupuesto.");
    }
}

// ==========================================
// 7. SIMULAR DESCUENTOS - MAP()
// ==========================================

function simularDescuentos() {

    let porcentaje = prompt("¿Qué porcentaje de descuento querés simular?");

    if (porcentaje === null || porcentaje.trim() === "") {
        return;
    }

    porcentaje = Number(porcentaje);

    if (!Number.isFinite(porcentaje) || porcentaje < 0 || porcentaje > 100) {
        alert("Ingresá un porcentaje entre 0 y 100.");
        return;
    }

    // Transformamos los datos para mostrar nuevos precios
    const mueblesConDescuento = catalogoMuebles.map(mueble => {
        return {
            nombre: mueble.nombre,
            precioOriginal: mueble.precio,
            precioConDescuento: mueble.aplicarDescuento(porcentaje)
        };
    });

    console.log("Muebles con descuento:", mueblesConDescuento);

    const listado = mueblesConDescuento.map(mueble =>
        mueble.nombre +
        "\nPrecio original: " + formatoPrecio(mueble.precioOriginal) +
        "\nPrecio con descuento: " + formatoPrecio(mueble.precioConDescuento)
    );

    alert(
        "SIMULACIÓN DE DESCUENTOS DEL " + porcentaje + "%\n\n" +
        listado.join("\n\n")
    );
}

// ==========================================
// 8. VALOR TOTAL DEL INVENTARIO - REDUCE()
// ==========================================

function calcularValorInventario() {

    // Sumamos el valor de todos los muebles disponibles
    const valorTotal = catalogoMuebles.reduce((acumulador, mueble) => {
        return acumulador + (mueble.precio * mueble.stock);
    }, 0);

    console.log("Valor total del inventario:", valorTotal);

    alert(
        "VALOR TOTAL DEL INVENTARIO\n\n" +
        formatoPrecio(valorTotal)
    );
}

// ==========================================
// 9. SIMULADOR DE PRESUPUESTOS
// ==========================================

function realizarPresupuesto(nombreCliente) {

    let producto = prompt("¿Qué mueble querés presupuestar?");

    if (producto === null || producto.trim() === "") {
        return;
    }

    // Buscamos el objeto dentro del catálogo
    const muebleSeleccionado = catalogoMuebles.find(mueble =>
        mueble.nombre.toLowerCase() === producto.trim().toLowerCase()
    );

    if (!muebleSeleccionado) {
        alert("El mueble solicitado no está disponible.");
        return;
    }

    let cantidadIngresada = prompt(
        "¿Cuántas unidades de " + muebleSeleccionado.nombre + " querés?"
    );

    if (cantidadIngresada === null || cantidadIngresada.trim() === "") {
        return;
    }

    const cantidad = Number(cantidadIngresada);

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        alert("Ingresá una cantidad entera positiva.");
        return;
    }

    if (cantidad > muebleSeleccionado.stock) {
        alert(
            "Stock insuficiente.\n" +
            "Stock disponible: " + muebleSeleccionado.stock
        );
        return;
    }

    // Calculamos el presupuesto utilizando el método de la clase
    const total = muebleSeleccionado.calcularPrecio(cantidad);
    const anticipo = calcularAnticipo(total);
    const clasificacion = clasificarPresupuesto(total);

    console.log("Cliente:", nombreCliente);
    console.log("Mueble seleccionado:", muebleSeleccionado);
    console.log("Cantidad:", cantidad);
    console.log("Total:", total);
    console.log("Anticipo:", anticipo);
    console.log("Clasificación:", clasificacion);

    alert(
        "PRESUPUESTO DE MUEBLES\n\n" +
        "Cliente: " + nombreCliente +
        "\nMueble: " + muebleSeleccionado.nombre +
        "\nCantidad: " + cantidad +
        "\nPrecio unitario: " + formatoPrecio(muebleSeleccionado.precio) +
        "\n\nTOTAL: " + formatoPrecio(total) +
        "\nANTICIPO DEL 50%: " + formatoPrecio(anticipo) +
        "\nClasificación: " + clasificacion
    );
}

// ==========================================
// 10. MENÚ PRINCIPAL INTERACTIVO
// ==========================================

function iniciarSimulador() {

    let nombreCliente = prompt("¡Bienvenido al simulador de muebles!\n¿Cuál es tu nombre?");

    if (nombreCliente === null || nombreCliente.trim() === "") {
        nombreCliente = "Cliente";
    }

    let continuar = true;

    while (continuar) {

        const opcion = prompt(
            "SIMULADOR DE PRESUPUESTOS DE MUEBLES\n\n" +
            "Hola " + nombreCliente + ", elegí una opción:\n\n" +
            "1 - Mostrar catálogo de muebles\n" +
            "2 - Buscar un mueble por nombre\n" +
            "3 - Filtrar muebles por presupuesto\n" +
            "4 - Simular descuentos\n" +
            "5 - Calcular valor total del inventario\n" +
            "6 - Realizar un presupuesto\n" +
            "0 - Salir\n\n" +
            "Ingresá el número de la opción:"
        );

        switch (opcion) {

            case "1":
                mostrarCatalogo();
                break;

            case "2":
                buscarMueble();
                break;

            case "3":
                filtrarPorPresupuesto();
                break;

            case "4":
                simularDescuentos();
                break;

            case "5":
                calcularValorInventario();
                break;

            case "6":
                realizarPresupuesto(nombreCliente);
                break;

            case "0":
            case null:
                continuar = false;
                alert("¡Gracias por utilizar nuestro simulador de muebles!");
                break;

            default:
                alert("Opción incorrecta. Elegí un número del 0 al 6.");
                break;
        }
    }
}

// ==========================================
// 11. EJECUCIÓN DEL SIMULADOR
// ==========================================

console.log("PRE-ENTREGA 6 - FUNCIONES DE ORDEN SUPERIOR");
console.log("Catálogo de objetos:", catalogoMuebles);

iniciarSimulador();