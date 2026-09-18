import type { DadosRelatorio, Produto } from "./api-types";

/** Named columns of `Produto` in `api-types.ts`, in declaration order. */
export const PRODUTO_COLUMNS = [
  "descricao",
  "nome",
  "produto",
  "ncm",
  "quantidade",
  "valor_total",
  "total_reforma",
  "dif_total",
  "icms",
  "pis",
  "cofins",
  "ibs",
  "cbs",
  "ibs_cbs",
  "is",
  "creditos",
  "debitos",
  "creditos_reforma",
  "debitos_reforma",
] as const;

export const CSV_COLUMNS = ["tipo", ...PRODUTO_COLUMNS] as const;

export const CSV_SEPARATOR = ";";
export const CSV_BOM = "\uFEFF";
export const CSV_FILENAME = "simulacao-reforma.csv";

const NEEDS_QUOTES = /[;"\r\n]/;

/**
 * Serialises a report to a spreadsheet-friendly CSV: one row per product
 * (purchases then sales), `;` as separator, `,` as decimal mark, UTF-8 BOM.
 */
export const toCsv = (report: DadosRelatorio): string => {
  const rows = [CSV_COLUMNS.join(CSV_SEPARATOR)];
  appendProducts(rows, report.entradas?.produtos, "compra");
  appendProducts(rows, report.saidas?.produtos, "venda");
  return `${CSV_BOM}${rows.join("\n")}\n`;
};

/** Triggers a browser download of a CSV string. */
export const downloadCsv = (csv: string, filename = CSV_FILENAME): void => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const appendProducts = (
  rows: string[],
  produtos: Produto[] | undefined,
  tipo: "compra" | "venda",
): void => {
  if (!produtos) return;
  for (const product of produtos) {
    if (!product || typeof product !== "object") continue;
    rows.push([tipo, ...PRODUTO_COLUMNS.map((key) => formatCell(product[key]))].join(CSV_SEPARATOR));
  }
};

const formatCell = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return "";
    return escapeCsv(String(value).replace(".", ","));
  }
  return escapeCsv(value);
};

const escapeCsv = (value: string): string => {
  if (!NEEDS_QUOTES.test(value)) return value;
  return `"${value.replace(/"/g, "\"\"")}"`;
};
