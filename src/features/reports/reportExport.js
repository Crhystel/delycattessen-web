import { formatAmount } from "./reportUtils";

// Rows of the CSV sent to Human Resources: a header with the period, the
// summary per teacher with the grand total and, below, every consumption.
// `report` is the adapted report (see adaptReport).
export function buildReportRows(report, institutionLabel, generatedAt) {
  return [
    ["Reporte de consumos a crédito docente"],
    ["Sede", institutionLabel],
    ["Periodo", report.period],
    ["Generado", generatedAt.toLocaleString("es-EC")],
    [],
    ["Resumen por docente"],
    ["Docente", "Correo", "Sede", "N.º de consumos", "Total"],
    ...report.teachers.map((t) => [
      t.fullName,
      t.email,
      t.institutionName,
      t.consumptions,
      formatAmount(t.total),
    ]),
    [
      "Total general",
      "",
      "",
      report.totals.consumptions,
      formatAmount(report.totals.amount),
    ],
    [],
    ["Detalle de consumos"],
    ["Docente", "Sede", "Fecha", "Hora", "Productos", "Monto"],
    ...report.teachers.flatMap((t) =>
      t.sales.map((sale) => [
        t.fullName,
        t.institutionName,
        sale.date,
        sale.time,
        sale.products,
        formatAmount(sale.amount),
      ]),
    ),
  ];
}

function toCsv(rows) {
  return rows
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
    )
    .join("\r\n");
}

// Downloads the rows as a CSV. The BOM makes Excel read the accents as UTF-8.
export function downloadCsv(fileName, rows) {
  const blob = new Blob(["﻿", toCsv(rows)], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
