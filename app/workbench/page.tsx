import Link from "next/link";

const SECTIONS: { path: string; label: string }[] = [
  { path: "tokens", label: "Tokens" },
  { path: "primitives", label: "Primitives" },
  { path: "blocks", label: "Blocks" },
  { path: "templates", label: "Templates" },
  { path: "layout", label: "Layout primitives" },
  { path: "screens", label: "Screens (composed from fixtures)" },
];

export default function WorkbenchIndex() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-h1 font-h1 text-strong">Component Workbench</h1>
        <p className="text-body font-body text-muted">Dev-only living catalog of the Gigly design system.</p>
      </div>
      <nav className="flex flex-col gap-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.path}
            href={`/workbench/${s.path}`}
            className="text-label font-label text-brand-default underline"
          >
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
