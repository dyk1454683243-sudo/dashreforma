# dashreforma

Dashboard that simulates the impact of Brazil's consumption tax reform (**IBS / CBS / IS**) on a company's tax assessment, side by side with the current system.

> 🇧🇷 Painel que simula o impacto da Reforma Tributária (IBS, CBS e Imposto Seletivo) na apuração de uma empresa, comparando com o sistema atual. [Resumo em português](#resumo-em-português) no fim deste arquivo.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Status: early stage](https://img.shields.io/badge/status-early%20stage-orange.svg)

## Why

Constitutional Amendment 132/2023 replaces PIS, COFINS, ICMS, ISS and part of IPI with a dual VAT (IBS + CBS) plus a selective tax (IS), phased in from 2026 to 2033. Every Brazilian company and accounting firm needs to answer the same question: *"what happens to my tax burden?"* — and there is very little open tooling to help.

`dashreforma` is the front end for that answer: it takes a company's purchases and sales for a period, applies the reform rates you choose, and shows where the burden goes up or down.

## Features

- **Current system vs. reform** — debits, credits, net result and effective tax burden for both scenarios.
- **Impact cards** — variation in debits, credits, result (R$) and burden (percentage points).
- **Adjustable rates** — simulate any IBS, CBS and IS rate (defaults: 18.5% / 8.5% / 0%).
- **Charts** — tax burden on purchases and sales, comparison per tax (current vs. reform) and tax composition for inbound and outbound operations.
- **Top products** — the 10 most purchased and most sold products, with per-product value comparison and tax breakdown.
- **Filters** — company, start and end period; filters can be preset through the URL query string.
- **Auto refresh** — optional 30-second polling.

## Status

Early stage. The dashboard is functional but the project is young: test coverage is minimal, the API base path is hard-coded and the UI is Portuguese-only. See the [roadmap](#roadmap). Issues and pull requests are welcome.

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix) · Recharts · Framer Motion · TanStack Query · Vitest

## Getting started

Requires Node.js 18+ and npm.

```sh
git clone https://github.com/grupomg-tech/dashreforma.git
cd dashreforma
npm install
npm run dev      # dev server on http://localhost:8080
```

Other scripts:

```sh
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # ESLint
npm test         # Vitest
```

## Backend API

This repository contains the front end only. It expects a backend that serves:

```
GET /dashboards/api/graficos/dados-relatorio/
```

| Query parameter   | Example   | Description                     |
| ----------------- | --------- | ------------------------------- |
| `empresa`         | `1`       | Company identifier              |
| `periodo_inicial` | `2026-01` | First month of the period       |
| `periodo_final`   | `2026-06` | Last month of the period        |
| `aliquota_ibs`    | `18.5`    | IBS rate (%)                    |
| `aliquota_cbs`    | `8.5`     | CBS rate (%)                    |
| `aliquota_is`     | `0`       | Selective tax (IS) rate (%)     |

Expected response (JSON, optionally wrapped in a `dados` key):

```jsonc
{
  "resumo": {
    "apuracao_atual":   { "debitos": 0, "creditos": 0, "resultado": 0, "carga_tributaria_efetiva": 0 },
    "apuracao_reforma": { "debitos": 0, "creditos": 0, "resultado": 0, "carga_tributaria_efetiva": 0 }
  },
  "entradas": { "produtos": [ /* purchases, each with valor_total and tax fields */ ] },
  "saidas":   { "produtos": [ /* sales, same shape */ ] },
  "graficos": {
    // Chart.js-style objects: { labels: [], datasets: [{ data: [] }] }
    "carga_tributaria_compras": {},
    "carga_tributaria_vendas": {}
  }
}
```

### Deployment paths

The app is currently configured to be served under a sub-path of the backend:

- static assets: `base: "/static/dashboard-cliente/"` in [`vite.config.ts`](vite.config.ts)
- router: `basename="/dashboards/dashboard-cliente"` in [`src/App.tsx`](src/App.tsx)

Change both if you host it elsewhere.

## Project structure

```
src/
├── pages/Index.tsx                  # data fetching and page layout
└── components/dashboard/
    ├── FilterPanel.tsx              # company, period and rate filters
    ├── ImpactOverview.tsx           # impact and summary cards
    ├── TaxCharts.tsx                # burden, comparison and composition charts
    ├── TopProducts.tsx              # top purchased / sold products
    └── utils.ts                     # colors and pt-BR formatters
```

## Roadmap

- [ ] Configurable API URL and base path through environment variables
- [ ] Mock data / demo mode so the dashboard runs without a backend
- [ ] Typed API contract (replace `any`) and unit tests for the data mapping
- [ ] Classification of products (NCM) into the reform's differentiated regimes
- [ ] English UI (i18n)

## Contributing

1. Open an issue describing the bug or idea.
2. Fork, create a branch, and make sure `npm run lint` and `npm test` pass.
3. Open a pull request.

## Disclaimer

This is a simulation tool. Results depend entirely on the data and rates supplied and do not constitute tax or legal advice.

## License

[MIT](LICENSE) © 2026 Bruno Goncalves

---

## Resumo em português

O `dashreforma` é um painel (React + TypeScript) que compara a apuração tributária de uma empresa no **sistema atual** com a apuração simulada na **Reforma Tributária** (IBS, CBS e Imposto Seletivo). Permite ajustar as alíquotas, filtrar por empresa e período, ver a variação de débitos, créditos, resultado e carga tributária, e analisar os produtos mais comprados e mais vendidos.

Este repositório contém apenas o front end; os dados vêm de uma API própria (veja [Backend API](#backend-api)). Projeto em estágio inicial — contribuições são bem-vindas. Ferramenta de simulação: não substitui orientação tributária profissional.
