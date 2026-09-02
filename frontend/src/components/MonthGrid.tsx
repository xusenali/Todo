import type { MonthTask } from "../lib/api";
import { formatMonthHuman, getMonthDays } from "../lib/date";
import { BloodDrip } from "./BloodDrip";

interface Props {
  monthKey: string;
  tasks: MonthTask[];
  onNavigate: (delta: number) => void;
  onToggleToday: (taskId: string) => void;
}

export function MonthGrid({ monthKey, tasks, onNavigate, onToggleToday }: Props) {
  const days = getMonthDays(monthKey);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <button
          onClick={() => onNavigate(-1)}
          aria-label="Oldingi oy"
          className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="relative">
          <h2 className="font-terminator text-sm capitalize text-white neon-text text-red-300">{formatMonthHuman(monthKey)}</h2>
          <BloodDrip className="absolute left-1/2 top-full h-5 w-14 -translate-x-1/2" count={2} />
        </div>
        <button
          onClick={() => onNavigate(1)}
          aria-label="Keyingi oy"
          className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="px-1 py-8 text-center text-sm text-neutral-500">Hali vazifa yo'q</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-red-500/10">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 min-w-[140px] max-w-[140px] truncate bg-neutral-900 px-3 py-2 text-left font-medium text-neutral-400">
                  Vazifa
                </th>
                {days.map((d) => (
                  <th
                    key={d.dateKey}
                    className={`w-9 min-w-9 px-0 py-1 text-center font-normal ${
                      d.isToday ? "text-red-300" : "text-neutral-500"
                    }`}
                  >
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-[10px]">{d.weekdayLetter}</span>
                      <span className={`text-xs ${d.isToday ? "font-semibold" : ""}`}>{d.day}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t border-neutral-800">
                  <td className="sticky left-0 z-10 min-w-[140px] max-w-[140px] truncate bg-neutral-900 px-3 py-2 text-neutral-200">
                    {task.title}
                  </td>
                  {days.map((d) => {
                    const done = task.completions[d.dateKey] === true;
                    if (d.isToday) {
                      return (
                        <td key={d.dateKey} className="bg-red-500/10 text-center">
                          <button
                            onClick={() => onToggleToday(task.id)}
                            aria-label={done ? "Bajarilmagan deb belgilash" : "Bajarilgan deb belgilash"}
                            className={`mx-auto flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                              done ? "neon-glow-cyan border-red-300" : "border-red-400/60"
                            }`}
                            style={
                              done
                                ? { background: "linear-gradient(135deg, var(--neon-red-deep), var(--neon-red))" }
                                : undefined
                            }
                          >
                            {done && (
                              <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none">
                                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        </td>
                      );
                    }
                    if (d.isFuture) {
                      return <td key={d.dateKey} className="text-center text-neutral-700">·</td>;
                    }
                    return (
                      <td key={d.dateKey} className="text-center">
                        {done ? (
                          <span className="mx-auto flex h-5 w-5 items-center justify-center rounded border-2 border-red-400/40 bg-red-900/40 text-red-200">
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none">
                              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        ) : (
                          <span className="mx-auto block h-5 w-5 rounded border-2 border-neutral-800" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
