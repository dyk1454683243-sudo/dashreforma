import { describe, it, expect } from "vitest";
import {
  computeImpactDelta, deriveBurdenBar, deriveComparativo, derivePieData, parseApiResponse,
} from "./report";

describe("parseApiResponse", () => {
  it("returns the report as-is", () => {
    expect(parseApiResponse('{"resumo":{}}')).toEqual({ resumo: {} });
  });

  it("unwraps a report nested under `dados`", () => {
    expect(parseApiResponse('{"dados":{"saidas":{"venda_bruta":10}}}')).toEqual({ saidas: { venda_bruta: 10 } });
  });

  it("rejects an HTML page (server misconfiguration)", () => {
    expect(() => parseApiResponse("<!doctype html><html></html>")).toThrow(/HTML/);
    expect(() => parseApiResponse("  <html><body>login</body></html>")).toThrow(/HTML/);
  });

  it("rejects invalid JSON", () => {
    expect(() => parseApiResponse("not json")).toThrow();
  });
});

describe("computeImpactDelta", () => {
  const atual = { debitos: 100, creditos: 40, resultado: 60, carga_tributaria_efetiva: 12 };
  const reforma = { debitos: 130, creditos: 70, resultado: 60, carga_tributaria_efetiva: 10.5 };

  it("subtracts current-system figures from reform figures", () => {
    expect(computeImpactDelta(atual, reforma)).toEqual({ debitos: 30, creditos: 30, resultado: 0, carga: -1.5 });
  });

  it("returns null when either scenario is missing", () => {
    expect(computeImpactDelta(undefined, reforma)).toBeNull();
    expect(computeImpactDelta(atual, undefined)).toBeNull();
  });
});

describe("deriveBurdenBar", () => {
  it("prefers the chart block", () => {
    const chart = { labels: ["Atual", "Reforma"], datasets: [{ data: [9.5, 8.2] }] };
    expect(deriveBurdenBar("Compras", chart, { carga_tributaria_atual: 1, carga_tributaria_reforma: 2 }))
      .toEqual([{ name: "Compras", "Sistema Atual": 9.5, Reforma: 8.2 }]);
  });

  it("falls back to the operation totals", () => {
    expect(deriveBurdenBar("Vendas", undefined, { carga_tributaria_atual: 11, carga_tributaria_reforma: 9 }))
      .toEqual([{ name: "Vendas", "Sistema Atual": 11, Reforma: 9 }]);
  });

  it("treats missing totals as zero", () => {
    expect(deriveBurdenBar("Vendas", undefined, {})).toEqual([{ name: "Vendas", "Sistema Atual": 0, Reforma: 0 }]);
  });

  it("returns an empty list without any source", () => {
    expect(deriveBurdenBar("Compras")).toEqual([]);
  });
});

describe("derivePieData", () => {
  it("maps chart labels to values", () => {
    const chart = { labels: ["ICMS", "PIS"], datasets: [{ data: [50, 5] }] };
    expect(derivePieData(chart)).toEqual([{ name: "ICMS", value: 50 }, { name: "PIS", value: 5 }]);
  });

  it("fills missing chart values with zero", () => {
    const chart = { labels: ["ICMS", "PIS"], datasets: [{ data: [50] }] };
    expect(derivePieData(chart)).toEqual([{ name: "ICMS", value: 50 }, { name: "PIS", value: 0 }]);
  });

  it("sums product taxes when there is no chart and drops zero taxes", () => {
    const produtos = [
      { icms: 10, pis: 1, cofins: 4, ibs_cbs: 0 },
      { icms: 5, pis: 0.5, cofins: 2, ibs_cbs: 0 },
    ];
    expect(derivePieData(undefined, produtos)).toEqual([
      { name: "ICMS", value: 15 },
      { name: "PIS", value: 1.5 },
      { name: "COFINS", value: 6 },
    ]);
  });

  it("returns an empty list without chart or products", () => {
    expect(derivePieData()).toEqual([]);
  });
});

describe("deriveComparativo", () => {
  it("pairs dataset 0 (current) with dataset 1 (reform)", () => {
    const chart = { labels: ["ICMS", "IBS"], datasets: [{ data: [100, 0] }, { data: [0, 90] }] };
    expect(deriveComparativo(chart)).toEqual([
      { tributo: "ICMS", Atual: 100, Reforma: 0 },
      { tributo: "IBS", Atual: 0, Reforma: 90 },
    ]);
  });

  it("returns an empty list without a chart", () => {
    expect(deriveComparativo(undefined)).toEqual([]);
  });
});
