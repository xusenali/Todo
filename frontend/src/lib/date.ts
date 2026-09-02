// Faqat local sana, vaqt emas — UTC bilan hisoblansa (toISOString) foydalanuvchi
// vaqt zonasiga qarab kun noto'g'ri almashishi mumkin.
export function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getMonthKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function formatDateHuman(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", weekday: "long" });
}

export function formatMonthHuman(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("uz-UZ", { month: "long", year: "numeric" });
}

export function shiftMonth(monthKey: string, delta: number): string {
  const [y, m] = monthKey.split("-").map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  return getMonthKey(date);
}

const WEEKDAY_LETTERS = ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];

export interface MonthDay {
  dateKey: string;
  day: number;
  weekdayLetter: string;
  isToday: boolean;
  isFuture: boolean;
  isWeekend: boolean;
}

export function getMonthDays(monthKey: string): MonthDay[] {
  const [y, m] = monthKey.split("-").map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const todayKey = getTodayKey();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(y, m - 1, day);
    const dateKey = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const weekday = date.getDay();
    return {
      dateKey,
      day,
      weekdayLetter: WEEKDAY_LETTERS[weekday],
      isToday: dateKey === todayKey,
      isFuture: dateKey > todayKey,
      isWeekend: weekday === 0 || weekday === 6,
    };
  });
}
