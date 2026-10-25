// Coordina la búsqueda, la ficha operativa y el historial del navegador.
const CLAVE_HISTORIAL = "muelle-ops-historial";
const MAXIMO_HISTORIAL = 10;

const formulario = document.querySelector("#search-form");
const campoCodigo = document.querySelector("#container-code");
const mensajeBusqueda = document.querySelector("#search-message");
const seccionResultado = document.querySelector("#result-section");
const encabezadoResultado = document.querySelector("#result-heading");
const tarjetaContenedor = document.querySelector("#container-card");
const estadoVacio = document.querySelector("#empty-state");
const listaHistorial = document.querySelector("#history-list");
const mensajeHistorialVacio = document.querySelector("#history-empty");
const contadorHistorial = document.querySelector("#history-count");
const encabezadoHistorial = document.querySelector("#history-heading");
const botonLimpiar = document.querySelector("#clear-history");
const dialogoLimpiarHistorial = document.querySelector("#clear-history-dialog");
const botonCancelarLimpieza = document.querySelector("#cancel-clear-history");
const botonConfirmarLimpieza = document.querySelector("#confirm-clear-history");
const mensajeErrorLimpieza = document.querySelector("#clear-history-error");
const reloj = document.querySelector("#current-time");

// Convierte entradas con minúsculas o espacios a un código canónico.
function normalizarCodigo(codigo) {
  return codigo.replace(/\s/g, "").toUpperCase();
}

// Acepta el formato de cuatro letras seguido por siete dígitos.
function codigoEsValido(codigo) {
  return /^[A-Z]{4}\d{7}$/.test(codigo);
}

function obtenerContenedor(codigo) {
  return window.CONTENEDORES.find((contenedor) => contenedor.codigo === codigo);
}

// Si el almacenamiento está bloqueado, se informa al usuario sin romper la consulta.
function leerHistorial() {
  try {
    const historialGuardado = localStorage.getItem(CLAVE_HISTORIAL);
    const historial = historialGuardado ? JSON.parse(historialGuardado) : [];
    return Array.isArray(historial)
      ? historial.filter((item) => item && typeof item.codigo === "string")
      : [];
  } catch (error) {
    mostrarMensaje("No se pudo acceder al historial guardado en este navegador.", true);
    return [];
  }
}

function guardarHistorial(historial) {
  try {
    localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
    return true;
  } catch (error) {
    mostrarMensaje("Consulta realizada, pero no se pudo guardar el historial.", true);
    return false;
  }
}

function actualizarHistorial(codigo) {
  const historial = leerHistorial().filter((item) => item.codigo !== codigo);
  historial.unshift({ codigo });
  const historialReciente = historial.slice(0, MAXIMO_HISTORIAL);
  guardarHistorial(historialReciente);
  dibujarHistorial(historialReciente);
}

function dibujarHistorial(historial = leerHistorial()) {
  listaHistorial.replaceChildren();

  historial.forEach((item) => {
    const contenedor = obtenerContenedor(item.codigo);
    if (!contenedor) return;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.className = "history-item";
    boton.dataset.codigo = contenedor.codigo;
    boton.setAttribute("aria-label", `Consultar ${contenedor.codigo}, estado ${contenedor.estado}`);

    const codigo = document.createElement("span");
    codigo.className = "history-code";
    codigo.textContent = contenedor.codigo;

    const estado = document.createElement("span");
    estado.className = `history-state ${claseEstado(contenedor.estado)}`;
    estado.textContent = contenedor.estado;

    boton.append(codigo, estado);
    listaHistorial.append(boton);
  });

  const tieneElementos = listaHistorial.childElementCount > 0;
  mensajeHistorialVacio.hidden = tieneElementos;
  botonLimpiar.disabled = !tieneElementos;
  contadorHistorial.textContent = String(listaHistorial.childElementCount);
}

function claseEstado(estado) {
  return `state-${estado.toLowerCase().replace(/\s/g, "-")}`;
}

function mostrarMensaje(texto, esError = false) {
  mensajeBusqueda.textContent = texto;
  mensajeBusqueda.dataset.tipo = esError ? "error" : "info";
}

function crearDetalle(etiqueta, valor, clase = "") {
  const elemento = document.createElement("div");
  elemento.className = "detail-item";

  const nombre = document.createElement("span");
  nombre.className = "detail-label";
  nombre.textContent = etiqueta;

  const dato = document.createElement("span");
  dato.className = `detail-value ${clase}`.trim();
  dato.textContent = valor;

  elemento.append(nombre, dato);
  return elemento;
}

