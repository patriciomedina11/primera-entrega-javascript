// ==========================================
// PRE-ENTREGA 7
// INTERFAZ DINÁMICA CON DOM Y EVENTOS
// SIMULADOR DE PRESUPUESTOS DE MUEBLES
// ==========================================


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

    calcularPrecio(cantidad) {

        return this.precio * cantidad;

    }

    aplicarDescuento(porcentaje) {

        return this.precio - (this.precio * porcentaje / 100);

    }

}


// ==========================================
// 2. ARRAY DE OBJETOS
// ==========================================

const catalogoMuebles = [

    new Mueble(1, "Mesa", 250000, "Comedor", 10),

    new Mueble(2, "Silla", 50000, "Comedor", 20),

    new Mueble(3, "Escritorio", 180000, "Oficina", 8),

    new Mueble(4, "Placard", 450000, "Dormitorio", 5),

    new Mueble(5, "Biblioteca modular", 200000, "Living", 6)

];


// ==========================================
// 3. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================

const formularioMueble = document.getElementById("formulario-mueble");

const inputNombre = document.getElementById("nombre-mueble");

const inputPrecio = document.getElementById("precio-mueble");

const inputCategoria = document.getElementById("categoria-mueble");

const inputStock = document.getElementById("stock-mueble");

const contenedorItems = document.getElementById("contenedor-items");

const inputBuscar = document.getElementById("buscar-mueble");

const inputFiltroPresupuesto = document.getElementById("filtro-presupuesto");

const mensaje = document.getElementById("mensaje");

const formularioPresupuesto = document.getElementById("formulario-presupuesto");

const inputCliente = document.getElementById("nombre-cliente");

const seleccionarMueble = document.getElementById("seleccionar-mueble");

const inputCantidad = document.getElementById("cantidad-mueble");

const resultadoPresupuesto = document.getElementById("resultado-presupuesto");

const resumenInventario = document.getElementById("resumen-inventario");


// ==========================================
// 4. FUNCIONES GENERALES
// ==========================================

// Formatear precios en pesos argentinos

function formatoPrecio(valor) {

    return "$" + valor.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


// Calcular anticipo del 50%

function calcularAnticipo(total) {

    return total * 0.5;

}


// Clasificar presupuesto

function clasificarPresupuesto(total) {

    if (total >= 1000000) {

        return "Presupuesto grande";

    } else if (total >= 500000) {

        return "Presupuesto mediano";

    } else {

        return "Presupuesto pequeño";

    }

}


// Evitar que los datos ingresados se interpreten como HTML

function escaparHTML(texto) {

    return String(texto).replace(/[&<>"']/g, caracter => {

        const equivalencias = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return equivalencias[caracter];

    });

}


// Mostrar mensajes en pantalla

function mostrarMensaje(texto, tipo = "exito") {

    mensaje.textContent = texto;

    mensaje.className = "mensaje visible " + tipo;

}


// ==========================================
// 5. RENDERIZADO DINÁMICO DEL CATÁLOGO
// ==========================================

function renderizarMuebles() {

    const busqueda = inputBuscar.value.trim().toLowerCase();

    const precioIngresado = inputFiltroPresupuesto.value.trim();

    const precioMaximo = precioIngresado === ""
        ? Infinity
        : Number(precioIngresado);


    // FILTER: buscar por nombre y precio

    const mueblesFiltrados = catalogoMuebles.filter(mueble => {

        const coincideNombre = mueble.nombre
            .toLowerCase()
            .includes(busqueda);

        const coincidePrecio = mueble.precio <= precioMaximo;

        return coincideNombre && coincidePrecio;

    });


    // Limpiar contenedor antes de renderizar

    contenedorItems.innerHTML = "";


    if (mueblesFiltrados.length === 0) {

        contenedorItems.innerHTML = `
            <p class="sin-resultados">
                No encontramos muebles con esos filtros.
            </p>
        `;

        return;

    }


    // MAP: generar las tarjetas dinámicamente

    contenedorItems.innerHTML = mueblesFiltrados.map(mueble => {

        return `

            <article class="tarjeta-mueble">

                <div class="tarjeta-encabezado">

                    <h3>${escaparHTML(mueble.nombre)}</h3>

                    <span class="categoria">
                        ${escaparHTML(mueble.categoria)}
                    </span>

                </div>

                <p class="precio">
                    ${formatoPrecio(mueble.precio)}
                </p>

                <p class="stock">
                    Stock disponible: ${mueble.stock}
                </p>

                <div class="acciones">

                    <button
                        type="button"
                        class="btn btn-secundario btn-presupuestar"
                        data-id="${mueble.id}"
                    >
                        Presupuestar
                    </button>

                    <button
                        type="button"
                        class="btn btn-eliminar btn-borrar"
                        data-id="${mueble.id}"
                    >
                        Eliminar
                    </button>

                </div>

            </article>

        `;

    }).join("");

}


// ==========================================
// 6. AGREGAR NUEVOS MUEBLES
// ==========================================

formularioMueble.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombre = inputNombre.value.trim();

    const precio = Number(inputPrecio.value);

    const categoria = inputCategoria.value;

    const stock = Number(inputStock.value);


    // Validación de datos

    if (
        nombre === "" ||
        !Number.isFinite(precio) ||
        precio <= 0 ||
        categoria === "" ||
        !Number.isInteger(stock) ||
        stock <= 0
    ) {

        mostrarMensaje(
            "Completá correctamente todos los campos.",
            "error"
        );

        return;

    }


    // Crear ID único

    const nuevoId = catalogoMuebles.reduce((maximo, mueble) => {

        return Math.max(maximo, mueble.id);

    }, 0) + 1;


    // Crear nueva instancia de la clase

    const nuevoMueble = new Mueble(

        nuevoId,
        nombre,
        precio,
        categoria,
        stock

    );


    // Agregar objeto al array

    catalogoMuebles.push(nuevoMueble);


    // Limpiar formulario

    formularioMueble.reset();


    // Actualizar interfaz

    renderizarMuebles();

    actualizarSelectorMuebles();

    actualizarInventario();


    mostrarMensaje(
        `El mueble "${nombre}" fue agregado correctamente.`,
        "exito"
    );

});


