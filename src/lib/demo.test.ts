import { describe, it, expect } from "vitest";
import { buildDemoReport } from "./demo";

const RATES = { ibs: 18.5, cbs: 8.5, is: 0 };
const round2 = (n: number) => Math.round(n * 100) / 100;

describe("buildDemoReport", () => {
  const report = buildDemoReport(RATES);

  it("produces every block the dashboard renders", () => {
    expect(report.resumo?.apuracao_atual).toBeDefined();
    expect(report.resumo?.apuracao_reforma).toBeDefined();
    expect(report.entradas?.produtos?.length).toBeGreaterThan(0);
    expect(report.saidas?.produtos?.length).toBeGreaterThan(0);
    expect(report.graficos?.comparativo_entradas?.labels).toEqual(["ICMS", "PIS", "COFINS", "IBS", "CBS", "IS"]);
  });

  it("keeps each product internally consistent", () => {
    for (const p of [...report.entradas!.produtos!, ...report.saidas!.produtos!]) {
      const base = p.valor_total! - p.icms! - p.pis! - p.cofins!;
      expect(p.total_reforma).toBeCloseTo(base + p.ibs! + p.cbs! + p.is!, 2);
      expect(p.dif_total).toBeCloseTo(p.total_reforma! - p.valor_total!, 2);
      expect(p.ibs_cbs).toBeCloseTo(p.ibs! + p.cbs!, 2);
    }
  });

  it("aggregates purchases and sales from their products", () => {
    const compras = report.entradas!.produtos!;
    const vendas = report.saidas!.produtos!;
    const total = (items: typeof compras, key: string) => round2(items.reduce((s, i) => s + (Number(i[key]) || 0), 0));

    expect(report.entradas!.compra_bruta).toBe(total(compras, "valor_total"));
    expect(report.entradas!.creditos).toBe(total(compras, "creditos"));
    expect(report.entradas!.creditos_ibs_cbs).toBe(total(compras, "creditos_reforma"));
    expect(report.saidas!.venda_bruta).toBe(total(vendas, "valor_total"));
    expect(report.saidas!.debitos).toBe(total(vendas, "debitos"));
    expect(report.saidas!.debitos_ibs_cbs).toBe(total(vendas, "debitos_reforma"));
  });

  it("computes the assessment as debits minus credits", () => {
    const { apuracao_atual: atual, apuracao_reforma: reforma } = report.resumo!;
    expect(atual!.resultado).toBeCloseTo(atual!.debitos - atual!.creditos, 2);
    expect(reforma!.resultado).toBeCloseTo(reforma!.debitos - reforma!.creditos, 2);
    expect(atual!.carga_tributaria_efetiva).toBeGreaterThan(0);
    expect(reforma!.carga_tributaria_efetiva).toBeGreaterThan(0);
  });

  it("reacts to the chosen rates", () => {
    const zero = buildDemoReport({ ibs: 0, cbs: 0, is: 0 });
    expect(zero.resumo!.apuracao_reforma!.debitos).toBe(0);
    expect(zero.resumo!.apuracao_reforma!.creditos).toBe(0);

    const higher = buildDemoReport({ ibs: 20, cbs: 10, is: 0 });
    expect(higher.resumo!.apuracao_reforma!.debitos).toBeGreaterThan(report.resumo!.apuracao_reforma!.debitos);
  });

  it("applies the selective tax only to flagged products, on the debit side", () => {
    const withIs = buildDemoReport({ ...RATES, is: 10 });
    const vendas = withIs.saidas!.produtos!;
    const seletivos = vendas.filter((p) => (p.is as number) > 0);
    expect(seletivos.length).toBeGreaterThan(0);
    expect(seletivos.length).toBeLessThan(vendas.length);
    expect(withIs.resumo!.apuracao_reforma!.creditos).toBe(report.resumo!.apuracao_reforma!.creditos);
    expect(withIs.resumo!.apuracao_reforma!.debitos).toBeGreaterThan(report.resumo!.apuracao_reforma!.debitos);
  });

  it("applies reduced and zero rates to basic-basket products", () => {
    const arroz = report.entradas!.produtos!.find((p) => String(p.descricao).startsWith("Arroz"))!;
    const sabao = report.entradas!.produtos!.find((p) => String(p.descricao).startsWith("Sabão"))!;
    expect(arroz.ibs_cbs).toBe(0);
    expect(sabao.ibs_cbs).toBeGreaterThan(0);
  });
});
