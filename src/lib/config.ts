/**
 * Runtime configuration, read from Vite env variables (see `.env.example`).
 * The defaults match the original deployment, where the app is served under a
 * sub-path of the backend.
 */

const env = import.meta.env;

/** Endpoint that returns the report. */
export const API_URL: string = env.VITE_API_URL || "/dashboards/api/graficos/dados-relatorio/";

/** `basename` of the router; must match where the app is hosted. */
export const ROUTER_BASENAME: string = env.VITE_ROUTER_BASENAME || "/dashboards/dashboard-cliente";

/** Demo mode: `VITE_DEMO=true` at build time, or `?demo=1` in the URL. */
export const isDemoMode = (search: string = window.location.search): boolean => {
  if (env.VITE_DEMO === "true") return true;
  const flag = new URLSearchParams(search).get("demo");
  return flag === "1" || flag === "true";
};
