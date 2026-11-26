// ==========================================
// PRE-ENTREGA 10
// APIs, PETICIONES Y LIBRERÍAS
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
// 2. VARIABLES GENERALES
// ==========================================

const CLAVE_STORAGE = "catalogoMuebles";

let catalogoMuebles = [];

let catalogoCargado = false;


// ==========================================
// 3. LOCALSTORAGE
// ==========================================

function convertirMuebles(datos) {

    if (!Array.isArray(datos)) {
        throw new Error("El catálogo no es válido.");
    }

    return datos.map(mueble => {

        const {
            id,
            nombre,
            precio,
            categoria,
            stock
        } = mueble;

        if (
            !Number.isInteger(id) ||
            id <= 0 ||
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            !Number.isFinite(precio) ||
            precio <= 0 ||
            typeof categoria !== "string" ||
            categoria.trim() === "" ||
            !Number.isInteger(stock) ||
            stock < 0
        ) {
            throw new Error("Se encontró un mueble con datos inválidos.");
        }

        return new Mueble(
            id,
            nombre,
            precio,
            categoria,
            stock
        );

    });

}


function cargarMuebles(datosIniciales) {

    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);

    if (datosGuardados !== null) {

        return convertirMuebles(
            JSON.parse(datosGuardados)
        );

    }

    return convertirMuebles(datosIniciales);

}


function guardarMuebles() {

    localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(catalogoMuebles)
    );

}


// ==========================================
// 4. ELEMENTOS DEL DOM
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

const estadoCarga = document.getElementById("estado-carga");

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


// ==========================================
// 6. LIBRERÍA SWEETALERT2
// ==========================================

function mostrarMensaje(texto, tipo = "exito") {

    // Alternativa visual si la librería no está disponible

    if (typeof Swal === "undefined") {

        mensaje.textContent = texto;

        mensaje.className = `mensaje visible ${tipo}`;

        return;

    }

    mensaje.className = "mensaje";

    if (tipo === "error") {

        Swal.fire({
            icon: "error",
            title: "Ocurrió un problema",
            text: texto,
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#2563eb"
        });

    } else {

        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "success",
            titleText: texto,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

    }

}


// Confirmación antes de eliminar un mueble

async function confirmarEliminacion(nombre) {

    if (typeof Swal === "undefined") {

        mostrarMensaje(
            "No se pudo cargar la librería de confirmación. Recargá la página.",
            "error"
        );

        return false;

    }

    const resultado = await Swal.fire({

        title: "¿Eliminar mueble?",

        text: `Estás por eliminar "${nombre}" del catálogo.`,

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Sí, eliminar",

        cancelButtonText: "Cancelar",

        confirmButtonColor: "#dc2626",

        cancelButtonColor: "#64748b"

    });

    return resultado.isConfirmed;

}


// ==========================================
// 7. RENDERIZADO DINÁMICO DEL CATÁLOGO
// ==========================================

