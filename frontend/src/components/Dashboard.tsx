import type { MonthTask } from "../lib/api";
import { formatMonthHuman } from "../lib/date";
import { computeOverallStat, computeTaskStats } from "../lib/stats";

interface Props {
  monthKey: string;
  tasks: MonthTask[];
}

function pct(rate: number) {
  return `${Math.round(rate * 100)}%`;
}

export function Dashboard({ monthKey, tasks }: Props) {
  if (tasks.length === 0) {
    return <p className="px-1 py-8 text-center text-sm text-slate-500">Statistika uchun avval vazifa qo'shing</p>;
  }

  const stats = computeTaskStats(monthKey, tasks).sort((a, b) => b.rate - a.rate);
  const overall = computeOverallStat(stats);
  const best = stats[0];
  const worst = stats[stats.length - 1];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-slate-400 capitalize">{formatMonthHuman(monthKey)} — umumiy natija</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-3xl font-semibold text-white">{pct(overall.rate)}</span>
          <span className="mb-1 text-sm text-slate-500">
            ({overall.totalDone}/{overall.totalPossible} bajarildi)
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-green-500" style={{ width: pct(overall.rate) }} />
        </div>
      </div>

      {stats.length > 1 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-xs text-slate-400">Eng yaxshi ketyapti</p>
            <p className="mt-1 truncate text-sm font-medium text-white">{best.title}</p>
            <p className="text-xs text-green-400">{pct(best.rate)}</p>
          </div>
          <div className="rounded-xl bg-slate-800/60 p-3">
            <p className="text-xs text-slate-400">Ko'p qoldirilyapti</p>
            <p className="mt-1 truncate text-sm font-medium text-white">{worst.title}</p>
            <p className="text-xs text-red-400">{pct(worst.rate)}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {stats.map((s) => (
          <div key={s.id} className="rounded-xl bg-slate-800/40 p-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="truncate text-sm text-slate-200">{s.title}</span>
              <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400">
                {s.streak > 0 && <span className="text-orange-400">🔥 {s.streak}</span>}
                <span>{s.doneCount}/{s.elapsedDays}</span>
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className={`h-full rounded-full ${s.rate >= 0.7 ? "bg-green-500" : s.rate >= 0.4 ? "bg-yellow-500" : "bg-red-500"}`}
                style={{ width: pct(s.rate) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