// ==========================================
// 7. ELIMINAR Y SELECCIONAR MUEBLES
// ==========================================

// Delegación de eventos para botones dinámicos

contenedorItems.addEventListener("click", function(evento) {

    const botonEliminar = evento.target.closest(".btn-borrar");

    const botonPresupuestar = evento.target.closest(".btn-presupuestar");


    // ELIMINAR MUEBLE

    if (botonEliminar) {

        const id = Number(botonEliminar.dataset.id);


        // FIND: buscar el mueble por ID

        const mueble = catalogoMuebles.find(item => item.id === id);


        if (!mueble) {

            return;

        }


        // Buscar posición dentro del array

        const indice = catalogoMuebles.findIndex(item => item.id === id);


        // Eliminar del array

        catalogoMuebles.splice(indice, 1);


        // Actualizar pantalla

        renderizarMuebles();

        actualizarSelectorMuebles();

        actualizarInventario();

        resultadoPresupuesto.innerHTML = "";


        mostrarMensaje(
            `El mueble "${mueble.nombre}" fue eliminado del catálogo.`,
            "exito"
        );

    }


    // SELECCIONAR MUEBLE PARA PRESUPUESTAR

    if (botonPresupuestar) {

        const id = Number(botonPresupuestar.dataset.id);


        seleccionarMueble.value = String(id);


        // Llevar al usuario al formulario

        formularioPresupuesto.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        mostrarMensaje(
            "Mueble seleccionado. Completá los datos para calcular tu presupuesto.",
            "exito"
        );

    }

});


// ==========================================
// 8. EVENTOS DE TECLADO - BUSCADORES
// ==========================================

// Filtrar mientras el usuario escribe

inputBuscar.addEventListener("input", function() {

    renderizarMuebles();

});


// Filtrar por presupuesto máximo

inputFiltroPresupuesto.addEventListener("input", function() {

    renderizarMuebles();

});


// ==========================================
// 9. ACTUALIZAR SELECTOR DE MUEBLES
// ==========================================

