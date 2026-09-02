export type TabKey = "today" | "grid" | "stats";

interface Props {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "today", label: "Bugun" },
  { key: "grid", label: "Jadval" },
  { key: "stats", label: "Statistika" },
];

export function TabBar({ active, onChange }: Props) {
  return (
    <nav className="flex gap-1 px-4 pb-3">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            active === tab.key
              ? "neon-glow-cyan text-slate-950"
              : "bg-slate-800/80 text-slate-300"
          }`}
          style={
            active === tab.key
              ? { background: "linear-gradient(90deg, var(--neon-red-deep), var(--neon-red))" }
              : undefined
          }
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
