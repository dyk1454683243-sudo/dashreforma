import type { ChartJsData, DadosRelatorio, Entradas, Produto, ResumoApuracao, Saidas } from "./api-types";

export interface ImpactDelta {
  debitos: number;
  creditos: number;
  resultado: number;
  /** Variation of the effective burden, in percentage points. */
  carga: number;
}

export interface BurdenBar {
  name: string;
  "Sistema Atual": number;
  Reforma: number;
}

export interface PieSlice {
  name: string;
  value: number;
}

export interface ComparativoRow {
  tributo: string;
  Atual: number;
  Reforma: number;
}

/**
 * Parses the raw body returned by the API. The backend may wrap the report in
 * a `dados` key, and a misconfigured server answers with an HTML page.
 */
export const parseApiResponse = (text: string): DadosRelatorio => {
  const body = text.trimStart();
  if (body.startsWith("<!") || body.startsWith("<html")) {
    throw new Error("API retornou HTML em vez de JSON. Verifique se o servidor está rodando.");
  }
  const json = JSON.parse(body);
  return (json?.dados || json) as DadosRelatorio;
};

/** Reform minus current system, for each headline figure. */
export const computeImpactDelta = (
  atual?: ResumoApuracao,
  reforma?: ResumoApuracao,
): ImpactDelta | null => {
  if (!atual || !reforma) return null;
  return {
    debitos: reforma.debitos - atual.debitos,
    creditos: reforma.creditos - atual.creditos,
    resultado: reforma.resultado - atual.resultado,
    carga: reforma.carga_tributaria_efetiva - atual.carga_tributaria_efetiva,
  };
};

/**
 * Tax burden (current vs. reform) for purchases or sales. Prefers the chart
 * block sent by the backend and falls back to the operation totals.
 */
export const deriveBurdenBar = (
  name: string,
  chart?: ChartJsData,
  operacao?: Entradas | Saidas,
): BurdenBar[] => {
  const values = chart?.datasets?.[0]?.data;
  if (values) return [{ name, "Sistema Atual": values[0], Reforma: values[1] }];
  if (operacao) {
    return [{
      name,
      "Sistema Atual": operacao.carga_tributaria_atual || 0,
      Reforma: operacao.carga_tributaria_reforma || 0,
    }];
  }
  return [];
};

/**
 * Tax composition. Prefers the chart block sent by the backend and falls back
 * to summing the taxes of each product, dropping taxes that add up to zero.
 */
export const derivePieData = (chart?: ChartJsData, produtos: Produto[] = []): PieSlice[] => {
  if (chart) {
    return (chart.labels || []).map((label, i) => ({
      name: label,
      value: chart.datasets?.[0]?.data?.[i] || 0,
    }));
  }
  if (produtos.length === 0) return [];
  const totals: Record<string, number> = { ICMS: 0, PIS: 0, COFINS: 0, "IBS/CBS": 0 };
  produtos.forEach((p) => {
    totals.ICMS += p.icms || 0;
    totals.PIS += p.pis || 0;
    totals.COFINS += p.cofins || 0;
    totals["IBS/CBS"] += p.ibs_cbs || 0;
  });
  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));
};

/** Per-tax comparison: dataset 0 is the current system, dataset 1 the reform. */
export const deriveComparativo = (chart?: ChartJsData): ComparativoRow[] => {
  if (!chart) return [];
  return (chart.labels || []).map((label, i) => ({
    tributo: label,
    Atual: chart.datasets?.[0]?.data?.[i] || 0,
    Reforma: chart.datasets?.[1]?.data?.[i] || 0,
  }));
};
