"use client";

import { useSearchParams } from "next/navigation";
import { RegisterWizard } from "./RegisterWizard";
import type { Role } from "@/app/components/blocks";

/** Reads the ?role= preselect (Suspense-wrapped per Next 15) and renders the wizard. */
export function RegisterRoleReader() {
  const param = useSearchParams().get("role");
  const role: Role | null = param === "CLIENT" || param === "SPECIALIST" ? param : null;
  return <RegisterWizard role={role} />;
}
