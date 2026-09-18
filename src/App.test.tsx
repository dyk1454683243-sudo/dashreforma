import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes, ErrorBoundary } from "./App";

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe("<AppRoutes />", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renders the dashboard at the root route", () => {
    vi.stubGlobal("ResizeObserver", ResizeObserverStub);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 200, text: async () => "{}" }));

    render(<MemoryRouter initialEntries={["/"]}><AppRoutes /></MemoryRouter>);

    expect(screen.getByText("Calculadora Reforma Tributária")).toBeInTheDocument();
  });

  it("renders the 404 page for unknown routes, with a link back", () => {
    render(<MemoryRouter initialEntries={["/nada"]}><AppRoutes /></MemoryRouter>);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText(/\/nada/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Voltar ao dashboard/ })).toHaveAttribute("href", "/");
  });
});

describe("<ErrorBoundary />", () => {
  it("shows the error message instead of crashing", () => {
    const Broken = () => { throw new Error("quebrou"); };
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    // jsdom re-reports the thrown error as a window "error" event; keep the output clean.
    const swallow = (e: ErrorEvent) => e.preventDefault();
    window.addEventListener("error", swallow);

    render(<ErrorBoundary><Broken /></ErrorBoundary>);

    expect(screen.getByText(/Erro na aplicação/)).toBeInTheDocument();
    expect(screen.getByText("quebrou")).toBeInTheDocument();
    spy.mockRestore();
    window.removeEventListener("error", swallow);
  });
});
