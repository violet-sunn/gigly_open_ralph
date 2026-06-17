import type { ReactNode } from "react";
import { Icon, ICON, Input, Button } from "@/app/components/primitives";
import { Stack } from "@/app/components/layout/Stack";
import { Rail } from "@/app/components/layout/Rail";
import { Panel } from "@/app/components/layout/Panel";
import { cx } from "@/app/components/layout/scale";
import { ProfileCard } from "./ProfileCard";
import type { SidebarNavVM, SidebarNavItemVM } from "./view-models";

const LOGO = "/assets/design-system/brand/gigly-logo.svg";
const resolveIcon = (icon: string): string => (ICON as Record<string, string>)[icon] ?? icon;

const NAV_BASE = "flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-default";
const navState = (active: boolean) =>
  active ? "bg-surface-level-3 text-strong" : "text-muted hover:bg-surface-level-3 hover:text-strong";

function NavMenuItem({ item, collapsed }: { item: SidebarNavItemVM; collapsed: boolean }) {
  if (collapsed) {
    return (
      <a href={item.href} aria-label={item.label} className={cx(NAV_BASE, navState(item.active), "justify-center p-2")}>
        <Icon src={resolveIcon(item.icon)} />
      </a>
    );
  }
  return (
    <a href={item.href} className={cx(NAV_BASE, navState(item.active), "gap-3 px-3 py-2")}>
      <Icon src={resolveIcon(item.icon)} />
      <span className="flex-1 text-label font-label">{item.label}</span>
      {item.count != null && <span className="text-caption font-caption text-subtle">{item.count}</span>}
    </a>
  );
}

/**
 * SidebarNav block (DESIGN_SYSTEM_SPEC §3.2) — role {client, specialist} × {expanded, collapsed}.
 * NavMenuItem(+count) + logo + ProfileCard + SupportCard + LogoutControl (sub-pieces internal).
 * collapsed → the Rail layout primitive (icon-rail). Token-pure; nav driven by the VM.
 */
export function SidebarNav({ vm, logout }: { vm: SidebarNavVM; logout?: ReactNode }) {
  const nav = (
    <Stack gap={1}>
      {vm.items.map((item) => (
        <NavMenuItem key={item.href} item={item} collapsed={vm.collapsed} />
      ))}
    </Stack>
  );

  if (vm.collapsed) {
    return (
      <Rail gap={3} aria-label="Навигация">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="Gigly" className="h-icon-rail w-auto" />
        {nav}
      </Rail>
    );
  }

  return (
    <Stack gap={6} className="bg-surface-level-1 p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO} alt="Gigly" className="h-8 w-auto" />
      {nav}
      <Panel surface={2} radius="lg" padding={3}>
        <Stack gap={2}>
          <span className="text-label font-label text-strong">Нужна помощь?</span>
          <Input placeholder="Опишите вопрос…" aria-label="Поддержка" />
          <Button variant="secondary">Отправить</Button>
        </Stack>
      </Panel>
      <ProfileCard variant="compact" vm={vm.profile} />
      {logout ?? <Button variant="ghost">Выйти</Button>}
    </Stack>
  );
}
