// ==========================================
// PRE-ENTREGA 8
// SINCRONIZACIÓN ENTRE DOM Y LOCALSTORAGE
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
// 2. CATÁLOGO INICIAL
// ==========================================

const mueblesIniciales = [

    new Mueble(1, "Mesa", 250000, "Comedor", 10),

    new Mueble(2, "Silla", 50000, "Comedor", 20),

    new Mueble(3, "Escritorio", 180000, "Oficina", 8),

    new Mueble(4, "Placard", 450000, "Dormitorio", 5),

    new Mueble(5, "Biblioteca modular", 200000, "Living", 6)

];


// ==========================================
// 3. LOCALSTORAGE
// ==========================================

// Clave utilizada para guardar los muebles

const CLAVE_STORAGE = "catalogoMuebles";


// Recuperar información almacenada

function cargarMuebles() {

    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);

    // Operador ternario y nullish coalescing
    // Si nunca se guardaron datos, usamos el catálogo inicial

    let mueblesRecuperados;

    try {

        mueblesRecuperados = datosGuardados !== null
            ? JSON.parse(datosGuardados)
            : mueblesIniciales;

    } catch (error) {

        mueblesRecuperados = mueblesIniciales;

    }

    // Operador ?? para manejar valores inexistentes

    mueblesRecuperados = mueblesRecuperados ?? mueblesIniciales;

    // Validar que los datos sean un array

    if (!Array.isArray(mueblesRecuperados)) {
        mueblesRecuperados = mueblesIniciales;
    }

    // Reconstruir instancias de la clase Mueble
    // JSON.parse no recupera automáticamente los métodos

    return mueblesRecuperados
        .filter(mueble =>
            mueble !== null &&
            typeof mueble === "object" &&
            Number.isInteger(mueble.id) &&
            typeof mueble.nombre === "string" &&
            mueble.nombre.trim() !== "" &&
            Number.isFinite(mueble.precio) &&
            mueble.precio > 0 &&
            typeof mueble.categoria === "string" &&
            Number.isInteger(mueble.stock) &&
            mueble.stock >= 0
        )
        .map(mueble => {

            // Destructuring de objetos

            const {
                id,
                nombre,
                precio,
                categoria,
                stock
            } = mueble;

            return new Mueble(
                id,
                nombre,
                precio,
                categoria,
                stock
            );

        });

}


// Array principal de la aplicación

const catalogoMuebles = cargarMuebles();


// Guardar catálogo actualizado

function guardarMuebles() {

    localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(catalogoMuebles)
    );

}


// Guardar estado inicial si todavía no existe

if (localStorage.getItem(CLAVE_STORAGE) === null) {

    guardarMuebles();

}


// ==========================================
// 4. SELECCIÓN DE ELEMENTOS DEL DOM
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
// 5. FUNCIONES GENERALES
// ==========================================

function formatoPrecio(valor) {

    return "$" + valor.toLocaleString("es-AR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });

}


function calcularAnticipo(total) {

    return total * 0.5;

}


function clasificarPresupuesto(total) {

    return total >= 1000000
        ? "Presupuesto grande"
        : total >= 500000
            ? "Presupuesto mediano"
            : "Presupuesto pequeño";

}


// Evitar interpretar datos del usuario como HTML

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


// Feedback visual mediante DOM

function mostrarMensaje(texto, tipo = "exito") {

    mensaje.textContent = texto;

    mensaje.className = `mensaje visible ${tipo}`;

}


// ==========================================
// 6. RENDERIZADO DINÁMICO
// ==========================================

function renderizarMuebles() {

    const busqueda = inputBuscar.value.trim().toLowerCase();

    const precioIngresado = inputFiltroPresupuesto.value.trim();

    // Operador ternario

    const precioMaximo = precioIngresado === ""
        ? Infinity
        : Number(precioIngresado);


    // Filtrar muebles

    const mueblesFiltrados = catalogoMuebles.filter(mueble => {

        const coincideNombre = mueble.nombre
            .toLowerCase()
            .includes(busqueda);

        const coincidePrecio = mueble.precio <= precioMaximo;

        return coincideNombre && coincidePrecio;

    });


    // Mostrar resultados en pantalla

    if (mueblesFiltrados.length === 0) {

        contenedorItems.innerHTML = `
            <p class="sin-resultados">
                No encontramos muebles con esos filtros.
            </p>
        `;

        return;

    }


    // Destructuring y MAP

    contenedorItems.innerHTML = mueblesFiltrados.map(mueble => {

        const {
            id,
            nombre,
            precio,
            categoria,
            stock
        } = mueble;

        return `

            <article class="tarjeta-mueble">

                <div class="tarjeta-encabezado">

                    <h3>${escaparHTML(nombre)}</h3>

                    <span class="categoria">
                        ${escaparHTML(categoria)}
                    </span>

                </div>

                <p class="precio">
                    ${formatoPrecio(precio)}
                </p>

                <p class="stock">
                    Stock disponible: ${stock}
                </p>

                <div class="acciones">

                    <button
                        type="button"
                        class="btn btn-secundario btn-presupuestar"
                        data-id="${id}"
                    >
                        Presupuestar
                    </button>

                    <button
                        type="button"
                        class="btn btn-eliminar btn-borrar"
                        data-id="${id}"
                    >
                        Eliminar
                    </button>

                </div>

            </article>

        `;

    }).join("");

}


// ==========================================
// 7. ACTUALIZAR TODA LA INTERFAZ
// ==========================================

function actualizarInterfaz() {

    renderizarMuebles();

    actualizarSelectorMuebles();

    actualizarInventario();

}


// ==========================================
// 8. AGREGAR MUEBLES
// ==========================================

formularioMueble.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombre = inputNombre.value.trim();

    const precio = Number(inputPrecio.value);

    const categoria = inputCategoria.value;

    const stock = Number(inputStock.value);


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


    // Obtener un ID único

    const nuevoId = catalogoMuebles.reduce((maximo, mueble) => {

        return Math.max(maximo, mueble.id);

    }, 0) + 1;


    // Crear objeto

    const nuevoMueble = new Mueble(
        nuevoId,
        nombre,
        precio,
        categoria,
        stock
    );


    // Actualizar array

    catalogoMuebles.push(nuevoMueble);


    // Guardar cambios en localStorage

    guardarMuebles();


    // Actualizar DOM

    actualizarInterfaz();


    // Limpiar formulario

    formularioMueble.reset();


    mostrarMensaje(
        `El mueble "${nombre}" fue agregado y guardado correctamente.`,
        "exito"
    );

});