function actualizarSelectorMuebles() {

    const seleccionAnterior = seleccionarMueble.value;


    seleccionarMueble.innerHTML = `
        <option value="">Seleccionar mueble</option>
    `;


    catalogoMuebles.forEach(mueble => {

        const opcion = document.createElement("option");

        opcion.value = mueble.id;

        opcion.textContent = `
            ${mueble.nombre} - ${formatoPrecio(mueble.precio)}
        `;

        seleccionarMueble.appendChild(opcion);

    });


    // Mantener selección si el mueble todavía existe

    const existeSeleccion = catalogoMuebles.some(mueble => {

        return String(mueble.id) === seleccionAnterior;

    });


    if (existeSeleccion) {

        seleccionarMueble.value = seleccionAnterior;

    }

}


// ==========================================
// 10. CALCULAR PRESUPUESTO
// ==========================================

formularioPresupuesto.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombreCliente = inputCliente.value.trim();

    const idMueble = Number(seleccionarMueble.value);

    const cantidad = Number(inputCantidad.value);


    // FIND: localizar mueble seleccionado

    const muebleSeleccionado = catalogoMuebles.find(mueble => {

        return mueble.id === idMueble;

    });


    // Validaciones

    if (nombreCliente === "") {

        mostrarMensaje(
            "Ingresá el nombre del cliente.",
            "error"
        );

        return;

    }


    if (!muebleSeleccionado) {

        mostrarMensaje(
            "Seleccioná un mueble válido.",
            "error"
        );

        return;

    }


    if (!Number.isInteger(cantidad) || cantidad <= 0) {

        mostrarMensaje(
            "Ingresá una cantidad válida.",
            "error"
        );

        return;

    }


    if (cantidad > muebleSeleccionado.stock) {

        mostrarMensaje(
            `Stock insuficiente. Solo hay ${muebleSeleccionado.stock} unidades disponibles.`,
            "error"
        );

        return;

    }


    // Calcular valores

    const total = muebleSeleccionado.calcularPrecio(cantidad);

    const anticipo = calcularAnticipo(total);

    const saldo = total - anticipo;

    const clasificacion = clasificarPresupuesto(total);


    // Mostrar presupuesto utilizando DOM

    resultadoPresupuesto.innerHTML = `

        <div class="resultado">

            <h3>Presupuesto generado</h3>

            <p>
                <strong>Cliente:</strong>
                ${escaparHTML(nombreCliente)}
            </p>

            <p>
                <strong>Mueble:</strong>
                ${escaparHTML(muebleSeleccionado.nombre)}
            </p>

            <p>
                <strong>Cantidad:</strong>
                ${cantidad}
            </p>

            <p>
                <strong>Precio unitario:</strong>
                ${formatoPrecio(muebleSeleccionado.precio)}
            </p>

            <hr>

            <p class="total">
                Total: ${formatoPrecio(total)}
            </p>

            <p>
                <strong>Anticipo del 50%:</strong>
                ${formatoPrecio(anticipo)}
            </p>

            <p>
                <strong>Saldo restante:</strong>
                ${formatoPrecio(saldo)}
            </p>

            <p>
                <strong>Clasificación:</strong>
                ${clasificacion}
            </p>

        </div>

    `;


    mostrarMensaje(
        "El presupuesto fue calculado correctamente.",
        "exito"
    );

});


// ==========================================
// 11. RESUMEN DEL INVENTARIO
// ==========================================

function actualizarInventario() {

    // REDUCE: calcular valor total del inventario

    const valorTotal = catalogoMuebles.reduce((acumulador, mueble) => {

        return acumulador + (mueble.precio * mueble.stock);

    }, 0);


    // REDUCE: calcular cantidad de unidades

    const unidadesTotales = catalogoMuebles.reduce((acumulador, mueble) => {

        return acumulador + mueble.stock;

    }, 0);


    resumenInventario.innerHTML = `

        <div class="inventario">

            <div class="dato-inventario">

                <h3>Productos diferentes</h3>

                <p>${catalogoMuebles.length}</p>

            </div>

            <div class="dato-inventario">

                <h3>Unidades disponibles</h3>

                <p>${unidadesTotales}</p>

            </div>

            <div class="dato-inventario">

                <h3>Valor total del inventario</h3>

                <p>${formatoPrecio(valorTotal)}</p>

            </div>

        </div>

    `;

}


// ==========================================
// 12. INICIALIZACIÓN
// ==========================================

// Mostrar catálogo al cargar la página

renderizarMuebles();

actualizarSelectorMuebles();

actualizarInventario();