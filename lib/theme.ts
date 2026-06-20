/**
 * Theme controller (add-light-theme). Dark is the default; light is opt-in and persisted in
 * localStorage under `gigly-theme`, applied via the root `data-theme` attribute — the same key the
 * no-flash boot script in `app/layout.tsx` reads before first paint. Framework-agnostic + SSR-safe
 * (guards on window/document), so a composed screen can import it (`@/lib` is allowlisted).
 */
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "gigly-theme";

/** The stored theme, or `"dark"` (the default) when unset / on the server. */
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/** Apply a theme: set `<html data-theme>` and persist the choice. */
export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* storage unavailable (private mode) — the attribute still applies for this session */
  }
}

/**
 * The inline boot script applied in <head> before first paint to avoid a flash-of-incorrect-theme.
 * Kept as a string so it can be injected via dangerouslySetInnerHTML in the server layout.
 */
export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;
