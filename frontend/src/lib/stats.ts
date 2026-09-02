import type { MonthTask } from "./api";
import { getMonthDays, getTodayKey } from "./date";

export interface TaskStat {
  id: string;
  title: string;
  doneCount: number;
  elapsedDays: number;
  rate: number; // 0..1
  streak: number;
}

export function computeTaskStats(monthKey: string, tasks: MonthTask[]): TaskStat[] {
  const todayKey = getTodayKey();
  const days = getMonthDays(monthKey).filter((d) => d.dateKey <= todayKey);

  return tasks.map((task) => {
    const doneCount = days.filter((d) => task.completions[d.dateKey] === true).length;
    const elapsedDays = days.length;
    const rate = elapsedDays === 0 ? 0 : doneCount / elapsedDays;

    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (task.completions[days[i].dateKey] === true) streak++;
      else break;
    }

    return { id: task.id, title: task.title, doneCount, elapsedDays, rate, streak };
  });
}

export interface OverallStat {
  totalDone: number;
  totalPossible: number;
  rate: number;
}

export function computeOverallStat(taskStats: TaskStat[]): OverallStat {
  const totalDone = taskStats.reduce((sum, t) => sum + t.doneCount, 0);
  const totalPossible = taskStats.reduce((sum, t) => sum + t.elapsedDays, 0);
  return { totalDone, totalPossible, rate: totalPossible === 0 ? 0 : totalDone / totalPossible };
}
