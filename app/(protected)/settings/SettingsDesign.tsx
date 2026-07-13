"use client";

// transport-settings — the /settings route renders the same 6-section `SettingsPanel` the «Настройки» modal uses
// (deep-link + no-JS fallback). The shell header supplies the «НАСТРОЙКИ» title; here we render just the panel body.

import { SettingsPanel } from "./SettingsPanel";
import type { SettingsData } from "@/lib/view-models";

export function SettingsDesign(props: SettingsData) {
  return (
    <div style={{ maxWidth: 760, width: "100%", margin: "0 auto" }}>
      <SettingsPanel {...props} />
    </div>
  );
}
