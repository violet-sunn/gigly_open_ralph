import type { ReactNode } from "react";
import { Tag, StatusBadge, type Category } from "@/app/components/primitives";
import { Panel } from "@/app/components/layout/Panel";
import { Stack } from "@/app/components/layout/Stack";
import { ProfileCard } from "./ProfileCard";
import { RequirementCard } from "./RequirementCard";
import type { ApplicantCardVM } from "./view-models";

/** Cycle the five category colours so a stack of tech tags reads like the mock (mirrors TagList). */
const TAG_COLORS: Category[] = ["programming", "design", "development", "marketing", "coding"];

/**
 * ApplicantCard block (build-applications-screen, DESIGN_SYSTEM_SPEC §3.2) — the company «Отклики» applicant card
 * (Figma `applications`): a `ProfileCard` identity row (avatar + name + level + rating) with a status pill, the tech
 * tags, and the **Подход** / **Уточняющие вопросы** / **Оценка трудозатрат** sections (`RequirementCard`). The
 * accept/reject server-action forms are passed in as `children` (the wiring stays in the screen — F5). Token-pure;
 * presentational (no server-action imports).
 */
export function ApplicantCard({ vm, children }: { vm: ApplicantCardVM; children?: ReactNode }) {
  return (
    <Panel surface={2} radius="lg" padding={4}>
      <Stack gap={3}>
        <Stack axis="row" gap={2} align="center" justify="between">
          <ProfileCard vm={{ avatar: "", name: vm.name, roleTag: vm.level, rating: vm.rating }} />
          <StatusBadge variant="pill" status={vm.status.tone}>
            {vm.status.label}
          </StatusBadge>
        </Stack>
        {vm.tags.length > 0 && (
          <Stack axis="row" gap={2}>
            {vm.tags.map((t, i) => (
              <Tag key={t} color={TAG_COLORS[i % TAG_COLORS.length]}>
                {t}
              </Tag>
            ))}
          </Stack>
        )}
        {vm.approach && <RequirementCard vm={{ title: "Подход", body: vm.approach }} />}
        {vm.questions && <RequirementCard vm={{ title: "Уточняющие вопросы", body: vm.questions }} />}
        {vm.estimate && <RequirementCard vm={{ title: "Оценка трудозатрат", body: vm.estimate }} />}
        {children}
      </Stack>
    </Panel>
  );
}
