// Faqat local sana, vaqt emas — UTC bilan hisoblansa (toISOString) foydalanuvchi
// vaqt zonasiga qarab kun noto'g'ri almashishi mumkin.
export function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatDateHuman(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("uz-UZ", { day: "numeric", month: "long", weekday: "long" });
}