function renderizarMuebles() {

    const busqueda = inputBuscar.value.trim().toLowerCase();

    const precioIngresado = inputFiltroPresupuesto.value.trim();

    const precioMaximo = precioIngresado === ""
        ? Infinity
        : Number(precioIngresado);


    const mueblesFiltrados = catalogoMuebles.filter(mueble => {

        const coincideNombre = mueble.nombre
            .toLowerCase()
            .includes(busqueda);

        const coincidePrecio = mueble.precio <= precioMaximo;

        return coincideNombre && coincidePrecio;

    });


    if (mueblesFiltrados.length === 0) {

        contenedorItems.innerHTML = `
            <p class="sin-resultados">
                No encontramos muebles con esos filtros.
            </p>
        `;

        return;

    }


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
// 8. ACTUALIZAR INTERFAZ
// ==========================================

function actualizarInterfaz() {

    renderizarMuebles();

    actualizarSelectorMuebles();

    actualizarInventario();

}


// Habilitar o deshabilitar formularios

function habilitarControles(habilitado) {

    formularioMueble.querySelectorAll("input, select, button")
        .forEach(elemento => {

            elemento.disabled = !habilitado;

        });

    formularioPresupuesto.querySelectorAll("input, select, button")
        .forEach(elemento => {

            elemento.disabled = !habilitado;

        });

    inputBuscar.disabled = !habilitado;

    inputFiltroPresupuesto.disabled = !habilitado;

}


// ==========================================
// 9. AGREGAR MUEBLES
// ==========================================

formularioMueble.addEventListener("submit", function(evento) {

    evento.preventDefault();

    if (!catalogoCargado) {

        mostrarMensaje(
            "El catálogo todavía no está disponible.",
            "error"
        );

        return;

    }


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


    const nuevoId = catalogoMuebles.reduce((maximo, mueble) => {

        return Math.max(maximo, mueble.id);

    }, 0) + 1;


    const nuevoMueble = new Mueble(
        nuevoId,
        nombre,
        precio,
        categoria,
        stock
    );


    catalogoMuebles.push(nuevoMueble);

    try {

        guardarMuebles();

    } catch (error) {

        catalogoMuebles.pop();

        mostrarMensaje(
            "No se pudo guardar el mueble. Intentá nuevamente.",
            "error"
        );

        return;

    }

    actualizarInterfaz();

    formularioMueble.reset();

    mostrarMensaje(
        `El mueble "${nombre}" fue agregado correctamente.`,
        "exito"
    );

});


// ==========================================
// 10. ELIMINAR Y SELECCIONAR MUEBLES
// ==========================================

contenedorItems.addEventListener("click", async function(evento) {

    const botonEliminar = evento.target.closest(".btn-borrar");

    const botonPresupuestar = evento.target.closest(".btn-presupuestar");


    if (!catalogoCargado) {
        return;
    }


    if (botonEliminar) {

        const id = Number(botonEliminar.dataset.id);

        const mueble = catalogoMuebles.find(mueble => {

            return mueble.id === id;

        });


        if (!mueble) {

            mostrarMensaje(
                "No encontramos el mueble seleccionado.",
                "error"
            );

            return;

        }


        // Confirmación mediante SweetAlert2

        const confirmado = await confirmarEliminacion(mueble.nombre);

        if (!confirmado) {
            return;
        }


        const indice = catalogoMuebles.findIndex(mueble => {

            return mueble.id === id;

        });


        if (indice === -1) {
            return;
        }


        const muebleEliminado = catalogoMuebles[indice];

        catalogoMuebles.splice(indice, 1);


        try {

            guardarMuebles();

        } catch (error) {

            catalogoMuebles.splice(indice, 0, muebleEliminado);

            mostrarMensaje(
                "No se pudo eliminar el mueble.",
                "error"
            );

            return;

        }

        actualizarInterfaz();

        resultadoPresupuesto.innerHTML = "";

        mostrarMensaje(
            `El mueble "${muebleEliminado.nombre}" fue eliminado correctamente.`,
            "exito"
        );

        return;

    }


    if (botonPresupuestar) {

        const id = Number(botonPresupuestar.dataset.id);

        const muebleSeleccionado = catalogoMuebles.find(mueble => {

            return mueble.id === id;

        });


        if (!muebleSeleccionado) {

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
// 11. FILTROS Y EVENTOS DE TECLADO
// ==========================================

inputBuscar.addEventListener("input", function() {

    if (catalogoCargado) {
        renderizarMuebles();
    }

});


inputFiltroPresupuesto.addEventListener("input", function() {

    if (catalogoCargado) {
        renderizarMuebles();
    }

});


// ==========================================
// 12. SELECTOR DE MUEBLES
// ==========================================

function actualizarSelectorMuebles() {

    const seleccionAnterior = seleccionarMueble.value;

    seleccionarMueble.innerHTML = `
        <option value="">Seleccionar mueble</option>
    `;


    catalogoMuebles.forEach(mueble => {

        const opcion = document.createElement("option");

        opcion.value = mueble.id;

        opcion.textContent =
            `${mueble.nombre} - ${formatoPrecio(mueble.precio)}`;

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
// 13. CALCULAR PRESUPUESTO
// ==========================================

formularioPresupuesto.addEventListener("submit", function(evento) {

    evento.preventDefault();


    if (!catalogoCargado) {

        mostrarMensaje(
            "El catálogo todavía no está disponible.",
            "error"
        );

        return;

    }


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
// 14. RESUMEN DEL INVENTARIO
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
// 15. PROMESA Y TEMPORIZADOR
// ==========================================

// Conservamos el uso de promesas de la entrega 9.
// La demora permite visualizar el indicador de carga.

function esperar(milisegundos) {

    return new Promise(resolve => {

        setTimeout(resolve, milisegundos);

    });

}


// ==========================================
// 16. FETCH, ASYNC/AWAIT Y MANEJO DE ERRORES
// ==========================================

async function iniciarSimulador() {

    estadoCarga.hidden = false;

    estadoCarga.className = "estado-carga";

    estadoCarga.innerHTML = `
        <span class="spinner"></span>
        Cargando catálogo de muebles...
    `;

    catalogoCargado = false;

    habilitarControles(false);


    try {

        // Petición al archivo JSON local

        const respuesta = await fetch("./data.json");


        // Validar el estado de la respuesta HTTP

        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );

        }


        // Convertir la respuesta a datos JavaScript

        const datos = await respuesta.json();


        // Validar los datos recibidos

        const mueblesIniciales = convertirMuebles(datos);


        // Demora visual para mostrar el indicador

        await esperar(1000);


        // Recuperar cambios anteriores del localStorage

        catalogoMuebles = cargarMuebles(mueblesIniciales);


        // Guardar los datos iniciales si no existen

        if (localStorage.getItem(CLAVE_STORAGE) === null) {

            guardarMuebles();

        }


        // Renderizar los datos en el DOM

        actualizarInterfaz();

        catalogoCargado = true;


        // Notificación exitosa con SweetAlert2

        mostrarMensaje(
            "Catálogo cargado correctamente.",
            "exito"
        );


    } catch (error) {

        // Capturar errores de red, HTTP o datos inválidos

        catalogoCargado = false;

        console.error("Error al cargar el catálogo:", error);


        contenedorItems.innerHTML = `

            <p class="sin-resultados">
                No se pudo cargar el catálogo de muebles.
                Recargá la página para intentar nuevamente.
            </p>

        `;


        // Notificación de error con SweetAlert2

        mostrarMensaje(
            "No se pudo cargar el catálogo de muebles. Verificá la conexión y el archivo data.json.",
            "error"
        );


    } finally {

        // Ocultar el indicador tanto si hay éxito
        // como si ocurre un error

        estadoCarga.hidden = true;

        habilitarControles(catalogoCargado);

    }

}


// ==========================================
// 17. TEMPORIZADOR INFORMATIVO
// ==========================================

setTimeout(() => {

    const aviso = document.createElement("div");

    aviso.className = "aviso-anticipo";

    aviso.textContent =
        "🔔 Recordá que podés calcular tu presupuesto con un anticipo del 50%.";

    const encabezado = document.querySelector(".header");

    encabezado.insertAdjacentElement("afterend", aviso);

}, 3500);


// ==========================================
// 18. INICIALIZACIÓN DEL SIMULADOR
// ==========================================

iniciarSimulador();