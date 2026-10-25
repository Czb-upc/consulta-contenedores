export const MAXIMO_HISTORIAL = 10;

export function actualizarEntradasHistorial(historial, codigo, fechaHora = new Date().toISOString()) {
  return [
    { codigo, fechaHora },
    ...historial.filter((item) => item.codigo !== codigo)
  ].slice(0, MAXIMO_HISTORIAL);
}

export function formatearFechaHora(fechaHora) {
  if (typeof fechaHora !== "string" || Number.isNaN(Date.parse(fechaHora))) {
    return null;
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(fechaHora));
}
