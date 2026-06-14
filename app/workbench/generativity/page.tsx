import { GenerativityProbe } from "../screens/GenerativityProbe";

export default function GenerativityPage() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-h2 font-h2 text-strong">Generativity probe (novel kit-only screen)</h2>
        <span className="text-caption font-caption text-subtle">zero off-system values — verified by lint:generativity</span>
      </div>
      <GenerativityProbe />
    </div>
  );
}
