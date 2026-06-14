import { SpecialistDashboardComposition } from "./SpecialistDashboardComposition";

export default function ScreensPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-h2 font-h2 text-strong">specialist-dashboard (composed from fixtures)</h2>
        <span className="text-caption font-caption text-subtle">
          ref: docs/design-system/reference-renders/frames/specialist-dashboard.lossy.jpg
        </span>
      </div>
      <SpecialistDashboardComposition />
    </div>
  );
}
