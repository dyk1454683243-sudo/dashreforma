import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterPanel from "./FilterPanel";

const baseProps = () => ({
  empresa: "1", setEmpresa: vi.fn(),
  periodoInicial: "2026-01", setPeriodoInicial: vi.fn(),
  periodoFinal: "2026-06", setPeriodoFinal: vi.fn(),
  aliquotaIbs: "18.5", setAliquotaIbs: vi.fn(),
  aliquotaCbs: "8.5", setAliquotaCbs: vi.fn(),
  aliquotaIs: "0", setAliquotaIs: vi.fn(),
  loading: false,
  autoRefresh: false, setAutoRefresh: vi.fn(),
  onSubmit: vi.fn(),
});

describe("<FilterPanel />", () => {
  it("renders the current filter values", () => {
    render(<FilterPanel {...baseProps()} />);
    expect((screen.getByLabelText("Empresa") as HTMLInputElement).value).toBe("1");
    expect((screen.getByLabelText("IBS (%)") as HTMLInputElement).value).toBe("18.5");
    expect((screen.getByLabelText("CBS (%)") as HTMLInputElement).value).toBe("8.5");
    expect((screen.getByLabelText("IS (%)") as HTMLInputElement).value).toBe("0");
  });

  it("propagates edits through the setters", () => {
    const props = baseProps();
    render(<FilterPanel {...props} />);

    fireEvent.change(screen.getByLabelText("Empresa"), { target: { value: "7" } });
    fireEvent.change(screen.getByLabelText("IBS (%)"), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText("IS (%)"), { target: { value: "5" } });

    expect(props.setEmpresa).toHaveBeenCalledWith("7");
    expect(props.setAliquotaIbs).toHaveBeenCalledWith("20");
    expect(props.setAliquotaIs).toHaveBeenCalledWith("5");
  });

  it("submits without reloading the page", () => {
    const props = baseProps();
    render(<FilterPanel {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /Simular/ }));

    expect(props.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("disables the submit button while loading", () => {
    render(<FilterPanel {...baseProps()} loading />);
    expect(screen.getByRole("button", { name: /Simulando|Simular/ })).toBeDisabled();
  });

  it("toggles auto refresh", () => {
    const props = baseProps();
    render(<FilterPanel {...props} />);

    fireEvent.click(screen.getByRole("button", { name: /Auto 30s/ }));

    expect(props.setAutoRefresh).toHaveBeenCalledWith(true);
  });
});