function mostrarContenedor(contenedor) {
  tarjetaContenedor.replaceChildren();

  const encabezado = document.createElement("div");
  encabezado.className = "card-top";

  const identidad = document.createElement("div");
  identidad.className = "container-identity";
  identidad.innerHTML = `
    <span class="container-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" fill="none">
        <path d="M4 11 16 5l12 6v13l-12 6-12-6V11Z" stroke="currentColor" stroke-width="1.6"/>
        <path d="m4.5 11.3 11.5 6 11.5-6M16 17.5V30M10 8l12 6.3v5" stroke="currentColor" stroke-width="1.6"/>
      </svg>
    </span>
    <span>
      <span class="identity-label">CÓDIGO DE UNIDAD</span>
      <span class="container-code"></span>
    </span>`;
  identidad.querySelector(".container-code").textContent = contenedor.codigo;

  const estado = document.createElement("span");
  estado.className = `state-badge ${claseEstado(contenedor.estado)}`;
  estado.textContent = contenedor.estado;
  encabezado.append(identidad, estado);

  const contenido = document.createElement("div");
  contenido.className = "card-content";

  const detalles = document.createElement("div");
  detalles.className = "detail-grid";
  detalles.append(
    crearDetalle("Peso bruto", `${new Intl.NumberFormat("es-ES").format(contenedor.pesoKg)} kg`, "mono"),
    crearDetalle("Tipo", contenedor.tipo, "mono"),
    crearDetalle("Refrigeración", contenedor.refrigerado ? "Sí" : "No"),
    crearDetalle("Peligroso", contenedor.peligroso ? "Sí · IMO" : "No", contenedor.peligroso ? "danger-value" : "safe-value")
  );

  const ubicacion = document.createElement("div");
  ubicacion.className = "location-block";
  ubicacion.innerHTML = `
    <span class="location-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 20V9l8-5 8 5v11M2.5 20h19M8 20v-6h8v6M8 9h.01M12 9h.01M16 9h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span>
      <span class="location-caption">UBICACIÓN EN PATIO</span>
      <span class="location-value"></span>
    </span>`;
  ubicacion.querySelector(".location-value").textContent =
    `Bahía ${contenedor.ubicacion.bahia} / Fila ${contenedor.ubicacion.fila} / Nivel ${contenedor.ubicacion.nivel}`;

  contenido.append(detalles, ubicacion);

  if (contenedor.peligroso) {
    const alerta = document.createElement("div");
    alerta.className = "hazard-alert";
    alerta.setAttribute("role", "status");
    alerta.innerHTML = `
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 2.5 18 17H2L10 2.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
        <path d="M10 7v4.5m0 2.5v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>CARGA PELIGROSA · Verificar protocolo de seguridad antes de manipular</span>`;
    contenido.append(alerta);
  }

  tarjetaContenedor.append(encabezado, contenido);
  seccionResultado.hidden = false;
  estadoVacio.hidden = true;
  seccionResultado.scrollIntoView({ block: "start" });
  encabezadoResultado.focus({ preventScroll: true });
}

function consultar(codigoOriginal) {
  const codigo = normalizarCodigo(codigoOriginal);

  if (!codigoEsValido(codigo)) {
    campoCodigo.setAttribute("aria-invalid", "true");
    mostrarMensaje("Formato inválido. Ingresa 4 letras seguidas de 7 dígitos (ej.: MSCU1234567).", true);
    seccionResultado.hidden = true;
    estadoVacio.hidden = false;
    return;
  }

  campoCodigo.value = codigo;
  campoCodigo.removeAttribute("aria-invalid");

  const contenedor = obtenerContenedor(codigo);
  if (!contenedor) {
    mostrarMensaje(`No se encontró el contenedor ${codigo} en los datos disponibles.`, true);
    seccionResultado.hidden = true;
    estadoVacio.hidden = false;
    return;
  }

  mostrarMensaje("");
  mostrarContenedor(contenedor);
  actualizarHistorial(codigo);
}

function limpiarHistorial() {
  mensajeErrorLimpieza.hidden = true;
  try {
    localStorage.removeItem(CLAVE_HISTORIAL);
    dibujarHistorial([]);
    dialogoLimpiarHistorial.close();
    encabezadoHistorial.focus();
  } catch (error) {
    const mensaje = "No se pudo limpiar el historial guardado en este navegador.";
    mensajeErrorLimpieza.textContent = mensaje;
    mensajeErrorLimpieza.hidden = false;
    mostrarMensaje(mensaje, true);
  }
}

function solicitarLimpiezaHistorial() {
  mensajeErrorLimpieza.hidden = true;
  mensajeErrorLimpieza.textContent = "";
  dialogoLimpiarHistorial.showModal();
}

function actualizarReloj() {
  reloj.textContent = new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date());
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  consultar(campoCodigo.value);
});

campoCodigo.addEventListener("input", () => {
  campoCodigo.removeAttribute("aria-invalid");
  mostrarMensaje("");
});

listaHistorial.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-codigo]");
  if (boton) consultar(boton.dataset.codigo);
});

botonLimpiar.addEventListener("click", solicitarLimpiezaHistorial);
botonCancelarLimpieza.addEventListener("click", () => dialogoLimpiarHistorial.close());
botonConfirmarLimpieza.addEventListener("click", limpiarHistorial);

dibujarHistorial();
actualizarReloj();
window.setInterval(actualizarReloj, 30_000);