// ==========================================
// 9. ELIMINAR Y SELECCIONAR MUEBLES
// ==========================================

contenedorItems.addEventListener("click", function(evento) {

    const botonEliminar = evento.target.closest(".btn-borrar");

    const botonPresupuestar = evento.target.closest(".btn-presupuestar");


    // ELIMINAR

    if (botonEliminar) {

        const id = Number(botonEliminar.dataset.id);

        const indice = catalogoMuebles.findIndex(mueble => {
            return mueble.id === id;
        });


        if (indice === -1) {

            mostrarMensaje(
                "No encontramos el mueble seleccionado.",
                "error"
            );

            return;

        }


        const nombreEliminado = catalogoMuebles[indice].nombre;


        // Eliminar del array

        catalogoMuebles.splice(indice, 1);


        // Actualizar localStorage

        guardarMuebles();


        // Actualizar DOM

        actualizarInterfaz();


        resultadoPresupuesto.innerHTML = "";


        mostrarMensaje(
            `El mueble "${nombreEliminado}" fue eliminado correctamente.`,
            "exito"
        );

        return;

    }


    // PRESUPUESTAR

    if (botonPresupuestar) {

        const id = Number(botonPresupuestar.dataset.id);

        const muebleSeleccionado = catalogoMuebles.find(mueble => {
            return mueble.id === id;
        });


        // Optional chaining

        if (!muebleSeleccionado?.id) {

            mostrarMensaje(
                "El mueble seleccionado ya no está disponible.",
                "error"
            );

            return;

        }


        seleccionarMueble.value = String(id);


        formularioPresupuesto.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });


        mostrarMensaje(
            "Mueble seleccionado. Completá los datos del presupuesto.",
            "exito"
        );

    }

});


// ==========================================
// 10. EVENTOS DE TECLADO
// ==========================================

inputBuscar.addEventListener("input", function() {

    renderizarMuebles();

});


inputFiltroPresupuesto.addEventListener("input", function() {

    renderizarMuebles();

});


// ==========================================
// 11. SELECTOR DE MUEBLES
// ==========================================

function actualizarSelectorMuebles() {

    const seleccionAnterior = seleccionarMueble.value;


    seleccionarMueble.innerHTML = `
        <option value="">Seleccionar mueble</option>
    `;


    catalogoMuebles.forEach(mueble => {

        const opcion = document.createElement("option");

        opcion.value = mueble.id;

        opcion.textContent = `${mueble.nombre} - ${formatoPrecio(mueble.precio)}`;

        seleccionarMueble.appendChild(opcion);

    });


    const existeSeleccion = catalogoMuebles.some(mueble => {

        return String(mueble.id) === seleccionAnterior;

    });


    seleccionarMueble.value = existeSeleccion
        ? seleccionAnterior
        : "";

}


// ==========================================
// 12. CALCULAR PRESUPUESTO
// ==========================================

formularioPresupuesto.addEventListener("submit", function(evento) {

    evento.preventDefault();


    const nombreCliente = inputCliente.value.trim();

    const idMueble = Number(seleccionarMueble.value);

    const cantidad = Number(inputCantidad.value);


    const muebleSeleccionado = catalogoMuebles.find(mueble => {

        return mueble.id === idMueble;

    });


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
            `Stock insuficiente. Hay ${muebleSeleccionado.stock} unidades disponibles.`,
            "error"
        );

        return;

    }


    const total = muebleSeleccionado.calcularPrecio(cantidad);

    const anticipo = calcularAnticipo(total);

    const saldo = total - anticipo;

    const clasificacion = clasificarPresupuesto(total);


    // Destructuring

    const {
        nombre,
        precio
    } = muebleSeleccionado;


    resultadoPresupuesto.innerHTML = `

        <div class="resultado">

            <h3>Presupuesto generado</h3>

            <p>
                <strong>Cliente:</strong>
                ${escaparHTML(nombreCliente)}
            </p>

            <p>
                <strong>Mueble:</strong>
                ${escaparHTML(nombre)}
            </p>

            <p>
                <strong>Cantidad:</strong>
                ${cantidad}
            </p>

            <p>
                <strong>Precio unitario:</strong>
                ${formatoPrecio(precio)}
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
// 13. INVENTARIO
// ==========================================

function actualizarInventario() {

    const valorTotal = catalogoMuebles.reduce((acumulador, mueble) => {

        return acumulador + (mueble.precio * mueble.stock);

    }, 0);


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
// 14. INICIALIZACIÓN
// ==========================================

// Mostrar los datos recuperados de localStorage

actualizarInterfaz();