import assert from "node:assert/strict";
import test from "node:test";
import {
  actualizarEntradasHistorial,
  formatearFechaHora,
  MAXIMO_HISTORIAL
} from "../history-utils.mjs";

test("an updated query is moved to the front with its new timestamp", () => {
  const historial = [
    { codigo: "MSCU1234567", fechaHora: "2026-01-01T12:00:00.000Z" },
    { codigo: "TGHU7654321", fechaHora: "2026-01-02T12:00:00.000Z" }
  ];

  assert.deepEqual(
    actualizarEntradasHistorial(historial, "MSCU1234567", "2026-01-03T12:00:00.000Z"),
    [
      { codigo: "MSCU1234567", fechaHora: "2026-01-03T12:00:00.000Z" },
      { codigo: "TGHU7654321", fechaHora: "2026-01-02T12:00:00.000Z" }
    ]
  );
});

test("the history remains capped at ten entries", () => {
  const historial = Array.from({ length: MAXIMO_HISTORIAL }, (_, index) => ({
    codigo: `OLD${String(index).padStart(7, "0")}`,
    fechaHora: "2026-01-01T12:00:00.000Z"
  }));

  const actualizadas = actualizarEntradasHistorial(historial, "NEWC1234567", "2026-01-03T12:00:00.000Z");

  assert.equal(actualizadas.length, MAXIMO_HISTORIAL);
  assert.equal(actualizadas[0].codigo, "NEWC1234567");
  assert.equal(actualizadas.some((item) => item.codigo === "OLD0000009"), false);
});

test("legacy entries without a timestamp stay displayable without a date", () => {
  assert.equal(formatearFechaHora(undefined), null);
  assert.equal(formatearFechaHora("not-a-date"), null);
  assert.equal(typeof formatearFechaHora("2026-01-03T12:00:00.000Z"), "string");
});
