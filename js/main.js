// ==========================================
// PRE-ENTREGA 9
// ASINCRONISMO Y PROMESAS
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

const CLAVE_STORAGE = "catalogoMuebles";

let catalogoMuebles = [];

let catalogoCargado = false;


// Recuperar muebles guardados

function cargarMuebles() {

    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);

    let mueblesRecuperados = datosGuardados !== null
        ? JSON.parse(datosGuardados)
        : mueblesIniciales;

    mueblesRecuperados = mueblesRecuperados ?? mueblesIniciales;

    if (!Array.isArray(mueblesRecuperados)) {
        throw new Error("El catálogo almacenado no es válido.");
    }

    return mueblesRecuperados.map(mueble => {

        const {
            id,
            nombre,
            precio,
            categoria,
            stock
        } = mueble;

        if (
            !Number.isInteger(id) ||
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            !Number.isFinite(precio) ||
            precio <= 0 ||
            typeof categoria !== "string" ||
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


// Guardar cambios

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


// Mostrar mensajes en el DOM

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
// 7. ACTUALIZAR INTERFAZ
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

    if (!catalogoCargado) {
        mostrarMensaje("Esperá a que termine la carga del catálogo.", "error");
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


    try {

        catalogoMuebles.push(nuevoMueble);

        guardarMuebles();

        actualizarInterfaz();

        formularioMueble.reset();

        mostrarMensaje(
            `El mueble "${nombre}" fue agregado y guardado correctamente.`,
            "exito"
        );

    } catch (error) {

        catalogoMuebles.pop();

        actualizarInterfaz();

        mostrarMensaje(
            "No se pudo guardar el mueble. Intentá nuevamente.",
            "error"
        );

    }

});


// ==========================================
// 9. ELIMINAR Y SELECCIONAR MUEBLES
// ==========================================

contenedorItems.addEventListener("click", function(evento) {

    const botonEliminar = evento.target.closest(".btn-borrar");

    const botonPresupuestar = evento.target.closest(".btn-presupuestar");


    if (botonEliminar) {

        const id = Number(botonEliminar.dataset.id);

        const indice = catalogoMuebles.findIndex(mueble => {
            return mueble.id === id;
        });


        if (indice === -1) {
            mostrarMensaje("No encontramos el mueble seleccionado.", "error");
            return;
        }


        const muebleEliminado = catalogoMuebles[indice];

        try {

            catalogoMuebles.splice(indice, 1);

            guardarMuebles();

            actualizarInterfaz();

            resultadoPresupuesto.innerHTML = "";

            mostrarMensaje(
                `El mueble "${muebleEliminado.nombre}" fue eliminado correctamente.`,
                "exito"
            );

        } catch (error) {

            catalogoMuebles.splice(indice, 0, muebleEliminado);

            actualizarInterfaz();

            mostrarMensaje(
                "No se pudo eliminar el mueble. Intentá nuevamente.",
                "error"
            );

        }

        return;

    }


    if (botonPresupuestar) {

        const id = Number(botonPresupuestar.dataset.id);

        const muebleSeleccionado = catalogoMuebles.find(mueble => {
            return mueble.id === id;
        });


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

    if (!catalogoCargado) {
        mostrarMensaje("Esperá a que termine la carga del catálogo.", "error");
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
// 14. PROMESA PARA CARGAR MUEBLES
// ==========================================

// Simulamos una carga asincrónica del catálogo.
// La promesa se resuelve después de 1,5 segundos.

function obtenerMuebles() {

    return new Promise((resolve, reject) => {

        setTimeout(() => {

            try {

                const muebles = cargarMuebles();

                resolve(muebles);

            } catch (error) {

                reject(error);

            }

        }, 1500);

    });

}


// ==========================================
// 15. ASYNC / AWAIT Y TRY-CATCH-FINALLY
// ==========================================

async function iniciarSimulador() {

    estadoCarga.textContent = "⏳ Cargando catálogo de muebles...";

    estadoCarga.className = "estado-carga";

    catalogoCargado = false;

    try {

        // Esperar la resolución de la promesa

        const muebles = await obtenerMuebles();

        catalogoMuebles = muebles;

        // Guardar catálogo inicial solo si todavía no existe

        if (localStorage.getItem(CLAVE_STORAGE) === null) {
            guardarMuebles();
        }

        catalogoCargado = true;

        actualizarInterfaz();

        estadoCarga.textContent =
            `✔️ Catálogo cargado correctamente: ${catalogoMuebles.length} muebles disponibles.`;

        estadoCarga.className = "estado-carga carga-exitosa";

    } catch (error) {

        catalogoCargado = false;

        estadoCarga.textContent =
            "⚠️ No se pudo cargar el catálogo. Intentá nuevamente.";

        estadoCarga.className = "estado-carga carga-error";

        mostrarMensaje(
            "Ocurrió un error al cargar los muebles.",
            "error"
        );

    } finally {

        // Este bloque siempre se ejecuta.
        // Finaliza el estado de carga.

        estadoCarga.classList.add("carga-finalizada");

    }

}


// ==========================================
// 16. TEMPORIZADOR
// ==========================================

// Mostrar información complementaria después de 3,5 segundos.

setTimeout(() => {

    const aviso = document.createElement("div");

    aviso.className = "aviso-anticipo";

    aviso.textContent =
        "🔔 Recordá que podés calcular tu presupuesto con un anticipo del 50%.";

    const encabezado = document.querySelector(".header");

    encabezado.insertAdjacentElement("afterend", aviso);

}, 3500);


// ==========================================
// 17. INICIALIZACIÓN
// ==========================================

iniciarSimulador();