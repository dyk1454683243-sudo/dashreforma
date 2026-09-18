import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import TaxCharts from "./TaxCharts";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const empty = {
  barDataCompras: [], barDataVendas: [], pieDataEntradas: [], pieDataSaidas: [],
  comparativoEntradas: [], comparativoSaidas: [],
};

describe("<TaxCharts />", () => {
  beforeEach(() => vi.stubGlobal("ResizeObserver", ResizeObserverStub));
  afterEach(() => vi.unstubAllGlobals());

  it("renders nothing when every block is empty", () => {
    const { container } = render(<TaxCharts {...empty} />);
    expect(container.querySelector(".space-y-6")?.childElementCount ?? 0).toBe(0);
  });

  it("shows the burden gauges with the percentage-point difference", () => {
    render(<TaxCharts {...empty}
      barDataCompras={[{ name: "Compras", "Sistema Atual": 18.11, Reforma: 10.04 }]}
      barDataVendas={[{ name: "Vendas", "Sistema Atual": 18.11, Reforma: 10.04 }]} />);

    expect(screen.getByText("Carga Tributária — Compras")).toBeInTheDocument();
    expect(screen.getByText("Carga Tributária — Vendas")).toBeInTheDocument();
    expect(screen.getAllByText("-8.07 p.p.")).toHaveLength(2);
  });

  it("renders the donut legend with percentages that add up to 100%", () => {
    render(<TaxCharts {...empty}
      pieDataEntradas={[{ name: "ICMS", value: 750 }, { name: "PIS", value: 250 }]} />);

    expect(screen.getByText("Composição Tributária — Entradas")).toBeInTheDocument();
    expect(screen.queryByText("Composição Tributária — Saídas")).not.toBeInTheDocument();
    expect(screen.getByText("(75.0%)")).toBeInTheDocument();
    expect(screen.getByText("(25.0%)")).toBeInTheDocument();
  });

  it("hides the per-tax comparison when the backend sends no chart block", () => {
    render(<TaxCharts {...empty}
      comparativoSaidas={[{ tributo: "ICMS", Atual: 100, Reforma: 0 }]} />);

    expect(screen.getByText("Comparativo por Tributo — Saídas")).toBeInTheDocument();
    expect(screen.queryByText("Comparativo por Tributo — Entradas")).not.toBeInTheDocument();
  });

  it("shows inbound and outbound summaries only for the blocks present", () => {
    render(<TaxCharts {...empty}
      saidas={{ venda_bruta: 1000, debitos: 100, venda_liquida: 900, carga_tributaria_atual: 10, debitos_ibs_cbs: 80, venda_total_reforma: 980, carga_tributaria_reforma: 8.16 }} />);

    expect(screen.getByText("Resumo Saídas (Vendas)")).toBeInTheDocument();
    expect(screen.queryByText("Resumo Entradas (Compras)")).not.toBeInTheDocument();
    expect(screen.getByText("R$ 1.000,00")).toBeInTheDocument();
    expect(screen.getByText("8.16%")).toBeInTheDocument();
  });
});
